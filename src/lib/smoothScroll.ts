import type Lenis from "lenis";

let lenisInstance: Lenis | null = null;

export function setLenis(instance: Lenis | null) {
  lenisInstance = instance;
}

export function getLenis() {
  return lenisInstance;
}

export function scrollToTop(immediate = true) {
  const lenis = lenisInstance;
  if (lenis) {
    lenis.scrollTo(0, { immediate });
    return;
  }
  if (typeof window !== "undefined") {
    window.scrollTo({ top: 0, behavior: immediate ? "auto" : "smooth" });
  }
}

export function scrollToElement(
  target: Element | string,
  {
    offset = 0,
    immediate = false,
  }: { offset?: number; immediate?: boolean } = {},
) {
  const el =
    typeof target === "string" ? document.getElementById(target) : target;
  if (!el) return false;

  const lenis = lenisInstance;
  if (lenis) {
    lenis.scrollTo(el, { offset: -offset, immediate });
    return true;
  }

  const top = el.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({
    top: Math.max(0, top),
    behavior: immediate ? "auto" : "smooth",
  });
  return true;
}
