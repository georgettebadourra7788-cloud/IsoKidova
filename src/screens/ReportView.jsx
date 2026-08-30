import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Card from "../components/Card.jsx";
import Button from "../components/Button.jsx";
import Badge from "../components/Badge.jsx";
import ErrorBanner from "../components/ErrorBanner.jsx";
import LoadingState from "../components/LoadingState.jsx";
import TextArea from "../components/form/TextArea.jsx";
import TextField from "../components/form/TextField.jsx";
import Select from "../components/form/Select.jsx";
import EditableList from "../components/form/EditableList.jsx";
import MaterialIcon from "../components/icons/MaterialIcon.jsx";
import { isSupabaseConfigured } from "../lib/supabaseClient.js";
import { getReport, updateReportFields, upsertPlanDays } from "../lib/api/reports.js";
import { getActiveShareLink, createShareLink } from "../lib/api/shareLinks.js";
import { AI_DISCLAIMER } from "../lib/ai/index.js";

const DIFFICULTIES = ["Easy", "Medium", "Challenging", "Review"];

function toEditState(report) {
  return {
    strengths: [...(report.strengths || [])],
    learningGaps: [...(report.learning_gaps || [])],
    priorityGoal: report.priority_goal || "",
    recommendedPractice: report.recommended_practice || "",
    planDays: (report.learning_plan_days || []).map((day) => ({
      dayNumber: day.day_number,
      focusSkill: day.focus_skill || "",
      activity: day.activity || "",
      estimatedTime: day.estimated_time || "",
      difficulty: day.difficulty || "Medium",
      successCriterion: day.success_criterion || "",
    })),
  };
}

export default function ReportView() {
  const { reportId } = useParams();
  const [report, setReport] = useState(null);
  const [edit, setEdit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [savedNotice, setSavedNotice] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError("");
      const { data, error: fetchError } = await getReport(reportId);
      if (cancelled) return;
      if (fetchError || !data) {
        setError("We couldn't find that report.");
      } else {
        setReport(data);
        setEdit(toEditState(data));
        const { data: link } = await getActiveShareLink(reportId);
        if (link) setShareUrl(`${window.location.origin}/share/${link.token}`);
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [reportId]);

  const updateDay = (index, field, value) => {
    setEdit((prev) => {
      const planDays = [...prev.planDays];
      planDays[index] = { ...planDays[index], [field]: value };
      return { ...prev, planDays };
    });
  };

  const persist = async (status) => {
    const [fieldsRes, daysRes] = await Promise.all([
      updateReportFields(reportId, { ...edit, status }),
      upsertPlanDays(reportId, edit.planDays),
    ]);
    if (fieldsRes.error || daysRes.error) {
      throw new Error("We couldn't save your changes. Please try again.");
    }
    setReport((prev) => ({ ...prev, ...fieldsRes.data, learning_plan_days: daysRes.data }));
  };

  const handleSave = async () => {
    setError("");
    setSaving(true);
    try {
      await persist("saved");
      setSavedNotice(true);
      setTimeout(() => setSavedNotice(false), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleShare = async () => {
    setError("");
    setSharing(true);
    try {
      await persist("saved");
      let link = null;
      const existing = await getActiveShareLink(reportId);
      if (existing.data) {
        link = existing.data;
      } else {
        const created = await createShareLink(report.tutor_id, reportId);
        if (created.error) throw new Error("We couldn't create a share link. Please try again.");
        link = created.data;
      }
      setShareUrl(`${window.location.origin}/share/${link.token}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setSharing(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API can be unavailable (e.g. insecure context); the link
      // is still visible in the input for the tutor to select and copy.
    }
  };

  if (!isSupabaseConfigured) {
    return <ErrorBanner message="This app isn't connected to a database yet. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to load this report." />;
  }
  if (loading) return <LoadingState title="Loading report..." />;
  if (error && !report) return <ErrorBanner message={error} />;
  if (!report || !edit) return null;

  return (
    <div className="mx-auto max-w-3xl space-y-6 pb-16">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold text-on-surface sm:text-3xl">{report.child_name}'s Learning Report</h1>
          <p className="mt-1 text-sm text-on-surface-variant">
            {[report.child_age && `Age ${report.child_age}`, report.child_grade, report.child_subject].filter(Boolean).join(" · ")}
          </p>
        </div>
        <Badge tone={report.status === "saved" ? "primary" : "neutral"}>{report.status === "saved" ? "Saved" : "Draft"}</Badge>
      </div>

      {error && <ErrorBanner message={error} />}
      {savedNotice && (
        <div className="flex items-center gap-2 rounded-xl bg-primary-container px-4 py-3 text-sm text-on-primary-container">
          <MaterialIcon name="check_circle" className="text-lg" filled /> Changes saved.
        </div>
      )}

      <Card className="space-y-4 p-6">
        <h2 className="font-display text-lg font-semibold text-on-surface">Strengths</h2>
        <EditableList
          items={edit.strengths}
          placeholder="e.g. Strong vocabulary"
          onChange={(strengths) => setEdit((prev) => ({ ...prev, strengths }))}
        />
      </Card>

      <Card className="space-y-4 p-6">
        <h2 className="font-display text-lg font-semibold text-on-surface">Learning Gaps</h2>
        <EditableList
          items={edit.learningGaps}
          placeholder="e.g. Needs additional practice with multiplication facts 6-9"
          onChange={(learningGaps) => setEdit((prev) => ({ ...prev, learningGaps }))}
        />
      </Card>

      <Card className="space-y-4 p-6">
        <h2 className="font-display text-lg font-semibold text-on-surface">Priority Goal</h2>
        <TextArea
          id="priorityGoal"
          rows={2}
          value={edit.priorityGoal}
          onChange={(e) => setEdit((prev) => ({ ...prev, priorityGoal: e.target.value }))}
        />
      </Card>

      <Card className="space-y-4 p-6">
        <h2 className="font-display text-lg font-semibold text-on-surface">Recommended Practice</h2>
        <TextField
          id="recommendedPractice"
          value={edit.recommendedPractice}
          onChange={(e) => setEdit((prev) => ({ ...prev, recommendedPractice: e.target.value }))}
        />
      </Card>

      <div>
        <h2 className="mb-3 font-display text-lg font-semibold text-on-surface">14-Day Learning Plan</h2>
        <div className="space-y-4">
          {edit.planDays.map((day, index) => (
            <Card key={day.dayNumber} className="space-y-3 p-5">
              <div className="flex items-center justify-between">
                <p className="font-display text-base font-semibold text-on-surface">Day {day.dayNumber}</p>
                <Badge tone="accent">{day.difficulty}</Badge>
              </div>
              <TextField
                id={`focus-${day.dayNumber}`}
                label="Focus skill"
                value={day.focusSkill}
                onChange={(e) => updateDay(index, "focusSkill", e.target.value)}
              />
              <TextArea
                id={`activity-${day.dayNumber}`}
                label="Activity"
                rows={2}
                value={day.activity}
                onChange={(e) => updateDay(index, "activity", e.target.value)}
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <TextField
                  id={`time-${day.dayNumber}`}
                  label="Estimated time"
                  value={day.estimatedTime}
                  onChange={(e) => updateDay(index, "estimatedTime", e.target.value)}
                />
                <Select
                  id={`difficulty-${day.dayNumber}`}
                  label="Difficulty"
                  value={day.difficulty}
                  onChange={(e) => updateDay(index, "difficulty", e.target.value)}
                >
                  {DIFFICULTIES.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </Select>
              </div>
              <TextField
                id={`success-${day.dayNumber}`}
                label="Success criterion"
                value={day.successCriterion}
                onChange={(e) => updateDay(index, "successCriterion", e.target.value)}
              />
            </Card>
          ))}
        </div>
      </div>

      <p className="text-xs text-on-surface-variant">{AI_DISCLAIMER}</p>

      <Card className="sticky bottom-4 flex flex-wrap items-center gap-3 p-4 soft-shadow">
        <Button onClick={handleSave} loading={saving} variant="outline">
          Save Changes
        </Button>
        <Button onClick={handleShare} loading={sharing} variant="accent">
          Share with Parent
        </Button>
        {shareUrl && (
          <div className="flex w-full items-center gap-2 sm:w-auto sm:flex-1">
            <input readOnly value={shareUrl} className="w-full rounded-xl border border-outline-variant bg-surface-container-low px-3 py-2 text-xs text-on-surface-variant" />
            <Button type="button" size="sm" variant="ghost" onClick={handleCopy}>
              {copied ? "Copied" : "Copy"}
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
