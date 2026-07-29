"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
}

interface AuthContextValue {
  user: User | null;
  isLoggedIn: boolean;
  login: (email: string) => void;
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
        setUser(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse auth session:", e);
      }
    }
    setIsInitialized(true);
  }, []);

  const login = (email: string) => {
    // Check if admin email or regular user
    const isAdmin = email.toLowerCase().includes("admin") || email.toLowerCase() === "samuel@quadraaudio.com";

    const sessionUser: User = {
      id: "usr_" + Math.random().toString(36).substring(2, 9),
      name: email.split("@")[0] || "User",
      email: email,
      role: isAdmin ? "admin" : "user",
    };

    setUser(sessionUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessionUser));
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
