import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Logo from "../../components/Logo.jsx";
import Button from "../../components/Button.jsx";
import ErrorBanner from "../../components/ErrorBanner.jsx";
import TextField from "../../components/form/TextField.jsx";
import { useAuth } from "../../lib/AuthContext.jsx";

export default function Login() {
  const { signIn, isSupabaseConfigured } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    const { error: signInError } = await signIn(email, password);
    setSubmitting(false);
    if (signInError) {
      setError(signInError.message || "We couldn't log you in. Check your email and password and try again.");
      return;
    }
    navigate(location.state?.from?.pathname || "/app", { replace: true });
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-surface px-4 py-10">
      <Logo className="mb-6" />
      <div className="w-full max-w-sm">
        <div className="mb-5 text-center">
          <h1 className="font-display text-2xl font-semibold text-on-surface">Welcome back</h1>
          <p className="mt-1 text-sm text-on-surface-variant">Log in to your tutor dashboard.</p>
        </div>

        {!isSupabaseConfigured && (
          <ErrorBanner
            className="mb-4"
            message="This app isn't connected to a database yet. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to enable login."
          />
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-2xl border border-outline-variant/60 bg-surface-container-lowest p-6 soft-shadow"
        >
          <TextField
            id="email"
            label="Email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            id="password"
            label="Password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <ErrorBanner message={error} />}

          <Button type="submit" className="w-full" loading={submitting} disabled={!isSupabaseConfigured}>
            {submitting ? "Logging in..." : "Log in"}
          </Button>
        </form>

        <p className="mt-5 text-center text-sm text-on-surface-variant">
          New to IsoKidova?{" "}
          <Link to="/signup" className="font-semibold text-primary hover:opacity-80">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
