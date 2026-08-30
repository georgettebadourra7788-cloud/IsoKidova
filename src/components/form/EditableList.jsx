import Button from "../Button.jsx";
import MaterialIcon from "../icons/MaterialIcon.jsx";

export default function EditableList({ label, items, onChange, placeholder }) {
  const updateItem = (index, value) => {
    const next = [...items];
    next[index] = value;
    onChange(next);
  };

  const removeItem = (index) => {
    onChange(items.filter((_, i) => i !== index));
  };

  const addItem = () => onChange([...items, ""]);

  return (
    <div>
      {label && <span className="mb-1.5 block text-sm font-medium text-on-surface">{label}</span>}
      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <input
              value={item}
              placeholder={placeholder}
              onChange={(e) => updateItem(index, e.target.value)}
              className="w-full rounded-xl border border-outline-variant bg-surface-container-lowest px-4 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
            <button
              type="button"
              onClick={() => removeItem(index)}
              aria-label="Remove"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-on-surface-variant hover:bg-surface-container"
            >
              <MaterialIcon name="close" className="text-lg" />
            </button>
          </div>
        ))}
      </div>
      <Button type="button" variant="ghost" size="sm" className="mt-2" onClick={addItem}>
        <MaterialIcon name="add" className="text-base" /> Add
      </Button>
    </div>
  );
}
