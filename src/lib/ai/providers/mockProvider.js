import { splitPhrases, shortLabel, scoreForTopic, extractScore, lowerFirst } from "../textUtils.js";
import { buildPlanDays } from "../curriculum/index.js";

// Mock AI provider for MVP 1: no API key, no network call, no cost. It
// turns the tutor's own free-text assessment into a structured report -
// strengths, ranked learning gaps, a priority goal, and a personalized
// 14-day teaching plan - using hand-authored curricula for common subjects
// (see ../curriculum/) and a concrete, phase-aware generic builder for
// anything else, so the whole product workflow (form -> report -> edit ->
// share -> parent view) can be built and tested end to end before a real AI
// provider is wired in. See ../index.js for how a real provider would slot
// in behind the same generate(input) contract.

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function significantWords(phrase) {
  return new Set(phrase.toLowerCase().match(/[a-z]{4,}/g) || []);
}

function buildWhyItMatters({ child, topic, subject }) {
  const name = child.name || "This child";
  const subjectLabel = subject ? lowerFirst(subject) : "this subject";
  return `${name}'s upcoming work in ${subjectLabel} builds directly on ${lowerFirst(
    topic,
  )} - later topics assume this skill is already solid, so gaps here tend to compound rather than resolve on their own. Strengthening it now, while the material is still at a manageable size, is far easier than revisiting it later alongside new, harder content.`;
}

export async function generate({ child, assessment }) {
  // Small artificial delay so the "Generate Learning Plan" loading state
  // (spec section 7) is meaningful to test in the browser, the same way a
  // real API call would take a moment. Skipped under the test runner so the
  // suite stays fast - this is purely a UX pacing delay, not behavior.
  if (import.meta.env?.MODE !== "test") await delay(900);

  const strengthPhrases = splitPhrases(assessment.strengths, 5);
  const weaknessPhrases = splitPhrases(assessment.weaknesses, 6);
  const topicPhrases = splitPhrases(assessment.topicsAssessed, 6);

  const strengths =
    strengthPhrases.length > 0
      ? strengthPhrases
      : [
          `${child.name} engages well with ${child.subject || "the subject"} and stays on task during sessions.`,
          "Shows willingness to try new problems, even when unsure at first.",
        ];

  // "Topics assessed" isn't the same as "weak" - a topic the results show
  // as already strong (e.g. "Addition 9/10" alongside "Multiplication
  // 6/10") shouldn't be listed as a learning gap just because it was part
  // of the assessment. Assessed topics (the structured, per-topic list) are
  // built first, since each one carries its own concrete score; a tutor's
  // free-text weaknesses sentence is added afterward only for whatever it
  // names that isn't already covered by a specific scored topic - a
  // sentence like "Multiplication tables, ... and multiplication word
  // problems" is fully redundant once "Multiplication" and "Word problems"
  // already appear as their own scored entries, so it's dropped rather than
  // producing a vague, unscored duplicate of the same gap.
  const focusPool = [];
  const claimedWords = new Set();
  for (const phrase of topicPhrases) {
    const topicScore = scoreForTopic(assessment.results, phrase);
    if (topicScore && topicScore.ratio >= 0.8) continue; // already strong - not a gap
    focusPool.push(phrase);
    for (const w of significantWords(phrase)) claimedWords.add(w);
  }
  for (const phrase of weaknessPhrases) {
    const words = [...significantWords(phrase)];
    const alreadyCovered = words.length > 0 && words.some((w) => claimedWords.has(w));
    if (alreadyCovered) continue;
    focusPool.push(phrase);
    for (const w of words) claimedWords.add(w);
  }
  if (focusPool.length === 0) focusPool.push("core skills");

  const topPriority = shortLabel(focusPool[0]);
  // Try the short topic label first, then the full weaknesses sentence
  // (which often names specific sub-skills the label alone doesn't, e.g.
  // "identifying the main idea" matching a "Main idea 5/10" result), before
  // falling back to whichever score appears first in the results text. This
  // is the plan's day-1/day-14 baseline, tied to whichever topic the
  // curriculum actually teaches.
  const score =
    scoreForTopic(assessment.results, topPriority) ||
    scoreForTopic(assessment.results, assessment.weaknesses) ||
    extractScore(assessment.results);

  // Each gap gets its own score looked up against its own topic - not just
  // the top item - so "Priority Learning Gaps" reflects the child's actual
  // per-topic results throughout the list, not only on the first line. The
  // displayed order is then ranked worst-first (lowest ratio = biggest gap =
  // highest priority); gaps with no resolvable score keep their original
  // order after those, since a tutor's explicit note is still a real gap
  // even without a number attached.
  const scoredPool = focusPool.map((phrase) => ({
    phrase,
    gapScore: scoreForTopic(assessment.results, shortLabel(phrase)) || scoreForTopic(assessment.results, phrase),
  }));
  const ranked = [
    ...scoredPool.filter((entry) => entry.gapScore).sort((a, b) => a.gapScore.ratio - b.gapScore.ratio),
    ...scoredPool.filter((entry) => !entry.gapScore),
  ];
  const rankedFocusPool = ranked.map((entry) => entry.phrase);

  const learningGaps = ranked.map(({ phrase, gapScore }) => {
    if (gapScore) {
      return `Needs additional practice with ${lowerFirst(phrase)} (currently around ${gapScore.correct} out of ${gapScore.total} correct).`;
    }
    return `Needs additional practice with ${lowerFirst(phrase)}.`;
  });

  const priorityGoal = `Build confidence and accuracy with ${lowerFirst(
    topPriority,
  )} through short, consistent daily practice over the next 14 days.`;

  const whyItMatters = buildWhyItMatters({ child, topic: topPriority, subject: child.subject });

  const recommendedPractice =
    child.age != null && child.age <= 8
      ? "15 minutes per day, ideally at the same time each day."
      : child.age != null && child.age >= 11
        ? "20-25 minutes per day, broken into focused sessions."
        : "15-20 minutes per day, ideally at the same time each day.";

  const planDays = buildPlanDays({ child, assessment, score, focusPool: rankedFocusPool });

  return { strengths, learningGaps, priorityGoal, whyItMatters, recommendedPractice, planDays };
}

export const meta = {
  id: "mock",
  label: "Mock (no API key required)",
};
