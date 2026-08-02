import styles from "./LogoMark.module.scss";

type Props = {
  className?: string;
  size?: "sm" | "md" | "lg" | "hero";
  /** @deprecated Q is favicon-only; site logo is always the QUADRA wordmark. */
  withWordmark?: boolean;
};

/** Site wordmark — “QUADRA”. The Q mark lives only in `/icon.svg` (favicon). */
export function LogoMark({ className = "", size = "md" }: Props) {
  return (
    <span className={`${styles.logo} ${styles[size]} ${className}`}>
      <span className={styles.word}>QUADRA</span>
    </span>
  );
}
