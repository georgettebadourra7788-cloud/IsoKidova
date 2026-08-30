import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Card from "../components/Card.jsx";
import Button from "../components/Button.jsx";
import Badge from "../components/Badge.jsx";
import EmptyState from "../components/EmptyState.jsx";
import LoadingState from "../components/LoadingState.jsx";
import ErrorBanner from "../components/ErrorBanner.jsx";
import { useAuth } from "../lib/AuthContext.jsx";
import { isSupabaseConfigured } from "../lib/supabaseClient.js";
import { listChildren } from "../lib/api/children.js";
import { listReportsForTutor } from "../lib/api/reports.js";

export default function Dashboard() {
  const { user, profile } = useAuth();
  const [children, setChildren] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isSupabaseConfigured || !user) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError("");
      const [childrenRes, reportsRes] = await Promise.all([
        listChildren(user.id),
        listReportsForTutor(user.id, { limit: 5 }),
      ]);
      if (cancelled) return;
      if (childrenRes.error || reportsRes.error) {
        setError("We couldn't load your dashboard right now. Please refresh the page.");
      } else {
        setChildren(childrenRes.data || []);
        setReports(reportsRes.data || []);
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [user]);

  const firstName = (profile?.full_name || "").split(" ")[0];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-semibold text-on-surface sm:text-3xl">
          {firstName ? `Welcome back, ${firstName}` : "Welcome back"}
        </h1>
        <p className="mt-1 text-sm text-on-surface-variant">Here's what's happening with your students.</p>
      </div>

      {!isSupabaseConfigured && (
        <ErrorBanner message="This app isn't connected to a database yet. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to load your data." />
      )}
      {error && <ErrorBanner message={error} />}

      {isSupabaseConfigured && (
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            <Card className="p-5">
              <p className="text-sm text-on-surface-variant">Children</p>
              <p className="mt-1 font-display text-3xl font-semibold text-on-surface">{loading ? "-" : children.length}</p>
            </Card>
            <Card className="p-5">
              <p className="text-sm text-on-surface-variant">Learning reports</p>
              <p className="mt-1 font-display text-3xl font-semibold text-on-surface">{loading ? "-" : reports.length}</p>
            </Card>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link to="/app/children/new">
              <Button>Add Child</Button>
            </Link>
            <Link to="/app/children">
              <Button variant="outline">Create Learning Plan</Button>
            </Link>
          </div>

          <div>
            <h2 className="mb-3 font-display text-lg font-semibold text-on-surface">Recent reports</h2>
            {loading ? (
              <LoadingState title="Loading your reports..." />
            ) : reports.length === 0 ? (
              <EmptyState
                icon="description"
                title="No reports yet"
                description="Add your first child to create a personalized learning plan."
                action={
                  <Link to="/app/children/new">
                    <Button size="sm">Add Child</Button>
                  </Link>
                }
              />
            ) : (
              <div className="space-y-3">
                {reports.map((report) => (
                  <Link key={report.id} to={`/app/reports/${report.id}`}>
                    <Card className="flex items-center justify-between gap-3 p-4 transition hover:border-primary/40">
                      <div>
                        <p className="font-medium text-on-surface">{report.child_name}</p>
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
        </>
      )}
    </div>
  );
}
