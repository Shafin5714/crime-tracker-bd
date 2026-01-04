"use client";

import * as React from "react";
import { useLocale } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Languages, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const locales = [
  { code: "en", name: "English", nativeName: "English", flag: "🇺🇸" },
  { code: "bn", name: "Bengali", nativeName: "বাংলা", flag: "🇧🇩" },
] as const;

type LocaleCode = (typeof locales)[number]["code"];

interface LanguageSwitcherProps {
  className?: string;
  variant?: "default" | "compact";
}

export function LanguageSwitcher({
  className,
  variant = "default",
}: LanguageSwitcherProps) {
  const currentLocale = useLocale() as LocaleCode;

  const handleLocaleChange = (locale: LocaleCode) => {
    // Store the locale preference in cookie
    document.cookie = `NEXT_LOCALE=${locale};path=/;max-age=31536000`;
    // Reload the page to apply the new locale
    window.location.reload();
  };

  const currentLocaleData = locales.find((l) => l.code === currentLocale);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size={variant === "compact" ? "icon-sm" : "sm"}
          className={cn("gap-2", className)}
        >
          {variant === "compact" ? (
            <Languages className="size-4" />
          ) : (
            <>
              <span className="text-base">{currentLocaleData?.flag}</span>
              <span className="hidden sm:inline">{currentLocaleData?.nativeName}</span>
              <Languages className="size-4 sm:hidden" />
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {locales.map((locale) => (
          <DropdownMenuItem
            key={locale.code}
            onClick={() => handleLocaleChange(locale.code)}
            className="cursor-pointer justify-between"
          >
            <span className="flex items-center gap-2">
              <span className="text-base">{locale.flag}</span>
              <span>{locale.nativeName}</span>
            </span>
            {currentLocale === locale.code && (
              <Check className="size-4 text-primary" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default LanguageSwitcher;
