import { NextResponse } from "next/server";

export const dynamic = "force-static";

export async function GET() {
  // Cloudflare Edge CDN download URL / R2 storage bucket
  const cdnUrl = "https://cdn.quadraaudio.com/releases/Hydra-latest.dmg";
  return NextResponse.redirect(cdnUrl, 302);
}
