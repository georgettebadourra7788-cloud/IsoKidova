import * as mockProvider from "./providers/mockProvider.js";

// Provider registry. To add a real provider later: create
// src/lib/ai/providers/yourProvider.js exporting the same
// `generate({ child, assessment })` contract as mockProvider.js, register it
// below, and set VITE_AI_PROVIDER. If the provider needs a secret API key,
// `generate()` there should call a server-only endpoint (see api/ and how
// api/whatsapp-webhook-style functions keep secrets out of the browser
// bundle) instead of calling the AI API directly from the client.
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

export async function generateLearningReport({ child, assessment }) {
  const providerId = resolveProviderId();
  const provider = PROVIDERS[providerId];
  try {
    const result = await provider.generate({ child, assessment });
    // TEMPORARY DEBUG LOGGING - remove once the pipeline is confirmed.
    console.log("[DEBUG 1 AI OUTPUT] day 1 from provider.generate():", result.planDays?.[0]);
    console.log("[DEBUG 2 NORMALIZED] day 1 returned by generateLearningReport() (no transform applied here):", result.planDays?.[0]);
    return { data: result, providerId, error: null };
  } catch (err) {
    return {
      data: null,
      providerId,
      error: err instanceof Error ? err.message : "AI generation failed. Please try again.",
    };
  }
}
