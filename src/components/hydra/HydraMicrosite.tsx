"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { SpectrumCascade } from "@/components/three/SpectrumCascade";
import { HydraCarousel } from "@/components/hydra/HydraCarousel";
import { HydraSheet } from "@/components/hydra/HydraSheet";
import {
  HYDRA,
  HYDRA_CHAPTERS,
  HYDRA_CONTROL,
  HYDRA_SPECS,
} from "@/data/hydra.landing";
import styles from "./HydraMicrosite.module.scss";

type Chapter = (typeof HYDRA_CHAPTERS)[number];

export function HydraMicrosite() {
  const [sheet, setSheet] = useState<null | "specs" | Chapter>(null);

  const closeSheet = useCallback(() => setSheet(null), []);

  return (
    <main className={styles.main}>
      <section id="overview" className={styles.hero}>
        <div className={styles.heroVisual} aria-hidden>
          <SpectrumCascade />
          <div className={styles.heroShade} />
        </div>
        <div className={styles.heroContent}>
          <p className={styles.brand}>{HYDRA.name}</p>
          <h1 className={styles.headline}>{HYDRA.headline}</h1>
          <p className={styles.lede}>{HYDRA.lede}</p>
          <div className={styles.ctaRow}>
            <Link href={HYDRA.ctaPrimary.href} className={styles.btnPrimary}>
              {HYDRA.ctaPrimary.label}
            </Link>
            <Link href={HYDRA.ctaSecondary.href} className={styles.btnGhost}>
              {HYDRA.ctaSecondary.label}
            </Link>
          </div>
        </div>
      </section>

      <section id="capabilities" className={styles.section}>
        <div className={styles.shell}>
          <Reveal>
            <p className={styles.eyebrow}>Capabilities</p>
            <h2 className={styles.sectionTitle}>Built around the signal path.</h2>
            <p className={styles.sectionLede}>
              One carousel. One idea at a time — matrix, bridges, network, and
              strips — the way a Logic Pro feature gallery moves.
            </p>
          </Reveal>
          <div className={styles.carouselBlock}>
            <HydraCarousel
              items={HYDRA_CHAPTERS}
              onLearnMore={(item) => setSheet(item)}
            />
          </div>
        </div>
      </section>

      <section id="control" className={styles.sectionAlt}>
        <div className={styles.shellNarrow}>
          <Reveal>
            <p className={styles.eyebrow}>{HYDRA_CONTROL.eyebrow}</p>
            <h2 className={styles.sectionTitle}>{HYDRA_CONTROL.title}</h2>
            <p className={styles.sectionLede}>{HYDRA_CONTROL.body}</p>
          </Reveal>
          <ul className={styles.pointList}>
            {HYDRA_CONTROL.points.map((point) => (
              <Reveal key={point}>
                <li>{point}</li>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section id="specs" className={styles.section}>
        <div className={styles.shellNarrow}>
          <Reveal>
            <p className={styles.eyebrow}>Tech Specs</p>
            <h2 className={styles.sectionTitle}>Built for macOS.</h2>
            <p className={styles.sectionLede}>
              Version {HYDRA.version}. Platform gate {HYDRA.platform}. Open the
              full sheet for hub, bridges, network, and licensing details.
            </p>
            <button
              type="button"
              className={styles.sheetBtn}
              onClick={() => setSheet("specs")}
            >
              View tech specs
            </button>
          </Reveal>
        </div>
      </section>

      <section className={styles.close}>
        <div className={styles.shellNarrow}>
          <Reveal>
            <p className={styles.brandSm}>{HYDRA.name}</p>
            <h2 className={styles.closeTitle}>Ready for your room.</h2>
            <p className={styles.sectionLede}>
              Talk to Quadra for access and activation. Licenses bind to your
              machine after you activate.
            </p>
            <div className={styles.ctaRow}>
              <Link href={HYDRA.ctaPrimary.href} className={styles.btnPrimary}>
                {HYDRA.ctaPrimary.label}
              </Link>
              <Link href={HYDRA.ctaSecondary.href} className={styles.btnGhost}>
                {HYDRA.ctaSecondary.label}
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <footer className={styles.footer}>
        <p>
          <Link href="/">Quadra</Link>
          <span aria-hidden>·</span>
          <span>
            {HYDRA.name} {HYDRA.version}
          </span>
          <span aria-hidden>·</span>
          <span>{HYDRA.platform}</span>
        </p>
      </footer>

      <HydraSheet
        open={sheet === "specs"}
        title="Hydra tech specs"
        onClose={closeSheet}
      >
        <dl className={styles.specSheet}>
          {HYDRA_SPECS.map((spec) => (
            <div key={spec.label} className={styles.specRow}>
              <dt>{spec.label}</dt>
              <dd>{spec.value}</dd>
            </div>
          ))}
        </dl>
      </HydraSheet>

      <HydraSheet
        open={typeof sheet === "object" && sheet !== null}
        title={typeof sheet === "object" && sheet ? sheet.title : ""}
        onClose={closeSheet}
      >
        {typeof sheet === "object" && sheet ? (
          <div className={styles.detailSheet}>
            <p className={styles.eyebrow}>{sheet.eyebrow}</p>
            <p>{sheet.detail}</p>
          </div>
        ) : null}
      </HydraSheet>
    </main>
  );
}
