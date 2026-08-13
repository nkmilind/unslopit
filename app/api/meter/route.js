import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { FREE_ANON_LIMIT, METER_COOKIE, readCount } from "../../../lib/meter";
import { createClient } from "../../../lib/supabase-server";
import { FREE_ACCOUNT_LIMIT, getAccountUsage } from "../../../lib/usage";

// GET /api/meter -> current tier + used/remaining/limit + which gate (if any).
// Signed-in users are metered per account; everyone else by the anon cookie.
export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = supabase ? await supabase.auth.getUser() : { data: { user: null } };

  if (user) {
    let used = 0;
    try {
      used = await getAccountUsage(user.id);
    } catch {
      // If usage lookup fails, don't hard-fail the page — treat as 0.
    }
    return NextResponse.json({
      tier: "account",
      email: user.email,
      used,
      remaining: Math.max(0, FREE_ACCOUNT_LIMIT - used),
      limit: FREE_ACCOUNT_LIMIT,
      gate: used >= FREE_ACCOUNT_LIMIT ? "paywall" : null,
    });
  }

  const cookieStore = await cookies();
  const used = readCount(cookieStore.get(METER_COOKIE)?.value);
  return NextResponse.json({
    tier: "anon",
    used,
    remaining: Math.max(0, FREE_ANON_LIMIT - used),
    limit: FREE_ANON_LIMIT,
    gate: used >= FREE_ANON_LIMIT ? "signup" : null,
  });
}
