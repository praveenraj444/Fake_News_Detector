"""
Tamil text preprocessing.

IMPORTANT: This function is copied EXACTLY from the Phase 1 training notebook.
If this logic differs from what the TF-IDF vectorizer was fitted on, predictions
will be silently wrong (the vectorizer will see out-of-distribution tokens).
Do not "improve" or refactor this without retraining the model.
"""

import re
import os

# Core stopwords used during Phase 1 training
_CORE_STOPWORDS = set(
    "மற்றும் இந்த அந்த அது இது அவர் அவர்கள் ஒரு என்று என தான் "
    "ஆனால் அல்லது மேலும் ஆகிய உள்ள இருந்த இருந்து".split()
)

# Merge in the SPELLL repo's Tamil-Stopwords.txt, exactly as done in training.
_STOPWORDS_FILE = os.path.join(os.path.dirname(__file__), "Tamil-Stopwords.txt")

TAMIL_STOPWORDS = set(_CORE_STOPWORDS)
if os.path.exists(_STOPWORDS_FILE):
    with open(_STOPWORDS_FILE, encoding="utf-8") as f:
        TAMIL_STOPWORDS |= set(line.strip() for line in f if line.strip())

TAMIL_RANGE = r"\u0B80-\u0BFF"


def clean_tamil_text(text: str) -> str:
    """Clean raw Tamil text the same way Phase 1 training did."""
    if text is None:
        return ""
    text = str(text)

    text = re.sub(r"http\S+|www\.\S+", " ", text)          # URLs
    text = re.sub(r"<.*?>", " ", text)                      # HTML tags
    text = re.sub(r"[a-zA-Z]+", " ", text)                  # English characters
    text = re.sub(r"[0-9]+", " ", text)                     # digits
    text = re.sub(rf"[^{TAMIL_RANGE}\s]", " ", text)        # punctuation/symbols
    text = re.sub(r"\s+", " ", text).strip()                # whitespace normalize

    tokens = [w for w in text.split() if w not in TAMIL_STOPWORDS]
    return " ".join(tokens)
