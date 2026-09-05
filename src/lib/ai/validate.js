// Quality gate for a generated learning report, run once at the provider
// boundary (see index.js's generateLearningReport()) regardless of which
// provider produced the result - the mock provider today, or a real model
// later. A provider can be wrong or incomplete in ways its own code can't
// see; this is the one place that refuses to let a broken plan reach the
// database or the UI.

const REQUIRED_DAY_FIELDS = [
  "title",
  "learningObjective",
  "tutorActivity",
  "childPractice",
  "teachingTip",
  "successCheck",
  "estimatedTime",
  "difficulty",
];

const VALID_DIFFICULTIES = new Set(["Easy", "Medium", "Challenging", "Review"]);

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function isNonEmptyStringArray(value) {
  return Array.isArray(value) && value.length > 0 && value.every(isNonEmptyString);
}

/**
 * Checks a single LearningPlanDay (see lib/api/learningPlanDay.js) for the
 * fields the brief requires every day to have. Returns a list of problem
 * descriptions - empty means valid.
 */
export function validatePlanDay(day, dayNumber) {
  const problems = [];
  const label = `Day ${dayNumber ?? day?.dayNumber ?? "?"}`;
  if (!day || typeof day !== "object") return [`${label}: missing day object`];

  for (const field of REQUIRED_DAY_FIELDS) {
    if (!isNonEmptyString(day[field])) problems.push(`${label}: "${field}" is empty`);
  }
  if (isNonEmptyString(day.difficulty) && !VALID_DIFFICULTIES.has(day.difficulty)) {
    problems.push(`${label}: difficulty "${day.difficulty}" is not one of Easy/Medium/Challenging/Review`);
  }
  return problems;
}

/**
 * Checks a full generated report (strengths, ranked gaps, goal, recommended
 * practice, and all 14 plan days) before it's allowed to be saved. Returns
 * { valid, problems } - problems is a list of human-readable reasons, empty
 * when valid.
 */
export function validateReport(report) {
  const problems = [];
  if (!report || typeof report !== "object") {
    return { valid: false, problems: ["No report object was generated."] };
  }

  if (!isNonEmptyStringArray(report.strengths)) problems.push("Strengths must be a non-empty list of non-empty strings.");
  if (!isNonEmptyStringArray(report.learningGaps)) problems.push("Priority learning gaps must be a non-empty list of non-empty strings.");
  if (!isNonEmptyString(report.priorityGoal)) problems.push("The 14-day goal is empty.");
  if (!isNonEmptyString(report.recommendedPractice)) problems.push("Recommended practice frequency is empty.");

  if (!Array.isArray(report.planDays) || report.planDays.length !== 14) {
    problems.push(`Plan must contain exactly 14 days (got ${Array.isArray(report.planDays) ? report.planDays.length : 0}).`);
  } else {
    report.planDays.forEach((day, i) => problems.push(...validatePlanDay(day, i + 1)));
  }

  return { valid: problems.length === 0, problems };
}
