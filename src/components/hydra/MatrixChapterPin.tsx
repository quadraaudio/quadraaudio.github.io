"use client";

import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type Props = {
  children: ReactNode;
  className?: string;
  /** Copy / statement block */
  copySelector?: string;
  /** Media plane */
  mediaSelector?: string;
  /** Feature strip */
  featuresSelector?: string;
};

/**
 * Pins a MATRIX chapter scene on desktop and scrubs reveal like Apple product pages.
 * Mobile / reduced-motion: no pin — children render in natural flow.
 */
export function MatrixChapterPin({
  children,
  className = "",
  copySelector = "[data-mx-copy]",
  mediaSelector = "[data-mx-media]",
  featuresSelector = "[data-mx-features]",
}: Props) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const targets = () =>
      root.querySelectorAll(
        `${copySelector}, ${mediaSelector}, ${featuresSelector}`,
      );

    const revealStatic = () => {
      targets().forEach((el) => {
        (el as HTMLElement).style.opacity = "1";
        (el as HTMLElement).style.transform = "none";
      });
    };

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const desktop = window.matchMedia("(min-width: 960px)").matches;
    if (reduce || !desktop) {
      revealStatic();
      return;
    }

    const scene = root.querySelector("[data-mx-scene]") as HTMLElement | null;
    const copy = root.querySelector(copySelector) as HTMLElement | null;
    const media = root.querySelector(mediaSelector) as HTMLElement | null;
    const features = root.querySelector(featuresSelector) as HTMLElement | null;
    if (!scene) return;

    const failsafe = window.setTimeout(() => {
      revealStatic();
    }, 4000);

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top top+=48",
          end: "+=140%",
          pin: scene,
          scrub: 0.65,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onRefreshInit: () => window.clearTimeout(failsafe),
        },
      });

      if (copy) {
        tl.fromTo(
          copy,
          { autoAlpha: 0, y: 32 },
          { autoAlpha: 1, y: 0, duration: 0.35, ease: "power2.out" },
          0,
        );
      }
      if (media) {
        tl.fromTo(
          media,
          { autoAlpha: 0, scale: 0.9 },
          { autoAlpha: 1, scale: 1, duration: 0.45, ease: "power2.out" },
          0.08,
        );
      }
      if (features) {
        tl.fromTo(
          features,
          { autoAlpha: 0, y: 24 },
          { autoAlpha: 1, y: 0, duration: 0.3, ease: "power2.out" },
          0.35,
        );
      }
      // Hold the fully revealed frame briefly before unpin
      tl.to({}, { duration: 0.25 });
    }, root);

    const mq = window.matchMedia("(min-width: 960px)");
    const onMq = () => ScrollTrigger.refresh();
    mq.addEventListener("change", onMq);
    const onResize = () => ScrollTrigger.refresh();
    window.addEventListener("resize", onResize);

    return () => {
      window.clearTimeout(failsafe);
      mq.removeEventListener("change", onMq);
      window.removeEventListener("resize", onResize);
      ctx.revert();
    };
  }, [copySelector, mediaSelector, featuresSelector]);

  return (
    <div ref={rootRef} className={className}>
      {children}
    </div>
  );
}
