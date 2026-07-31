import { NextResponse } from "next/server";
import {
  SESSION_COOKIE,
  createSessionToken,
  googleAuthConfigured,
  verifyGoogleAccessToken,
} from "@/lib/googleAuth";

export async function POST(request: Request) {
  if (!googleAuthConfigured()) {
    return NextResponse.json(
      { error: "Google sign-in is not configured" },
      { status: 503 }
    );
  }

  const body = (await request.json().catch(() => ({}))) as {
    accessToken?: string;
  };
  if (!body.accessToken) {
    return NextResponse.json({ error: "Missing accessToken" }, { status: 400 });
  }

  const user = await verifyGoogleAccessToken(body.accessToken);
  if (!user) {
    return NextResponse.json({ error: "Invalid Google token" }, { status: 401 });
  }

  const token = await createSessionToken(user);
  const response = NextResponse.json({ ok: true, user });
  response.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return response;
}
