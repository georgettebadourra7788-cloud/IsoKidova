import { supabase } from "../supabaseClient.js";

const SHARE_LINK_COLUMNS = "id, report_id, tutor_id, token, created_at, revoked_at";

// 32 random bytes, base64url-encoded -> a 43-character token with 256 bits
// of entropy. Generated client-side with the Web Crypto API (available in
// every browser this app targets) so there's no predictable sequence
// (no auto-increment id, no timestamp) an outsider could guess or enumerate.
function generateToken() {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export async function getActiveShareLink(reportId) {
  return supabase
    .from("parent_share_links")
    .select(SHARE_LINK_COLUMNS)
    .eq("report_id", reportId)
    .is("revoked_at", null)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
}

export async function createShareLink(tutorId, reportId) {
  return supabase
    .from("parent_share_links")
    .insert({ tutor_id: tutorId, report_id: reportId, token: generateToken() })
    .select(SHARE_LINK_COLUMNS)
    .single();
}

export async function revokeShareLink(linkId) {
  return supabase
    .from("parent_share_links")
    .update({ revoked_at: new Date().toISOString() })
    .eq("id", linkId)
    .select(SHARE_LINK_COLUMNS)
    .single();
}

// Public, unauthenticated lookup used by the parent view. Goes through the
// get_shared_report() Postgres function instead of selecting tables
// directly, so an anonymous visitor can never see anything beyond the one
// report their token unlocks -- see supabase/schema.sql.
export async function getSharedReport(token) {
  return supabase.rpc("get_shared_report", { p_token: token });
}
