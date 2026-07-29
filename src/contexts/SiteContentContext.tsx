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
  homeHeroTitle: "Hydra",
  homeHeroSub: "Virtual soundcard and audio matrix software for Mac.",
  
  hydraIntroTitle: "Sound thinking. Endless routing.",
  hydraIntroSub: "The premier virtual soundcard and multichannel audio routing software for macOS.",
  hydraCarouselTitle: "Professional routing features built into every channel.",
  hydraCarouselSub: "Hydra empowers your studio with uncompressed audio patching, driver fusion, and network streaming.",
  hydraCarouselItems: [
    {
      id: "1",
      title: "256-Channel Matrix",
      description: "Route audio uncompressed between DAWs, virtual devices, and system apps with sub-millisecond buffer speeds.",
    },
    {
      id: "2",
      title: "GroundControl Driver Fusion",
      description: "Combine multiple physical audio interfaces into a single unified driver without aggregate clock drift.",
    },
    {
      id: "3",
      title: "NDI® & AVB Network Audio",
      description: "Stream up to 128 NDI channels and 256 AVB channels over local Ethernet to any Mac or broadcast receiver.",
    },
    {
      id: "4",
      title: "Spatial Audio 9.1.6",
      description: "Monitor Dolby Atmos mixes with integrated HRTF head-tracking binaural renderers and sub-bass management.",
    },
  ],
  hydraPerfTitle: "Unprecedented performance for demanding studios.",
  hydraPerfSub: "Hydra on Quadra silicon effortlessly handles massive multichannel setups with 0ms added driver latency. No dropped frames. No artifacts.",

  storeTitle: "Store.",
  storeSub: "Equip your studio with Hydra software.",
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
