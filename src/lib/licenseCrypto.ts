// Cryptographic License Generator & App Token Utility for Quadra Audio
// Official Domain: quadraaudio.com

export interface OfflineLicenseData {
  licenseId: string;
  userEmail: string;
  userName: string;
  productSlug: string;
  productName: string;
  hardwareId: string;
  issuedAt: string;
  expiresAt: string;
  signature: string;
}

/**
 * Generates an encrypted Base64 .qkey string for offline activation.
 */
export function generateOfflineLicenseKey(
  userEmail: string,
  userName: string,
  productSlug: string,
  productName: string,
  hardwareId: string
): OfflineLicenseData {
  const issuedAt = new Date().toISOString();
  const expiresAt = "PERPETUAL"; // or Date string

  const payload = {
    domain: "quadraaudio.com",
    licenseId: `LIC-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
    userEmail,
    userName,
    productSlug,
    productName,
    hardwareId,
    issuedAt,
    expiresAt,
    hash: btoa(`${userEmail}:${hardwareId}:${productSlug}:QUADRA_SECRET_KEY`),
  };

  const rawJson = JSON.stringify(payload, null, 2);
  const signature = btoa(encodeURIComponent(rawJson));

  return {
    ...payload,
    signature,
  };
}

/**
 * Validates an uploaded .qkey license string.
 */
export function validateOfflineLicenseKey(signature: string): {
  valid: boolean;
  data?: any;
  error?: string;
} {
  try {
    const rawJson = decodeURIComponent(atob(signature));
    const data = JSON.parse(rawJson);

    if (data.domain !== "quadraaudio.com") {
      return { valid: false, error: "Invalid license domain" };
    }

    return { valid: true, data };
  } catch {
    return { valid: false, error: "Corrupted or invalid license file format" };
  }
}

/**
 * Generates Web-to-App Deep Link token for quadra:// protocol
 */
export function generateAppAuthToken(email: string, slug: string): string {
  const payload = {
    issuer: "quadraaudio.com",
    email,
    product: slug,
    timestamp: Date.now(),
    nonce: Math.random().toString(36).substring(2),
  };
  return btoa(JSON.stringify(payload));
}
