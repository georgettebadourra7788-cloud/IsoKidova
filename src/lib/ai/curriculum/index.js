import * as multiplicationTables from "./mathematics/multiplicationTables.js";
import * as fractions from "./mathematics/fractions.js";
import * as readingComprehension from "./reading/comprehension.js";
import * as vocabulary from "./english/vocabulary.js";
import * as scientificMethod from "./science/scientificMethod.js";
import * as genericPhaseBuilder from "./genericPhaseBuilder.js";

// Hand-authored curricula, organized by subject folder (mathematics/,
// reading/, english/, science/) and checked in this order against the
// tutor's weaknesses + topics-assessed text. To add another subject or
// topic: create a new module anywhere under curriculum/<subject>/ exporting
// `subject`, `topic`, `matches(text)`, and `build({child, assessment, score,
// focusPool})` (see mathematics/fractions.js for the shortest example), then
// register it here. Nothing else in the app needs to change - mockProvider.js
// and the report screens only ever see the resulting LearningPlanDay[].
const CURRICULA = [multiplicationTables, fractions, readingComprehension, vocabulary, scientificMethod];

// focusPool is the same ranked list of gap phrases already shown in the
// report's "Priority Learning Gaps" - passed through so the generic
// builder's day-to-day topics rotate through the same specific gaps
// (e.g. "Fractions", "Decimals") instead of re-deriving its own, coarser
// split of the raw assessment text and risking a mismatch between what the
// snapshot says the gaps are and what the plan actually teaches.
export function buildPlanDays({ child, assessment, score, focusPool }) {
  const text = [assessment?.weaknesses, assessment?.topicsAssessed].filter(Boolean).join(" ");
  const curriculum = CURRICULA.find((c) => c.matches(text));
  const chosen = curriculum || genericPhaseBuilder;
  return chosen.build({ child, assessment, score, focusPool });
}

// Exposed for introspection/testing - e.g. asserting a given weakness text
// routes to the expected curriculum, or listing supported subjects in a UI
// later. Not used by the generation path itself.
export function listCurricula() {
  return CURRICULA.map((c) => ({ subject: c.subject, topic: c.topic }));
}

export function resolveCurriculum({ assessment }) {
  const text = [assessment?.weaknesses, assessment?.topicsAssessed].filter(Boolean).join(" ");
  const curriculum = CURRICULA.find((c) => c.matches(text));
  return curriculum ? { subject: curriculum.subject, topic: curriculum.topic } : { subject: "General", topic: "Generic phase-based plan" };
}
