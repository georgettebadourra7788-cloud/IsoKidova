import * as multiplicationTables from "./multiplicationTables.js";
import * as readingComprehension from "./readingComprehension.js";
import * as genericPhaseBuilder from "./genericPhaseBuilder.js";

// Hand-authored curricula, checked in order against the tutor's weaknesses
// + topics-assessed text. Add a new module here (with the same
// matches(text)/build({child, assessment, score}) contract) to give another
// subject real, specific day-by-day content instead of falling back to the
// generic builder.
const CURRICULA = [multiplicationTables, readingComprehension];

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
