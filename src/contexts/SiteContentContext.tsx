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
  
  hydraIntroTitle: "The complete virtual audio patchbay.",
  hydraIntroSub: "Eight virtual audio bridges and a visual Matrix Grid for macOS.",
  hydraCarouselTitle: "Professional routing features built into every bridge.",
  hydraCarouselSub: "Hydra empowers your studio with cross-point patching, hardware ASRC, and network streaming.",
  hydraCarouselItems: [
    {
      id: "1",
      title: "Eight Hydra Audio Bridges",
      description: "2 to 128 channels each, up to 256 channels total — any app can select a bridge as its input or output.",
    },
    {
      id: "2",
      title: "Hardware ASRC",
      description: "Drift-corrected sample rate conversion keeps physical interfaces on independent clocks perfectly in sync.",
    },
    {
      id: "3",
      title: "AES67 & NDI Network Audio",
      description: "Subscribe to PTP-synced AES67 streams and NDI sources over local Ethernet directly into the grid.",
    },
    {
      id: "4",
      title: "Control Room Monitor",
      description: "DIM, MONO, SWAP L/R, MUTE and TALKBACK MIC, plus a floating always-on-top Studio HUD.",
    },
  ],
  hydraPerfTitle: "Built for demanding studios.",
  hydraPerfSub: "Hydra's native Core Audio driver adds 0ms of latency, with out-of-process VST3 hosting keeping a crashing plugin from ever taking down your session.",

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
