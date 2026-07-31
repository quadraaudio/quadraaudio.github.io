import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

export const GOOGLE_CLIENT_ID =
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
  "120489321679-udegv4a0kl5o193bqnji07351kseca47.apps.googleusercontent.com";

export const SESSION_COOKIE = "quadra_google_session";

export type SessionUser = {
  id: string;
  email: string;
  name?: string | null;
  picture?: string | null;
};

function sessionSecret() {
  const secret = process.env.AUTH_SECRET;
  if (!secret) return null;
  return new TextEncoder().encode(secret);
}

export function googleAuthConfigured() {
  return Boolean(GOOGLE_CLIENT_ID && process.env.AUTH_SECRET);
}

export async function createSessionToken(user: SessionUser) {
  const key = sessionSecret();
  if (!key) throw new Error("AUTH_SECRET is not set");
  return new SignJWT({
    email: user.email,
    name: user.name || null,
    picture: user.picture || null,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(key);
}

export async function readSessionToken(
  token: string | undefined | null
): Promise<SessionUser | null> {
  if (!token) return null;
  const key = sessionSecret();
  if (!key) return null;
  try {
    const { payload } = await jwtVerify(token, key);
    if (!payload.sub || typeof payload.email !== "string") return null;
    return {
      id: payload.sub,
      email: payload.email,
      name: typeof payload.name === "string" ? payload.name : null,
      picture: typeof payload.picture === "string" ? payload.picture : null,
    };
  } catch {
    return null;
  }
}

export async function getSessionUser(): Promise<SessionUser | null> {
  if (!googleAuthConfigured()) return null;
  const jar = await cookies();
  return readSessionToken(jar.get(SESSION_COOKIE)?.value);
}

export async function verifyGoogleAccessToken(
  accessToken: string
): Promise<SessionUser | null> {
  const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });
  if (!res.ok) return null;
  const data = (await res.json()) as {
    sub?: string;
    email?: string;
    name?: string;
    picture?: string;
  };
  if (!data.sub || !data.email) return null;
  return {
    id: data.sub,
    email: data.email,
    name: data.name || null,
    picture: data.picture || null,
  };
}
