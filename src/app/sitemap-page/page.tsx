import Link from "next/link";
import ThemeSwitcher from "@/app/hydra/ThemeSwitcher";
import styles from "./page.module.scss";

export const metadata = {
  title: "Site Map — Quadra Audio",
  description: "Complete navigation index of all Quadra Audio pages, products, documentation, and support topics.",
};

const sitemapData = [
  {
    title: "Main Platform",
    links: [
      { label: "Home", href: "/", desc: "Flagship Overview & Core Audio Engine" },
      { label: "Hydra Software", href: "/hydra", desc: "256-Channel Virtual Patchbay & Matrix" },
      { label: "Virtual Patchbay Tools", href: "/hydra#tools", desc: "Application Process Tap & Driver Fusion" },
      { label: "Network Audio (AoIP)", href: "/hydra#network", desc: "NDI® & AVB Multichannel Streaming" },
      { label: "Spatial Audio 9.4.6", href: "/hydra#spatial", desc: "Dolby Atmos & HRTF Head Tracking" },
      { label: "Tech Specs", href: "/hydra#specs", desc: "System Requirements & C++ Architecture" },
    ],
  },
  {
    title: "Quadra Store & Purchase",
    links: [
      { label: "Quadra Store", href: "/store", desc: "Browse Commercial Licenses & Free Trial" },
      { label: "Buy Hydra License", href: "/store/buy-hydra", desc: "Direct Purchase Shortcut ($199.99)" },
      { label: "Shopping Bag", href: "/store/bag", desc: "Review Cart & Apply Promo Coupons" },
      { label: "Checkout Gate", href: "/store/checkout/gate", desc: "Sign in with Quadra ID or Google OAuth" },
      { label: "Checkout Payment", href: "/store/checkout/payment", desc: "PayPal, Card & $0 Promo Orders" },
    ],
  },
  {
    title: "Quadra ID & Account",
    links: [
      { label: "Account Dashboard", href: "/account", desc: "Manage Machine Activations & Licenses" },
      { label: "Offline License (.qkey)", href: "/account", desc: "Generate Studio Air-Gapped Licenses" },
      { label: "Sign In / Register", href: "/login", desc: "Quadra ID Authentication Portal" },
    ],
  },
  {
    title: "Support & Knowledge Base",
    links: [
      { label: "Support Home", href: "/support", desc: "Search Topics & Knowledge Base" },
      { label: "Configuring NDI® Audio", href: "/support/article/configuring-ndi", desc: "Ethernet AoIP Network Setup Guide" },
      { label: "License Activations", href: "/support/article/license-activation", desc: "Quadra ID 2-Machine Licensing Guide" },
      { label: "Buffer Optimization", href: "/support/article/optimizing-buffer", desc: "Preventing Audio Dropouts & Xruns" },
      { label: "GroundControl Fusion", href: "/support/article/groundcontrol-fusion", desc: "Aggregating Hardware Interfaces" },
      { label: "Dolby Atmos 9.4.6", href: "/support/article/dolby-atmos-916", desc: "Spatial Audio Monitoring Setup" },
      { label: "Engineering Support Contact", href: "/support/contact", desc: "Direct Audio Specialist Help Desk" },
    ],
  },
  {
    title: "Legal & Corporate",
    links: [
      { label: "Privacy Policy", href: "/legal/privacy", desc: "Data Protection & Quadra ID Privacy" },
      { label: "Terms of Use", href: "/legal/terms", desc: "Software License Agreement & Terms" },
      { label: "Sales and Refunds", href: "/legal/refunds", desc: "14-Day Money Back Guarantee" },
      { label: "HTML Site Map", href: "/sitemap-page", desc: "Complete Website Directory" },
    ],
  },
];

export default function SiteMapPage() {
  return (
    <div className={styles.page}>
      <ThemeSwitcher forceTheme="light" />

      <div className={styles.container}>
        <header className={styles.header}>
          <h1>Quadra Audio Site Map</h1>
          <p>Complete directory of all pages, tools, documentation, and licensing portals.</p>
        </header>

        <div className={styles.sitemapGrid}>
          {sitemapData.map((section, idx) => (
            <div key={idx} className={styles.sectionCard}>
              <h2>{section.title}</h2>
              <ul>
                {section.links.map((link, lidx) => (
                  <li key={lidx}>
                    <Link href={link.href}>
                      <span>{link.label}</span>
                    </Link>
                    <div className={styles.desc}>{link.desc}</div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
