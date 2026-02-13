"use client";

import { useLanguage } from "@/lib/language-context";
import { cn } from "@/lib/utils";

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center bg-muted rounded-full p-1">
      <button
        onClick={() => setLanguage("en")}
        className={cn(
          "px-3 py-1.5 rounded-full text-xs font-medium animation-standard",
          language === "en"
            ? "bg-tertiary text-tertiary-foreground"
            : "text-paragraph hover:text-heading"
        )}
      >
        EN
      </button>
      <button
        onClick={() => setLanguage("ur")}
        className={cn(
          "px-3 py-1.5 rounded-full text-xs font-medium animation-standard",
          language === "ur"
            ? "bg-tertiary text-tertiary-foreground"
            : "text-paragraph hover:text-heading"
        )}
        style={language === "ur" ? {} : {}}
      >
        اردو
      </button>
    </div>
  );
}
