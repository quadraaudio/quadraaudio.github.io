"use client";

import { usePathname } from "next/navigation";
import GlobalNav from "@/components/GlobalNav";
import GlobalFooter from "@/components/GlobalFooter";

/**
 * Hides the real site chrome only on the Puck canvas route so the
 * preview can render Nav/Footer inside the editor iframe instead.
 */
export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPuckCanvas =
    pathname === "/editor/home" ||
    pathname === "/editor/home/" ||
    Boolean(pathname?.startsWith("/editor/home/"));

  if (isPuckCanvas) {
    return <>{children}</>;
  }

  return (
    <>
      <GlobalNav />
      <main style={{ paddingTop: "44px" }}>{children}</main>
      <GlobalFooter />
    </>
  );
}
