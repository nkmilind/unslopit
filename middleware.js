import { NextResponse } from "next/server";

// The detector-bait spoke was renamed to align its slug with the query
// language ("chatgpt words"). Permanent 301 so the old URL's ranking signals
// consolidate onto the new one. Query string is preserved.
export function middleware(request) {
  const url = new URL("/learn/chatgpt-words", request.url);
  url.search = request.nextUrl.search;
  return NextResponse.redirect(url, 301);
}

export const config = {
  matcher: "/learn/detector-bait",
};
