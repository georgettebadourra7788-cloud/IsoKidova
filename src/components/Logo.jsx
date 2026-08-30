import { Link } from "react-router-dom";
import MaterialIcon from "./icons/MaterialIcon.jsx";

export default function Logo({ to = "/", className = "" }) {
  return (
    <Link to={to} className={`flex items-center gap-2 ${className}`}>
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-on-primary">
        <MaterialIcon name="auto_stories" className="text-lg" filled />
      </span>
      <span className="font-display text-lg font-semibold tracking-tight text-on-surface">IsoKidova</span>
    </Link>
  );
}
