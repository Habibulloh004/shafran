"use client";

import { useTranslation, LOCALES, LOCALE_NAMES, LOCALE_FLAGS } from "@/i18n";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";

export default function LanguageSwitcher({ variant = "default" }) {
  const { locale, setLocale } = useTranslation();

  if (variant === "compact") {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10"
          >
            <span className="text-sm font-medium uppercase">{locale}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-[140px]">
          {LOCALES.map((loc) => (
            <DropdownMenuItem
              key={loc}
              onClick={() => setLocale(loc)}
              className={`flex items-center gap-2 cursor-pointer ${
                locale === loc ? "bg-accent font-medium" : ""
              }`}
            >
              <span>{LOCALE_FLAGS[loc]}</span>
              <span>{LOCALE_NAMES[loc]}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5 h-8 sm:h-9 md:h-10 px-2 sm:px-3"
        >
          <Globe className="w-4 h-4" />
          <span className="text-xs sm:text-sm font-medium uppercase">
            {locale}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[160px]">
        {LOCALES.map((loc) => (
          <DropdownMenuItem
            key={loc}
            onClick={() => setLocale(loc)}
            className={`flex items-center gap-2 cursor-pointer ${
              locale === loc ? "bg-accent font-medium" : ""
            }`}
          >
            <span>{LOCALE_FLAGS[loc]}</span>
            <span>{LOCALE_NAMES[loc]}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
