"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useCart } from "@/components/providers/CartProvider";
import styles from "./GlobalNav.module.scss";

const PRODUCT_LINKS = [
  { href: "/products", label: "Overview" },
  { href: "/store/quadra-channel", label: "Quadra Channel" },
  { href: "/store/quadra-dynamics", label: "Quadra Dynamics" },
  { href: "/store/quadra-studio-bundle", label: "Studio Bundle" },
];

const RESOURCE_LINKS = [
  { href: "/support", label: "Support" },
  { href: "/contact", label: "Contact" },
  { href: "/about", label: "About" },
  { href: "/legal/terms", label: "Legal" },
];

export function GlobalNav() {
  const { user } = useUser();
  const { itemCount } = useCart();
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

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ""}`}>
      <div className={`page-shell ${styles.inner}`}>
        <Link href="/" className={styles.logo} aria-label="Quadra home">
          <span className={styles.mark} aria-hidden />
          <span className={styles.word}>Quadra</span>
        </Link>

        <nav className={styles.nav} aria-label="Primary">
          <div
            className={styles.item}
            onMouseEnter={() => setOpen("products")}
            onMouseLeave={() => setOpen(null)}
          >
            <button
              type="button"
              className={styles.trigger}
              aria-expanded={open === "products"}
            >
              Products
            </button>
            {open === "products" && (
              <div className={styles.dropdown}>
                {PRODUCT_LINKS.map((link) => (
                  <Link key={link.href} href={link.href} className={styles.dropLink}>
                    {link.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
          <Link href="/store" className={styles.link}>
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
          {user ? (
            <>
              <Link href="/account" className={styles.linkQuiet}>
                Account
              </Link>
              <a href="/auth/logout" className="btn btn-secondary">
                Log out
              </a>
            </>
          ) : (
            <a href="/auth/login" className="btn btn-primary">
              Sign in
            </a>
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
          <Link href="/products" onClick={() => setMobileOpen(false)}>
            Products
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
          {user ? (
            <>
              <Link href="/account" onClick={() => setMobileOpen(false)}>
                Account
              </Link>
              <a href="/auth/logout">Log out</a>
            </>
          ) : (
            <a href="/auth/login">Sign in</a>
          )}
        </div>
      )}
    </header>
  );
}
