import Link from "next/link";
import ThemeSwitcher from "@/app/hydra/ThemeSwitcher";
import styles from "./page.module.scss";

export const metadata = {
  title: "Site Map — Quadra Audio Directory",
  description: "Complete navigation index of all Quadra Audio pages, products, documentation, and support topics.",
};

const sitemapData = [
  {
    title: "Quadra Platform & Products",
    links: [
      { label: "Quadra Home", href: "/", desc: "Core Audio engine overview" },
      { label: "Hydra Overview", href: "/hydra", desc: "256-Channel virtual soundcard & matrix" },
      { label: "Virtual Patchbay Tools", href: "/hydra#tools", desc: "Application process capture & driver fusion" },
      { label: "NDI® & AVB Network Audio", href: "/hydra#network", desc: "Multichannel Ethernet AoIP streaming" },
      { label: "Spatial Audio 9.4.6", href: "/hydra#spatial", desc: "Dolby Atmos & HRTF head tracking" },
      { label: "System Specifications", href: "/hydra#specs", desc: "macOS requirements & C++ DSP architecture" },
    ],
  },
  {
    title: "Store & Licensing",
    links: [
      { label: "Quadra Store", href: "/store", desc: "Browse software licenses & free trial" },
      { label: "Buy Hydra ($199.99)", href: "/store/buy-hydra", desc: "Direct purchase shortcut" },
      { label: "Shopping Bag", href: "/store/bag", desc: "Cart summary & promotional coupons" },
      { label: "Checkout Gate", href: "/store/checkout/gate", desc: "Quadra ID & Google OAuth sign in" },
      { label: "Express Payment", href: "/store/checkout/payment", desc: "PayPal, Card & $0 promo order desk" },
    ],
  },
  {
    title: "Quadra ID & Accounts",
    links: [
      { label: "Account Dashboard", href: "/account", desc: "Manage machine activations & software keys" },
      { label: "Offline Key (.qkey)", href: "/account", desc: "Generate air-gapped studio licenses" },
      { label: "Quadra ID Sign In", href: "/login", desc: "Authentication & security portal" },
    ],
  },
  {
    title: "Support & Knowledge Base",
    links: [
      { label: "Support Desk", href: "/support", desc: "Knowledge base & search index" },
      { label: "Configuring NDI® Audio", href: "/support/article/configuring-ndi", desc: "Ethernet AoIP network setup guide" },
      { label: "License Activation Guide", href: "/support/article/license-activation", desc: "2-Mac machine authorization rules" },
      { label: "Buffer Optimization", href: "/support/article/optimizing-buffer", desc: "Preventing xruns & Core Audio dropouts" },
      { label: "GroundControl Fusion", href: "/support/article/groundcontrol-fusion", desc: "Hardware interface aggregation" },
      { label: "Dolby Atmos 9.4.6", href: "/support/article/dolby-atmos-916", desc: "Spatial monitoring configuration" },
      { label: "Engineering Help Desk", href: "/support/contact", desc: "Direct specialist support ticket form" },
    ],
  },
  {
    title: "Legal & Corporate",
    links: [
      { label: "Privacy Policy", href: "/legal/privacy", desc: "CCPA/CPRA data protection & privacy" },
      { label: "Terms of Use & EULA", href: "/legal/terms", desc: "Software license agreement & US EAR compliance" },
      { label: "Sales & Refunds", href: "/legal/refunds", desc: "14-Day money back guarantee" },
      { label: "Site Map Directory", href: "/sitemap-page", desc: "Complete website directory index" },
    ],
  },
];

export default function SiteMapPage() {
  return (
    <div className={styles.sitemapPage}>
      <ThemeSwitcher forceTheme="light" />

      <div className={styles.sitemapHeaderContainer}>
        <div className={styles.sitemapHeaderContent}>
          <span className={styles.sitemapEyebrow}>Quadra Navigation Directory</span>
          <h1 className={styles.sitemapTitle}>Site Map</h1>
          <p className={styles.sitemapSub}>
            Complete index of all Quadra Audio products, support guides, store checkout flows, and legal documentation.
          </p>
        </div>
      </div>

      <div className={styles.sitemapGridContainer}>
        <div className={styles.sitemapGrid}>
          {sitemapData.map((section, idx) => (
            <div key={idx} className={styles.sitemapColumn}>
              <h2 className={styles.columnTitle}>{section.title}</h2>
              <ul className={styles.linkList}>
                {section.links.map((link, lidx) => (
                  <li key={lidx} className={styles.linkItem}>
                    <Link href={link.href} className={styles.itemLink}>
                      <span className={styles.linkLabel}>{link.label}</span>
                      <span className={styles.linkArrow}>›</span>
                    </Link>
                    <span className={styles.linkDesc}>{link.desc}</span>
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
