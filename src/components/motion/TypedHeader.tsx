"use client";

import styles from "./TypedHeader.module.scss";

/**
 * Hero headline. Kept as a component for call sites; typing was removed so the
 * first paint always shows the full title (no blank/cursor-only stuck state).
 */
export function TypedHeader({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  return <span className={`${styles.wrap} ${className}`}>{text}</span>;
}
