import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../../components/Logo.jsx";
import Button from "../../components/Button.jsx";
import ErrorBanner from "../../components/ErrorBanner.jsx";
import TextField from "../../components/form/TextField.jsx";
import { useAuth } from "../../lib/AuthContext.jsx";

export default function SignUp() {
  const { signUp, isSupabaseConfigured } = useAuth();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [needsConfirmation, setNeedsConfirmation] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!fullName.trim()) {
      setError("Please enter your name.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setSubmitting(true);
    const { data, error: signUpError } = await signUp(email, password, fullName.trim());
    setSubmitting(false);
    if (signUpError) {
      setError(signUpError.message || "We couldn't create your account. Please try again.");
      return;
    }
    if (data.session) {
      navigate("/app", { replace: true });
    } else {
      setNeedsConfirmation(true);
    }
  };

  if (needsConfirmation) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-surface px-4 text-center">
        <Logo className="mb-6" />
        <div className="w-full max-w-sm rounded-2xl border border-outline-variant/60 bg-surface-container-lowest p-8 soft-shadow">
          <h1 className="font-display text-xl font-semibold text-on-surface">Check your email</h1>
          <p className="mt-2 text-sm text-on-surface-variant">
            We sent a confirmation link to <span className="font-medium text-on-surface">{email}</span>. Confirm your
            email, then log in.
          </p>
          <Link to="/login" className="mt-6 block">
            <Button className="w-full">Go to login</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-surface px-4 py-10">
      <Logo className="mb-6" />
      <div className="w-full max-w-sm">
        <div className="mb-5 text-center">
          <h1 className="font-display text-2xl font-semibold text-on-surface">Create your tutor account</h1>
          <p className="mt-1 text-sm text-on-surface-variant">Start building personalized learning plans.</p>
        </div>

        {!isSupabaseConfigured && (
          <ErrorBanner
            className="mb-4"
            message="This app isn't connected to a database yet. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to enable sign up."
          />
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-2xl border border-outline-variant/60 bg-surface-container-lowest p-6 soft-shadow"
        >
          <TextField
            id="fullName"
            label="Name"
            autoComplete="name"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
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
            autoComplete="new-password"
            required
            hint="At least 6 characters."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <ErrorBanner message={error} />}

          <Button type="submit" className="w-full" loading={submitting} disabled={!isSupabaseConfigured}>
            {submitting ? "Creating account..." : "Create account"}
          </Button>
        </form>

        <p className="mt-5 text-center text-sm text-on-surface-variant">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-primary hover:opacity-80">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
