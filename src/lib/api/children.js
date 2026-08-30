import { supabase } from "../supabaseClient.js";

const CHILD_COLUMNS = "id, tutor_id, name, age, grade, subject, created_at, updated_at";

export async function listChildren(tutorId) {
  return supabase
    .from("children")
    .select(CHILD_COLUMNS)
    .eq("tutor_id", tutorId)
    .order("created_at", { ascending: false });
}

export async function getChild(childId) {
  return supabase.from("children").select(CHILD_COLUMNS).eq("id", childId).maybeSingle();
}

export async function createChild(tutorId, child) {
  return supabase
    .from("children")
    .insert({
      tutor_id: tutorId,
      name: child.name,
      age: child.age ?? null,
      grade: child.grade || null,
      subject: child.subject || null,
    })
    .select(CHILD_COLUMNS)
    .single();
}

export async function updateChild(childId, child) {
  return supabase
    .from("children")
    .update({
      name: child.name,
      age: child.age ?? null,
      grade: child.grade || null,
      subject: child.subject || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", childId)
    .select(CHILD_COLUMNS)
    .single();
}

export async function deleteChild(childId) {
  return supabase.from("children").delete().eq("id", childId);
}
