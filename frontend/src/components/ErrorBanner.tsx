interface ErrorBannerProps {
  message: string;
  onDismiss: () => void;
}

export default function ErrorBanner({ message, onDismiss }: ErrorBannerProps) {
  return (
    <div className="flex items-start justify-between gap-3 bg-fake-bg border border-fake/30 rounded-xl px-4 py-3 animate-fadeIn">
      <p className="text-sm text-red-300">{message}</p>
      <button
        onClick={onDismiss}
        className="text-red-300/70 hover:text-red-200 text-sm leading-none shrink-0"
        aria-label="Dismiss error"
      >
        ✕
      </button>
    </div>
  );
}
