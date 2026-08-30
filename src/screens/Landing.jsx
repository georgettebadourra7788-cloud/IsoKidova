import { Link } from "react-router-dom";
import Logo from "../components/Logo.jsx";
import Button from "../components/Button.jsx";
import MaterialIcon from "../components/icons/MaterialIcon.jsx";

const STEPS = [
  {
    icon: "fact_check",
    title: "1. Assess",
    description: "Enter what you already know about a child - strengths, weaknesses, and how a recent assessment went.",
  },
  {
    icon: "auto_awesome",
    title: "2. Personalize",
    description: "IsoKidova turns that into a clear learning report and a personalized 14-day plan you can review and edit.",
  },
  {
    icon: "trending_up",
    title: "3. Improve",
    description: "Share the plan privately with the parent, so everyone knows exactly what to focus on next.",
  },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-surface">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 sm:px-6">
        <Logo />
        <div className="flex items-center gap-2">
          <Link to="/login" className="px-3 py-2 text-sm font-medium text-on-surface-variant hover:text-on-surface">
            Log in
          </Link>
          <Link to="/signup">
            <Button size="sm">Get Started</Button>
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 sm:py-24">
        <h1 className="font-display text-4xl font-semibold leading-tight text-on-surface sm:text-5xl">
          Personalized learning for every child.
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-base text-on-surface-variant sm:text-lg">
          IsoKidova helps tutors understand where a child needs support and turns that into a clear, personalized
          14-day learning plan - ready to review and share with parents in minutes.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link to="/signup">
            <Button size="lg">Get Started</Button>
          </Link>
          <a href="#how-it-works">
            <Button size="lg" variant="outline">
              See How It Works
            </Button>
          </a>
        </div>
      </section>

      <section id="how-it-works" className="mx-auto max-w-5xl px-4 pb-20 sm:px-6">
        <div className="grid gap-5 sm:grid-cols-3">
          {STEPS.map((step) => (
            <div key={step.title} className="rounded-2xl border border-outline-variant/60 bg-surface-container-lowest p-6 soft-shadow">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-container text-on-primary-container">
                <MaterialIcon name={step.icon} />
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold text-on-surface">{step.title}</h3>
              <p className="mt-1.5 text-sm text-on-surface-variant">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 pb-24 text-center sm:px-6">
        <p className="text-sm text-on-surface-variant">
          IsoKidova is an educational planning assistant for tutors and parents. It doesn't diagnose or replace
          professional evaluation - it helps you turn what you already know about a child into a clear plan of action.
        </p>
      </section>

      <footer className="border-t border-outline-variant/60 py-6 text-center text-xs text-on-surface-variant">
        &copy; {new Date().getFullYear()} IsoKidova
      </footer>
    </div>
  );
}
