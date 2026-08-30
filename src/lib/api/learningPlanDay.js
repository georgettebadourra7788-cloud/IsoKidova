// Canonical shape for one day of a 14-day learning plan, and the ONLY two
// functions in the app allowed to know about the database's snake_case
// column names. Every layer of the app - the AI provider's output, the
// report edit form's state, and the parent's read-only view - uses this one
// camelCase shape. Nothing else should invent its own field names for a
// plan day; convert at the boundary with toDbRow()/fromDbRow() instead.
//
// This is a plain JS project (no TypeScript anywhere in the build), so the
// "type" is documented as a JSDoc typedef rather than a `type` declaration -
// editors still get full autocomplete/type-checking from this, with no
// change to the build.
//
/**
 * @typedef {Object} LearningPlanDay
 * @property {number} dayNumber - 1-14
 * @property {string} title - e.g. "Multiplication as Equal Groups" (the UI prepends "Day N -")
 * @property {string} focusSkill - short topic tag, e.g. "Equal groups" or "x6" - kept for quick scanning/lists
 * @property {string} learningObjective - specific and measurable, "By the end of the session, <name> will..."
 * @property {string} tutorActivity - the concrete teaching procedure: what to explain, demonstrate, ask
 * @property {string} childPractice - the exercises the child does, with sample questions where relevant
 * @property {string} teachingTip - one practical strategy for this age/gap
 * @property {string} successCheck - measurable, e.g. "4 of 5 correct independently"
 * @property {string} estimatedTime - a display string, e.g. "15 minutes" or "10-15 minutes" (review days are a range, so this is text, not a bare number of minutes)
 * @property {"Easy"|"Medium"|"Challenging"|"Review"} difficulty
 */

// application format (LearningPlanDay) -> database row.
//
// learning_plan_days columns: day_number, focus_skill, title,
// learning_objective, activity, child_practice, teaching_tip,
// estimated_time, difficulty, success_criterion. Two columns keep their
// original name but a newer meaning now that the plan is richer:
// `activity` holds the tutor's teaching procedure (tutorActivity) and
// `success_criterion` holds the measurable check (successCheck) - reusing
// them instead of adding parallel columns, per the brief's "don't
// unnecessarily destroy the existing database architecture."
export function toDbRow(reportId, day) {
  return {
    report_id: reportId,
    day_number: day.dayNumber,
    title: day.title,
    focus_skill: day.focusSkill,
    learning_objective: day.learningObjective,
    activity: day.tutorActivity,
    child_practice: day.childPractice,
    teaching_tip: day.teachingTip,
    estimated_time: day.estimatedTime,
    difficulty: day.difficulty,
    success_criterion: day.successCheck,
  };
}

// database row -> application format (LearningPlanDay). Used both for a
// learning_plan_days row read via the tutor's authenticated query and for
// one entry of the plan_days array the get_shared_report() RPC returns for
// the parent view (same column names either way).
export function fromDbRow(row) {
  return {
    dayNumber: row.day_number,
    title: row.title ?? "",
    focusSkill: row.focus_skill ?? "",
    learningObjective: row.learning_objective ?? "",
    tutorActivity: row.activity ?? "",
    childPractice: row.child_practice ?? "",
    teachingTip: row.teaching_tip ?? "",
    estimatedTime: row.estimated_time ?? "",
    difficulty: row.difficulty ?? "Medium",
    successCheck: row.success_criterion ?? "",
  };
}
