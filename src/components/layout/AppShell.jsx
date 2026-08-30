import { NavLink } from "react-router-dom";
import { useAuth } from "../../lib/AuthContext.jsx";
import MaterialIcon from "../icons/MaterialIcon.jsx";
import Logo from "../Logo.jsx";

const NAV_ITEMS = [
  { to: "/app", label: "Dashboard", icon: "space_dashboard", end: true },
  { to: "/app/children", label: "Children", icon: "groups" },
];

export default function AppShell({ children }) {
  const { profile, user, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-surface">
      <header className="sticky top-0 z-10 border-b border-outline-variant/60 bg-surface/95 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Logo />
          <nav className="flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium transition ${
                    isActive ? "bg-primary-container text-on-primary-container" : "text-on-surface-variant hover:bg-surface-container"
                  }`
                }
              >
                <MaterialIcon name={item.icon} className="text-lg" />
                <span className="hidden sm:inline">{item.label}</span>
              </NavLink>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-on-surface-variant sm:inline">
              {profile?.full_name || user?.email}
            </span>
            <button
              onClick={signOut}
              className="flex h-9 w-9 items-center justify-center rounded-full text-on-surface-variant hover:bg-surface-container"
              title="Sign out"
              aria-label="Sign out"
            >
              <MaterialIcon name="logout" />
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8">{children}</main>
    </div>
  );
}
