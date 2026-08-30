import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Card from "../components/Card.jsx";
import Button from "../components/Button.jsx";
import EmptyState from "../components/EmptyState.jsx";
import LoadingState from "../components/LoadingState.jsx";
import ErrorBanner from "../components/ErrorBanner.jsx";
import { useAuth } from "../lib/AuthContext.jsx";
import { isSupabaseConfigured } from "../lib/supabaseClient.js";
import { listChildren } from "../lib/api/children.js";
import { listReportsForTutor } from "../lib/api/reports.js";

export default function Children() {
  const { user } = useAuth();
  const [children, setChildren] = useState([]);
  const [latestByChild, setLatestByChild] = useState({});
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
      const [childrenRes, reportsRes] = await Promise.all([listChildren(user.id), listReportsForTutor(user.id)]);
      if (cancelled) return;
      if (childrenRes.error || reportsRes.error) {
        setError("We couldn't load your children right now. Please refresh the page.");
      } else {
        setChildren(childrenRes.data || []);
        const latest = {};
        for (const report of reportsRes.data || []) {
          if (!latest[report.child_id]) latest[report.child_id] = report;
        }
        setLatestByChild(latest);
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [user]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-semibold text-on-surface sm:text-3xl">Children</h1>
        <Link to="/app/children/new">
          <Button>Add Child</Button>
        </Link>
      </div>

      {!isSupabaseConfigured && (
        <ErrorBanner message="This app isn't connected to a database yet. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to load your children." />
      )}
      {error && <ErrorBanner message={error} />}

      {isSupabaseConfigured &&
        (loading ? (
          <LoadingState title="Loading children..." />
        ) : children.length === 0 ? (
          <EmptyState
            icon="groups"
            title="No children yet"
            description="Add your first child to create a personalized learning plan."
            action={
              <Link to="/app/children/new">
                <Button size="sm">Add Child</Button>
              </Link>
            }
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {children.map((child) => {
              const latest = latestByChild[child.id];
              return (
                <Card key={child.id} className="p-5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-display text-lg font-semibold text-on-surface">{child.name}</p>
                      <p className="text-sm text-on-surface-variant">
                        {[child.age && `Age ${child.age}`, child.grade, child.subject].filter(Boolean).join(" · ") ||
                          "No details yet"}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 text-xs text-on-surface-variant">
                    {latest ? (
                      <>Latest report updated {new Date(latest.updated_at).toLocaleDateString()}</>
                    ) : (
                      "No learning report yet"
                    )}
                  </div>
                  <Link to={`/app/children/${child.id}`} className="mt-4 block">
                    <Button variant="outline" size="sm" className="w-full">
                      View Child
                    </Button>
                  </Link>
                </Card>
              );
            })}
          </div>
        ))}
    </div>
  );
}
