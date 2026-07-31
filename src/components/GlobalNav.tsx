"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "./ThemeContext";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import styles from "./GlobalNav.module.scss";

// Define the content for our Mega Menus
const menuData = {
  store: {
    columns: [
      {
        title: "Shop",
        links: [
          { label: "Shop Store", href: "/store", large: true },
          { label: "Hydra Software", href: "/hydra", large: true },
          { label: "Virtual Patchbay", href: "/hydra#tools", large: true },
          { label: "Commercial Licenses", href: "/store", large: true },
        ]
      },
      {
        title: "Quick Links",
        links: [
          { label: "Try Free for 90 Days", href: "/store", large: false },
          { label: "Order Status", href: "/account", large: false },
        ]
      }
    ]
  },
  hydra: {
    columns: [
      {
        title: "Explore Hydra",
        links: [
          { label: "Overview", href: "/hydra#overview", large: true },
          { label: "The Matrix Grid", href: "/hydra#tools", large: true },
          { label: "AES67 & NDI Network Audio", href: "/hydra#network", large: true },
          { label: "Control Room Monitor", href: "/hydra#control-room", large: true },
        ]
      },
      {
        title: "Resources",
        links: [
          { label: "Hydra Support", href: "/support", large: false },
          { label: "System Requirements", href: "/hydra#specs", large: false },
          { label: "Documentation & Driver Guide", href: "/support", large: false },
        ]
      }
    ]
  },
  support: {
    columns: [
      {
        title: "Explore Support",
        links: [
          { label: "Hydra Setup Guide", href: "/support", large: true },
          { label: "Virtual Drivers", href: "/support", large: true },
          { label: "Quadra ID & Licenses", href: "/support", large: true },
        ]
      },
      {
        title: "Get Help",
        links: [
          { label: "Community Forum", href: "/support", large: false },
          { label: "Contact Engineering Support", href: "/support", large: false },
        ]
      }
    ]
  }
};


export default function GlobalNav() {
  const pathname = usePathname();
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isHidden, setIsHidden] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { theme } = useTheme();
  const { totalCount } = useCart();
  const { isLoggedIn } = useAuth();

  if (pathname?.startsWith("/edit")) {
    return null;
  }

  // Scroll logic to hide/show Global Nav
  useEffect(() => {
    let lastScrollY = window.scrollY;
    
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // If we scroll down past the nav height (44px), hide it
      if (currentScrollY > lastScrollY && currentScrollY > 44) {
        setIsHidden(true);
        document.body.classList.add("global-nav-hidden");
      } 
      // If we scroll up, show it again
      else if (currentScrollY < lastScrollY) {
        setIsHidden(false);
        document.body.classList.remove("global-nav-hidden");
      }
      
      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    
    // Cleanup
    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.body.classList.remove("global-nav-hidden");
    };
  }, []);

  // Handlers for hover logic
  const handleMouseEnter = (menuName: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveMenu(menuName);
  };

  const handleMouseLeave = () => {
    // Add a small delay so moving between nav items or to the tray doesn't cause flickering
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setActiveMenu(null);
    }, 150);
  };

  const activeContent = activeMenu ? menuData[activeMenu as keyof typeof menuData] : null;

  // Determine if the nav should be in dark mode
  // The nav is ONLY dark if the page context requests it AND the mega menu is NOT open.
  const isDarkMode = theme === 'dark' && !activeMenu;

  return (
    <>
      {/* The main 44px Navigation Bar */}
      <nav 
        className={`${styles.navWrapper} ${isDarkMode ? styles.themeDark : styles.themeLight} ${activeMenu ? styles.menuOpen : ''} ${isHidden ? styles.hidden : ''}`}
        onMouseLeave={handleMouseLeave}
      >
        <div className={styles.navContainer}>
          <ul className={styles.navList}>
            {/* Quadra Logo (Home) */}
            <li className={styles.navItem} onMouseEnter={handleMouseLeave}>
              <Link href="/" className={styles.navLogo} aria-label="Quadra Home">
                <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M 0 25 A 25 25 0 0 1 25 0 L 75 0 A 25 25 0 0 1 100 25 L 100 100 L 25 100 A 25 25 0 0 1 0 75 Z M 35 43 A 8 8 0 0 1 43 35 L 57 35 A 8 8 0 0 1 65 43 L 65 65 L 43 65 A 8 8 0 0 1 35 57 Z" fill="currentColor"/>
                </svg>
              </Link>
            </li>

            {/* Main Links */}
            <li className={styles.navItem} onMouseEnter={() => handleMouseEnter('store')}>
              <Link href="/store" className={styles.navLink}>Store</Link>
            </li>
            
            <li className={styles.navItem} onMouseEnter={() => handleMouseEnter('hydra')}>
              <Link href="/hydra" className={styles.navLink}>Hydra</Link>
            </li>
            
            <li className={styles.navItem} onMouseEnter={() => handleMouseEnter('support')}>
              <Link href="/support" className={styles.navLink}>Support</Link>
            </li>
            
            <li className={styles.navItem} onMouseEnter={handleMouseLeave}>
              <Link href={isLoggedIn ? "/account" : "/login"} className={styles.navLink}>
                Account
              </Link>
            </li>
            
            {/* Bag Icon */}
            <li className={styles.navItem} onMouseEnter={handleMouseLeave}>
              <Link href="/store/bag" className={styles.navBagLink} aria-label="Shopping Bag">
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="16" viewBox="0 0 15 16" fill="currentColor">
                  <path d="M13.5 4.5H11.25C11.25 2.43 9.57 0.75 7.5 0.75C5.43 0.75 3.75 2.43 3.75 4.5H1.5C0.675 4.5 0 5.175 0 6V14.25C0 15.075 0.675 15.75 1.5 15.75H13.5C14.325 15.75 15 15.075 15 14.25V6C15 5.175 14.325 4.5 13.5 4.5ZM7.5 2.25C8.745 2.25 9.75 3.255 9.75 4.5H5.25C5.25 3.255 6.255 2.25 7.5 2.25ZM13.5 14.25H1.5V6H13.5V14.25Z"/>
                </svg>
                {totalCount > 0 && (
                  <span className={styles.bagCount}>{totalCount}</span>
                )}
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      {/* The Mega Menu Dropdown Tray */}
      <div 
        className={`${styles.megaMenuTray} ${activeMenu ? styles.open : ''}`}
        onMouseEnter={() => { if (timeoutRef.current) clearTimeout(timeoutRef.current); }}
        onMouseLeave={handleMouseLeave}
      >
        <div className={styles.trayContent}>
          {activeContent && activeContent.columns.map((col, idx) => (
            <div key={idx} className={styles.trayColumn}>
              <span className={styles.trayCategory}>{col.title}</span>
              {col.links.map((link, lidx) => (
                <Link 
                  key={lidx} 
                  href={link.href} 
                  className={link.large ? styles.trayLink : styles.traySmallLink}
                  onClick={() => setActiveMenu(null)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* The Blur Backdrop that covers the rest of the site */}
      <div 
        className={`${styles.backdrop} ${activeMenu ? styles.open : ''}`} 
        onMouseEnter={handleMouseLeave} /* Moving mouse out of tray to backdrop closes it */
      />
    </>
  );
}
