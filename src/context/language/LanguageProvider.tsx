"use client";

import { createContext, useEffect, useState, ReactNode } from "react";
import { Language, LanguageContextType } from "./types";
import fr from "@/locales/fr.json";
import en from "@/locales/en.json";

const translations = { fr, en };

export const LanguageContext = createContext<LanguageContextType | null>(null);

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguageState] = useState<Language>("en");
  const [mounted, setMounted] = useState(false);

  // Load language from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language | null;
    if (savedLanguage && (savedLanguage === "fr" || savedLanguage === "en")) {
      setLanguageState(savedLanguage);
    }
    setMounted(true);
  }, []);

  // Save language to localStorage when it changes
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("language", lang);
  };

  // Translation function - flat key lookup
  const t = (key: string): string => {
    const dict = translations[language] as Record<string, string>;
    return dict[key] || key;
  };

  const contextValue: LanguageContextType = { language, setLanguage, t };

  // Always provide the context, even before hydration
  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
}
