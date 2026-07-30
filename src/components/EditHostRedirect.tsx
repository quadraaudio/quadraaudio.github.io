"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const ADMIN_HOSTS = new Set([
  "admin.quadraaudio.com",
  "edit.quadraaudio.com",
]);

/**
 * On admin/edit subdomains, land on the editor hub (not a blank partial view).
 */
export default function EditHostRedirect() {
  const pathname = usePathname();

  useEffect(() => {
    const host = window.location.hostname.toLowerCase();
    const isAdminHost =
      ADMIN_HOSTS.has(host) ||
      host.startsWith("admin.") ||
      host.startsWith("edit.");

    if (!isAdminHost) return;
    if (pathname?.startsWith("/editor")) return;

    window.location.replace("/editor/");
  }, [pathname]);

  return null;
}
