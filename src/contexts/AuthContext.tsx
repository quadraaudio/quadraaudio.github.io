"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { syncLicenseToSupabase } from "@/lib/supabase";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  organization?: string;
  country?: string;
  phone?: string;
  authProvider?: "google" | "quadra";
}

interface AuthContextValue {
  user: User | null;
  isLoggedIn: boolean;
  login: (email: string, details?: Partial<User>) => void;
  logout: () => void;
}

const STORAGE_KEY = "quadra_auth_session_v1";

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setUser(parsed);
        // Sync license to Supabase on restore
        syncLicenseToSupabase(parsed.email, parsed.name);
      } catch (e) {
        console.error("Failed to parse auth session:", e);
      }
    }
    setIsInitialized(true);
  }, []);

  const login = (email: string, details?: Partial<User>) => {
    const isAdmin = email.toLowerCase().includes("admin") || email.toLowerCase() === "samuel@quadraaudio.com";
    const userName = details?.name || email.split("@")[0] || "User";

    const sessionUser: User = {
      id: details?.id || "usr_" + Math.random().toString(36).substring(2, 9),
      name: userName,
      email: email,
      role: isAdmin ? "admin" : "user",
      organization: details?.organization || "",
      country: details?.country || "United States",
      phone: details?.phone || "",
      authProvider: details?.authProvider || "quadra",
    };

    setUser(sessionUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessionUser));

    // Sync license directly into Supabase public.licenses table
    syncLicenseToSupabase(email, userName);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
