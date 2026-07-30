/**
 * Quadra design tokens (JS mirror of src/styles/tokens.scss).
 * Structure is Apple-aligned; values are Quadra-owned. No purple glow theme.
 */

export const QUADRA_TOKENS = {
  colors: {
    bg: "#000000",
    bgSecondary: "#0a0a0c",
    bgTertiary: "#111114",
    text: "#f5f5f7",
    textSecondary: "#a1a1a6",
    textMuted: "#86868b",
    accent: "#2997ff",
    accentSolid: "#0071e3",
    border: "rgba(255, 255, 255, 0.12)",
  },
  typography: {
    fontFamily:
      'var(--font-quadra), "SF Pro Display", "Helvetica Neue", Helvetica, Arial, sans-serif',
  },
  layout: {
    content: "980px",
    wide: "1200px",
    navHeight: "44px",
  },
} as const;
