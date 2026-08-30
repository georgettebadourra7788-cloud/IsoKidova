import { supabase } from "../supabaseClient.js";

const ASSESSMENT_COLUMNS =
  "id, child_id, tutor_id, strengths, weaknesses, topics_assessed, results, observations, additional_notes, created_at";

export async function createAssessment(tutorId, childId, assessment) {
  return supabase
    .from("assessments")
    .insert({
      tutor_id: tutorId,
      child_id: childId,
      strengths: assessment.strengths || null,
      weaknesses: assessment.weaknesses || null,
      topics_assessed: assessment.topicsAssessed || null,
      results: assessment.results || null,
      observations: assessment.observations || null,
      additional_notes: assessment.additionalNotes || null,
    })
    .select(ASSESSMENT_COLUMNS)
    .single();
}

export async function getAssessment(assessmentId) {
  return supabase.from("assessments").select(ASSESSMENT_COLUMNS).eq("id", assessmentId).maybeSingle();
}

export async function getLatestAssessmentForChild(childId) {
  return supabase
    .from("assessments")
    .select(ASSESSMENT_COLUMNS)
    .eq("child_id", childId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
}
