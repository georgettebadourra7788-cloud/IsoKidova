const TONES = {
  neutral: "bg-surface-container text-on-surface-variant",
  primary: "bg-primary-container text-on-primary-container",
  accent: "bg-accent-container text-on-accent-container",
};

export default function Badge({ tone = "neutral", className = "", children }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${TONES[tone]} ${className}`}>
      {children}
    </span>
  );
}
