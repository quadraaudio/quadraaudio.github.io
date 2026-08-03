import { GlobalFooter } from "@/components/chrome/GlobalFooter";
import { HydraNavSwap } from "@/components/hydra/HydraNavSwap";
import styles from "./hydra-shell.module.scss";

export default function HydraLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={styles.shell}>
      <HydraNavSwap />
      {children}
      <GlobalFooter />
    </div>
  );
}
