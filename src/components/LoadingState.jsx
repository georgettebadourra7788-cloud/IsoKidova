export default function LoadingState({ title = "Loading...", description }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-outline-variant/60 bg-surface-container-lowest px-6 py-16 text-center">
      <span className="h-9 w-9 animate-spin rounded-full border-[3px] border-primary/25 border-t-primary" aria-hidden="true" />
      <div>
        <p className="font-display text-lg font-semibold text-on-surface">{title}</p>
        {description && <p className="mt-1 max-w-sm text-sm text-on-surface-variant">{description}</p>}
      </div>
    </div>
  );
}
