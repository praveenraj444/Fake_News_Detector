import { useState } from "react";
import { translateText, TranslationError } from "../api";

interface EnglishTranslatorProps {
  onUseTranslation: (tamilText: string) => void;
}

const MAX_CHARS = 2000;

export default function EnglishTranslator({ onUseTranslation }: EnglishTranslatorProps) {
  const [englishText, setEnglishText] = useState("");
  const [tamilText, setTamilText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const overLimit = englishText.length > MAX_CHARS;

  const handleTranslate = async () => {
    if (englishText.trim().length === 0) return;

    setLoading(true);
    setError(null);
    setTamilText("");

    try {
      const result = await translateText(englishText.trim());
      setTamilText(result);
    } catch (err) {
      if (err instanceof TranslationError) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred while translating. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUseText = () => {
    if (tamilText.trim().length > 0) {
      onUseTranslation(tamilText);
    }
  };

  return (
    <div className="bg-bg-panel border border-accent/20 rounded-xl p-6 sm:p-7">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-accent text-sm">⇄</span>
          <h3 className="text-sm font-medium text-ink">English to Tamil translator</h3>
        </div>
        <span className="text-xs text-ink-faint">Step 1 · optional</span>
      </div>

      {error && (
        <div className="mb-4 bg-fake-bg border border-fake/25 rounded-lg px-4 py-3 text-sm text-fake-light">
          {error}
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="english-text" className="block text-xs font-medium text-ink-muted mb-2">
            English text
          </label>
          <textarea
            id="english-text"
            value={englishText}
            onChange={(e) => setEnglishText(e.target.value)}
            placeholder="Paste English news text here..."
            rows={5}
            className="w-full resize-none rounded-lg bg-bg-elevated border border-border focus:border-accent/60 focus:ring-2 focus:ring-accent/20 outline-none px-4 py-3 text-[15px] leading-relaxed text-ink placeholder:text-ink-faint transition-all duration-150"
          />
          <div className={`text-xs mt-1.5 ${overLimit ? "text-fake" : "text-ink-faint"}`}>
            {englishText.length.toLocaleString()} / {MAX_CHARS.toLocaleString()} characters
          </div>
        </div>

        <div>
          <label htmlFor="tamil-output" className="block text-xs font-medium text-ink-muted mb-2">
            Tamil translation
          </label>
          {tamilText ? (
            <textarea
              id="tamil-output"
              value={tamilText}
              readOnly
              rows={5}
              className="w-full resize-none rounded-lg bg-bg-elevated border border-border outline-none px-4 py-3 text-[15px] leading-relaxed font-tamil text-ink"
            />
          ) : (
            <div
              id="tamil-output"
              className="w-full rounded-lg bg-bg-elevated/60 border border-dashed border-border h-[126px] flex items-center justify-center px-4 text-center"
            >
              <p className="text-sm text-ink-faint font-tamil">
                {loading ? "மொழிபெயர்க்கிறது..." : "மொழிபெயர்ப்பு இங்கே தோன்றும்"}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mt-4">
        <button
          onClick={handleTranslate}
          disabled={loading || englishText.trim().length === 0 || overLimit}
          className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-accent hover:bg-accent-light disabled:bg-bg-elevated disabled:text-ink-faint disabled:cursor-not-allowed text-bg font-medium px-5 py-2.5 text-sm transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:ring-offset-2 focus:ring-offset-bg-panel"
        >
          {loading ? (
            <>
              <span className="w-3.5 h-3.5 border-2 border-bg/40 border-t-bg rounded-full animate-spin" />
              Translating
            </>
          ) : (
            "Translate to Tamil"
          )}
        </button>

        <button
          onClick={handleUseText}
          disabled={tamilText.trim().length === 0}
          className="rounded-lg border border-border hover:border-border-strong disabled:opacity-40 disabled:cursor-not-allowed text-ink-muted hover:text-ink font-medium px-5 py-2.5 text-sm transition-colors duration-150"
        >
          Use this text
        </button>
      </div>

      <p className="text-[11px] text-ink-faint mt-3">
        Uses an open-source translation model. First translation may take a few seconds.
      </p>
    </div>
  );
}
