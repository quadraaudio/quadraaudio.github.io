import AdminProductsClient from "./AdminProductsClient";

export const metadata = {
  title: "Store admin — Products",
  description: "Manage Quadra store catalog in Supabase.",
  robots: { index: false, follow: false },
};

export default function AdminProductsPage() {
  return <AdminProductsClient />;
}
