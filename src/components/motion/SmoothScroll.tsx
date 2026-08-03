"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { scrollToTop, setLenis } from "@/lib/smoothScroll";

gsap.registerPlugin(ScrollTrigger);

function prefersReducedMotion() {
  if (typeof window === "undefined") return true;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function SmoothScroll({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    // Snappier than the first pass — still smooth, not “heavy syrup”.
    const lenis = new Lenis({
      duration: 0.55,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1.2,
      touchMultiplier: 1.35,
      syncTouch: false,
    });

    lenisRef.current = lenis;
    setLenis(lenis);
    lenis.on("scroll", ScrollTrigger.update);

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
      setLenis(null);
    };
  }, []);

  // Lenis keeps scroll across App Router navigations — reset on each route.
  useEffect(() => {
    if (typeof window === "undefined") return;
    history.scrollRestoration = "manual";
    // Hash deep-links are handled by page chrome; bare routes start at top.
    if (!window.location.hash) {
      scrollToTop(true);
      ScrollTrigger.refresh();
    }
  }, [pathname]);

  return <>{children}</>;
}
