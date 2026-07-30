import { NextResponse } from "next/server";

export const dynamic = "force-static";

export async function GET() {
  const updatePayload = {
    tag_name: "v1.0.0",
    name: "Hydra v1.0.0 Commercial Release",
    published_at: new Date().toISOString(),
    assets: [
      {
        name: "Hydra-1.0.0.dmg",
        browser_download_url: "https://quadraaudio.com/download/latest"
      },
      {
        name: "Hydra-1.0.0.dmg.sha256",
        browser_download_url: "https://quadraaudio.com/download/latest.sha256"
      }
    ]
  };

  return NextResponse.json(updatePayload, { status: 200 });
}
