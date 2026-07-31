export type SupportArticle = {
  id: string;
  title: string;
  category: string;
  date: string;
  summary: string;
  hubBlurb: string;
  steps: { heading: string; text: string; bullets?: string[] }[];
};

export const SUPPORT_ARTICLES: SupportArticle[] = [
  {
    id: "getting-started",
    title: "Getting Started with Hydra",
    category: "Setup",
    date: "July 2026",
    hubBlurb:
      "Install Hydra, confirm the HAL bridges are loaded, and make your first Matrix Grid patch.",
    summary:
      "Hydra is a virtual audio patchbay for macOS. One app process hosts the UI and the audio engine (HydraDaemon). Eight Hydra Audio Bridges appear as Core Audio devices; you route them in the Matrix Grid along with apps, hardware, VST inserts, and network streams.",
    steps: [
      {
        heading: "1. Install and open Hydra",
        text: "Download Hydra from the Quadra Store, run the installer, and launch Hydra.app. On first launch the engine starts in-process and opens a loopback control channel on the local machine.",
        bullets: [
          "Requires macOS 26 (Tahoe) or later.",
          "The installer places HAL plug-ins under /Library/Audio/Plug-Ins/HAL and restarts coreaudiod.",
          "You should see Hydra in the menu bar after launch.",
        ],
      },
      {
        heading: "2. Confirm the bridges are present",
        text: "Open System Settings → Sound (or Audio MIDI Setup). You should see the public Hydra Audio Bridge devices (2‑A, 2‑B, 4, 8, 16, 32, 64, and 128 channels). A hidden hub device named “Hydra Engine” (256 channels) powers the matrix and is not meant for DAW selection.",
        bullets: [
          "If bridges are missing, reinstall and ensure the HAL plug-ins are allowed under Privacy & Security.",
          "After driver changes, a logout/login or reboot can be required for coreaudiod to reload.",
        ],
      },
      {
        heading: "3. Make your first patch",
        text: "In Hydra, open the Matrix Grid. Transmitters run on one axis, receivers on the other. Click a cross-point to create a connection; a live indicator confirms audio is flowing. Enable a bridge, select it as the output of an app (or DAW), and patch that bridge into another bridge or device.",
      },
      {
        heading: "4. Activate or start the trial",
        text: "Sign in with your Quadra ID to activate a license or begin the 90-day trial. Licensing is hardware-bound (Quadra Guard) and works offline after activation.",
      },
    ],
  },
  {
    id: "system-requirements",
    title: "System Requirements",
    category: "Setup",
    date: "July 2026",
    hubBlurb:
      "macOS version, Apple Silicon / Intel support, and what Hydra installs on your Mac.",
    summary:
      "Hydra ships as a Universal binary targeting macOS 26.0 or later. It uses user-space Core Audio AudioServerPlugIn HAL drivers — no kernel extensions, SIP stays enabled.",
    steps: [
      {
        heading: "Operating system",
        text: "macOS 26 (Tahoe) or later is required. Older macOS releases are not supported by the current build.",
      },
      {
        heading: "Hardware",
        text: "Apple Silicon (M1 and later) and Intel (x86_64) Macs are supported via a Universal binary.",
      },
      {
        heading: "What gets installed",
        text: "Hydra.app embeds the audio engine and the optional hydra-plugin-host worker. Packaging also installs:",
        bullets: [
          "HydraVirtualSoundcard.driver — hidden 256-channel hub (“Hydra Engine”).",
          "Eight HydraAudioBridge*.driver bundles matching the bridge catalog (2A–128).",
          "Drivers live in /Library/Audio/Plug-Ins/HAL.",
        ],
      },
      {
        heading: "Optional runtimes",
        text: "NDI audio requires the NDI Apple redistributable at runtime (loaded dynamically; not linked into Hydra). AES67 uses built-in SAP/SDP and PTPv2 helpers on your LAN.",
      },
    ],
  },
  {
    id: "install-drivers",
    title: "Installing & Verifying HAL Drivers",
    category: "Setup",
    date: "July 2026",
    hubBlurb:
      "How Hydra’s AudioServerPlugIn drivers install, reload, and show up in Audio MIDI Setup.",
    summary:
      "Hydra’s bridges are Core Audio HAL AudioServerPlugIn bundles. They use an in-driver ring buffer (output write → input read) so apps see standard multi-channel devices without userspace shared-memory IPC.",
    steps: [
      {
        heading: "1. Use the official installer",
        text: "The packaging postinstall script sets correct ownership on HAL plug-ins and restarts coreaudiod. Prefer the Quadra installer or DMG over copying files by hand.",
      },
      {
        heading: "2. Verify in Audio MIDI Setup",
        text: "You should see the eight public bridges. Channel counts match the catalog: 2, 2, 4, 8, 16, 32, 64, and 128. Default sample rate is 48 kHz.",
      },
      {
        heading: "3. If devices are missing",
        text: "Confirm plug-ins exist under /Library/Audio/Plug-Ins/HAL, then restart coreaudiod (or reboot). Check System Settings → Privacy & Security for blocked system software. Re-run the installer if bundles were removed.",
      },
      {
        heading: "4. Uninstall",
        text: "Use the Uninstall app shipped with the DMG when available, or remove the Hydra HAL bundles and Hydra.app, then restart coreaudiod.",
      },
    ],
  },
  {
    id: "license-activation",
    title: "Activation & Licensing (Quadra Guard)",
    category: "Licensing",
    date: "July 2026",
    hubBlurb:
      "Activate with Quadra ID, bind a Mac via HWID, manage seats, and use offline .qkey files.",
    summary:
      "Hydra licenses are perpetual with lifetime updates. Quadra Guard binds activation to a hardware ID (HWID), verifies signed license payloads locally, and mutes engine output if the guard fails. Up to 2 Macs per license via your Quadra ID.",
    steps: [
      {
        heading: "1. Online activation",
        text: "In Hydra, open License / Account and sign in with your Quadra ID (email or Google). The license server verifies entitlement for your machine ID and returns a signed license payload stored on the Mac.",
        bullets: [
          "Activation needs network once; afterward the license works offline.",
          "Manage devices from your Quadra Account on the website.",
        ],
      },
      {
        heading: "2. Offline / .qkey activation",
        text: "If you received a signed license file, use Offline Activation in the License UI. Paste or import the file so LicenseEngine can verify and save it locally.",
      },
      {
        heading: "3. Seat limits",
        text: "Each full license permits activation on up to 2 Macs. Deactivate a machine from Account or License settings before moving a seat to another Mac.",
      },
      {
        heading: "4. Trial",
        text: "Hydra includes a fully functional 90-day trial. When the trial ends without a license, the engine guard zeros audio output until you activate.",
      },
      {
        heading: "5. Troubleshooting activation",
        text: "Confirm the email matches your purchase, that you have an open seat, and that the Mac’s clock is accurate (signature checks can fail on extreme clock skew). Contact support with your order email and HWID if verification keeps failing.",
      },
    ],
  },
  {
    id: "audio-bridges",
    title: "Hydra Audio Bridges",
    category: "Virtual Soundcard",
    date: "July 2026",
    hubBlurb:
      "Eight Core Audio bridges from 2 to 128 channels — pick the size that fits each app.",
    summary:
      "Bridges are the public virtual soundcards apps and DAWs select. Behind them, a hidden 256-channel hub (“Hydra Engine”) runs the matrix. Bridge roles and network TX can be controlled from Hydra’s Bridges UI.",
    steps: [
      {
        heading: "Bridge catalog",
        text: "Hydra exposes eight bridges:",
        bullets: [
          "2‑A and 2‑B — stereo pairs for podcasts, browsers, or simple I/O.",
          "4 / 8 / 16 — stems, stems+return, or small ensemble routing.",
          "32 / 64 / 128 — large sessions and multichannel stems.",
        ],
      },
      {
        heading: "Using a bridge in a DAW",
        text: "In your DAW’s audio preferences, set input and/or output to the desired Hydra Audio Bridge. Enable that bridge in Hydra if it is toggled off, then patch its channels in the Matrix Grid.",
      },
      {
        heading: "Bridge roles & network TX",
        text: "From Bridges settings you can enable/disable bridges, set role, and mark a bridge for AES67 or NDI transmit so other machines on the LAN can subscribe.",
      },
      {
        heading: "Hub vs bridges",
        text: "Do not select “Hydra Engine” as a normal playback device in most apps — it is the hidden backplane. Always use the numbered bridges for application I/O.",
      },
    ],
  },
  {
    id: "matrix-grid",
    title: "Matrix Grid & Routing",
    category: "Routing",
    date: "July 2026",
    hubBlurb:
      "Cross-point patching, gainful connections, scenes, and how the engine mixes audio.",
    summary:
      "The Matrix Grid is a visual cross-point router. Each connection is a gainful patch from a source channel to a destination channel. The audio engine processes the matrix every IOProc cycle on the Hydra Engine hub.",
    steps: [
      {
        heading: "1. Read the grid",
        text: "Transmitters (sources) sit on one axis; receivers (destinations) on the other. Sources include bridges, physical devices, app taps, AES67/NDI RX, modules, and strip/plugin chains. Destinations include bridges, devices, network TX, module sinks, and recording.",
      },
      {
        heading: "2. Create and remove connections",
        text: "Click a cross-point to patch. Click again (or use remove) to clear. Connection IDs follow the form src:ch→dst:ch. Gain can be adjusted per connection where the UI exposes it.",
      },
      {
        heading: "3. Feedback protection",
        text: "Hydra includes patch validation / feedback-protection helpers. Keep feedback protection enabled in Config unless you intentionally need a monitored loop and understand the risk of feedback.",
      },
      {
        heading: "4. Labels & scenes",
        text: "Rename channels with Labels for clarity. Save Scenes to snapshot the matrix; Apply a scene to recall a routing layout for a show, client, or session type.",
      },
      {
        heading: "5. Capacity",
        text: "The engine supports up to 1024 connections. Prefer intentional patches over dense all-to-all grids for CPU and clarity.",
      },
    ],
  },
  {
    id: "app-capture",
    title: "Flux Capture & App Process Taps",
    category: "Routing",
    date: "July 2026",
    hubBlurb:
      "Tap Zoom, Chrome, Spotify, Discord, and other apps without changing their output device.",
    summary:
      "Process taps use the macOS Core Audio Process Tap API to copy an app’s audio into Hydra while the app keeps playing to its normal output. Each tap presents stereo (2-channel) sources to the matrix.",
    steps: [
      {
        heading: "1. Grant permission",
        text: "macOS will prompt for audio capture / process tap permission when you first enable an app. Allow Hydra in System Settings if the tap stays silent.",
      },
      {
        heading: "2. Enable capture",
        text: "In the Apps sidebar, toggle capture for the target process. Hydra lists running apps that can be tapped; channels appear as sources in the Matrix Grid.",
      },
      {
        heading: "3. Route the tap",
        text: "Patch the app tap into a bridge, hardware output, recorder, or network TX. Optional app-tap makeup gain is available in Config (appTapMakeupDB) if levels are low.",
      },
      {
        heading: "4. Limitations",
        text: "Some sandboxed or protected processes may not expose taps. Prefer bridges when you need guaranteed multi-channel I/O from a DAW.",
      },
    ],
  },
  {
    id: "hardware-asrc-setup",
    title: "Physical Devices & ASRC",
    category: "Virtual Soundcard",
    date: "July 2026",
    hubBlurb:
      "Add USB/Thunderbolt interfaces to the grid with automatic drift-corrected sample-rate conversion.",
    summary:
      "Physical devices attach via Core Audio IOProcs into ChannelRing buffers. Consumer-side polyphase / linear ASRC keeps independent hardware clocks aligned with the Hydra Engine clock.",
    steps: [
      {
        heading: "1. Enable a device",
        text: "Open the Devices tab and set the device to be used by Hydra. Its channels appear as sources and/or destinations depending on direction.",
      },
      {
        heading: "2. ASRC behavior",
        text: "ASRC runs on the pull path so a USB mic and a Thunderbolt interface can coexist without manual word-clock cabling. You should not need to force all devices to the same clock master for basic routing.",
      },
      {
        heading: "3. Monitor outs & routes",
        text: "Route Manager / device output taps can send matrix audio to a chosen hardware output. Pair this with Control Room for DIM/MUTE/TALKBACK on your monitors.",
      },
      {
        heading: "4. Reconnect behavior",
        text: "If a device disconnects, restore it and re-enable use in the Devices list. Re-check patches if the device UID changed after a firmware or OS update.",
      },
    ],
  },
  {
    id: "vst-channel-strips",
    title: "VST3 Inserts & Channel Strips",
    category: "Plugins",
    date: "July 2026",
    hubBlurb:
      "Host VST3 plugins out-of-process so a crash cannot take down Hydra or your DAW session path.",
    summary:
      "StripManager hosts insert chains as EngineTaps. Plugins can run in-process or via SharedPluginHost, which spawns hydra-plugin-host and exchanges audio over a lock-free POSIX shared-memory ABI (v2). If the worker stalls, Hydra bypasses rather than blocking the audio thread.",
    steps: [
      {
        heading: "1. Point Hydra at your VST folder",
        text: "In Settings / Config, set vstFolderPath to your VST3 directory, then run Scan VST. Favorites and availability flags help filter large libraries.",
      },
      {
        heading: "2. Build a strip",
        text: "Create or edit a channel strip, add inserts, and place the strip in the matrix path so audio passes through the chain.",
      },
      {
        heading: "3. Open the plugin editor",
        text: "Use Open Plugin Editor from the strip UI. Editor and parameter commands travel on the host command ring (open/set param/close).",
      },
      {
        heading: "4. Crash isolation",
        text: "Out-of-process hosting isolates plugin faults in hydra-plugin-host. The worker can restart; the Hydra engine and DAW keep running. Prefer OOP for unstable or untrusted plugins.",
      },
      {
        heading: "5. Scan worker",
        text: "Hydra can run an isolated --scan-bundle worker so a crashing plug-in scan does not bring down the main UI process.",
      },
    ],
  },
  {
    id: "network-aes67-ndi",
    title: "Network Audio: AES67 & NDI",
    category: "Network",
    date: "July 2026",
    hubBlurb:
      "Subscribe to AES67 (PTP/SAP/SDP) and NDI sources, and transmit bridges back to the LAN.",
    summary:
      "Hydra’s Network tab surfaces AES67 and NDI discovery. AES67 RX uses SAP (UDP 9875) and SDP parsing with PTPv2 clock helpers. NDI is loaded at runtime via a dlopen shim — install the NDI Apple redistributable first.",
    steps: [
      {
        heading: "1. AES67 receive",
        text: "Open Network → AES67. Discovered streams appear from SAP announcements. Subscribe to add channels to the grid. Confirm PTP lock status before critical shows.",
      },
      {
        heading: "2. AES67 transmit",
        text: "Mark a bridge (or flow) for AES67 TX so other AoIP endpoints can subscribe. Keep multicast/IGMP routing healthy on your switch fabric.",
      },
      {
        heading: "3. NDI receive & send",
        text: "Install NDI tools/runtime, then use Network → NDI to subscribe to sources. Enable NDI TX on a bridge/interface when you want Hydra to publish audio to NDI consumers.",
      },
      {
        heading: "4. Interfaces & flows",
        text: "Create network Interfaces for organized TX/RX endpoints, and use Flows to define higher-level route objects between endpoints when the UI exposes them.",
      },
      {
        heading: "5. Firewall & LAN tips",
        text: "Allow local multicast/UDP for SAP and PTP-related traffic. Prefer wired Ethernet for AoIP. NDI discovery also needs LAN visibility between machines.",
      },
    ],
  },
  {
    id: "control-room",
    title: "Control Room Monitor",
    category: "Monitor Control",
    date: "July 2026",
    hubBlurb:
      "DIM, MONO, SWAP L/R, MUTE, TALKBACK, and the floating Studio HUD.",
    summary:
      "Control Room state includes dim, mono sum, swap L/R, master mute, talkback active, monitor/talkback device UIDs, and dim/talkback ducking levels. Use it as a software monitor controller while mixing in your DAW.",
    steps: [
      {
        heading: "1. Assign monitor & talkback devices",
        text: "Open Control Room settings and choose the hardware (or bridge) used for monitors and the talkback mic input.",
      },
      {
        heading: "2. Transport-style controls",
        text: "DIM attenuates the master path, MONO sums L/R for phase checks, SWAP L/R flips the stereo image, and MUTE silences the master. TALKBACK engages the mic and ducks background audio by the configured amount.",
      },
      {
        heading: "3. Floating Studio HUD",
        text: "Open the always-on-top monitor panel so these controls stay reachable over a full-screen DAW.",
      },
    ],
  },
  {
    id: "scenes-labels",
    title: "Scenes & Channel Labels",
    category: "Routing",
    date: "July 2026",
    hubBlurb:
      "Name channels clearly and recall entire patch layouts with Scenes.",
    summary:
      "LabelStore and SceneStore persist under Application Support. Labels keep large matrices readable; scenes snapshot and restore connection sets for different workflows.",
    steps: [
      {
        heading: "Labels",
        text: "Use Set Label on channels you revisit often (e.g. “Guest A”, “Stream Mix”, “VR Return”). Labels sync through the control protocol to the UI.",
      },
      {
        heading: "Save a scene",
        text: "When the matrix looks right, Save Scene with a descriptive name (Podcast, Live Stream, Tracking).",
      },
      {
        heading: "Apply or delete",
        text: "Apply Scene replaces the live patch set with the snapshot. Delete Scene removes unused layouts. Confirm before applying over a live show.",
      },
    ],
  },
  {
    id: "recording",
    title: "Recording from the Matrix",
    category: "Recording",
    date: "July 2026",
    hubBlurb:
      "Capture matrix destinations to disk with configurable format and folder.",
    summary:
      "RecordingManager can start/stop recordings fed from matrix destinations (pool TX taps). Configure recording format and folder path in Hydra Config.",
    steps: [
      {
        heading: "1. Choose folder & format",
        text: "In Settings, set recordingFolderPath and recordingFormat before a session so files land where your backup workflow expects them.",
      },
      {
        heading: "2. Route into record",
        text: "Patch the sources you want captured into the recording destination / arm the recorder from the Recordings UI.",
      },
      {
        heading: "3. Start and stop",
        text: "Start Recording when the take begins; Stop Recording to finalize the file. Verify disk space before long multichannel captures.",
      },
    ],
  },
  {
    id: "buffer-performance",
    title: "Buffer Size, Load & Dropouts",
    category: "Troubleshooting",
    date: "July 2026",
    hubBlurb:
      "Tune bufferSizeFrames, reduce xruns, and keep high channel-count sessions stable.",
    summary:
      "Hydra’s audio callback runs on the hub IOProc. Config exposes bufferSizeFrames. Device rings default to 8192 frames of buffering headroom; max IO frames are capped for safety. Heavy VST chains and dense matrices raise CPU.",
    steps: [
      {
        heading: "1. Raise the buffer when overloaded",
        text: "Increase buffer size in Audio Engine / Config for tracking-heavy or high channel-count sessions. Lower it only when you need minimum monitoring latency and CPU allows.",
      },
      {
        heading: "2. Reduce matrix density",
        text: "Remove unused connections, disable idle bridges, and bypass unused VST strips. Prefer OOP hosting for heavy plugins so faults do not stall the engine.",
      },
      {
        heading: "3. Hardware & ASRC",
        text: "Ensure physical devices stay connected. Extreme clock drift or failing USB buses still surface as glitches — try another port/cable and confirm ASRC paths are active.",
      },
      {
        heading: "4. macOS hygiene",
        text: "Close aggressive background CPU users, keep thermal headroom on laptops, and avoid running multiple conflicting virtual soundcards on the same session if possible.",
      },
    ],
  },
  {
    id: "osc-remote-control",
    title: "OSC Remote Control",
    category: "Control",
    date: "July 2026",
    hubBlurb:
      "Enable the OSC server for Stream Deck, TouchOSC, Companion, and custom controllers.",
    summary:
      "Hydra can run an OscServer when oscEnabled is set in Config. Point controllers at your Mac’s IP and the configured oscPort. OSC parsing lives in HydraCore alongside the WebSocket control plane.",
    steps: [
      {
        heading: "1. Enable OSC",
        text: "Open Settings → enable OSC and note the port. Allow inbound UDP on that port in the macOS firewall if controllers are on another machine.",
      },
      {
        heading: "2. Map your controller",
        text: "Use Bitfocus Companion, TouchOSC, or similar to send OSC messages that match Hydra’s expected address space for the actions you need.",
      },
      {
        heading: "3. Prefer local network",
        text: "Keep controllers on the same LAN. Do not expose OSC ports to the public internet.",
      },
    ],
  },
  {
    id: "modules",
    title: "Hydra Modules (.dylib)",
    category: "Advanced",
    date: "July 2026",
    hubBlurb:
      "Load optional Module ABI plugins that publish sources/sinks into the matrix.",
    summary:
      "Modules are .dylib files under Application Support modules/ exporting hydra_module_entry (ABI v1). ModuleManager dlopens them and can subscribe module sources into the grid. This tree does not ship a Dante module; third-party modules follow the public ABI header.",
    steps: [
      {
        heading: "Install a module",
        text: "Place a compatible .dylib in Hydra’s modules folder and restart or refresh Modules in the UI.",
      },
      {
        heading: "Subscribe sources",
        text: "Use getModules / subscribeModuleSource from the Modules UI to bring module channels onto the matrix.",
      },
      {
        heading: "Developers",
        text: "Implement the Module ABI (sources_changed, deliver_audio, optional list_sinks) and match HYDRA_MODULE_ABI_VERSION. Test outside of show-critical sessions first.",
      },
    ],
  },
  {
    id: "troubleshooting",
    title: "Troubleshooting Checklist",
    category: "Troubleshooting",
    date: "July 2026",
    hubBlurb:
      "No devices, silence, license mute, network discovery, and plugin worker issues.",
    summary:
      "Most issues fall into driver load, permission, license guard, routing mistakes, or optional runtime (NDI) problems. Work top-down: devices → engine → patches → license → network.",
    steps: [
      {
        heading: "No Hydra bridges in apps",
        text: "Reinstall HAL drivers, restart coreaudiod/reboot, check Privacy & Security for blocked system software, confirm bundles under /Library/Audio/Plug-Ins/HAL.",
      },
      {
        heading: "Bridges exist but silence",
        text: "Enable the bridge in Hydra, verify Matrix connections, check Control Room MUTE/DIM, confirm the DAW is using the same bridge you patched, and ensure the license/trial is valid (guard zeroes output when invalid).",
      },
      {
        heading: "App tap is silent",
        text: "Re-grant process tap / audio capture permission, relaunch the target app, and confirm the process still appears in the Apps list.",
      },
      {
        heading: "AES67 / NDI empty",
        text: "Check cabling, multicast, and firewall. For NDI, install the Apple redistributable. For AES67, confirm SAP announcements and PTP status on the LAN.",
      },
      {
        heading: "Plugin editor / inserts misbehave",
        text: "Rescan VST folder, try OOP hosting, clear a bad insert, and check Activity Monitor for hydra-plugin-host. Bypass strips to isolate CPU overload.",
      },
      {
        heading: "Still stuck?",
        text: "Note Hydra version (About), macOS version, bridge/device setup, and exact repro steps, then contact Engineering Support.",
      },
    ],
  },
  {
    id: "architecture-overview",
    title: "How Hydra Works (Architecture)",
    category: "Advanced",
    date: "July 2026",
    hubBlurb:
      "App + in-process daemon, WebSocket control plane, hub IOProc, and optional plugin host.",
    summary:
      "For power users and integrators: Hydra.app starts DaemonRuntime in-process. UI talks to the engine over ws://127.0.0.1:59731. Audio mixes on the hidden hub; bridges are the public HAL faces.",
    steps: [
      {
        heading: "Processes",
        text: "Hydra.app hosts SwiftUI + HydraDaemon. hydra-plugin-host is spawned on demand for out-of-process VST chains. HAL drivers load inside coreaudiod separately.",
      },
      {
        heading: "Control plane",
        text: "JSON WebSocket messages (WSMessage) cover matrix, devices, apps, AES67, NDI, strips, scenes, config, recording, control room, and more. Surface/HUI protocol cases exist in the shared model but are not executed by the current daemon handler.",
      },
      {
        heading: "Audio plane",
        text: "Hub IOProc → MatrixStore.process (mix + optional ChainTap) → destinations (bridges, devices, AES67/NDI TX, modules, recording). ChannelRing provides SPSC buffering with consumer ASRC.",
      },
      {
        heading: "Version",
        text: "Check About / Hydra.version in the app for the exact build string when filing tickets.",
      },
    ],
  },
];

export const SUPPORT_ARTICLE_MAP: Record<string, SupportArticle> = Object.fromEntries(
  SUPPORT_ARTICLES.map((a) => [a.id, a])
);

export const SUPPORT_CATEGORIES = [
  "Setup",
  "Licensing",
  "Virtual Soundcard",
  "Routing",
  "Plugins",
  "Network",
  "Monitor Control",
  "Recording",
  "Control",
  "Troubleshooting",
  "Advanced",
] as const;

export function getArticlesByCategory(category: string) {
  return SUPPORT_ARTICLES.filter((a) => a.category === category);
}
