import { HydraChrome } from "@/components/hydra/HydraChrome";
import styles from "./hydra-shell.module.scss";

export default function HydraLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={styles.shell}>
      <HydraChrome />
      {children}
    </div>
  );
}
