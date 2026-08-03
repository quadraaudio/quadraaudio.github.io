"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import { useCart } from "@/components/providers/CartProvider";
import { LogoMark } from "@/components/chrome/LogoMark";
import { BagIcon } from "@/components/chrome/BagIcon";
import styles from "./GlobalNav.module.scss";

/** After logo: Store first, products, Support last before actions. */
const NAV_LINKS = [
  { href: "/store", label: "Store" },
  { href: "/products/matrix", label: "MATRIX" },
  { href: "/support", label: "Support" },
];

type Props = {
  /** MATRIX page: slide Quadra away so product chrome can own the top slot. */
  swapHidden?: boolean;
};

export function GlobalNav({ swapHidden = false }: Props) {
  const { user, isLoading } = useAuth();
  const { itemCount } = useCart();
  const pathname = usePathname() || "/";
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (swapHidden) setMobileOpen(false);
  }, [swapHidden]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const accountHref = user
    ? "/account"
    : `/login?returnTo=${encodeURIComponent(pathname)}`;

  // isLoading kept for mobile account gate consistency
  void isLoading;

  function isActive(href: string) {
    if (href === "/store") {
      return (
        pathname === "/store" ||
        pathname === "/store/" ||
        (pathname.startsWith("/store/") &&
          !NAV_LINKS.some(
            (l) =>
              l.href !== "/store" &&
              (pathname === l.href || pathname.startsWith(`${l.href}/`)),
          ))
      );
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <header
      className={`${styles.header} ${scrolled ? styles.scrolled : ""} ${swapHidden ? styles.swapAway : ""}`}
      aria-hidden={swapHidden || undefined}
    >
      <div className={`page-shell ${styles.inner}`}>
        <Link href="/" className={styles.logo} aria-label="Quadra home">
          <LogoMark size="md" />
        </Link>

        <nav className={styles.nav} aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`${styles.link} ${isActive(link.href) ? styles.linkActive : ""}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className={styles.actions}>
          <Link
            href={accountHref}
            className={`${styles.link} ${pathname.startsWith("/account") || pathname.startsWith("/login") ? styles.linkActive : ""}`}
          >
            Account
          </Link>
          <Link
            href="/store/bag"
            className={styles.bag}
            aria-label={
              itemCount > 0 ? `Shopping bag, ${itemCount} items` : "Shopping bag"
            }
          >
            <BagIcon className={styles.bagIcon} />
            {itemCount > 0 ? (
              <span className={styles.bagCount}>{itemCount}</span>
            ) : null}
          </Link>
          <button
            type="button"
            className={styles.menuBtn}
            aria-label="Open menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
          >
            <span />
            <span />
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className={styles.mobile}>
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={isActive(link.href) ? styles.mobileActive : undefined}
            >
              {link.label}
            </Link>
          ))}
          <Link href="/products" onClick={() => setMobileOpen(false)}>
            All products
          </Link>
          <Link href="/about" onClick={() => setMobileOpen(false)}>
            About
          </Link>
          <Link href="/contact" onClick={() => setMobileOpen(false)}>
            Contact
          </Link>
          {!isLoading && (
            <Link href={accountHref} onClick={() => setMobileOpen(false)}>
              Account
            </Link>
          )}
          <Link
            href="/store/bag"
            className={styles.mobileBag}
            onClick={() => setMobileOpen(false)}
            aria-label={
              itemCount > 0 ? `Shopping bag, ${itemCount} items` : "Shopping bag"
            }
          >
            <BagIcon className={styles.bagIcon} />
            <span>Bag{itemCount > 0 ? ` (${itemCount})` : ""}</span>
          </Link>
        </div>
      )}
    </header>
  );
}
