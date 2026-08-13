import { createBrowserClient } from "@supabase/ssr";

// Base project origin — tolerate a pasted trailing slash or /rest/v1 suffix.
const URL = (process.env.NEXT_PUBLIC_SUPABASE_URL || "")
  .trim()
  .replace(/\/+$/, "")
  .replace(/\/rest\/v1$/, "");
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// Browser-side Supabase client for auth (magic-link sign-in, session state).
// Uses the public anon key — safe to ship to the browser; RLS protects data.
export function createClient() {
  return createBrowserClient(URL, ANON);
}
