const VARIANTS = {
  primary: "bg-primary text-on-primary hover:opacity-90",
  accent: "bg-accent text-on-accent hover:opacity-90",
  secondary: "bg-secondary-container text-on-secondary-container hover:opacity-90",
  outline: "border border-outline text-on-surface hover:bg-surface-container",
  ghost: "text-on-surface hover:bg-surface-container",
  danger: "bg-error text-on-error hover:opacity-90",
};

const SIZES = {
  md: "h-11 px-5 text-sm",
  lg: "h-13 px-6 text-base",
  sm: "h-9 px-4 text-sm",
};

export default function Button({
  variant = "primary",
  size = "md",
  className = "",
  disabled = false,
  loading = false,
  type = "button",
  children,
  ...rest
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded-full font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...rest}
    >
      {loading && (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" aria-hidden="true" />
      )}
      {children}
    </button>
  );
}
