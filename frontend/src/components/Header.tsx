interface HeaderProps {
  apiOnline: boolean | null;
}

export default function Header({ apiOnline }: HeaderProps) {
  return (
    <header className="border-b border-border bg-bg-panel/60 backdrop-blur sticky top-0 z-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-accent/15 border border-accent/30 flex items-center justify-center text-accent-light font-semibold">
            த
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-semibold tracking-tight text-slate-50">
              Tamil Fake News Detector
            </h1>
            <p className="text-xs text-slate-400 hidden sm:block">
              TF-IDF + Logistic Regression &middot; Tamil headline verification
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span
            className={`w-2 h-2 rounded-full ${
              apiOnline === null
                ? "bg-slate-500 animate-pulseSoft"
                : apiOnline
                ? "bg-real"
                : "bg-fake"
            }`}
          />
          <span className="text-slate-400 hidden sm:inline">
            {apiOnline === null ? "Checking..." : apiOnline ? "API Online" : "API Offline"}
          </span>
        </div>
      </div>
    </header>
  );
}
