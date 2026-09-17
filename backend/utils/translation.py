"""
English -> Tamil translation.

Fully independent from the fake-news detection pipeline. Uses Meta's open-source
NLLB-200 model via Hugging Face transformers -- no paid API, no external service call.

Loads the tokenizer/model directly (not via pipeline()) and calls .generate()
ourselves. This avoids depending on the transformers "translation" pipeline task
name, which has changed/been removed across library versions.

The model is loaded lazily (on first /translate request, not at server startup)
so that a slow/failed translation-model download can never block or crash the
existing /predict functionality.
"""

import logging

logger = logging.getLogger(__name__)

_tokenizer = None
_model = None
_load_error = None

MODEL_NAME = "facebook/nllb-200-distilled-600M"
SRC_LANG = "eng_Latn"
TGT_LANG = "tam_Taml"
MAX_INPUT_CHARS = 2000


def _get_model():
    """Lazily load and cache the tokenizer + model on first use."""
    global _tokenizer, _model, _load_error

    if _model is not None:
        return _tokenizer, _model
    if _load_error is not None:
        raise RuntimeError(_load_error)

    try:
        from transformers import AutoTokenizer, AutoModelForSeq2SeqLM

        logger.info(f"Loading translation model '{MODEL_NAME}' (first request only)...")
        _tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME, src_lang=SRC_LANG)
        _model = AutoModelForSeq2SeqLM.from_pretrained(MODEL_NAME)
        logger.info("Translation model loaded.")
        return _tokenizer, _model
    except Exception as e:  # noqa: BLE001
        _load_error = f"Failed to load translation model: {e}"
        logger.error(_load_error)
        raise RuntimeError(_load_error)


def translate_en_to_ta(text: str) -> str:
    """Translate English text to Tamil. Raises RuntimeError on failure."""
    if not text or not text.strip():
        return ""

    tokenizer, model = _get_model()

    inputs = tokenizer(text, return_tensors="pt", truncation=True, max_length=512)

    # Newer tokenizers expose convert_tokens_to_ids for the target language code;
    # older ones expose lang_code_to_id directly. Try both for version safety.
    try:
        forced_bos_token_id = tokenizer.convert_tokens_to_ids(TGT_LANG)
    except Exception:  # noqa: BLE001
        forced_bos_token_id = tokenizer.lang_code_to_id[TGT_LANG]

    generated_tokens = model.generate(
        **inputs,
        forced_bos_token_id=forced_bos_token_id,
        max_length=512,
    )

    translated_text = tokenizer.batch_decode(generated_tokens, skip_special_tokens=True)[0]
    return translated_text
