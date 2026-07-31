"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./TypedHeader.module.scss";

export function TypedHeader({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  const [shown, setShown] = useState("");
  const reduced = useRef(false);

  useEffect(() => {
    reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced.current) {
      setShown(text);
      return;
    }

    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      setShown(text.slice(0, i));
      if (i >= text.length) window.clearInterval(id);
    }, 28);

    return () => window.clearInterval(id);
  }, [text]);

  return (
    <span className={`${styles.wrap} ${className}`}>
      <span className="sr-only">{text}</span>
      <span aria-hidden className={styles.visible}>
        {shown}
        <span className={styles.cursor} />
      </span>
    </span>
  );
}
