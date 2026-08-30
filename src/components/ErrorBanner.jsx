import MaterialIcon from "./icons/MaterialIcon.jsx";

// Friendly, non-technical error display (spec section 17: never show raw
// technical errors to normal users). Callers pass a plain-language message;
// raw error objects/stack traces should never reach this component.
export default function ErrorBanner({ message, className = "" }) {
  if (!message) return null;
  return (
    <div
      role="alert"
      className={`flex items-start gap-2.5 rounded-xl border border-error/30 bg-error-container px-4 py-3 text-sm text-on-error-container ${className}`}
    >
      <MaterialIcon name="error" className="mt-0.5 text-base" />
      <span>{message}</span>
    </div>
  );
}
