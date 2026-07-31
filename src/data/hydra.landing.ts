export const HYDRA = {
  name: "Hydra",
  version: "2.1.19",
  platform: "macOS 26.0+",
  sourceUrl: "https://github.com/quadraaudio/hydra",
  headline: "The routing matrix for the modern Mac studio.",
  lede: "Virtual hub, public bridges, and a gainful patchbay that connects devices, apps, AES67, NDI, and VST strips — in one macOS app.",
  ctaPrimary: { href: "/contact", label: "Get Hydra" },
  ctaSecondary: { href: "/support", label: "License & support" },
} as const;

export const HYDRA_NAV = [
  { href: "#overview", label: "Overview" },
  { href: "#matrix", label: "Matrix" },
  { href: "#bridges", label: "Bridges" },
  { href: "#network", label: "Network" },
  { href: "#strips", label: "Strips" },
  { href: "#specs", label: "Specs" },
] as const;

export const HYDRA_CHAPTERS = [
  {
    id: "matrix",
    eyebrow: "Patch matrix",
    title: "Every cross-point. With gain.",
    body: "Route any source channel to any destination with precise gain. Save scenes, name labels, and recall the room the way you left it.",
    image: "/hydra/chapter-matrix.png",
    imageAlt: "Abstract patch grid glowing on a display surface",
  },
  {
    id: "bridges",
    eyebrow: "Engine & bridges",
    title: "A hidden hub. Public bridges.",
    body: "Hydra Engine is a 256-channel CoreAudio hub. Eight Bridge devices — from 2 to 128 channels — appear as ordinary audio interfaces to every DAW and app on the Mac.",
    image: "/hydra/chapter-bridges.png",
    imageAlt: "Mac in a dark studio showing abstract virtual device panels",
  },
  {
    id: "network",
    eyebrow: "Capture & network",
    title: "Local devices. Network streams. App taps.",
    body: "Bring in CoreAudio hardware, process capture from running apps, subscribe to AES67 via SAP/SDP, and send or receive NDI — all mixed in the same matrix.",
    image: "/hydra/chapter-network.png",
    imageAlt: "Wide studio with network hardware and converging signal paths",
  },
  {
    id: "strips",
    eyebrow: "Channel strips",
    title: "VST inserts that stay out of the way.",
    body: "Build channel strips with VST3 inserts. Run in-process or isolate chains in an out-of-process host so a bad plugin cannot take down the session.",
    image: "/hydra/chapter-control.png",
    imageAlt: "Engineer at dual monitors with abstract strip meters",
  },
] as const;

export const HYDRA_CONTROL = {
  id: "control",
  eyebrow: "Control room",
  title: "Monitor like a console.",
  body: "Dim, mono, swap, master mute, and talkback — with monitor and talkback device routing built into the engine.",
} as const;

export const HYDRA_SPECS = [
  { label: "Version", value: "2.1.19" },
  { label: "Platform", value: "macOS 26.0+" },
  { label: "Hub", value: "Hydra Engine · 256 channels" },
  { label: "Bridges", value: "2A, 2B, 4, 8, 16, 32, 64, 128" },
  { label: "Formats", value: "CoreAudio HAL · VST3 inserts" },
  { label: "Network", value: "AES67 · NDI" },
  { label: "Licensing", value: "Hardware-bound activation" },
  { label: "Control", value: "Local WebSocket on loopback" },
] as const;
