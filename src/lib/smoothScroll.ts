import type Lenis from "lenis";
import { ScrollTrigger } from "gsap/ScrollTrigger";

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
  const found =
    typeof target === "string" ? document.getElementById(target) : target;
  if (!found || !(found instanceof HTMLElement)) return false;
  const el = found;

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

/**
 * Scroll to a MATRIX microsite section, accounting for GSAP pin spacers.
 * Lands slightly into the pin so chapter copy is already visible.
 */
export function scrollToMatrixSection(
  id: string,
  {
    offset = 48,
    immediate = false,
    pinProgress = 0.14,
  }: { offset?: number; immediate?: boolean; pinProgress?: number } = {},
) {
  if (typeof window === "undefined") return false;

  if (id === "overview") {
    scrollToTop(immediate);
    return true;
  }

  const section = document.getElementById(id);
  if (!section) return false;

  const byId = ScrollTrigger.getById(`matrix-chapter-${id}`);
  const pinRoot = section.querySelector("[data-mx-pin]") as HTMLElement | null;

  const triggers = byId
    ? [byId]
    : ScrollTrigger.getAll().filter((st) => {
        const trigger = st.trigger;
        if (!trigger || typeof trigger === "string") return false;
        return (
          trigger === pinRoot ||
          trigger === section ||
          (pinRoot != null && pinRoot.contains(trigger))
        );
      });

  const pinned =
    triggers.find((st) => Boolean(st.pin) || Boolean(st.vars?.pin)) ||
    triggers[0];
  if (pinned && Number.isFinite(pinned.start) && Number.isFinite(pinned.end)) {
    const range = Math.max(0, pinned.end - pinned.start);
    // For non-pinned mobile triggers, land at start; for pins, ease into story.
    const progress = pinned.pin ? pinProgress : 0;
    const y = pinned.start + range * Math.min(1, Math.max(0, progress));
    const lenis = lenisInstance;
    if (lenis) {
      lenis.scrollTo(y, { immediate });
    } else {
      window.scrollTo({
        top: Math.max(0, y),
        behavior: immediate ? "auto" : "smooth",
      });
    }
    return true;
  }

  // Specs / non-pinned sections
  return scrollToElement(section, { offset, immediate });
}
