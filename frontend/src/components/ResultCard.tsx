import type { PredictionResponse } from "../types";

interface ResultCardProps {
  result: PredictionResponse;
}

export default function ResultCard({ result }: ResultCardProps) {
  const isReal = result.prediction === "REAL";

  return (
    <div
      className={`rounded-2xl border p-5 sm:p-6 animate-fadeIn ${
        isReal ? "bg-real-bg border-real/30" : "bg-fake-bg border-fake/30"
      }`}
    >
      <div className="flex items-center justify-between flex-wrap gap-3 mb-5">
        <div className="flex items-center gap-3">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold ${
              isReal ? "bg-real/15 text-real" : "bg-fake/15 text-fake"
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${isReal ? "bg-real" : "bg-fake"}`} />
            {isReal ? "REAL" : "FAKE"}
          </span>
          <span className="text-sm text-slate-400">
            {isReal ? "Likely authentic content" : "Likely misinformation"}
          </span>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-slate-50">
            {(result.confidence * 100).toFixed(1)}%
          </div>
          <div className="text-xs text-slate-400">confidence</div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        <Stat label="Real probability" value={`${(result.real_probability * 100).toFixed(1)}%`} />
        <Stat label="Fake probability" value={`${(result.fake_probability * 100).toFixed(1)}%`} />
        <Stat label="Word count" value={result.word_count.toString()} />
        <Stat label="Character count" value={result.character_count.toString()} />
      </div>

      <p className="text-xs text-slate-500 leading-relaxed border-t border-white/5 pt-4">
        This is a model confidence estimate based on learned text patterns from a training
        corpus, not a factual fact-check. Always verify important claims against a trusted
        source before sharing.
      </p>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-bg-elevated/60 rounded-xl px-3 py-2.5">
      <div className="text-base font-semibold text-slate-100">{value}</div>
      <div className="text-[11px] text-slate-400 mt-0.5">{label}</div>
    </div>
  );
}
