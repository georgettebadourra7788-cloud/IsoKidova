import MaterialIcon from "./icons/MaterialIcon.jsx";

export default function EmptyState({ icon = "inbox", title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-outline-variant bg-surface-container-low px-6 py-12 text-center">
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary-container text-on-primary-container">
        <MaterialIcon name={icon} />
      </div>
      <h3 className="font-display text-lg font-semibold text-on-surface">{title}</h3>
      {description && <p className="mt-1.5 max-w-sm text-sm text-on-surface-variant">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
