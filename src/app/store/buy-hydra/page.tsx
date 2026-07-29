// Redirect /store/buy-hydra → /store/hydra-pro (the new canonical URL)
import { redirect } from "next/navigation";

export default function BuyHydraRedirect() {
  redirect("/store/hydra-pro");
}
