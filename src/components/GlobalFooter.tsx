"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from './ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import styles from './GlobalFooter.module.scss';

// Dynamic Directory Configuration
const footerDirectory = [
  {
    title: 'Shop and Learn',
    links: [
      { label: 'Store', url: '/store' },
      { label: 'Hydra Pro', url: '/hydra' },
      { label: 'Accessories', url: '#' },
    ]
  },
  {
    title: 'Account',
    links: [
      { label: 'Manage Your Quadra ID', url: '/account' },
      { label: 'Quadra Store Account', url: '/account' },
    ]
  },
  {
    title: 'Quadra Store',
    links: [
      { label: 'Find a Store', url: '#' },
      { label: 'Order Status', url: '#' },
      { label: 'Shopping Help', url: '#' },
    ]
  },
  {
    title: 'For Business',
    links: [
      { label: 'Quadra and Business', url: '#' },
      { label: 'Shop for Your Business', url: '#' },
    ]
  },
  {
    title: 'Quadra Values',
    links: [
      { label: 'Accessibility', url: '#' },
      { label: 'Environment', url: '#' },
      { label: 'Privacy', url: '#' },
    ]
  },
];

// Dynamic Footnotes based on route
const footnotesByPath: Record<string, string[]> = {
  '/': [
    '1. Quadra Audio reserves the right to change specifications without notice.',
    '2. Quadra, Hydra, and the Quadra logo are registered trademarks of Quadra Audio Inc.',
  ],
  '/hydra': [
    '1. Testing conducted by Quadra in July 2026 using Mac Studio (M2 Ultra) systems in isolated gigabit network environments.',
    '2. Network latency and processing capacity (128 simultaneous channels) are dependent on local network infrastructure.',
    '3. An active Hydra Pro license is required for NDI® routing features and 9.1.6 Dolby Atmos support.',
    'Some features, third-party plugins, and protocols (like Dante) are subject to additional terms and hardware licenses.',
  ],
  '/store': [
    '1. Financing options are subject to credit approval and local credit card fees.',
    '2. Technical support included with purchase lasts 90 days from license activation.',
  ],
  '/account': [
    '1. Manage your active subscriptions and payment history directly in your Quadra Account portal.',
    'The resale of academic licenses is strictly prohibited.',
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
            <p>More ways to shop: <Link href="/store" className={styles.textLink}>Find a Quadra Store</Link> or <Link href="#" className={styles.textLink}>other retailer</Link> near you.</p>
          </div>
          
          <div className={styles.legalBottom}>
            <div className={styles.copyright}>
              Copyright © 2026 Quadra Audio Inc. All rights reserved.
            </div>
            
            <div className={styles.legalLinks}>
              <Link href="#">Privacy Policy</Link>
              <div className={styles.divider}></div>
              <Link href="#">Terms of Use</Link>
              <div className={styles.divider}></div>
              <Link href="#">Sales and Refunds</Link>
              <div className={styles.divider}></div>
              <Link href="#">Site Map</Link>
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
