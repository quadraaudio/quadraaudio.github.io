"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from './ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import styles from './GlobalFooter.module.scss';

// Dynamic Directory Configuration
const footerDirectory = [
  {
    title: 'Explore Software',
    links: [
      { label: 'Hydra Software', url: '/hydra' },
      { label: 'Virtual Patchbay', url: '/hydra#tools' },
      { label: 'NDI Network Audio', url: '/hydra#network' },
      { label: 'Spatial Audio 9.1.6', url: '/hydra#spatial' },
    ]
  },
  {
    title: 'Account & License',
    links: [
      { label: 'Manage Quadra ID', url: '/account' },
      { label: 'License Portal', url: '/account' },
      { label: 'Commercial Subscriptions', url: '/store' },
    ]
  },
  {
    title: 'Quadra Store',
    links: [
      { label: 'Shop Licenses', url: '/store' },
      { label: 'Order Status', url: '/account' },
      { label: 'Software Help', url: '/support' },
    ]
  },
  {
    title: 'For Enterprise & Studios',
    links: [
      { label: 'Quadra for Broadcast', url: '/support' },
      { label: 'Volume Licensing', url: '/store' },
    ]
  },
  {
    title: 'Quadra Values',
    links: [
      { label: 'Accessibility', url: '/support' },
      { label: 'Environment', url: '/hydra#specs' },
      { label: 'Privacy', url: '/legal/privacy' },
    ]
  },
];

// Dynamic Footnotes based on route
const footnotesByPath: Record<string, string[]> = {
  '/': [
    '1. Quadra Audio reserves the right to change software specifications without notice.',
    '2. Quadra, Hydra, and the Quadra logo are registered trademarks of Quadra Audio Inc.',
  ],
  '/hydra': [
    '1. Performance testing conducted by Quadra Audio in 2026 using Mac Studio (M2 Ultra) systems in isolated 10GbE network environments.',
    '2. Network channel density (up to 256 AVB and 128 NDI® channels) depends on local network bandwidth and switch topology.',
    '3. An active Hydra license is required for multichannel virtual patchbay routing and 9.1.6 Dolby Atmos monitoring.',
    'NDI® is a registered trademark of Vizrt NDI AB. Dolby, Dolby Atmos, and the double-D symbol are registered trademarks of Dolby Laboratories.',
  ],
  '/store': [
    '1. Free 90-day trial activates instantly with a Quadra ID. No credit card required.',
    '2. Lifetime software updates included with single-purchase licenses.',
  ],
  '/account': [
    '1. Manage active machine activations and license transfers directly in your Quadra ID portal.',
  ]
};


export default function GlobalFooter() {
  const pathname = usePathname();
  const { theme } = useTheme();
  const { isLoggedIn } = useAuth();
  
  // Resolve footnotes for current path, fallback to empty array if no specific footnotes exist
  const currentFootnotes = footnotesByPath[pathname] || footnotesByPath['/'];

  return (
    <footer className={`${styles.globalFooter} ${theme === 'dark' ? styles.themeDark : ''}`}>
      <div className={styles.footerContent}>
        
        {/* Footnotes Section - Dynamically rendered based on route */}
        {currentFootnotes.length > 0 && (
          <section className={styles.footnotes}>
            <ul>
              {currentFootnotes.map((note, idx) => (
                <li key={idx}>{note}</li>
              ))}
            </ul>
          </section>
        )}

        {/* Directory Section */}
        <nav className={styles.directory}>
          {footerDirectory.map((column, colIdx) => (
            <div key={colIdx} className={styles.directoryColumn}>
              <h3 className={styles.columnTitle}>{column.title}</h3>
              <ul className={styles.columnList}>
                {column.links.map((link, linkIdx) => {
                  const targetUrl = link.label.includes("Quadra ID") || link.label.includes("Account") 
                    ? (isLoggedIn ? "/account" : "/login")
                    : link.url;

                  return (
                    <li key={linkIdx}>
                      <Link href={targetUrl}>{link.label}</Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Legal and Copyright Section */}
        <section className={styles.footerLegal}>
          <div className={styles.legalTop}>
            <p>More ways to shop: <Link href="/store" className={styles.textLink}>Find a Quadra Store</Link> or <Link href="/store" className={styles.textLink}>other retailer</Link> near you.</p>
          </div>
          
          <div className={styles.legalBottom}>
            <div className={styles.copyright}>
              Copyright © 2026 Quadra Audio Inc. All rights reserved.
            </div>
            
            <div className={styles.legalLinks}>
              <Link href="/legal/privacy">Privacy Policy</Link>
              <div className={styles.divider}></div>
              <Link href="/legal/terms">Terms of Use</Link>
              <div className={styles.divider}></div>
              <Link href="/legal/refunds">Sales and Refunds</Link>
              <div className={styles.divider}></div>
              <Link href="/sitemap-page">Site Map</Link>
            </div>
            
            <div className={styles.locale}>
              United States
            </div>
          </div>
        </section>

      </div>
    </footer>
  );
}
