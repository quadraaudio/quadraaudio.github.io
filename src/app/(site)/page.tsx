import { HomePage } from "@/components/chrome/HomePage";
import { listProducts } from "@/lib/products";

export default async function Page() {
  const products = await listProducts();
  return <HomePage products={products} />;
}
