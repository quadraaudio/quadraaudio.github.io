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
  { href: "#capabilities", label: "Capabilities" },
  { href: "#control", label: "Control" },
  { href: "#specs", label: "Tech Specs" },
] as const;

export const HYDRA_CHAPTERS = [
  {
    id: "matrix",
    eyebrow: "Patch matrix",
    title: "Every cross-point. With gain.",
    body: "Route any source channel to any destination with precise gain. Save scenes, name labels, and recall the room the way you left it.",
    detail:
      "The matrix is a gainful connection graph: each cross-point is addressable, metered, and scene-recallable. Labels travel with the graph so complex rooms stay readable across sessions.",
    image: "/hydra/chapter-matrix.png",
    imageAlt: "Abstract patch grid glowing on a display surface",
  },
  {
    id: "bridges",
    eyebrow: "Engine & bridges",
    title: "A hidden hub. Public bridges.",
    body: "Hydra Engine is a 256-channel CoreAudio hub. Eight Bridge devices — from 2 to 128 channels — appear as ordinary audio interfaces to every DAW and app on the Mac.",
    detail:
      "DAWs see standard CoreAudio devices. The hub stays hidden while Bridge 2A through 128 expose the channel counts you need — without rewiring the physical room.",
    image: "/hydra/chapter-bridges.png",
    imageAlt: "Mac in a dark studio showing abstract virtual device panels",
  },
  {
    id: "network",
    eyebrow: "Capture & network",
    title: "Local devices. Network streams. App taps.",
    body: "Bring in CoreAudio hardware, process capture from running apps, subscribe to AES67 via SAP/SDP, and send or receive NDI — all mixed in the same matrix.",
    detail:
      "Sources and destinations share one patch surface: hardware I/O, app process taps, AES67 discovery, and NDI send/receive. No parallel routing islands.",
    image: "/hydra/chapter-network.png",
    imageAlt: "Wide studio with network hardware and converging signal paths",
  },
  {
    id: "strips",
    eyebrow: "Channel strips",
    title: "VST inserts that stay out of the way.",
    body: "Build channel strips with VST3 inserts. Run in-process or isolate chains in an out-of-process host so a bad plugin cannot take down the session.",
    detail:
      "Strip inserts can run in-process for lowest latency or in hydra-plugin-host over shared memory ABI v2. Plugin scans run in an isolated worker so a crash does not kill the engine.",
    image: "/hydra/chapter-control.png",
    imageAlt: "Engineer at dual monitors with abstract strip meters",
  },
] as const;

export const HYDRA_CONTROL = {
  id: "control",
  eyebrow: "Control room",
  title: "Monitor like a console.",
  body: "Dim, mono, swap, master mute, and talkback — with monitor and talkback device routing built into the engine.",
  points: [
    "Dim and talkback ducking in dB",
    "Mono / swap L-R / master mute",
    "Monitor and talkback device UIDs",
  ],
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
