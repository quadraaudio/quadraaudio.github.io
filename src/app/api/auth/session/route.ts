import { NextResponse } from "next/server";
import { getSessionUser, googleAuthConfigured } from "@/lib/googleAuth";

export async function GET() {
  if (!googleAuthConfigured()) {
    return NextResponse.json({ user: null, configured: false });
  }
  const user = await getSessionUser();
  return NextResponse.json({ user, configured: true });
}
