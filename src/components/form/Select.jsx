export default function Select({ label, id, error, hint, className = "", children, ...rest }) {
  return (
    <label htmlFor={id} className={`block ${className}`}>
      {label && <span className="mb-1.5 block text-sm font-medium text-on-surface">{label}</span>}
      <select
        id={id}
        className={`w-full rounded-xl border bg-surface-container-lowest px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40 ${
          error ? "border-error" : "border-outline-variant"
        }`}
        {...rest}
      >
        {children}
      </select>
      {hint && !error && <span className="mt-1 block text-xs text-on-surface-variant">{hint}</span>}
      {error && <span className="mt-1 block text-xs text-error">{error}</span>}
    </label>
  );
}
