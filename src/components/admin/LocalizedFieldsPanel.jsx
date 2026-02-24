"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { LOCALES } from "@/i18n";

const LOCALE_LABELS = {
  uz: "UZ",
  ru: "RU",
  en: "EN",
};

export default function LocalizedFieldsPanel({
  title,
  fields = [],
  values = {},
  onChange,
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const urlLocale = useMemo(() => {
    const lang = searchParams.get("lang");
    return LOCALES.includes(lang) ? lang : null;
  }, [searchParams]);

  const [activeLocale, setActiveLocale] = useState(urlLocale || "uz");

  const handleTabChange = (nextLocale) => {
    setActiveLocale(nextLocale);
    const params = new URLSearchParams(searchParams.toString());
    params.set("lang", nextLocale);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="space-y-4">
      {title && <h3 className="font-medium text-foreground">{title}</h3>}
      <Tabs value={activeLocale} onValueChange={handleTabChange}>
        <TabsList className="w-full">
          {LOCALES.map((locale) => (
            <TabsTrigger key={locale} value={locale} className="flex-1">
              {LOCALE_LABELS[locale] || locale.toUpperCase()}
            </TabsTrigger>
          ))}
        </TabsList>
        {LOCALES.map((locale) => (
          <TabsContent key={locale} value={locale} className="pt-4 space-y-4">
            {fields.map((field) => (
              <div key={field.key} className="space-y-2">
                {field.label && (
                  <label className="text-sm text-muted-foreground mb-1 block">
                    {field.label}
                  </label>
                )}
                <Input
                  value={values?.[`${field.key}_${locale}`] || ""}
                  onChange={(e) => onChange(field.key, locale, e.target.value)}
                  placeholder={
                    typeof field.placeholder === "object"
                      ? field.placeholder[locale] || ""
                      : field.placeholder || ""
                  }
                />
              </div>
            ))}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
