import { supabase } from "../supabaseClient.js";

const REPORT_COLUMNS =
  "id, child_id, assessment_id, tutor_id, status, child_name, child_age, child_grade, child_subject, strengths, learning_gaps, priority_goal, recommended_practice, ai_provider, created_at, updated_at";

const PLAN_DAY_COLUMNS = "id, report_id, day_number, focus_skill, activity, estimated_time, difficulty, success_criterion";

// Creates a report and its 14 plan-day rows together. Not a real DB
// transaction (supabase-js can't start one from the browser), but the plan
// days are meaningless without their report, so a partial failure here
// just leaves an orphaned draft report the tutor can regenerate -- nothing
// unsafe is exposed.
export async function createReport(tutorId, { child, assessmentId, aiProvider, report, planDays }) {
  const { data: reportRow, error: reportError } = await supabase
    .from("learning_reports")
    .insert({
      tutor_id: tutorId,
      child_id: child.id,
      assessment_id: assessmentId || null,
      status: "draft",
      child_name: child.name,
      child_age: child.age ?? null,
      child_grade: child.grade || null,
      child_subject: child.subject || null,
      strengths: report.strengths,
      learning_gaps: report.learningGaps,
      priority_goal: report.priorityGoal,
      recommended_practice: report.recommendedPractice,
      ai_provider: aiProvider,
    })
    .select(REPORT_COLUMNS)
    .single();

  if (reportError) return { data: null, error: reportError };

  const rows = planDays.map((day) => ({
    report_id: reportRow.id,
    day_number: day.dayNumber,
    focus_skill: day.focusSkill,
    activity: day.activity,
    estimated_time: day.estimatedTime,
    difficulty: day.difficulty,
    success_criterion: day.successCriterion,
  }));

  const { data: dayRows, error: daysError } = await supabase
    .from("learning_plan_days")
    .insert(rows)
    .select(PLAN_DAY_COLUMNS)
    .order("day_number");

  if (daysError) return { data: null, error: daysError };

  return { data: { ...reportRow, learning_plan_days: dayRows }, error: null };
}

export async function getReport(reportId) {
  return supabase
    .from("learning_reports")
    .select(`${REPORT_COLUMNS}, learning_plan_days(${PLAN_DAY_COLUMNS})`)
    .eq("id", reportId)
    .order("day_number", { foreignTable: "learning_plan_days" })
    .maybeSingle();
}

export async function listReportsForTutor(tutorId, { limit } = {}) {
  let query = supabase
    .from("learning_reports")
    .select(REPORT_COLUMNS)
    .eq("tutor_id", tutorId)
    .order("updated_at", { ascending: false });
  if (limit) query = query.limit(limit);
  return query;
}

export async function listReportsForChild(childId) {
  return supabase
    .from("learning_reports")
    .select(REPORT_COLUMNS)
    .eq("child_id", childId)
    .order("updated_at", { ascending: false });
}

export async function updateReportFields(reportId, patch) {
  return supabase
    .from("learning_reports")
    .update({
      strengths: patch.strengths,
      learning_gaps: patch.learningGaps,
      priority_goal: patch.priorityGoal,
      recommended_practice: patch.recommendedPractice,
      status: patch.status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", reportId)
    .select(REPORT_COLUMNS)
    .single();
}

export async function upsertPlanDays(reportId, days) {
  const rows = days.map((day) => ({
    report_id: reportId,
    day_number: day.dayNumber,
    focus_skill: day.focusSkill,
    activity: day.activity,
    estimated_time: day.estimatedTime,
    difficulty: day.difficulty,
    success_criterion: day.successCriterion,
  }));
  return supabase
    .from("learning_plan_days")
    .upsert(rows, { onConflict: "report_id,day_number" })
    .select(PLAN_DAY_COLUMNS)
    .order("day_number");
}
