import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Card from "../components/Card.jsx";
import Badge from "../components/Badge.jsx";
import ErrorBanner from "../components/ErrorBanner.jsx";
import LoadingState from "../components/LoadingState.jsx";
import Logo from "../components/Logo.jsx";
import { isSupabaseConfigured } from "../lib/supabaseClient.js";
import { getSharedReport } from "../lib/api/shareLinks.js";
import { fromDbRow } from "../lib/api/learningPlanDay.js";
import { AI_DISCLAIMER } from "../lib/ai/index.js";

export default function ParentView() {
  const { token } = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      setLoading(true);
      const { data, error: fetchError } = await getSharedReport(token);
      if (cancelled) return;
      if (fetchError) {
        setError("We couldn't load this learning plan right now. Please try again in a moment.");
      } else if (!data) {
        setNotFound(true);
      } else {
        // get_shared_report() returns plan_days as raw DB-shaped rows
        // (same column names as learning_plan_days); convert once here so
        // this screen renders the same canonical LearningPlanDay shape as
        // the tutor's report view.
        setReport({ ...data, plan_days: (data.plan_days || []).map(fromDbRow) });
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [token]);

  return (
    <div className="min-h-screen bg-surface">
      <header className="mx-auto max-w-2xl px-4 py-6 sm:px-6">
        <Logo to="/" />
      </header>

      <main className="mx-auto max-w-2xl px-4 pb-16 sm:px-6">
        {!isSupabaseConfigured && (
          <ErrorBanner message="This app isn't connected to a database yet, so shared links can't be opened." />
        )}
        {isSupabaseConfigured && loading && <LoadingState title="Loading learning plan..." />}
        {isSupabaseConfigured && !loading && error && <ErrorBanner message={error} />}
        {isSupabaseConfigured && !loading && notFound && (
          <Card className="p-8 text-center">
            <h1 className="font-display text-xl font-semibold text-on-surface">This link isn't available</h1>
            <p className="mt-2 text-sm text-on-surface-variant">
              This learning plan link may have been removed or is no longer active. Please ask the tutor for a new
              link.
            </p>
          </Card>
        )}

        {isSupabaseConfigured && !loading && report && (
          <div className="space-y-6">
            <div>
              <h1 className="font-display text-2xl font-semibold text-on-surface sm:text-3xl">{report.child_name}'s Learning Plan</h1>
              <p className="mt-1 text-sm text-on-surface-variant">
                {[report.child_grade, report.child_subject].filter(Boolean).join(" · ")}
              </p>
            </div>

            <Card className="space-y-3 p-6">
              <h2 className="font-display text-lg font-semibold text-on-surface">What your child is doing well</h2>
              <ul className="list-disc space-y-1.5 pl-5 text-sm text-on-surface-variant">
                {(report.strengths || []).map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </Card>

            <Card className="space-y-3 p-6">
              <h2 className="font-display text-lg font-semibold text-on-surface">Skills to strengthen</h2>
              <ul className="list-disc space-y-1.5 pl-5 text-sm text-on-surface-variant">
                {(report.learning_gaps || []).map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </Card>

            {report.priority_goal && (
              <Card className="space-y-2 p-6">
                <h2 className="font-display text-lg font-semibold text-on-surface">Priority goal for the next 14 days</h2>
                <p className="text-sm text-on-surface-variant">{report.priority_goal}</p>
              </Card>
            )}

            {report.recommended_practice && (
              <Card className="space-y-2 p-6">
                <h2 className="font-display text-lg font-semibold text-on-surface">Recommended daily practice</h2>
                <p className="text-sm text-on-surface-variant">{report.recommended_practice}</p>
              </Card>
            )}

            <div>
              <h2 className="mb-3 font-display text-lg font-semibold text-on-surface">14-Day Learning Plan</h2>
              <div className="space-y-3">
                {(report.plan_days || []).map((day) => (
                  <Card key={day.dayNumber} className="space-y-1.5 p-5">
                    <div className="flex items-center justify-between">
                      <p className="font-display text-base font-semibold text-on-surface">Day {day.dayNumber}: {day.focusSkill}</p>
                      {day.difficulty && <Badge tone="accent">{day.difficulty}</Badge>}
                    </div>
                    <p className="text-sm text-on-surface-variant">{day.activity}</p>
                    <p className="text-xs text-on-surface-variant">
                      {[day.estimatedTime, day.successCriterion && `Goal: ${day.successCriterion}`].filter(Boolean).join(" · ")}
                    </p>
                  </Card>
                ))}
              </div>
            </div>

            <p className="border-t border-outline-variant/60 pt-5 text-xs text-on-surface-variant">{AI_DISCLAIMER}</p>
          </div>
        )}
      </main>
    </div>
  );
}
