// Canonical shape for one day of a 14-day learning plan, and the ONLY two
// functions in the app allowed to know about the database's snake_case
// column names. Every layer of the app - the mock AI provider's output, the
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
 * @property {string} focusSkill
 * @property {string} activity
 * @property {string} estimatedTime - a display string, e.g. "15 minutes" or "10-15 minutes" (review days are a range, so this is text, not a bare number of minutes)
 * @property {"Easy"|"Medium"|"Challenging"|"Review"} difficulty
 * @property {string} successCriterion
 */

// application format (LearningPlanDay) -> database row
// (learning_plan_days columns: day_number, focus_skill, activity,
// estimated_time, difficulty, success_criterion)
export function toDbRow(reportId, day) {
  return {
    report_id: reportId,
    day_number: day.dayNumber,
    focus_skill: day.focusSkill,
    activity: day.activity,
    estimated_time: day.estimatedTime,
    difficulty: day.difficulty,
    success_criterion: day.successCriterion,
  };
}

// database row -> application format (LearningPlanDay). Used both for a
// learning_plan_days row read via the tutor's authenticated query and for
// one entry of the plan_days array the get_shared_report() RPC returns for
// the parent view (same column names either way).
export function fromDbRow(row) {
  return {
    dayNumber: row.day_number,
    focusSkill: row.focus_skill ?? "",
    activity: row.activity ?? "",
    estimatedTime: row.estimated_time ?? "",
    difficulty: row.difficulty ?? "Medium",
    successCriterion: row.success_criterion ?? "",
  };
}
