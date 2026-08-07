import AdminReleasesClient from "./AdminReleasesClient";

export const metadata = {
  title: "Store admin — Releases",
  description: "Publish MATRIX installer downloads in Supabase.",
  robots: { index: false, follow: false },
};

export default function AdminReleasesPage() {
  return <AdminReleasesClient />;
}
