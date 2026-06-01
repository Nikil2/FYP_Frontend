"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import type { Language, LanguageContent } from "@/types/provider";
import { providerTranslations } from "@/lib/translations/provider";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: LanguageContent;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t: providerTranslations[language],
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
