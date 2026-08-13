import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const URL = (process.env.NEXT_PUBLIC_SUPABASE_URL || "")
  .trim()
  .replace(/\/+$/, "")
  .replace(/\/rest\/v1$/, "");
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// Server-side Supabase client bound to the request cookies. Reads the session
// in route handlers (auth.getUser) and writes refreshed session cookies back.
// Returns null when auth env isn't configured, so callers fall back to the
// anonymous tier instead of 500-ing.
export async function createClient() {
  if (!URL || !ANON) return null;
  const cookieStore = await cookies();
  return createServerClient(URL, ANON, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // set() throws in Server Components; safe to ignore in that context.
        }
      },
    },
  });
}
