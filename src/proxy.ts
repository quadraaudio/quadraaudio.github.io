import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

/** Pass-through — Google session uses httpOnly cookies (no Auth0). */
export async function proxy(_request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|placeholders).*)",
  ],
};
