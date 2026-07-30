import { NextResponse } from "next/server";

export const dynamic = "force-static";

export async function POST(request: Request) {
  let body: { licenseKey?: string; hwid?: string; email?: string; name?: string } = {};
  try {
    body = await request.json();
  } catch {}

  const licenseKey = body.licenseKey || "HYDRA-PERPETUAL-PRO";
  const hwid = body.hwid || "WILDCARD";
  const customerEmail = body.email || "user@quadraaudio.com";
  const customerName = body.name || "Quadra Audio Customer";

  const payload = {
    domain: "quadraaudio.com",
    productSlug: "hydra",
    licenseID: licenseKey,
    customerName: customerName,
    customerEmail: customerEmail,
    machineID: hwid,
    licenseType: "perpetual",
    issuedAt: new Date().toISOString(),
    expiresAt: null,
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

  const signedLicense = {
    payload,
    signatureBase64: `QUADRA-ONLINE-SIG-${Buffer.from(licenseKey + ":" + hwid).toString("base64")}`
  };

  return NextResponse.json({
    success: true,
    activated: true,
    message: "Hydra software activated successfully on macOS device.",
    signedLicense,
    payload,
    signatureBase64: signedLicense.signatureBase64
  }, { status: 200 });
}

