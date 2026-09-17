import { useEffect, useState } from "react";
import Header from "./components/Header";
import NewsInput from "./components/NewsInput";
import ResultCard from "./components/ResultCard";
import PredictionCharts from "./components/PredictionCharts";
import ErrorBanner from "./components/ErrorBanner";
import EnglishTranslator from "./components/EnglishTranslator";
import { predictNews, checkHealth, PredictionError } from "./api";
import type { PredictionResponse } from "./types";

export default function App() {
  const [text, setText] = useState("");
  const [result, setResult] = useState<PredictionResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiOnline, setApiOnline] = useState<boolean | null>(null);

  useEffect(() => {
    checkHealth().then(setApiOnline);
  }, []);

  const handleSubmit = async () => {
    if (text.trim().length === 0) return;

    setLoading(true);
    setError(null);

    try {
      const response = await predictNews(text.trim());
      setResult(response);
    } catch (err) {
      setResult(null);
      if (err instanceof PredictionError) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setText("");
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-bg flex flex-col">
      <Header apiOnline={apiOnline} />

      <main className="flex-1 max-w-3xl w-full mx-auto px-5 sm:px-6 py-10 sm:py-14">
        <div className="animate-fadeIn mb-9">
          <h2 className="font-serif text-3xl sm:text-4xl text-ink tracking-tight leading-tight">
            Verify a Tamil news article
          </h2>
          <p className="text-ink-muted mt-3 text-[15px] leading-relaxed max-w-lg">
            Paste a Tamil headline or article to check it against learned patterns of
            verified and fabricated reporting. Have English text instead? Translate it
            below first.
          </p>
        </div>

        <div className="space-y-4">
          {apiOnline === false && (
            <ErrorBanner
              message="Cannot reach the backend API. Make sure the Flask server is running on port 5000."
              onDismiss={() => setApiOnline(null)}
            />
          )}

          {error && <ErrorBanner message={error} onDismiss={() => setError(null)} />}

          <EnglishTranslator onUseTranslation={(tamilText) => setText(tamilText)} />

          <NewsInput
            text={text}
            onChange={setText}
            onSubmit={handleSubmit}
            onClear={handleClear}
            loading={loading}
          />

          {result && (
            <>
              <ResultCard result={result} />
              <PredictionCharts result={result} />
            </>
          )}
        </div>
      </main>

      <footer className="border-t border-border py-6">
        <div className="max-w-3xl mx-auto px-5 sm:px-6 text-center text-xs text-ink-faint">
          Built with TF-IDF and logistic regression, for research and educational use.
        </div>
      </footer>
    </div>
  );
}
