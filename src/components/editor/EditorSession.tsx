"use client";

import { createContext, useContext, type ReactNode } from "react";

interface EditorSessionValue {
  email?: string;
  logout: () => void;
}

const EditorSessionContext = createContext<EditorSessionValue | null>(null);

export function EditorSessionProvider({
  email,
  logout,
  children,
}: {
  email?: string;
  logout: () => void;
  children: ReactNode;
}) {
  return (
    <EditorSessionContext.Provider value={{ email, logout }}>
      {children}
    </EditorSessionContext.Provider>
  );
}

export function useEditorSession(): EditorSessionValue {
  const ctx = useContext(EditorSessionContext);
  if (!ctx) {
    throw new Error("useEditorSession must be used within EditorSessionProvider");
  }
  return ctx;
}
