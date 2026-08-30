export default function MaterialIcon({ name, filled = false, className = "", style = {}, "aria-hidden": ariaHidden = true, ...rest }) {
  return (
    <span
      className={`material-symbols-outlined ${className}`}
      style={{ fontVariationSettings: `'FILL' ${filled ? 1 : 0}`, ...style }}
      aria-hidden={ariaHidden}
      {...rest}
    >
      {name}
    </span>
  );
}
