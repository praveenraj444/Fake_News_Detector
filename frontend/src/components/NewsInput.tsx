interface NewsInputProps {
  text: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onClear: () => void;
  loading: boolean;
}

const MAX_CHARS = 5000;

export default function NewsInput({ text, onChange, onSubmit, onClear, loading }: NewsInputProps) {
  const charCount = text.length;
  const overLimit = charCount > MAX_CHARS;

  return (
    <div className="bg-bg-panel border border-border rounded-2xl p-5 sm:p-6 animate-fadeIn">
      <label htmlFor="news-text" className="block text-sm font-medium text-slate-300 mb-2">
        Tamil News Text
      </label>

      <textarea
        id="news-text"
        value={text}
        onChange={(e) => onChange(e.target.value)}
        placeholder="தமிழில் செய்தி உரையை இங்கே ஒட்டவும்... (எ.கா. தலைப்பு அல்லது கட்டுரையின் பகுதி)"
        rows={7}
        className="w-full resize-none rounded-xl bg-bg-elevated border border-border focus:border-accent focus:ring-1 focus:ring-accent outline-none px-4 py-3 text-[15px] leading-relaxed font-tamil text-slate-100 placeholder:text-slate-500 transition-colors"
      />

      <div className="flex items-center justify-between mt-2 mb-4">
        <span className={`text-xs ${overLimit ? "text-fake" : "text-slate-500"}`}>
          {charCount.toLocaleString()} / {MAX_CHARS.toLocaleString()} characters
        </span>
        {overLimit && (
          <span className="text-xs text-fake">Text exceeds maximum length</span>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={onSubmit}
          disabled={loading || text.trim().length === 0 || overLimit}
          className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-accent hover:bg-accent-light disabled:bg-bg-elevated disabled:text-slate-500 disabled:cursor-not-allowed text-white font-medium px-5 py-3 transition-colors"
        >
          {loading ? (
            <>
              <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              Verifying...
            </>
          ) : (
            "Verify Article"
          )}
        </button>

        <button
          onClick={onClear}
          disabled={loading || text.length === 0}
          className="rounded-xl border border-border hover:border-slate-500 disabled:opacity-40 disabled:cursor-not-allowed text-slate-300 font-medium px-5 py-3 transition-colors"
        >
          Clear
        </button>
      </div>
    </div>
  );
}
