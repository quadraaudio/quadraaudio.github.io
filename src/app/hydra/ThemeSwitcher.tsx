"use client";

import { useEffect } from 'react';

interface ThemeSwitcherProps {
  forceTheme?: 'light' | 'dark';
}

export default function ThemeSwitcher({ forceTheme = 'dark' }: ThemeSwitcherProps) {
  useEffect(() => {
    if (forceTheme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme'); // default is light
    }
    
    return () => {
      // Optional: Reset to light on unmount if it was forcing dark
      document.documentElement.removeAttribute('data-theme');
    };
  }, [forceTheme]);
  
  return null;
}
