import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import Card from "../components/Card.jsx";
import Button from "../components/Button.jsx";
import ErrorBanner from "../components/ErrorBanner.jsx";
import LoadingState from "../components/LoadingState.jsx";
import TextField from "../components/form/TextField.jsx";
import TextArea from "../components/form/TextArea.jsx";
import { useAuth } from "../lib/AuthContext.jsx";
import { isSupabaseConfigured } from "../lib/supabaseClient.js";
import { getChild, createChild } from "../lib/api/children.js";
import { createAssessment } from "../lib/api/assessments.js";
import { createReport } from "../lib/api/reports.js";
import { generateLearningReport } from "../lib/ai/index.js";

const EMPTY_ASSESSMENT = {
  strengths: "",
  weaknesses: "",
  topicsAssessed: "",
  results: "",
  observations: "",
  additionalNotes: "",
};

export default function AddChild() {
  const { childId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [existingChild, setExistingChild] = useState(null);
  const [loadingChild, setLoadingChild] = useState(Boolean(childId));
  const [childInfo, setChildInfo] = useState({ name: "", age: "", grade: "", subject: "" });
  const [assessment, setAssessment] = useState(EMPTY_ASSESSMENT);
  const [error, setError] = useState("");
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    if (!childId || !isSupabaseConfigured) {
      setLoadingChild(false);
      return;
    }
    let cancelled = false;
    (async () => {
      const { data, error: fetchError } = await getChild(childId);
      if (cancelled) return;
      if (fetchError || !data) {
        setError("We couldn't find that child. Please go back and try again.");
      } else {
        setExistingChild(data);
      }
      setLoadingChild(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [childId]);

  const updateField = (setter) => (e) => setter((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!existingChild && !childInfo.name.trim()) {
      setError("Please enter the child's name.");
      return;
    }

    setGenerating(true);
    try {
      let child = existingChild;
      if (!child) {
        const { data, error: childError } = await createChild(user.id, {
          name: childInfo.name.trim(),
          age: childInfo.age ? Number(childInfo.age) : null,
          grade: childInfo.grade.trim(),
          subject: childInfo.subject.trim(),
        });
        if (childError) throw new Error("We couldn't save this child. Please try again.");
        child = data;
      }

      const { data: assessmentRow, error: assessmentError } = await createAssessment(user.id, child.id, assessment);
      if (assessmentError) throw new Error("We couldn't save the assessment. Please try again.");

      const { data: aiResult, providerId, error: aiError } = await generateLearningReport({ child, assessment });
      if (aiError || !aiResult) throw new Error("The AI couldn't generate a report right now. Please try again.");

      const { data: report, error: reportError } = await createReport(user.id, {
        child,
        assessmentId: assessmentRow.id,
        aiProvider: providerId,
        report: aiResult,
        planDays: aiResult.planDays,
      });
      if (reportError) throw new Error("We generated the report but couldn't save it. Please try again.");

      navigate(`/app/reports/${report.id}`);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
      setGenerating(false);
    }
  };

  if (loadingChild) return <LoadingState title="Loading..." />;

  if (generating) {
    return (
      <LoadingState
        title="Generating a personalized learning plan..."
        description="IsoKidova is reviewing the assessment and building a 14-day plan. This takes just a moment."
      />
    );
  }

  const child = existingChild;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-on-surface sm:text-3xl">
          {child ? `New assessment for ${child.name}` : "Add a child"}
        </h1>
        <p className="mt-1 text-sm text-on-surface-variant">
          Fill in what you know - IsoKidova will turn it into a learning report and a 14-day plan.
        </p>
      </div>

      {!isSupabaseConfigured && (
        <ErrorBanner message="This app isn't connected to a database yet. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to save children and assessments." />
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {!child && (
          <Card className="space-y-4 p-6">
            <h2 className="font-display text-lg font-semibold text-on-surface">Child information</h2>
            <TextField
              id="name"
              name="name"
              label="Child name"
              required
              value={childInfo.name}
              onChange={updateField(setChildInfo)}
            />
            <div className="grid gap-4 sm:grid-cols-3">
              <TextField
                id="age"
                name="age"
                label="Age"
                type="number"
                min="3"
                max="18"
                placeholder="9"
                value={childInfo.age}
                onChange={updateField(setChildInfo)}
              />
              <TextField
                id="grade"
                name="grade"
                label="Grade"
                placeholder="Grade 3"
                value={childInfo.grade}
                onChange={updateField(setChildInfo)}
              />
              <TextField
                id="subject"
                name="subject"
                label="Subject"
                placeholder="Math"
                value={childInfo.subject}
                onChange={updateField(setChildInfo)}
              />
            </div>
          </Card>
        )}

        <Card className="space-y-4 p-6">
          <h2 className="font-display text-lg font-semibold text-on-surface">Assessment</h2>
          <TextArea
            id="strengths"
            name="strengths"
            label="Strengths"
            placeholder="Strong vocabulary, understands basic addition..."
            value={assessment.strengths}
            onChange={updateField(setAssessment)}
          />
          <TextArea
            id="weaknesses"
            name="weaknesses"
            label="Weaknesses"
            placeholder="Multiplication tables, reading comprehension..."
            value={assessment.weaknesses}
            onChange={updateField(setAssessment)}
          />
          <TextArea
            id="topicsAssessed"
            name="topicsAssessed"
            label="Topics / skills assessed"
            placeholder="Multiplication facts 2-9, short passage comprehension..."
            value={assessment.topicsAssessed}
            onChange={updateField(setAssessment)}
          />
          <TextArea
            id="results"
            name="results"
            label="Assessment results"
            placeholder="7/10 multiplication questions correct..."
            value={assessment.results}
            onChange={updateField(setAssessment)}
          />
          <TextArea
            id="observations"
            name="observations"
            label="Tutor observations"
            placeholder="Gets distracted after 10 minutes, prefers hands-on examples..."
            value={assessment.observations}
            onChange={updateField(setAssessment)}
          />
          <TextArea
            id="additionalNotes"
            name="additionalNotes"
            label="Additional notes (optional)"
            hint="Anything else that would help build a better plan."
            value={assessment.additionalNotes}
            onChange={updateField(setAssessment)}
          />
        </Card>

        {error && <ErrorBanner message={error} />}

        <div className="flex flex-wrap items-center gap-3">
          <Button type="submit" size="lg" disabled={!isSupabaseConfigured}>
            Generate Learning Plan
          </Button>
          <Link to={child ? `/app/children/${child.id}` : "/app/children"} className="text-sm text-on-surface-variant hover:text-on-surface">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
