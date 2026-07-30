"use client";

import styles from "./quadra.module.scss";

export interface QuadraHeroProps {
  eyebrow?: string;
  title: string;
  subtitle: string;
  primaryCtaText?: string;
  primaryCtaLink?: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
  imageUrl?: string;
  videoUrl?: string;
}

export function QuadraHero({
  eyebrow = "HYDRA",
  title,
  subtitle,
  primaryCtaText,
  primaryCtaLink = "/store",
  secondaryCtaText,
  secondaryCtaLink = "#overview",
  imageUrl = "/images/home_hero_quadra.jpg",
  videoUrl,
}: QuadraHeroProps) {
  return (
    <section className={styles.hero} id="overview">
      <div className={styles.heroMedia} aria-hidden={!imageUrl && !videoUrl}>
        {videoUrl ? (
          <video src={videoUrl} autoPlay muted loop playsInline poster={imageUrl} />
        ) : (
          imageUrl && <img src={imageUrl} alt="" />
        )}
      </div>
      <div className={styles.heroShade} />
      <div className={styles.heroCopy}>
        {eyebrow ? <p className={styles.heroEyebrow}>{eyebrow}</p> : null}
        <h1 className={styles.heroTitle}>{title}</h1>
        <p className={styles.heroSubtitle}>{subtitle}</p>
        <div className={styles.heroCtas}>
          {primaryCtaText ? (
            <a className={styles.btnPrimary} href={primaryCtaLink}>
              {primaryCtaText}
            </a>
          ) : null}
          {secondaryCtaText ? (
            <a className={styles.btnSecondary} href={secondaryCtaLink}>
              {secondaryCtaText}
            </a>
          ) : null}
        </div>
      </div>
    </section>
  );
}
