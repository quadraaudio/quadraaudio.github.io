"use client";

import Image from "next/image";
import type { HydraMediaSlot } from "@/data/hydra.landing";
import styles from "./HydraMedia.module.scss";

/**
 * Full-bleed still — no frame / card / aspect box behind the photo.
 * Assets are 1536×1024; rendered at natural ratio.
 */
export function HydraMedia({
  media,
  videoSrc,
  priority = false,
}: {
  media: HydraMediaSlot;
  videoSrc?: string;
  priority?: boolean;
  /** @deprecated ignored — no framed large variant */
  large?: boolean;
}) {
  return (
    <figure className={styles.bleed}>
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
          width={1536}
          height={1024}
          sizes="(max-width: 980px) 100vw, 1120px"
          className={styles.image}
          priority={priority}
        />
      )}
    </figure>
  );
}
