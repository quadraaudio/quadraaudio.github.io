"use client";

import { useEffect } from "react";
import { useTheme } from "./ThemeContext";

interface ThemeSetterProps {
  theme: "light" | "dark";
}

/**
 * A headless utility component that pages can drop in to 
 * announce their theme to the global context.
 */
export default function ThemeSetter({ theme }: ThemeSetterProps) {
  const { setTheme } = useTheme();

  useEffect(() => {
    // Announce this page's theme to the global headers/footers
    setTheme(theme);
    
    // Cleanup: when leaving this page, always revert to the safe default (light)
    return () => {
      setTheme("light");
    };
  }, [theme, setTheme]);

  return null;
}
