import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const FULFILLMENT_SECRET =
  Deno.env.get("STORE_FULFILLMENT_SECRET") ||
  "HLrlrMSlvdRTcvFsr4ty6J5rY4GThWksQbZhzJxp8CM";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

async function googleUser(accessToken: string) {
  const token = (accessToken || "").trim();
  if (!token) return null;

  const fromUserInfo = await fetch(
    "https://www.googleapis.com/oauth2/v3/userinfo",
    { headers: { Authorization: `Bearer ${token}` } }
  );
  if (fromUserInfo.ok) {
    const data = await fromUserInfo.json();
    if (data.sub && data.email) {
      return {
        id: String(data.sub),
        email: String(data.email),
        name: data.name || null,
      };
    }
  }

  const infoRes = await fetch(
    `https://oauth2.googleapis.com/tokeninfo?access_token=${encodeURIComponent(token)}`
  );
  if (infoRes.ok) {
    const data = await infoRes.json();
    if (data.sub && data.email) {
      return {
        id: String(data.sub),
        email: String(data.email),
        name: data.name || null,
      };
    }
  }

  return null;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: CORS });
  }

  try {
    const body = await req.json();
    const user = await googleUser(body.googleAccessToken || "");
    if (!user) {
      return Response.json(
        { error: "Google session expired. Sign in again." },
        { status: 401, headers: CORS }
      );
    }

    // Must use service role — get_account_for_auth0 is not executable by anon.
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ||
        Deno.env.get("SUPABASE_ANON_KEY")!
    );

    const { data, error } = await supabase.rpc("get_account_for_auth0", {
      p_secret: FULFILLMENT_SECRET,
      p_auth0_sub: user.id,
    });

    if (error) {
      return Response.json(
        { error: error.message },
        { status: 500, headers: CORS }
      );
    }

    return Response.json(data || { orders: [], licenses: [] }, {
      headers: CORS,
    });
  } catch (e) {
    return Response.json(
      { error: e instanceof Error ? e.message : "failed" },
      { status: 500, headers: CORS }
    );
  }
});
