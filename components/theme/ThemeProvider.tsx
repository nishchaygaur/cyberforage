"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { usePathname } from "next/navigation";

export type ThemeMode = "dark" | "light" | "system";
export type ResolvedTheme = "dark" | "light";

interface ThemeContextType {
  theme: ThemeMode;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const THEME_STORAGE_KEY = "cyberforage-theme";

function getSystemTheme(): ResolvedTheme {
  if (typeof window === "undefined") return "dark";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeMode>("system");
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>("dark");
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  // Apply theme to document element
  const applyTheme = useCallback((targetTheme: ThemeMode, forceDark = false) => {
    const resolved: ResolvedTheme = forceDark
      ? "dark"
      : targetTheme === "system"
      ? getSystemTheme()
      : targetTheme;

    setResolvedTheme(resolved);

    if (typeof document !== "undefined") {
      const root = document.documentElement;
      root.setAttribute("data-theme", resolved);
      if (resolved === "dark") {
        root.classList.add("dark");
        root.classList.remove("light");
      } else {
        root.classList.add("light");
        root.classList.remove("dark");
      }

      // Notify non-react listeners (e.g. Canvas Globe)
      window.dispatchEvent(
        new CustomEvent("cyberforage-theme-change", { detail: { theme: targetTheme, resolved } })
      );
    }
  }, []);

  // Initialize theme from localStorage on client mount
  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode | null;
      const initial: ThemeMode =
        saved === "dark" || saved === "light" || saved === "system" ? saved : "system";
      setThemeState(initial);
      applyTheme(initial, isAdmin);
    } catch {
      applyTheme("system", isAdmin);
    }
  }, [applyTheme, isAdmin]);

  // Handle route transitions between admin and public pages
  useEffect(() => {
    if (!mounted) return;
    applyTheme(theme, isAdmin);
  }, [isAdmin, theme, mounted, applyTheme]);

  // Listen to OS theme changes when System mode is active
  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      if (theme === "system") {
        applyTheme("system", isAdmin);
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme, isAdmin, applyTheme]);

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, newTheme);
    } catch {
      // Ignore localStorage errors (e.g. private browsing storage limits)
    }
    applyTheme(newTheme, isAdmin);
  };

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (!context) {
    // Graceful fallback if invoked outside ThemeProvider
    return {
      theme: "dark",
      resolvedTheme: "dark",
      setTheme: () => {},
    };
  }
  return context;
}
