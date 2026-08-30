export default function Card({ className = "", children, ...rest }) {
  return (
    <div
      className={`rounded-2xl bg-surface-container-lowest border border-outline-variant/60 soft-shadow ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}
