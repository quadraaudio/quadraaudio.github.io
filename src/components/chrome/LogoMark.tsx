import styles from "./LogoMark.module.scss";

type Props = {
  className?: string;
  /** Show the wordmark beside the Q */
  withWordmark?: boolean;
  size?: "sm" | "md" | "lg" | "hero";
};

export function LogoMark({
  className = "",
  withWordmark = false,
  size = "md",
}: Props) {
  return (
    <span className={`${styles.logo} ${styles[size]} ${className}`}>
      <span className={styles.q} aria-hidden>
        Q
      </span>
      {withWordmark ? <span className={styles.word}>Quadra</span> : null}
    </span>
  );
}
