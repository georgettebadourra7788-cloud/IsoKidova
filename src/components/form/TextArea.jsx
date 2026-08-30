export default function TextArea({ label, id, error, hint, className = "", rows = 3, ...rest }) {
  return (
    <label htmlFor={id} className={`block ${className}`}>
      {label && <span className="mb-1.5 block text-sm font-medium text-on-surface">{label}</span>}
      <textarea
        id={id}
        rows={rows}
        className={`w-full rounded-xl border bg-surface-container-lowest px-4 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:ring-2 focus:ring-primary/40 ${
          error ? "border-error" : "border-outline-variant"
        }`}
        {...rest}
      />
      {hint && !error && <span className="mt-1 block text-xs text-on-surface-variant">{hint}</span>}
      {error && <span className="mt-1 block text-xs text-error">{error}</span>}
    </label>
  );
}
