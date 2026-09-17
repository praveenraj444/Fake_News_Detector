"""
Tamil Fake News Detection API.

Loads the already-trained model.pkl and vectorizer.pkl from Phase 1.
Does NOT retrain or refit anything -- this is inference only.
"""

import os
import pickle
import logging

from flask import Flask, request, jsonify
from flask_cors import CORS

from utils.preprocessing import clean_tamil_text
from utils.translation import translate_en_to_ta, MAX_INPUT_CHARS as TRANSLATE_MAX_CHARS

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "model.pkl")
VECTORIZER_PATH = os.path.join(BASE_DIR, "vectorizer.pkl")

MAX_INPUT_CHARS = 5000  # basic abuse guard, generous for a news article

app = Flask(__name__)
CORS(app)  # allow the React dev server / frontend origin to call this API

# ---------------------------------------------------------------------------
# Load model + vectorizer ONCE at startup. If either file is missing or
# corrupted, fail fast and loudly rather than serving broken predictions.
# ---------------------------------------------------------------------------
model = None
vectorizer = None
load_error = None

try:
    with open(MODEL_PATH, "rb") as f:
        model = pickle.load(f)
    with open(VECTORIZER_PATH, "rb") as f:
        vectorizer = pickle.load(f)
    logger.info("Model and vectorizer loaded successfully.")
except FileNotFoundError as e:
    load_error = f"Required file not found: {e.filename}"
    logger.error(load_error)
except Exception as e:  # noqa: BLE001 - we want to catch and report any load failure
    load_error = f"Failed to load model/vectorizer: {e}"
    logger.error(load_error)


def model_ready() -> bool:
    return model is not None and vectorizer is not None


@app.route("/health", methods=["GET"])
def health():
    """Simple readiness check -- useful for the frontend and for deployment probes."""
    if model_ready():
        return jsonify({"status": "ok", "model_loaded": True}), 200
    return jsonify({"status": "error", "model_loaded": False, "detail": load_error}), 503


@app.route("/predict", methods=["POST"])
def predict():
    if not model_ready():
        return jsonify({
            "error": "Model is not loaded on the server.",
            "detail": load_error
        }), 503

    if not request.is_json:
        return jsonify({"error": "Request must have Content-Type: application/json"}), 400

    data = request.get_json(silent=True)
    if data is None:
        return jsonify({"error": "Invalid or missing JSON body."}), 400

    text = data.get("text", None)

    if text is None:
        return jsonify({"error": "Missing required field: 'text'."}), 400

    if not isinstance(text, str):
        return jsonify({"error": "'text' must be a string."}), 400

    text = text.strip()

    if len(text) == 0:
        return jsonify({"error": "'text' cannot be empty."}), 400

    if len(text) > MAX_INPUT_CHARS:
        return jsonify({
            "error": f"'text' exceeds maximum length of {MAX_INPUT_CHARS} characters."
        }), 400

    # --- Same preprocessing pipeline used at training time ---
    cleaned = clean_tamil_text(text)

    if cleaned.strip() == "":
        return jsonify({
            "error": "No Tamil content detected after preprocessing. "
                     "Please provide Tamil news text."
        }), 400

    try:
        vec = vectorizer.transform([cleaned])
        pred = model.predict(vec)[0]
        proba = model.predict_proba(vec)[0]
    except Exception as e:  # noqa: BLE001
        logger.exception("Prediction failed")
        return jsonify({"error": "Prediction failed on the server.", "detail": str(e)}), 500

    prob_fake = float(proba[0])
    prob_real = float(proba[1])
    prediction_label = "REAL" if pred == 1 else "FAKE"
    confidence = max(prob_fake, prob_real)

    # Text statistics computed on the ORIGINAL input, not the cleaned text --
    # that's what a user intuitively means by "word/character count".
    word_count = len(text.split())
    character_count = len(text)

    response = {
        "prediction": prediction_label,
        "confidence": round(confidence, 4),
        "fake_probability": round(prob_fake, 4),
        "real_probability": round(prob_real, 4),
        "word_count": word_count,
        "character_count": character_count,
    }

    return jsonify(response), 200


# ---------------------------------------------------------------------------
# /translate -- English to Tamil translation.
# Completely independent of the fake-news model, vectorizer, and preprocessing
# above. Does not touch model.pkl, vectorizer.pkl, or clean_tamil_text().
# ---------------------------------------------------------------------------
@app.route("/translate", methods=["POST"])
def translate():
    if not request.is_json:
        return jsonify({"error": "Request must have Content-Type: application/json"}), 400

    data = request.get_json(silent=True)
    if data is None:
        return jsonify({"error": "Invalid or missing JSON body."}), 400

    text = data.get("text", None)

    if text is None:
        return jsonify({"error": "Missing required field: 'text'."}), 400

    if not isinstance(text, str):
        return jsonify({"error": "'text' must be a string."}), 400

    text = text.strip()

    if len(text) == 0:
        return jsonify({"error": "'text' cannot be empty."}), 400

    if len(text) > TRANSLATE_MAX_CHARS:
        return jsonify({
            "error": f"'text' exceeds maximum length of {TRANSLATE_MAX_CHARS} characters."
        }), 400

    try:
        translated_text = translate_en_to_ta(text)
    except RuntimeError as e:
        logger.error(f"Translation failed: {e}")
        return jsonify({
            "error": "Translation service is unavailable. The translation model may still "
                     "be downloading on first use, or failed to load.",
            "detail": str(e)
        }), 503
    except Exception as e:  # noqa: BLE001
        logger.exception("Unexpected translation error")
        return jsonify({"error": "Translation failed on the server.", "detail": str(e)}), 500

    if not translated_text.strip():
        return jsonify({"error": "Translation produced empty output."}), 500

    return jsonify({"translated_text": translated_text}), 200


@app.errorhandler(404)
def not_found(e):
    return jsonify({"error": "Endpoint not found."}), 404


@app.errorhandler(405)
def method_not_allowed(e):
    return jsonify({"error": "Method not allowed on this endpoint."}), 405


@app.errorhandler(500)
def internal_error(e):
    return jsonify({"error": "Internal server error."}), 500


if __name__ == "__main__":
    # NOTE: this development server (app.run) is for local testing only.
    # For production/live deployment, run via gunicorn instead -- see README.
    app.run(host="0.0.0.0", port=5000, debug=True)
