import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = body.email || "user@quadraaudio.com";
    const hardwareId = body.hardwareId || "MAC-HWID-001";

    return NextResponse.json({
      success: true,
      activated: true,
      email: email,
      hardwareId: hardwareId,
      licenseId: `LIC-${Buffer.from(email + hardwareId).toString("hex").substring(0, 10).toUpperCase()}`,
      expiresAt: "PERPETUAL",
      token: Buffer.from(JSON.stringify({ email, hardwareId, time: Date.now() })).toString("base64"),
      message: "Device activated cleanly via Quadra API."
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Invalid activation request" }, { status: 400 });
  }
}
