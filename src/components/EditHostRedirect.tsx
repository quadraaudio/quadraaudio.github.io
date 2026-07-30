"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * On edit.quadraaudio.com, send visitors to the visual editor.
 */
export default function EditHostRedirect() {
  const pathname = usePathname();

  useEffect(() => {
    const host = window.location.hostname.toLowerCase();
    const isEditHost =
      host === "edit.quadraaudio.com" || host.startsWith("edit.");
    if (!isEditHost) return;
    if (pathname?.startsWith("/editor")) return;
    window.location.replace("/editor/");
  }, [pathname]);

  return null;
}
