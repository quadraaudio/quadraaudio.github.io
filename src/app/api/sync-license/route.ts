import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://accvrbqjndibljfpsspc.supabase.co";
const supabaseKey = process.env.SUPABASE_SECRET_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_4o9Wc4iUQQ_foOStyozkhw_DafU6VmL";

const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, name, productSlug = "hydra" } = body;

    if (!email) {
      return NextResponse.json({ success: false, error: "Email is required" }, { status: 400 });
    }

    // Check if license already exists
    const { data: existing } = await supabase
      .from("licenses")
      .select("*")
      .eq("user_email", email)
      .eq("product_slug", productSlug);

    if (existing && existing.length > 0) {
      return NextResponse.json({ success: true, license: existing[0], message: "License already exists in Supabase" });
    }

    // Insert new license into Supabase licenses table
    const { data, error } = await supabase
      .from("licenses")
      .insert([
        {
          user_email: email,
          user_name: name || email.split("@")[0],
          product_slug: productSlug,
          status: "active",
        },
      ])
      .select();

    if (error) {
      console.error("Supabase API sync error:", error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, license: data ? data[0] : null });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
