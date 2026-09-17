# 📰 Tamil Fake News Detector

A full-stack **AI-powered Tamil Fake News Detection System** that analyzes Tamil news text and predicts whether the content is **FAKE** or **REAL** using Machine Learning.

The system combines **Natural Language Processing (NLP)**, **TF-IDF feature extraction**, and **Logistic Regression** with a modern **React + TypeScript** frontend and **Flask** backend.

It also provides an **English → Tamil Translation** feature, allowing users to translate English news content into Tamil and directly verify the translated content.

---

## 🚀 Live Project

> Add your deployed application URL here after deployment.

**Web Application:** `Coming Soon`

**Backend API:** `Coming Soon`

---

## 📌 Project Overview

Fake news and misinformation can spread rapidly through social media, messaging platforms, websites, and online communities.

Tamil-language misinformation detection presents an additional challenge because Tamil is a low-resource language compared with English, and many existing fake-news detection systems are primarily designed for English content.

This project aims to provide a simple and accessible system for analyzing Tamil news content using Machine Learning.

Users can:

1. Enter Tamil news content.
2. Submit the content for analysis.
3. The system preprocesses the Tamil text.
4. The text is converted into numerical features using TF-IDF.
5. A trained Logistic Regression model analyzes the features.
6. The system predicts whether the content is FAKE or REAL.
7. Prediction confidence and probability values are displayed.
8. Users can also translate English news into Tamil before verification.

---

# ✨ Features

## 🔍 Tamil Fake News Detection

Analyze Tamil news headlines/text and classify them into:

* 🔴 **FAKE**
* 🟢 **REAL**

The prediction is generated using a trained Machine Learning model.

---

## 🤖 Machine Learning Model

The system uses:

* **TF-IDF Vectorization**
* **Logistic Regression**
* Stratified train-test split
* Tamil text preprocessing
* Probability-based prediction

The trained model and vectorizer are serialized using Python Pickle.

```text
Tamil News Text
       ↓
Text Preprocessing
       ↓
TF-IDF Vectorization
       ↓
Logistic Regression
       ↓
FAKE / REAL
```

---

## 🌐 English → Tamil Translation

Users can enter English news content and translate it into Tamil.

```text
English News
     ↓
English → Tamil Translation
     ↓
Tamil News Text
     ↓
Fake News Detection
```

After translation, the generated Tamil text can be directly transferred into the fake-news detection input.

This makes the system more useful for users who find English news but want to analyze it using the Tamil fake-news detection model.

Translation runs on **facebook/nllb-200-distilled-600M** (open-source, via Hugging Face `transformers`), loaded lazily on the backend so a missing/slow translation dependency can never affect the `/predict` endpoint. The model weights (~2.4GB) download once on first use and are cached locally afterward.

---

## 📊 Prediction Confidence

The application provides probability information along with the prediction.

Example:

```text
Prediction: REAL

REAL Probability: 87%
FAKE Probability: 13%
Confidence: 87%
```

This helps users understand how strongly the trained model supports its prediction.

> Model confidence represents the classifier's estimated probability. It should not be interpreted as absolute proof that a news article is factually true or false.

---

## 📈 Interactive Visualization

The frontend uses **Recharts** to visualize prediction probabilities.

The dashboard can display:

* FAKE probability
* REAL probability
* Confidence
* Prediction result

This provides a more understandable representation of the Machine Learning output.

---

# 🛠️ Tech Stack

## Frontend

| Technology   | Purpose               |
| ------------ | ---------------------- |
| React.js     | Frontend application  |
| TypeScript   | Type-safe development |
| Tailwind CSS | UI styling            |
| Axios        | API communication     |
| Recharts     | Data visualization    |

---

## Backend

| Technology     | Purpose                            |
| -------------- | ----------------------------------- |
| Python         | Backend & ML development           |
| Flask          | REST API                           |
| Flask-CORS     | Cross-Origin Resource Sharing      |
| Pickle         | Model serialization (predict only) |
| scikit-learn   | Machine Learning                   |
| NumPy          | Numerical operations               |
| Pandas         | Data processing                    |
| Transformers   | English → Tamil translation model  |
| PyTorch        | Translation model inference        |
| SentencePiece  | Translation tokenization           |

---

## Machine Learning

| Component          | Technology                            |
| ------------------ | -------------------------------------- |
| Text Processing    | Python / Regex                        |
| Feature Extraction | TF-IDF                                |
| Classification     | Logistic Regression                   |
| Evaluation         | Accuracy, Precision, Recall, F1-score |
| Model Storage      | Pickle                                |

---

# 🧠 Machine Learning Pipeline

The Machine Learning pipeline consists of several stages.

## 1. Dataset Collection

The model is trained on the SPELLL Tamil Fake News Corpus (`Tamil-News-Headlines.csv`) — 5,226 labelled Tamil headlines, sourced from verified Tamil news sites (REAL) and fact-checked misinformation claims (FAKE). The dataset contains two classes:

```text
FAKE → 0
REAL → 1
```

> An earlier exploration considered scraped Tamil news datasets (Hindu Tamil, Tamil Murasu) that had no FAKE/REAL veracity labels — see the design-decision note below for why those were not used to train the classifier.

---

## 2. Data Cleaning

The input text is cleaned before training.

The preprocessing pipeline includes:

* URL removal
* HTML tag removal
* English character removal
* Number removal
* Special character removal
* Extra whitespace removal
* Tamil stop-word removal
* Tamil Unicode preservation

Example:

```text
Original:
"இந்தியாவில் புதிய திட்டம்! https://example.com"

After preprocessing:
"இந்தியாவில் புதிய திட்டம்"
```

---

## 3. TF-IDF Feature Extraction

Machine Learning algorithms cannot directly understand raw Tamil text.

TF-IDF converts text into numerical feature vectors.

The implementation uses:

```python
TfidfVectorizer(
    max_features=5000,
    ngram_range=(1, 2),
    min_df=2,
    sublinear_tf=True
)
```

The vectorizer learns vocabulary and feature weights from the training data only, then transforms the held-out test data — never fit on test data.

---

## 4. Train-Test Split

The dataset is divided into:

```text
80% → Training Data
20% → Testing Data
```

A stratified split (`random_state=42`) is used to maintain the FAKE/REAL class distribution.

---

## 5. Logistic Regression

The TF-IDF vectors are passed to a Logistic Regression classifier (`solver="liblinear"`, `class_weight="balanced"`).

```text
TF-IDF Features
      ↓
Logistic Regression
      ↓
Classification
      ↓
FAKE / REAL
```

The trained model is then saved as:

```text
model.pkl
```

The trained TF-IDF vectorizer is saved as:

```text
vectorizer.pkl
```

**Test-set performance:** Accuracy 85.2%, Precision 81.3%, Recall 86.4%, F1-score 83.8% (1,036 held-out samples). This is in line with the SPELLL corpus's own published Logistic Regression baseline (~86.8%).

---

# 🔄 Application Workflow

The complete application works as follows:

```text
                    ┌─────────────────────┐
                    │      User           │
                    └──────────┬──────────┘
                               │
                               ↓
                    ┌─────────────────────┐
                    │   React Frontend    │
                    └──────────┬──────────┘
                               │
                    ┌──────────┴──────────┐
                    │                     │
                    ↓                     ↓
            English Translation     Tamil News Input
                    │                     │
                    ↓                     │
              Tamil Text                 │
                    │                     │
                    └──────────┬──────────┘
                               ↓
                    ┌─────────────────────┐
                    │    Flask Backend    │
                    └──────────┬──────────┘
                               │
                               ↓
                    ┌─────────────────────┐
                    │ Text Preprocessing  │
                    └──────────┬──────────┘
                               │
                               ↓
                    ┌─────────────────────┐
                    │ Saved TF-IDF        │
                    │ Vectorizer          │
                    └──────────┬──────────┘
                               │
                               ↓
                    ┌─────────────────────┐
                    │ Logistic Regression │
                    │ Model               │
                    └──────────┬──────────┘
                               │
                               ↓
                    ┌─────────────────────┐
                    │ Prediction Result   │
                    │ FAKE / REAL         │
                    │ Probability         │
                    └──────────┬──────────┘
                               │
                               ↓
                    ┌─────────────────────┐
                    │ React Result UI     │
                    └─────────────────────┘
```

---

# 📂 Project Structure

```text
Fake-News-Detector/
│
├── backend/
│   │
│   ├── app.py
│   ├── model.pkl
│   ├── vectorizer.pkl
│   ├── requirements.txt
│   │
│   └── utils/
│       ├── preprocessing.py
│       ├── translation.py
│       └── Tamil-Stopwords.txt
│
├── frontend/
│   │
│   ├── public/
│   │
│   ├── src/
│   │   ├── components/
│   │   ├── App.tsx
│   │   ├── api.ts
│   │   ├── types.ts
│   │   ├── main.tsx
│   │   └── ...
│   │
│   ├── package.json
│   ├── package-lock.json
│   └── ...
│
├── README.md
└── .gitignore
```

---

# ⚙️ Installation & Setup

## Prerequisites

Make sure the following are installed:

* Python 3.9+
* Node.js 18+
* npm
* Git

---

# 🔧 Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Create a virtual environment:

### Windows

```bash
python -m venv venv
venv\Scripts\activate
```

### macOS / Linux

```bash
python3 -m venv venv
source venv/bin/activate
```

---

## Install Python Dependencies

```bash
pip install -r requirements.txt
```

> Includes `transformers`, `torch`, and `sentencepiece` for the translation feature. The translation model (~2.4GB) downloads on its first use, not at install time — this can take several minutes.

---

## Run Flask Backend

```bash
python app.py
```

The backend will normally run at:

```text
http://localhost:5000
```

---

# 💻 Frontend Setup

Open another terminal.

Navigate to the frontend:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend will normally be available at:

```text
http://localhost:5173
```

---

# 🔌 API

## POST `/predict`

Analyzes Tamil news text and returns a fake/real prediction.

### Request

```json
{
  "text": "தமிழ் செய்தி இங்கே"
}
```

### Response

```json
{
  "prediction": "REAL",
  "confidence": 0.87,
  "fake_probability": 0.13,
  "real_probability": 0.87,
  "word_count": 25,
  "character_count": 142
}
```

---

## POST `/translate`

Translates English text into Tamil.

### Request

```json
{
  "text": "The government announced a new scheme."
}
```

### Response

```json
{
  "translated_text": "அரசாங்கம் புதிய திட்டத்தை அறிவித்துள்ளது."
}
```

---

## GET `/health`

Reports whether the ML model is loaded and the server is ready.

### Response

```json
{
  "status": "ok",
  "model_loaded": true
}
```

---

# 🧪 Testing

The system should be tested at multiple levels.

## Machine Learning Testing

Evaluate the model using:

* Accuracy
* Precision
* Recall
* F1-score
* Confusion Matrix

## Backend Testing

Test:

* Valid Tamil text
* Empty input
* Invalid request
* Large input
* Prediction endpoint
* Translation endpoint
* API error handling

## Frontend Testing

Test:

* Tamil text input
* English text translation
* Translation output
* Use translated text
* FAKE result
* REAL result
* Confidence display
* Probability chart
* Loading state
* Error state
* Responsive layout

---

# 🔐 Important ML Design Decision

Two Tamil news datasets (Hindu Tamil, Tamil Murasu) were explored early in this project but contained no FAKE/REAL veracity labels — only topic categories. They were **not artificially labelled** as fake or real, and `news_category` was not used as a substitute label, since that would only teach the model to distinguish topics, not veracity.

The model instead uses the SPELLL Tamil Fake News Corpus, which carries genuine FAKE/REAL labels sourced from fact-checked claims and verified news sites.

This prevents the model from learning the difference between two news publishers or topics instead of learning patterns associated with actual misinformation.

---

# 📊 Model Limitations

This project is a Machine Learning classification system and has limitations.

The prediction depends on:

* Training dataset quality
* Dataset size
* Language patterns
* Vocabulary
* Training distribution
* Text similarity
* Distribution of future news content

A known limitation: the FAKE class in the training data skews toward COVID-19 and international/US political claims (2007–2022), while the REAL class is mostly Tamil Nadu regional news (2019–2022). This topic imbalance means the model may partly key on subject matter rather than purely on linguistic patterns of misinformation.

The model should therefore be treated as an **AI-assisted screening tool**, not as an independent fact-checking authority.

A prediction of `REAL` does not prove that an article is factually correct, and a prediction of `FAKE` does not by itself establish that the claim is false.

---

# 🔮 Future Enhancements

Possible future improvements include:

* Larger Tamil fake-news datasets
* Additional fact-checked datasets (e.g. DFND, TamilFacts)
* Transformer-based Tamil NLP models
* BERT / IndicBERT based classification
* Multilingual fake-news detection
* Image-based misinformation detection
* OCR for news screenshots
* Social-media misinformation analysis
* Source credibility analysis
* Explainable AI
* User authentication
* Prediction history
* Database integration
* Admin dashboard
* Cloud deployment
* Mobile application
* Real-time fact-checking integrations

---

# 🎯 Project Objectives

The main objectives of this project are:

* Develop an AI-assisted Tamil fake-news detection system.
* Apply Natural Language Processing to Tamil text.
* Build a complete ML pipeline for fake-news classification.
* Provide an easy-to-use web interface.
* Integrate a trained Machine Learning model with a Flask REST API.
* Visualize prediction probabilities.
* Support English-to-Tamil translation before analysis.
* Create a foundation for future multilingual misinformation detection systems.

---

# 📚 Technologies Learned

This project demonstrates practical implementation of:

* Machine Learning
* Natural Language Processing
* Text Classification
* TF-IDF
* Logistic Regression
* Python
* Flask REST API
* React
* TypeScript
* Tailwind CSS
* Axios
* Data Visualization
* API Integration
* Model Serialization
* Full-Stack Development

---

# 👨‍💻 Author

**Praveenraj M**

Computer Science & Engineering Student

### Skills demonstrated

* Frontend Development
* Backend Development
* Full-Stack Development
* Artificial Intelligence
* Machine Learning
* Python
* Data Science
* Software Development

---

# ⭐ Support

If you find this project useful or interesting, consider giving the repository a ⭐ on GitHub.

---

# 📄 License

This project is intended for educational and research purposes.

Add the appropriate license file to the repository based on how you plan to distribute the project.
