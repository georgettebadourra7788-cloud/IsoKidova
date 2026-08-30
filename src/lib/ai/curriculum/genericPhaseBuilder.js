import { estimatedTimeFor, phaseFor, firstName } from "./shared.js";
import { splitPhrases, shortLabel, lowerFirst } from "../textUtils.js";

// Fallback used when no hand-authored curriculum matches the tutor's
// weaknesses/topics. It doesn't know the specific subject content the way
// multiplicationTables.js or readingComprehension.js do, so it can't write
// literal sample questions - but it still produces concrete, measurable,
// non-generic instructions by (a) naming the real topic(s) the tutor
// entered in every field, (b) varying the teaching approach day-to-day
// within each phase instead of repeating one template, and (c) always
// specifying exact counts ("5 of 8 correct") rather than vague language.

const FOUNDATION_VARIANTS = [
  {
    title: (topic) => `Introducing ${topic}`,
    tutorActivity: (topic, name) =>
      `Introduce ${lowerFirst(topic)} with 2-3 worked examples, thinking out loud through each step so ${name} can follow the reasoning before trying independently.`,
    childPractice: (topic) => `Complete 5 short practice items on ${lowerFirst(topic)} - work through the first one together, then try the rest solo.`,
    target: "3 of 5",
  },
  {
    title: (topic) => `Guided First Attempts: ${topic}`,
    tutorActivity: (topic, name) =>
      `Give ${name} a short set on ${lowerFirst(topic)} and stay close by, prompting with a question ("what's the first step?") rather than giving the answer whenever they get stuck.`,
    childPractice: (topic) => `Attempt 6 practice items on ${lowerFirst(topic)} with the tutor prompting as needed.`,
    target: "4 of 6",
  },
  {
    title: (topic) => `Foundation Check: ${topic}`,
    tutorActivity: (topic, name) =>
      `Briefly review the strategy for ${lowerFirst(topic)} from the last two sessions, then have ${name} attempt a short set fully independently as a first check.`,
    childPractice: (topic) => `Complete 5 items on ${lowerFirst(topic)} independently, with no hints unless truly stuck.`,
    target: "4 of 5",
  },
];

const GUIDED_VARIANTS = [
  {
    title: (topic) => `Building Fluency: ${topic}`,
    tutorActivity: (topic, name) =>
      `Introduce a slightly harder version of ${lowerFirst(topic)}. Work the first two examples together, then let ${name} continue with hints (not answers) offered only when needed.`,
    childPractice: (topic) => `Complete 8 practice items on ${lowerFirst(topic)}, increasing in difficulty.`,
    target: "6 of 8",
  },
  {
    title: (topic) => `Strategy Practice: ${topic}`,
    tutorActivity: (topic, name) =>
      `Teach ${name} one explicit strategy for ${lowerFirst(topic)}, demonstrate it on two examples, then have them name the strategy out loud before applying it themselves.`,
    childPractice: (topic) => `Apply the strategy to 8 new items on ${lowerFirst(topic)}.`,
    target: "6 of 8",
  },
  {
    title: (topic) => `Guided Review: ${topic}`,
    tutorActivity: (topic, name) =>
      `Mix a few of ${name}'s earlier practice items on ${lowerFirst(topic)} with new ones. Ask ${name} to explain their reasoning for at least two answers.`,
    childPractice: (topic) => `Complete 8 mixed practice items on ${lowerFirst(topic)}, explaining the reasoning for 2 of them out loud.`,
    target: "7 of 8",
  },
];

const APPLICATION_VARIANTS = [
  {
    title: (topic) => `Real-World Application: ${topic}`,
    tutorActivity: (topic, name) =>
      `Present ${lowerFirst(topic)} in a real-life style scenario rather than a bare exercise, and ask ${name} to explain their thinking before writing an answer.`,
    childPractice: (topic) => `Solve 5 applied problems involving ${lowerFirst(topic)}, explaining the reasoning for at least 2.`,
    target: "3 of 5",
  },
  {
    title: (topic) => `New Format Practice: ${topic}`,
    tutorActivity: (topic, name) =>
      `Present ${lowerFirst(topic)} in a different format than practiced so far (spoken instead of written, a picture instead of text, or vice versa) to check the skill transfers, not just the format.`,
    childPractice: (topic) => `Complete 5 items on ${lowerFirst(topic)} presented in a new format.`,
    target: "4 of 5",
  },
  {
    title: (topic) => `Applied Problem Solving: ${topic}`,
    tutorActivity: (topic, name) =>
      `Give ${name} a short, multi-part applied problem that requires ${lowerFirst(topic)} as one step among a few, so they practice recognizing when to use the skill.`,
    childPractice: (topic) => `Work through 4 multi-part applied problems involving ${lowerFirst(topic)}.`,
    target: "3 of 4",
  },
];

const INDEPENDENT_VARIANTS = [
  {
    title: (topic) => `Independent Practice: ${topic}`,
    tutorActivity: (topic, name) =>
      `Hand ${name} the practice set on ${lowerFirst(topic)} and step back - help only if asked, or after an attempt is made and wrong. Review any mistakes together afterward.`,
    childPractice: (topic) => `Complete 6 practice items on ${lowerFirst(topic)} independently.`,
    target: "5 of 6",
  },
  {
    title: (topic) => `Confidence Challenge: ${topic}`,
    tutorActivity: (topic, name) =>
      `Give ${name} a slightly larger set on ${lowerFirst(topic)} to build stamina and confidence, keeping the pace relaxed and low-pressure.`,
    childPractice: (topic) => `Complete 8 practice items on ${lowerFirst(topic)} at a comfortable pace.`,
    target: "6 of 8",
  },
  {
    title: (topic) => `Mixed Independent Challenge: ${topic}`,
    tutorActivity: (topic, name) =>
      `Combine ${lowerFirst(topic)} with one or two other skills practiced earlier in the plan into one mixed independent set.`,
    childPractice: (topic) => `Complete 8 mixed items combining ${lowerFirst(topic)} with earlier skills.`,
    target: "6 of 8",
  },
];

function pickTopics(assessment, focusPool) {
  // Prefer the same ranked gap list already shown in the Learning Snapshot
  // (already deduped and filtered for topics the assessment shows are
  // already strong) so the plan's day-to-day topics match it exactly.
  const source = focusPool && focusPool.length > 0 ? focusPool : splitPhrases(assessment?.weaknesses || assessment?.topicsAssessed || "", 3);
  const topics = source.map((phrase) => shortLabel(phrase, 4));
  return topics.length > 0 ? topics : ["core skills"];
}

function buildDay(dayNumber, variant, topic, name, age, phaseLabel) {
  const { phase, difficulty } = phaseFor(dayNumber);
  return {
    dayNumber,
    title: variant.title(topic),
    focusSkill: topic,
    learningObjective: `By the end of the session, ${name} will complete at least ${variant.target} practice items on ${lowerFirst(topic)} correctly.`,
    tutorActivity: variant.tutorActivity(topic, name),
    childPractice: variant.childPractice(topic),
    teachingTip:
      phaseLabel === "foundation"
        ? `Break ${lowerFirst(topic)} into its smallest steps and celebrate each one - early confidence matters more than speed.`
        : phaseLabel === "independent"
          ? `Resist stepping in immediately - let ${name} attempt and self-correct before offering help.`
          : `Connect ${lowerFirst(topic)} to something ${name} already does well to build confidence before adding difficulty.`,
    successCheck: `${variant.target} correct.`,
    estimatedTime: estimatedTimeFor(age, phase),
    difficulty,
  };
}

export function build({ child, assessment, score, focusPool }) {
  const name = firstName(child);
  const age = child?.age;
  const topics = pickTopics(assessment, focusPool);
  const topicFor = (i) => topics[i % topics.length];
  const baseline = score ? `${score.correct} of ${score.total}` : "the starting assessment";

  const days = [];
  for (let i = 0; i < 3; i++) days.push(buildDay(i + 1, FOUNDATION_VARIANTS[i], topicFor(i), name, age, "foundation"));
  for (let i = 0; i < 3; i++) days.push(buildDay(i + 4, GUIDED_VARIANTS[i], topicFor(i), name, age, "guided"));

  const { difficulty: checkpointDifficulty } = phaseFor(7);
  days.push({
    dayNumber: 7,
    title: "Week 1 Checkpoint",
    focusSkill: "Mixed review",
    learningObjective: `By the end of the session, ${name} and the tutor will identify which parts of ${topics.map(lowerFirst).join(" and ")} are still shaky, based on a mixed review.`,
    tutorActivity: `Give a short mixed review covering everything practiced this week (${topics.join(", ")}). Note which items ${name} answers confidently and which are still difficult - these become the focus for the rest of the plan.`,
    childPractice: `Mixed review set (8 items) covering ${topics.join(", ")}.`,
    teachingTip: "Note the specific items that were wrong or slow, without correcting them yet - that list is this week's target list.",
    successCheck: "6 of 8 correct, with specific misses noted for extra practice.",
    estimatedTime: estimatedTimeFor(age, "checkpoint"),
    difficulty: checkpointDifficulty,
  });

  for (let i = 0; i < 3; i++) days.push(buildDay(i + 8, APPLICATION_VARIANTS[i], topicFor(i), name, age, "application"));
  for (let i = 0; i < 3; i++) days.push(buildDay(i + 11, INDEPENDENT_VARIANTS[i], topicFor(i), name, age, "independent"));

  const { difficulty: finalDifficulty } = phaseFor(14);
  days.push({
    dayNumber: 14,
    title: "Final Check & Progress Comparison",
    focusSkill: "Final assessment",
    learningObjective: `By the end of the session, ${name} will complete a short mixed assessment covering ${topics.map(lowerFirst).join(" and ")}, compared against ${baseline}.`,
    tutorActivity: `Give a short, low-pressure mixed assessment covering ${topics.join(", ")}. Compare the result with the starting assessment and note which specific skills have improved and which still need continued practice.`,
    childPractice: `Final mixed check (8 items) covering ${topics.join(", ")}.`,
    teachingTip: "Frame this as a celebration of progress, not a test to pass or fail - compare to where the child started, not to a perfect score.",
    successCheck: `6 of 8 correct, an improvement on ${baseline}.`,
    estimatedTime: estimatedTimeFor(age, "final"),
    difficulty: finalDifficulty,
  });

  return days;
}
