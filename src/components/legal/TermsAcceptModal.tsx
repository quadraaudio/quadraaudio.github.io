"use client";

import Link from "next/link";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import {
  TERMS_EFFECTIVE_DATE,
  TERMS_INTRO,
  TERMS_SECTIONS,
  TERMS_TITLE,
  TERMS_VERSION,
} from "@/data/terms.eula";
import { acceptCurrentTerms } from "@/lib/termsAcceptance";
import styles from "./TermsAcceptModal.module.scss";

type Props = {
  open: boolean;
  onAccepted: () => void;
  onDismiss?: () => void;
};

const SCROLL_BOTTOM_PX = 28;

export function TermsAcceptModal({ open, onAccepted, onDismiss }: Props) {
  const titleId = useId();
  const bodyRef = useRef<HTMLDivElement>(null);
  const [reachedEnd, setReachedEnd] = useState(false);

  const checkScroll = useCallback(() => {
    const el = bodyRef.current;
    if (!el) return;
    const remaining = el.scrollHeight - el.scrollTop - el.clientHeight;
    if (remaining <= SCROLL_BOTTOM_PX) {
      setReachedEnd(true);
    }
  }, []);

  useEffect(() => {
    if (!open) {
      setReachedEnd(false);
      return;
    }
    const el = bodyRef.current;
    if (!el) return;
    setReachedEnd(false);
    // Short content or already at bottom
    requestAnimationFrame(() => {
      checkScroll();
    });
    el.focus();
  }, [open, checkScroll]);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  if (!open) return null;

  function handleAccept() {
    if (!reachedEnd) return;
    acceptCurrentTerms();
    onAccepted();
  }

  return (
    <div className={styles.overlay} role="presentation">
      <div
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <header className={styles.header}>
          <p className={styles.eyebrow}>Required</p>
          <h2 id={titleId}>{TERMS_TITLE}</h2>
          <p className={styles.meta}>
            Version {TERMS_VERSION} · Effective {TERMS_EFFECTIVE_DATE}. Scroll to
            the end to enable Accept.
          </p>
        </header>

        <div
          ref={bodyRef}
          className={styles.body}
          onScroll={checkScroll}
          tabIndex={0}
        >
          {TERMS_INTRO.map((paragraph, index) => (
            <p key={`intro-${index}`}>{paragraph}</p>
          ))}
          {TERMS_SECTIONS.map((section) => (
            <section key={section.id}>
              <h3>{section.heading}</h3>
              {section.paragraphs.map((paragraph, index) => (
                <p key={`${section.id}-${index}`}>{paragraph}</p>
              ))}
            </section>
          ))}
        </div>

        <footer className={styles.footer}>
          {!reachedEnd ? (
            <p className={styles.hint} role="status">
              Keep scrolling to review the full agreement.
            </p>
          ) : (
            <p className={styles.hintReady} role="status">
              You reached the end. You may accept.
            </p>
          )}
          <div className={styles.actions}>
            <Link
              href="/legal/terms"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.openLink}
            >
              Open full page
            </Link>
            {onDismiss ? (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onDismiss}
              >
                Cancel
              </button>
            ) : null}
            <button
              type="button"
              className="btn btn-primary"
              disabled={!reachedEnd}
              onClick={handleAccept}
            >
              I have read and accept
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}
