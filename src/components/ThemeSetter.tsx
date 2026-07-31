"use client";

import { useEffect } from "react";
import { useTheme } from "./ThemeContext";

interface ThemeSetterProps {
  theme: "light" | "dark";
}

/** Headless component pages drop in to announce their theme to the nav/footer. */
export default function ThemeSetter({ theme }: ThemeSetterProps) {
  const { setTheme } = useTheme();

  useEffect(() => {
    setTheme(theme);
    return () => {
      setTheme("light");
    };
  }, [theme, setTheme]);

  return null;
}
