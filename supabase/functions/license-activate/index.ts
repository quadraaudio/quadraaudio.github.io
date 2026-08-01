/**
 * Quadra Guard — Matrix activation + server trial (email + HWID).
 *
 * Actions:
 *   issue       — paid: bind seat + one-time code
 *   issue-trial — trial: require Google; one trial per email AND per HWID
 *   redeem      — app: code + hwid → signed qkey (paid or trial)
 *   deactivate / status — manage seats
 */
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import * as ed from "npm:@noble/ed25519@2.1.0";
import { sha512 } from "npm:@noble/hashes@1.4.0/sha512";

ed.etc.sha512Sync = (...msgs: Uint8Array[]) => sha512(ed.etc.concatBytes(...msgs));

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SEATS_MAX = 2;
const TRIAL_DAYS = 14;
const CODE_TTL_MS = 5 * 60 * 1000;
const DEFAULT_PRIV =
  "d9c61f0c1897d8342748cff144b29c042f6dc628b74879c5cc7405c1c712de78";

type Action = "issue" | "issue-trial" | "redeem" | "deactivate" | "status";

interface Body {
  googleAccessToken?: string;
  hardwareId?: string;
  productSlug?: string;
  action?: Action;
  code?: string;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: CORS });
  }

  try {
    const body = (await req.json()) as Body;
    const hwid = body.hardwareId?.trim();
    const productSlug = body.productSlug?.trim() || "quadra-matrix";
    const action = body.action || "status";

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    if (action === "redeem") {
      const code = body.code?.trim().toUpperCase();
      if (!code || !hwid) return json({ error: "Missing code or hardwareId" }, 400);
      return await redeem(supabase, code, hwid, productSlug);
    }

    const token = body.googleAccessToken?.trim();
    if (!token || !hwid) {
      return json({ error: "Missing googleAccessToken or hardwareId" }, 400);
    }

    const user = await googleUser(token);
    if (!user?.email) {
      return json({ error: "Invalid Google token", code: "auth" }, 401);
    }

    if (action === "issue-trial") {
      return await issueTrial(supabase, user.email, hwid, productSlug);
    }

    const license = await findLicense(supabase, productSlug, user.email);
    if (!license) {
      return json({ error: "No license for this account", code: "no_purchase" }, 403);
    }

    if (action === "deactivate") {
      await supabase
        .from("license_activations")
        .delete()
        .eq("license_id", license.id)
        .eq("hardware_id", hwid);
      const seats = await seatCount(supabase, license.id);
      return json({ ok: true, seatsUsed: seats, seatsMax: SEATS_MAX });
    }

    if (action === "issue") {
      return await issuePaid(supabase, license, user.email, hwid, productSlug);
    }

    const { data: activations } = await supabase
      .from("license_activations")
      .select("hardware_id")
      .eq("license_id", license.id);
    const list = activations ?? [];
    const already = list.some((a) => a.hardware_id === hwid);
    if (!already) {
      return json({ seatsUsed: list.length, seatsMax: SEATS_MAX, code: "not_activated" });
    }
    return json(await signPaid(license, user.email, hwid, productSlug, list.length));
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : String(e) }, 500);
  }
});

async function issueTrial(
  supabase: ReturnType<typeof createClient>,
  email: string,
  hwid: string,
  productSlug: string
) {
  // Paid license? Prefer paid activation path messaging.
  const paid = await findLicense(supabase, productSlug, email);
  if (paid) {
    return json({
      error: "This account already has a full license. Use Activate instead of trial.",
      code: "has_license",
    }, 403);
  }

  const { data: byEmail } = await supabase
    .from("product_trials")
    .select("id, expires_at, hardware_id")
    .eq("product_slug", productSlug)
    .eq("email", email)
    .maybeSingle();

  const { data: byHwid } = await supabase
    .from("product_trials")
    .select("id, expires_at, email")
    .eq("product_slug", productSlug)
    .eq("hardware_id", hwid)
    .maybeSingle();

  if (byEmail && byEmail.hardware_id !== hwid) {
    return json({
      error: "Trial already used on this account.",
      code: "trial_email_used",
    }, 403);
  }
  if (byHwid && byHwid.email !== email) {
    return json({
      error: "Trial already used on this Mac.",
      code: "trial_hwid_used",
    }, 403);
  }

  let trialExpires: string;
  if (byEmail || byHwid) {
    // Same account + same Mac: re-issue code for existing trial window (no reset).
    const row = byEmail || byHwid!;
    trialExpires = row.expires_at;
    if (new Date(trialExpires).getTime() < Date.now()) {
      return json({
        error: "Trial expired for this account/Mac.",
        code: "trial_expired",
      }, 403);
    }
  } else {
    trialExpires = new Date(Date.now() + TRIAL_DAYS * 86400_000).toISOString();
    const { error: insErr } = await supabase.from("product_trials").insert({
      product_slug: productSlug,
      email,
      hardware_id: hwid,
      expires_at: trialExpires,
    });
    if (insErr) {
      // Race on unique — treat as used
      return json({ error: insErr.message, code: "trial_used" }, 403);
    }
  }

  const code = randomCode();
  const expires = new Date(Date.now() + CODE_TTL_MS).toISOString();
  const { error: codeErr } = await supabase.from("license_redeem_codes").insert({
    code,
    license_id: null,
    hardware_id: hwid,
    product_slug: productSlug,
    email,
    expires_at: expires,
    grant_kind: "trial",
    trial_expires_at: trialExpires,
  });
  if (codeErr) return json({ error: codeErr.message }, 500);

  return json({
    code,
    expiresAt: expires,
    trialExpiresAt: trialExpires,
    kind: "trial",
  });
}

async function issuePaid(
  supabase: ReturnType<typeof createClient>,
  license: LicenseRow,
  email: string,
  hwid: string,
  productSlug: string
) {
  const { data: activations } = await supabase
    .from("license_activations")
    .select("hardware_id")
    .eq("license_id", license.id);
  const list = activations ?? [];
  const already = list.some((a) => a.hardware_id === hwid);

  if (!already) {
    if (list.length >= SEATS_MAX) {
      return json({ error: "Seat limit reached", code: "seat_limit" }, 403);
    }
    const { error: insErr } = await supabase.from("license_activations").insert({
      license_id: license.id,
      hardware_id: hwid,
    });
    if (insErr) return json({ error: insErr.message }, 500);
    await supabase.from("licenses").update({ hardware_id: hwid }).eq("id", license.id);
  }

  const code = randomCode();
  const expires = new Date(Date.now() + CODE_TTL_MS).toISOString();
  const { error: codeErr } = await supabase.from("license_redeem_codes").insert({
    code,
    license_id: license.id,
    hardware_id: hwid,
    product_slug: productSlug,
    email,
    expires_at: expires,
    grant_kind: "perpetual",
  });
  if (codeErr) return json({ error: codeErr.message }, 500);

  return json({
    code,
    expiresAt: expires,
    seatsUsed: already ? list.length : list.length + 1,
    seatsMax: SEATS_MAX,
    kind: "paid",
  });
}

async function redeem(
  supabase: ReturnType<typeof createClient>,
  code: string,
  hwid: string,
  productSlug: string
) {
  const { data: row, error } = await supabase
    .from("license_redeem_codes")
    .select("*")
    .eq("code", code)
    .maybeSingle();

  if (error) return json({ error: error.message }, 500);
  if (!row) return json({ error: "Invalid code", code: "invalid_code" }, 403);
  if (row.used_at) return json({ error: "Code already used", code: "used" }, 403);
  if (new Date(row.expires_at).getTime() < Date.now()) {
    return json({ error: "Code expired", code: "expired" }, 403);
  }
  if (row.hardware_id !== hwid) {
    return json({ error: "Hardware mismatch", code: "hwid" }, 403);
  }
  if (row.product_slug !== productSlug) {
    return json({ error: "Product mismatch", code: "product" }, 403);
  }

  let signed: {
    claimsJSON: string;
    signatureHex: string;
    seatsUsed: number;
    seatsMax: number;
  };

  if (row.grant_kind === "trial") {
    const trialExp = row.trial_expires_at
      ? Date.parse(row.trial_expires_at) / 1000
      : Date.now() / 1000 + TRIAL_DAYS * 86400;
    if (trialExp * 1000 < Date.now()) {
      return json({ error: "Trial expired", code: "trial_expired" }, 403);
    }
    signed = await signGrant({
      productSlug,
      email: row.email,
      kind: "trial",
      hardwareID: hwid,
      seatsUsed: 1,
      seatsMax: 1,
      expiresAt: trialExp,
    });
  } else {
    if (!row.license_id) {
      return json({ error: "License missing", code: "no_purchase" }, 403);
    }
    const { data: license, error: licErr } = await supabase
      .from("licenses")
      .select("id, status, expires_at, product_slug, email, user_email")
      .eq("id", row.license_id)
      .maybeSingle();
    if (licErr || !license || license.status !== "active") {
      return json({ error: "License inactive", code: "no_purchase" }, 403);
    }
    const seatsUsed = await seatCount(supabase, license.id);
    signed = await signPaid(license as LicenseRow, row.email, hwid, productSlug, seatsUsed);
  }

  await supabase
    .from("license_redeem_codes")
    .update({ used_at: new Date().toISOString() })
    .eq("code", code);

  return json({
    ...signed,
    qkey: btoa(
      JSON.stringify({
        claimsJSON: signed.claimsJSON,
        signatureHex: signed.signatureHex,
      })
    ),
  });
}

type LicenseRow = {
  id: string;
  status: string;
  expires_at: string | null;
  product_slug: string;
  email?: string | null;
  user_email?: string | null;
};

async function findLicense(
  supabase: ReturnType<typeof createClient>,
  productSlug: string,
  email: string
) {
  const { data: licenses, error } = await supabase
    .from("licenses")
    .select("id, status, expires_at, product_slug, email, user_email")
    .eq("product_slug", productSlug)
    .eq("status", "active")
    .or(`email.eq.${email},user_email.eq.${email}`);
  if (error || !licenses?.length) return null;
  return licenses[0] as LicenseRow;
}

async function signPaid(
  license: LicenseRow,
  email: string,
  hwid: string,
  productSlug: string,
  seatsUsed: number
) {
  const kind =
    license.expires_at && license.expires_at !== "PERPETUAL" ? "rentToOwn" : "perpetual";
  const expiresAt =
    license.expires_at && license.expires_at !== "PERPETUAL"
      ? Date.parse(license.expires_at) / 1000
      : null;
  return signGrant({
    productSlug,
    email,
    kind,
    hardwareID: hwid,
    seatsUsed,
    seatsMax: SEATS_MAX,
    expiresAt,
  });
}

async function signGrant(claims: {
  productSlug: string;
  email: string;
  kind: string;
  hardwareID: string;
  seatsUsed: number;
  seatsMax: number;
  expiresAt: number | null;
}) {
  const full = {
    ...claims,
    issuedAt: Date.now() / 1000,
    chapters: ["Start"],
  };
  const claimsJSON = JSON.stringify(full);
  const signatureHex = await sign(claimsJSON);
  return {
    claimsJSON,
    signatureHex,
    seatsUsed: claims.seatsUsed,
    seatsMax: claims.seatsMax,
  };
}

async function googleUser(accessToken: string) {
  const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) return null;
  return (await res.json()) as { email?: string; name?: string };
}

async function seatCount(
  supabase: ReturnType<typeof createClient>,
  licenseId: string
): Promise<number> {
  const { count } = await supabase
    .from("license_activations")
    .select("*", { count: "exact", head: true })
    .eq("license_id", licenseId);
  return count ?? 0;
}

async function sign(message: string): Promise<string> {
  const privHex = Deno.env.get("LICENSE_ED25519_PRIVATE_KEY") || DEFAULT_PRIV;
  const priv = hexToBytes(privHex);
  const sig = await ed.signAsync(new TextEncoder().encode(message), priv);
  return bytesToHex(sig);
}

function randomCode(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = crypto.getRandomValues(new Uint8Array(10));
  let out = "";
  for (let i = 0; i < bytes.length; i++) out += alphabet[bytes[i] % alphabet.length];
  return out;
}

function hexToBytes(hex: string): Uint8Array {
  const clean = hex.trim();
  const out = new Uint8Array(clean.length / 2);
  for (let i = 0; i < out.length; i++) out[i] = parseInt(clean.slice(i * 2, i * 2 + 2), 16);
  return out;
}

function bytesToHex(bytes: Uint8Array): string {
  return [...bytes].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS, "Content-Type": "application/json" },
  });
}
