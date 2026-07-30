"use client";

import styles from "./quadra.module.scss";

export interface SpecRow {
  category: string;
  detail: string;
}

export interface QuadraSpecsProps {
  title?: string;
  subtitle?: string;
  specs?: SpecRow[];
}

const DEFAULT_SPECS: SpecRow[] = [
  {
    category: "Channels",
    detail: "Up to 128 inputs and 128 outputs via virtual Core Audio matrix",
  },
  {
    category: "Sample rates",
    detail: "44.1–192 kHz with 32-bit float processing path",
  },
  {
    category: "Network",
    detail: "NDI Audio, AVB, and AES67 RTP on local Ethernet",
  },
  {
    category: "System",
    detail: "macOS 13 Ventura or later · Apple Silicon optimized",
  },
];

export function QuadraSpecs({
  title = "Technical specifications",
  subtitle,
  specs = DEFAULT_SPECS,
}: QuadraSpecsProps) {
  return (
    <section className={styles.specs} id="specs">
      <header className={styles.specsHeader}>
        <h2 className={styles.specsTitle}>{title}</h2>
        {subtitle ? <p className={styles.specsSubtitle}>{subtitle}</p> : null}
      </header>
      <div className={styles.specsList}>
        {specs.map((row) => (
          <div className={styles.specRow} key={`${row.category}-${row.detail}`}>
            <div className={styles.specCategory}>{row.category}</div>
            <div className={styles.specDetail}>{row.detail}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
