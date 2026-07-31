import { GlobalNav } from "@/components/chrome/GlobalNav";
import { GlobalFooter } from "@/components/chrome/GlobalFooter";

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <GlobalNav />
      <div className="site-main">{children}</div>
      <GlobalFooter />
    </>
  );
}
