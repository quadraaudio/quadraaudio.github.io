import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email") || "user@quadraaudio.com";

  const licensePayload = {
    domain: "quadraaudio.com",
    active: true,
    email: email,
    product: "Hydra",
    productSlug: "hydra",
    licenseId: `LIC-${Buffer.from(email).toString("hex").substring(0, 8).toUpperCase()}`,
    tier: "Full Commercial",
    maxDevices: 2,
    activeDevices: 1,
    expiresAt: "PERPETUAL",
    features: [
      "256_VIRTUAL_CHANNELS",
      "CORE_AUDIO_PROCESS_TAP",
      "GROUNDCONTROL_FUSION",
      "GROUNDCONTROL_LINK",
      "NDI_AUDIO_128CH",
      "AVB_AUDIO_256CH",
      "SPATIAL_DOLBY_ATMOS_9_4_6",
      "STREAMDECK_OSC_AUTOMATION"
    ]
  };

  return NextResponse.json(licensePayload, { status: 200 });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = body.email || "user@quadraaudio.com";
    const hardwareId = body.hardwareId || "MAC-000-000";

    return NextResponse.json({
      success: true,
      activated: true,
      email: email,
      hardwareId: hardwareId,
      licenseId: `LIC-${Buffer.from(email + hardwareId).toString("hex").substring(0, 10).toUpperCase()}`,
      expiresAt: "PERPETUAL",
      message: "Hydra software activated successfully on macOS device."
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Invalid activation request" }, { status: 400 });
  }
}
