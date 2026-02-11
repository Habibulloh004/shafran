"use client";

import { createContext, useContext, useState, useCallback, useEffect } from "react";

// Supported locales
export const LOCALES = ["uz", "en", "ru"];
export const DEFAULT_LOCALE = "uz";
const STORAGE_KEY = "shafran_locale";

// Lazy-load translation modules
const translationLoaders = {
  uz: {
    common: () => import("@/locales/uz/common.json"),
    auth: () => import("@/locales/uz/auth.json"),
    profile: () => import("@/locales/uz/profile.json"),
    orders: () => import("@/locales/uz/orders.json"),
    home: () => import("@/locales/uz/home.json"),
    footer: () => import("@/locales/uz/footer.json"),
    errors: () => import("@/locales/uz/errors.json"),
    search: () => import("@/locales/uz/search.json"),
    admin: () => import("@/locales/uz/admin.json"),
  },
  en: {
    common: () => import("@/locales/en/common.json"),
    auth: () => import("@/locales/en/auth.json"),
    profile: () => import("@/locales/en/profile.json"),
    orders: () => import("@/locales/en/orders.json"),
    home: () => import("@/locales/en/home.json"),
    footer: () => import("@/locales/en/footer.json"),
    errors: () => import("@/locales/en/errors.json"),
    search: () => import("@/locales/en/search.json"),
    admin: () => import("@/locales/en/admin.json"),
  },
  ru: {
    common: () => import("@/locales/ru/common.json"),
    auth: () => import("@/locales/ru/auth.json"),
    profile: () => import("@/locales/ru/profile.json"),
    orders: () => import("@/locales/ru/orders.json"),
    home: () => import("@/locales/ru/home.json"),
    footer: () => import("@/locales/ru/footer.json"),
    errors: () => import("@/locales/ru/errors.json"),
    search: () => import("@/locales/ru/search.json"),
    admin: () => import("@/locales/ru/admin.json"),
  },
};

// Cache for loaded translations
const translationCache = {};

async function loadNamespace(locale, namespace) {
  const cacheKey = `${locale}.${namespace}`;
  if (translationCache[cacheKey]) {
    return translationCache[cacheKey];
  }

  const loaders = translationLoaders[locale] || translationLoaders[DEFAULT_LOCALE];
  const loader = loaders[namespace];
  if (!loader) return {};

  try {
    const mod = await loader();
    const data = mod.default || mod;
    translationCache[cacheKey] = data;
    return data;
  } catch (error) {
    console.error(`Failed to load translations: ${cacheKey}`, error);
    return {};
  }
}

async function loadAllNamespaces(locale) {
  const loaders = translationLoaders[locale] || translationLoaders[DEFAULT_LOCALE];
  const namespaces = Object.keys(loaders);
  const entries = await Promise.all(
    namespaces.map(async (ns) => {
      const data = await loadNamespace(locale, ns);
      return [ns, data];
    })
  );
  return Object.fromEntries(entries);
}

// Translation context
const I18nContext = createContext(null);

export function I18nProvider({ children }) {
  const [locale, setLocaleState] = useState(DEFAULT_LOCALE);
  const [translations, setTranslations] = useState({});
  const [isLoaded, setIsLoaded] = useState(false);

  // Initialize locale from localStorage
  useEffect(() => {
    const savedLocale = localStorage.getItem(STORAGE_KEY);
    if (savedLocale && LOCALES.includes(savedLocale)) {
      setLocaleState(savedLocale);
    }
  }, []);

  // Load translations when locale changes
  useEffect(() => {
    let cancelled = false;
    setIsLoaded(false);

    loadAllNamespaces(locale).then((data) => {
      if (!cancelled) {
        setTranslations(data);
        setIsLoaded(true);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [locale]);

  const setLocale = useCallback((newLocale) => {
    if (LOCALES.includes(newLocale)) {
      setLocaleState(newLocale);
      localStorage.setItem(STORAGE_KEY, newLocale);
      document.documentElement.lang = newLocale;
    }
  }, []);

  // Translation function with namespace support and interpolation
  const t = useCallback(
    (key, params) => {
      // key can be "namespace.key" or just "key" (defaults to common)
      const parts = key.split(".");
      let namespace, translationKey;

      if (parts.length >= 2) {
        namespace = parts[0];
        translationKey = parts.slice(1).join(".");
      } else {
        namespace = "common";
        translationKey = key;
      }

      const nsTranslations = translations[namespace] || {};
      let value = nsTranslations[translationKey];

      // Fallback: try to load from default locale cache
      if (value === undefined && locale !== DEFAULT_LOCALE) {
        const fallbackKey = `${DEFAULT_LOCALE}.${namespace}`;
        const fallback = translationCache[fallbackKey] || {};
        value = fallback[translationKey];
      }

      // If still not found, return the key itself
      if (value === undefined) {
        return translationKey;
      }

      // Interpolation: replace {param} with values
      if (params && typeof value === "string") {
        return value.replace(/\{(\w+)\}/g, (_, paramKey) => {
          return params[paramKey] !== undefined ? String(params[paramKey]) : `{${paramKey}}`;
        });
      }

      return value;
    },
    [translations, locale]
  );

  return (
    <I18nContext.Provider value={{ locale, setLocale, t, isLoaded }}>
      {children}
    </I18nContext.Provider>
  );
}

// Hook to use translations
export function useTranslation() {
  const context = useContext(I18nContext);
  if (!context) {
    // Return a safe fallback if used outside provider (e.g. during SSR)
    return {
      locale: DEFAULT_LOCALE,
      setLocale: () => {},
      t: (key) => {
        const parts = key.split(".");
        return parts[parts.length - 1];
      },
      isLoaded: false,
    };
  }
  return context;
}

// Locale display names
export const LOCALE_NAMES = {
  uz: "O'zbekcha",
  en: "English",
  ru: "Русский",
};

export const LOCALE_FLAGS = {
  uz: "🇺🇿",
  en: "🇬🇧",
  ru: "🇷🇺",
};
