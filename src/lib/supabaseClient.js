import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// The app is fully buildable/runnable without a Supabase project configured
// (e.g. to preview the UI and the mock AI report flow). Every screen that
// touches the database checks this flag first and shows a friendly
// "not configured" state instead of crashing.
export const isSupabaseConfigured = Boolean(url && anonKey);

export const supabase = isSupabaseConfigured ? createClient(url, anonKey) : null;
