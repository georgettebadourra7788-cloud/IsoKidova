import { Link } from "react-router-dom";
import Button from "../components/Button.jsx";
import Logo from "../components/Logo.jsx";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-surface px-4 text-center">
      <Logo />
      <h1 className="font-display text-xl font-semibold text-on-surface">Page not found</h1>
      <p className="text-sm text-on-surface-variant">The page you're looking for doesn't exist.</p>
      <Link to="/">
        <Button variant="outline">Go home</Button>
      </Link>
    </div>
  );
}
