import { splitPhrases, shortLabel, extractScore, lowerFirst } from "../textUtils.js";

// Mock AI provider for MVP 1: no API key, no network call, no cost. It
// turns the tutor's own free-text assessment into a structured report using
// templates, so the whole product workflow (form -> report -> edit -> share
// -> parent view) can be built and tested end to end before a real AI
// provider is wired in. See ../index.js for how a real provider would slot
// in behind the same generate(input) contract.

const ACTIVITY_TEMPLATES = [
  (skill) => `Complete a short, focused practice set on ${lowerFirst(skill)}.`,
  (skill) => `Work through a few guided examples of ${lowerFirst(skill)} together.`,
  (skill) => `Play a quick learning game that reinforces ${lowerFirst(skill)}.`,
  (skill) => `Review the last practice set on ${lowerFirst(skill)} and try a slightly harder one.`,
  (skill) => `Apply ${lowerFirst(skill)} to one real-life, hands-on example.`,
  (skill) => `Take a short, low-pressure check-in on ${lowerFirst(skill)} to see how it's going.`,
];

const REVIEW_ACTIVITY = (skill) => `Light review day: revisit ${lowerFirst(skill)} through a game or story, no pressure.`;

function pickEstimatedTime(age, isReviewDay) {
  if (isReviewDay) return "10-15 minutes";
  if (age != null && age <= 8) return "15 minutes";
  if (age != null && age >= 11) return "25 minutes";
  return "20 minutes";
}

function pickDifficulty(dayNumber) {
  if (dayNumber === 7 || dayNumber === 14) return "Review";
  if (dayNumber <= 3) return "Easy";
  if (dayNumber <= 9) return "Medium";
  return "Challenging";
}

function buildSuccessCriterion(score) {
  if (score) {
    const target = Math.min(score.total, score.correct + 1);
    return `Gets at least ${target} out of ${score.total} correct.`;
  }
  return "Completes the activity with growing confidence, asking for help only when needed.";
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function generate({ child, assessment }) {
  // Small artificial delay so the "Generate Learning Plan" loading state
  // (spec section 7) is meaningful to test, the same way a real API call
  // would take a moment.
  await delay(900);

  const strengthPhrases = splitPhrases(assessment.strengths, 5);
  const weaknessPhrases = splitPhrases(assessment.weaknesses, 6);
  const topicPhrases = splitPhrases(assessment.topicsAssessed, 6);
  const score = extractScore(assessment.results);

  const strengths =
    strengthPhrases.length > 0
      ? strengthPhrases
      : [
          `${child.name} engages well with ${child.subject || "the subject"} and stays on task during sessions.`,
          "Shows willingness to try new problems, even when unsure at first.",
        ];

  // Weaknesses and assessed topics are both worth practicing, so combine
  // them (deduping near-identical entries) rather than only falling back to
  // topics when weaknesses is empty - this also keeps the 14-day plan from
  // repeating a single focus skill when the tutor described just one.
  const focusPool = [];
  const seen = new Set();
  for (const phrase of [...weaknessPhrases, ...topicPhrases]) {
    const key = shortLabel(phrase).toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    focusPool.push(phrase);
  }
  if (focusPool.length === 0) focusPool.push("core skills");

  const learningGaps = focusPool.map((phrase, i) => {
    if (i === 0 && score) {
      return `Needs additional practice with ${lowerFirst(phrase)} (currently around ${score.correct} out of ${score.total} correct).`;
    }
    return `Needs additional practice with ${lowerFirst(phrase)}.`;
  });

  const priorityGoal = `Build confidence and accuracy with ${lowerFirst(
    shortLabel(focusPool[0]),
  )} through short, consistent daily practice over the next 14 days.`;

  const recommendedPractice =
    child.age != null && child.age <= 8
      ? "15 minutes per day, ideally at the same time each day."
      : child.age != null && child.age >= 11
        ? "20-25 minutes per day, broken into focused sessions."
        : "15-20 minutes per day, ideally at the same time each day.";

  const planDays = Array.from({ length: 14 }, (_, i) => {
    const dayNumber = i + 1;
    // The full phrase (e.g. "multiplication tables, especially 6-9") is
    // right for a Learning Gaps bullet, but reads better trimmed down when
    // it's embedded mid-sentence in a day's focus skill / activity text.
    const skill = shortLabel(focusPool[i % focusPool.length]);
    const isReviewDay = dayNumber === 7 || dayNumber === 14;
    const activity = isReviewDay
      ? REVIEW_ACTIVITY(skill)
      : ACTIVITY_TEMPLATES[i % ACTIVITY_TEMPLATES.length](skill);

    return {
      dayNumber,
      focusSkill: skill,
      activity,
      estimatedTime: pickEstimatedTime(child.age, isReviewDay),
      difficulty: pickDifficulty(dayNumber),
      successCriterion: isReviewDay
        ? "Takes part willingly, no formal scoring today."
        : buildSuccessCriterion(score),
    };
  });

  return { strengths, learningGaps, priorityGoal, recommendedPractice, planDays };
}

export const meta = {
  id: "mock",
  label: "Mock (no API key required)",
};
