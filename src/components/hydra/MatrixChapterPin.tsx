"use client";

import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type Props = {
  children: ReactNode;
  className?: string;
};

/**
 * Pins the chapter viewport and scrubs storytelling.
 * Writes progress 0→1 onto the root (`data-mx-progress`) so the
 * full-bleed visual can stay locked to scroll — not a free-running GIF.
 */
export function MatrixChapterPin({ children, className = "" }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const copy = root.querySelector("[data-mx-copy]") as HTMLElement | null;
    const features = root.querySelector("[data-mx-features]") as HTMLElement | null;
    const visual = root.querySelector("[data-mx-visual]") as HTMLElement | null;
    const scene = root.querySelector("[data-mx-scene]") as HTMLElement | null;
    if (!scene) return;

    const revealStatic = () => {
      root.dataset.mxProgress = "1";
      [copy, features, visual].forEach((el) => {
        if (!el) return;
        el.style.opacity = "1";
        el.style.transform = "none";
      });
    };

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      revealStatic();
      return;
    }

    const desktop = window.matchMedia("(min-width: 960px)").matches;
    const failsafe = window.setTimeout(revealStatic, 4500);

    const ctx = gsap.context(() => {
      if (desktop) {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: root,
            start: "top top+=48",
            end: "+=165%",
            pin: scene,
            scrub: 0.7,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onRefreshInit: () => window.clearTimeout(failsafe),
            onUpdate: (self) => {
              root.dataset.mxProgress = self.progress.toFixed(4);
            },
          },
        });

        // Visual is the stage — arrives first, grows with scroll
        if (visual) {
          tl.fromTo(
            visual,
            { autoAlpha: 0.35, scale: 1.12 },
            { autoAlpha: 1, scale: 1, duration: 0.45, ease: "none" },
            0,
          );
        }
        if (copy) {
          tl.fromTo(
            copy,
            { autoAlpha: 0, y: 40 },
            { autoAlpha: 1, y: 0, duration: 0.28, ease: "power2.out" },
            0.12,
          );
        }
        if (features) {
          tl.fromTo(
            features,
            { autoAlpha: 0, y: 28 },
            { autoAlpha: 1, y: 0, duration: 0.25, ease: "power2.out" },
            0.55,
          );
        }
        tl.to({}, { duration: 0.2 });
      } else {
        // Mobile: no pin — progress tracks section visibility
        ScrollTrigger.create({
          trigger: root,
          start: "top 80%",
          end: "bottom 20%",
          scrub: 0.5,
          onUpdate: (self) => {
            root.dataset.mxProgress = self.progress.toFixed(4);
          },
          onRefreshInit: () => window.clearTimeout(failsafe),
        });
        if (copy) gsap.set(copy, { autoAlpha: 1, y: 0 });
        if (features) gsap.set(features, { autoAlpha: 1, y: 0 });
        if (visual) gsap.set(visual, { autoAlpha: 1, scale: 1 });
      }
    }, root);

    const onResize = () => ScrollTrigger.refresh();
    window.addEventListener("resize", onResize);

    return () => {
      window.clearTimeout(failsafe);
      window.removeEventListener("resize", onResize);
      ctx.revert();
    };
  }, []);

  return (
    <div ref={rootRef} className={className} data-mx-pin data-mx-progress="0">
      {children}
    </div>
  );
}
