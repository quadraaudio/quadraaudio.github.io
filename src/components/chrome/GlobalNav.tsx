"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import { useCart } from "@/components/providers/CartProvider";
import { LogoMark } from "@/components/chrome/LogoMark";
import styles from "./GlobalNav.module.scss";

/** Top-level product links — Apple-style primary product bar. */
const PRIMARY_PRODUCTS = [
  { href: "/products/hydra", label: "Hydra" },
  { href: "/store/quadra-channel", label: "Channel" },
  { href: "/store/quadra-dynamics", label: "Dynamics" },
  { href: "/store/quadra-studio-bundle", label: "Bundle" },
];

const RESOURCE_LINKS = [
  { href: "/support", label: "Support" },
  { href: "/contact", label: "Contact" },
  { href: "/about", label: "About" },
  { href: "/legal/terms", label: "Legal" },
];

export function GlobalNav() {
  const { user, isLoading, logout } = useAuth();
  const { itemCount } = useCart();
  const pathname = usePathname() || "/";
  const router = useRouter();
  const [open, setOpen] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const loginHref = `/login?returnTo=${encodeURIComponent(pathname)}`;

  async function onLogout() {
    await logout();
    router.refresh();
  }

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ""}`}>
      <div className={`page-shell ${styles.inner}`}>
        <Link href="/" className={styles.logo} aria-label="Quadra home">
          <LogoMark withWordmark size="md" />
        </Link>

        <nav className={styles.nav} aria-label="Primary">
          {PRIMARY_PRODUCTS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`${styles.link} ${isActive(link.href) ? styles.linkActive : ""}`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/store"
            className={`${styles.link} ${isActive("/store") && !PRIMARY_PRODUCTS.some((p) => isActive(p.href)) ? styles.linkActive : ""}`}
          >
            Store
          </Link>
          <div
            className={styles.item}
            onMouseEnter={() => setOpen("resources")}
            onMouseLeave={() => setOpen(null)}
          >
            <button
              type="button"
              className={styles.trigger}
              aria-expanded={open === "resources"}
            >
              Resources
            </button>
            {open === "resources" && (
              <div className={styles.dropdown}>
                {RESOURCE_LINKS.map((link) => (
                  <Link key={link.href} href={link.href} className={styles.dropLink}>
                    {link.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </nav>

        <div className={styles.actions}>
          <Link href="/store/bag" className={styles.bag} aria-label="Shopping bag">
            Bag{itemCount > 0 ? ` (${itemCount})` : ""}
          </Link>
          {isLoading ? (
            <span className={styles.linkQuiet} aria-hidden>
              …
            </span>
          ) : user ? (
            <>
              <Link href="/account" className={styles.linkQuiet}>
                Account
              </Link>
              <button type="button" className="btn btn-secondary" onClick={onLogout}>
                Log out
              </button>
            </>
          ) : (
            <Link href={loginHref} className="btn btn-primary">
              Sign in with Google
            </Link>
          )}
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
          {PRIMARY_PRODUCTS.map((link) => (
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
          <Link href="/store" onClick={() => setMobileOpen(false)}>
            Store
          </Link>
          <Link href="/about" onClick={() => setMobileOpen(false)}>
            About
          </Link>
          <Link href="/support" onClick={() => setMobileOpen(false)}>
            Support
          </Link>
          <Link href="/contact" onClick={() => setMobileOpen(false)}>
            Contact
          </Link>
          <Link href="/store/bag" onClick={() => setMobileOpen(false)}>
            Bag{itemCount > 0 ? ` (${itemCount})` : ""}
          </Link>
          {isLoading ? null : user ? (
            <>
              <Link href="/account" onClick={() => setMobileOpen(false)}>
                Account
              </Link>
              <button type="button" onClick={onLogout}>
                Log out
              </button>
            </>
          ) : (
            <Link href={loginHref} onClick={() => setMobileOpen(false)}>
              Sign in with Google
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
