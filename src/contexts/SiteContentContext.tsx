"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface CarouselItemData {
  id: string;
  title: string;
  description: string;
}

export interface PageContent {
  // Home Page
  homeHeroTitle: string;
  homeHeroSub: string;
  
  // Hydra Page
  hydraIntroTitle: string;
  hydraIntroSub: string;
  hydraCarouselTitle: string;
  hydraCarouselSub: string;
  hydraCarouselItems: CarouselItemData[];
  hydraPerfTitle: string;
  hydraPerfSub: string;

  // Store Page
  storeTitle: string;
  storeSub: string;
}

const defaultContent: PageContent = {
  homeHeroTitle: "Quadra",
  homeHeroSub: "The new standard in virtual audio routing.",
  
  hydraIntroTitle: "No limits.",
  hydraIntroSub: "The first ever 32-bit float audio interface with infinite digital headroom.",
  hydraCarouselTitle: "The power is in the details.",
  hydraCarouselSub: "Hydra stimulates your creativity with an enormous variety of capabilities.",
  hydraCarouselItems: [
    {
      id: "1",
      title: "192kHz / 32-bit Float",
      description: "Pristine audio engine preserving full dynamic range without clipping.",
    },
    {
      id: "2",
      title: "System-wide Capture",
      description: "Isolate and capture audio from any specific app on your machine.",
    },
    {
      id: "3",
      title: "Hardware Inserts",
      description: "Route outboard gear into your DAW like virtual plugins instantly.",
    },
    {
      id: "4",
      title: "MIDI Translation",
      description: "Map and route complex MIDI CC messages alongside audio streams.",
    },
  ],
  hydraPerfTitle: "A new level of performance.",
  hydraPerfSub: "Hydra on Quadra silicon effortlessly handles massive multichannel setups with sub-millisecond latency. No dropped frames. No artifacts.",

  storeTitle: "Store.",
  storeSub: "The best way to equip your studio.",
};

interface SiteContentContextValue {
  content: PageContent;
  updateContent: (fields: Partial<PageContent>) => void;
  addCarouselCard: (title: string, description: string) => void;
  removeCarouselCard: (id: string) => void;
  resetContent: () => void;
}

const STORAGE_KEY = "quadra_site_content_v1";

const SiteContentContext = createContext<SiteContentContextValue | null>(null);

export function SiteContentProvider({ children }: { children: React.ReactNode }) {
  const [content, setContent] = useState<PageContent>(defaultContent);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setContent(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved site content:", e);
      }
    }
  }, []);

  const saveContent = (newContent: PageContent) => {
    setContent(newContent);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newContent));
  };

  const updateContent = (fields: Partial<PageContent>) => {
    const updated = { ...content, ...fields };
    saveContent(updated);
  };

  const addCarouselCard = (title: string, description: string) => {
    const newCard: CarouselItemData = {
      id: Date.now().toString(),
      title,
      description,
    };
    const updatedItems = [...content.hydraCarouselItems, newCard];
    saveContent({ ...content, hydraCarouselItems: updatedItems });
  };

  const removeCarouselCard = (id: string) => {
    const updatedItems = content.hydraCarouselItems.filter((item) => item.id !== id);
    saveContent({ ...content, hydraCarouselItems: updatedItems });
  };

  const resetContent = () => {
    saveContent(defaultContent);
  };

  return (
    <SiteContentContext.Provider
      value={{ content, updateContent, addCarouselCard, removeCarouselCard, resetContent }}
    >
      {children}
    </SiteContentContext.Provider>
  );
}

export function useSiteContent() {
  const ctx = useContext(SiteContentContext);
  if (!ctx) throw new Error("useSiteContent must be used within SiteContentProvider");
  return ctx;
}
