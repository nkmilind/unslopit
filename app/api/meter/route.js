import { NextResponse } from "next/server";
import { FREE_ANON_LIMIT, METER_COOKIE, readCount } from "../../../lib/meter";

// GET /api/meter -> { used, remaining, limit, gate } for the anonymous visitor.
// Lets the client show an honest "N free edits left" on page load without
// exposing the httpOnly cookie to browser JS.
export async function GET(request) {
  const used = readCount(request.cookies.get(METER_COOKIE)?.value);
  return NextResponse.json({
    used,
    remaining: Math.max(0, FREE_ANON_LIMIT - used),
    limit: FREE_ANON_LIMIT,
    gate: used >= FREE_ANON_LIMIT ? "signup" : null,
  });
}
