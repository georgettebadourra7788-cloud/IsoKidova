import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Card from "../components/Card.jsx";
import Button from "../components/Button.jsx";
import Badge from "../components/Badge.jsx";
import EmptyState from "../components/EmptyState.jsx";
import LoadingState from "../components/LoadingState.jsx";
import ErrorBanner from "../components/ErrorBanner.jsx";
import { isSupabaseConfigured } from "../lib/supabaseClient.js";
import { getChild } from "../lib/api/children.js";
import { listReportsForChild } from "../lib/api/reports.js";

export default function ChildDetail() {
  const { childId } = useParams();
  const [child, setChild] = useState(null);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError("");
      const [childRes, reportsRes] = await Promise.all([getChild(childId), listReportsForChild(childId)]);
      if (cancelled) return;
      if (childRes.error || !childRes.data) {
        setError("We couldn't find that child.");
      } else if (reportsRes.error) {
        setError("We couldn't load this child's reports right now.");
      } else {
        setChild(childRes.data);
        setReports(reportsRes.data || []);
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [childId]);

  if (!isSupabaseConfigured) {
    return <ErrorBanner message="This app isn't connected to a database yet. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to load this child." />;
  }
  if (loading) return <LoadingState title="Loading..." />;
  if (error) return <ErrorBanner message={error} />;

  return (
    <div className="space-y-6">
      <Link to="/app/children" className="text-sm text-on-surface-variant hover:text-on-surface">
        &larr; Back to children
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold text-on-surface sm:text-3xl">{child.name}</h1>
          <p className="mt-1 text-sm text-on-surface-variant">
            {[child.age && `Age ${child.age}`, child.grade, child.subject].filter(Boolean).join(" · ") || "No details yet"}
          </p>
        </div>
        <Link to={`/app/children/${child.id}/assess`}>
          <Button>New Assessment</Button>
        </Link>
      </div>

      <div>
        <h2 className="mb-3 font-display text-lg font-semibold text-on-surface">Learning reports</h2>
        {reports.length === 0 ? (
          <EmptyState
            icon="description"
            title="No reports yet"
            description="Create an assessment to generate this child's first learning report."
            action={
              <Link to={`/app/children/${child.id}/assess`}>
                <Button size="sm">New Assessment</Button>
              </Link>
            }
          />
        ) : (
          <div className="space-y-3">
            {reports.map((report) => (
              <Link key={report.id} to={`/app/reports/${report.id}`}>
                <Card className="flex items-center justify-between gap-3 p-4 transition hover:border-primary/40">
                  <div>
                    <p className="font-medium text-on-surface">
                      {report.priority_goal ? report.priority_goal.slice(0, 60) : "Learning report"}
                    </p>
                    <p className="text-xs text-on-surface-variant">
                      Updated {new Date(report.updated_at).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge tone={report.status === "saved" ? "primary" : "neutral"}>
                    {report.status === "saved" ? "Saved" : "Draft"}
                  </Badge>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
