import * as mockProvider from "./providers/mockProvider.js";
import { validateReport } from "./validate.js";

/**
 * The contract every AI provider module must implement - the mock provider
 * today, a GeminiProvider or any other real model later. Nothing outside
 * this file and validate.js needs to know which provider produced a
 * result; the report screens only ever see the validated LearningReport
 * shape returned by generateLearningReport() below.
 *
 * @typedef {Object} LearningReport
 * @property {string[]} strengths
 * @property {string[]} learningGaps - ranked highest-priority first
 * @property {string} priorityGoal
 * @property {string} whyItMatters
 * @property {string} recommendedPractice
 * @property {import("../api/learningPlanDay.js").LearningPlanDay[]} planDays - exactly 14
 *
 * @typedef {Object} AIProvider
 * @property {{id: string, label: string}} meta - `id` is the value tutors/ops set VITE_AI_PROVIDER to
 * @property {(input: {child: object, assessment: object}) => Promise<LearningReport>} generate
 */

// Provider registry. To add a real provider later: create
// src/lib/ai/providers/yourProvider.js implementing the AIProvider contract
// above (same `generate({ child, assessment })` shape as mockProvider.js),
// register it below, and set VITE_AI_PROVIDER to its `meta.id`. Every
// provider's output is validated the same way before it's trusted (see
// below), so a future provider that occasionally returns incomplete data
// fails loudly instead of silently reaching the database.
//
// If the provider needs a secret API key, `generate()` there should call a
// server-only endpoint (a Vercel serverless function under a top-level
// api/ directory, which never ships in the browser bundle) instead of
// calling the AI API directly from the client - never embed a real
// provider's secret key in a VITE_* env var, since those are inlined into
// the client bundle at build time.
const PROVIDERS = {
  [mockProvider.meta.id]: mockProvider,
};

const DEFAULT_PROVIDER_ID = "mock";

function resolveProviderId() {
  const configured = import.meta.env.VITE_AI_PROVIDER;
  return configured && PROVIDERS[configured] ? configured : DEFAULT_PROVIDER_ID;
}

// AI safety guardrails (spec section 8): the report is educational planning
// guidance built from what the tutor supplied, never a diagnosis. This
// disclaimer text is shown wherever a generated report is shown, tutor and
// parent views alike.
export const AI_DISCLAIMER =
  "This learning plan is educational guidance based on information provided by the tutor. It is not a medical or psychological assessment.";

/**
 * @param {{child: object, assessment: object}} input
 * @returns {Promise<{data: LearningReport|null, providerId: string, error: string|null}>}
 */
export async function generateLearningReport({ child, assessment }) {
  const providerId = resolveProviderId();
  const provider = PROVIDERS[providerId];
  try {
    const result = await provider.generate({ child, assessment });
    const { valid, problems } = validateReport(result);
    if (!valid) {
      // Never a vague failure - the specific missing/empty fields are
      // logged for debugging, while the tutor sees one friendly message
      // (spec section 17: no raw technical errors in the UI).
      console.error("[ai] generated report failed validation:", problems);
      return {
        data: null,
        providerId,
        error: "The learning plan couldn't be generated completely. Please try again.",
      };
    }
    // TEMPORARY DEBUG LOGGING - remove once the pipeline is confirmed.
    console.log("[DEBUG VALIDATED] valid =", valid, "| strengths.length =", result.strengths.length);
    console.log("[DEBUG VALIDATED] day1.title =", result.planDays[0]?.title);
    console.log("[DEBUG VALIDATED] day1.learningObjective =", result.planDays[0]?.learningObjective);
    return { data: result, providerId, error: null };
  } catch (err) {
    return {
      data: null,
      providerId,
      error: err instanceof Error ? err.message : "AI generation failed. Please try again.",
    };
  }
}
