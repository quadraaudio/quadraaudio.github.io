"use client";

import { useEffect, useState } from "react";
import { GlobalNav } from "@/components/chrome/GlobalNav";
import { HydraChrome } from "@/components/hydra/HydraChrome";

/** Leave the first viewport slightly before swapping, re-enter with hysteresis. */
const SHOW_MATRIX_Y = 56;
const SHOW_QUADRA_Y = 20;

/**
 * Mutual-exclusive headers on MATRIX: Quadra at the first view,
 * MATRIX chrome in the same top slot once you scroll.
 */
export function HydraNavSwap() {
  const [showMatrix, setShowMatrix] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setShowMatrix((prev) => {
        if (!prev && y > SHOW_MATRIX_Y) return true;
        if (prev && y < SHOW_QUADRA_Y) return false;
        return prev;
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      const html = document.documentElement;
      html.style.scrollPaddingTop = "";
      html.style.removeProperty("--matrix-sticky-offset");
      delete html.dataset.matrixShell;
    };
  }, []);

  useEffect(() => {
    const html = document.documentElement;
    html.dataset.matrixShell = showMatrix ? "matrix" : "quadra";
    html.style.scrollPaddingTop = showMatrix
      ? "var(--matrix-chrome-height)"
      : "var(--nav-height)";
    html.style.setProperty(
      "--matrix-sticky-offset",
      showMatrix ? "var(--matrix-chrome-height)" : "var(--nav-height)",
    );
  }, [showMatrix]);

  return (
    <>
      <GlobalNav swapHidden={showMatrix} />
      <HydraChrome visible={showMatrix} />
    </>
  );
}
