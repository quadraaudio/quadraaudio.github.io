"use client";

import Image from "next/image";
import type { HydraMediaSlot } from "@/data/hydra.landing";
import styles from "./HydraMedia.module.scss";

/**
 * Apple-style media well. Swap files in /public/hydra/ to upgrade visuals.
 * Optional videoSrc later — when present, video plays muted/loop.
 */
export function HydraMedia({
  media,
  videoSrc,
  priority = false,
  large = false,
}: {
  media: HydraMediaSlot;
  videoSrc?: string;
  priority?: boolean;
  large?: boolean;
}) {
  return (
    <figure className={`${styles.frame} ${large ? styles.large : ""}`}>
      {videoSrc ? (
        <video
          className={styles.video}
          src={videoSrc}
          poster={media.src}
          autoPlay
          muted
          loop
          playsInline
          aria-label={media.alt}
        />
      ) : (
        <Image
          src={media.src}
          alt={media.alt}
          fill
          sizes="(max-width: 980px) 100vw, 1120px"
          className={styles.image}
          priority={priority}
        />
      )}
    </figure>
  );
}
