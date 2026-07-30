import { supabase } from "@/lib/supabase";

/**
 * Returns true when email exists and is active in public.editor_allowlist.
 */
export async function isEditorEmailAllowed(email: string | undefined | null): Promise<boolean> {
  if (!email || typeof email !== "string") return false;

  try {
    const { data, error } = await supabase.rpc("is_editor_email_allowed", {
      p_email: email.trim().toLowerCase(),
    });

    if (error) {
      console.warn("editor allowlist check failed:", error.message);
      return false;
    }

    return data === true;
  } catch (err) {
    console.warn("editor allowlist check error:", err);
    return false;
  }
}
