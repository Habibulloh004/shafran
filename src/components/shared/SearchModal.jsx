"use client";

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  X,
  Loader2,
  ArrowRight,
  Clock,
  TrendingUp,
} from "lucide-react";
import { Price } from "@/lib/functions";
import { collectGalleryItems, resolveHeroImage } from "@/lib/media";
import { getBillzProducts } from "../../../actions/get";
import { useTranslation } from "@/i18n";

const FALLBACK_IMAGE = "/img/res1.webp";
const DEBOUNCE_MS = 400;
const RECENT_SEARCHES_KEY = "shafran_recent_searches";
const MAX_RECENT = 5;
const MAX_RESULTS = 8;

// --- Helpers ---

function getRecentSearches() {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(RECENT_SEARCHES_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveRecentSearch(query) {
  if (typeof window === "undefined" || !query.trim()) return;
  const recent = getRecentSearches().filter((s) => s !== query.trim());
  recent.unshift(query.trim());
  localStorage.setItem(
    RECENT_SEARCHES_KEY,
    JSON.stringify(recent.slice(0, MAX_RECENT))
  );
}

function buildSearchableText(product) {
  const parts = [
    product?.name,
    product?.short_description,
    product?.manufacturer,
    product?.brand?.name,
    product?.fragrance_family,
    product?.fragrance_group,
    product?.composition_notes,
    product?.country_of_origin,
    product?.gender_audience,
  ];

  // Billz-specific fields
  if (Array.isArray(product?.categories)) {
    product.categories.forEach((cat) => {
      parts.push(cat?.name);
    });
  }
  if (product?.category?.name) {
    parts.push(product.category.name);
  }

  // Specifications / parameters
  if (Array.isArray(product?.specifications)) {
    product.specifications.forEach((spec) => {
      parts.push(spec?.label, spec?.value);
    });
  }
  if (typeof product?.parameters === "string") {
    parts.push(product.parameters);
  }

  // Shop prices (for product type info)
  if (Array.isArray(product?.shop_prices)) {
    product.shop_prices.forEach((sp) => {
      parts.push(sp?.name);
    });
  }

  return parts
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function filterProducts(products, query) {
  const terms = query
    .toLowerCase()
    .split(/\s+/)
    .filter((t) => t.length > 0);
  if (terms.length === 0) return [];

  const scored = [];
  for (const product of products) {
    const text = buildSearchableText(product);
    const name = (product?.name || "").toLowerCase();
    const brand = (product?.brand?.name || product?.manufacturer || "").toLowerCase();

    let allMatch = true;
    for (const term of terms) {
      if (!text.includes(term)) {
        allMatch = false;
        break;
      }
    }
    if (!allMatch) continue;

    // Score: name match > brand match > other
    let score = 0;
    for (const term of terms) {
      if (name.includes(term)) score += 3;
      if (brand.includes(term)) score += 2;
    }
    if (name.startsWith(terms[0])) score += 5;

    scored.push({ product, score });
  }

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, MAX_RESULTS).map((s) => s.product);
}

// --- Components ---

function SearchResultItem({ product, onClick }) {
  const { t } = useTranslation();
  const imageUrl = useMemo(() => {
    if (!product) return FALLBACK_IMAGE;
    const gallery = collectGalleryItems(product);
    return resolveHeroImage(product, gallery);
  }, [product]);

  const price =
    product?.price?.amount ??
    product?.base_price ??
    product?.shop_prices?.[0]?.retail_price ??
    0;
  const currency =
    product?.price?.currency ??
    product?.currency ??
    product?.shop_prices?.[0]?.retail_currency ??
    "USD";

  const categoryId =
    product?.category?.id ||
    product?.category_id ||
    (Array.isArray(product?.categories) ? product.categories[0]?.id : null) ||
    null;
  const brandName = product?.brand?.name || product?.manufacturer || "";
  const gender = product?.gender_audience || product?.gender || null;

  const query = new URLSearchParams();
  if (gender) query.set("gender", gender);
  const qs = query.toString();

  const href = categoryId
    ? `/category/${categoryId}/product/${product.id}${qs ? `?${qs}` : ""}`
    : "#";

  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-3 p-3 rounded-xl hover:bg-accent/50 transition-all duration-200 group"
    >
      <div className="relative w-14 h-14 md:w-16 md:h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
        <Image
          src={imageUrl}
          alt={product?.name || "Product"}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="64px"
        />
      </div>
      <div className="flex-1 min-w-0">
        {brandName && (
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
            {brandName}
          </p>
        )}
        <h3 className="text-sm font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
          {product?.name || t("common.noName")}
        </h3>
        <Price
          amount={price}
          currency={currency}
          size="sm"
          className="text-xs"
        />
      </div>
      <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-200 flex-shrink-0" />
    </Link>
  );
}

// --- Main ---

export default function SearchModal({ open, onClose }) {
  const { t } = useTranslation();
  const inputRef = useRef(null);
  const overlayRef = useRef(null);
  const [query, setQuery] = useState("");
  const [allProducts, setAllProducts] = useState([]);
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingProducts, setIsFetchingProducts] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);

  // Load all Billz products once when modal opens
  useEffect(() => {
    if (!open) return;
    if (allProducts.length > 0) return; // already loaded

    let cancelled = false;
    setIsFetchingProducts(true);

    (async () => {
      try {
        const { data } = await getBillzProducts({ limit: 200, page: 1 });
        if (!cancelled) {
          setAllProducts(data || []);
        }
      } catch (error) {
        console.error("Failed to load products for search:", error);
      } finally {
        if (!cancelled) setIsFetchingProducts(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [open, allProducts.length]);

  // Load recent searches
  useEffect(() => {
    if (open) {
      setRecentSearches(getRecentSearches());
    }
  }, [open]);

  // Focus input on open
  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setQuery("");
      setResults([]);
      setHasSearched(false);
    }
  }, [open]);

  // Lock body scroll
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Keyboard: Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && open) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  // Debounced client-side filter
  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setResults([]);
      setHasSearched(false);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    const timer = setTimeout(() => {
      const filtered = filterProducts(allProducts, trimmed);
      setResults(filtered);
      setHasSearched(true);
      setIsLoading(false);
    }, DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [query, allProducts]);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  const handleOverlayClick = useCallback(
    (e) => {
      if (e.target === overlayRef.current) {
        handleClose();
      }
    },
    [handleClose]
  );

  const handleResultClick = useCallback(() => {
    if (query.trim()) {
      saveRecentSearch(query.trim());
    }
    handleClose();
  }, [query, handleClose]);

  const handleRecentClick = useCallback((search) => {
    setQuery(search);
  }, []);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (query.trim()) {
        saveRecentSearch(query.trim());
        handleClose();
      }
    },
    [query, handleClose]
  );

  if (!open) return null;

  const showRecent =
    !query.trim() && recentSearches.length > 0 && !hasSearched;
  const showEmpty =
    hasSearched && results.length === 0 && query.trim().length >= 2;
  const showResults = results.length > 0;
  const showLoading =
    (isLoading || isFetchingProducts) &&
    query.trim().length >= 2 &&
    results.length === 0;

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-[1000] flex items-start justify-center"
    >
      {/* Search Panel */}
      <div className="relative w-full max-w-2xl mx-4 mt-16 sm:mt-24 bg-background rounded-2xl shadow-2xl border border-border/50 overflow-hidden transition-all duration-300 ease-out opacity-100 translate-y-0 scale-100">
        {/* Search Input */}
        <form onSubmit={handleSubmit} className="relative">
          <div className="flex items-center px-4 sm:px-5 border-b border-border/50">
            <Search className="w-5 h-5 text-muted-foreground flex-shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("search.searchPlaceholder")}
              className="flex-1 h-14 sm:h-16 px-3 bg-transparent text-foreground placeholder:text-muted-foreground outline-none text-sm sm:text-base"
              autoComplete="off"
            />
            {(isLoading || isFetchingProducts) && (
              <Loader2 className="w-5 h-5 text-muted-foreground animate-spin flex-shrink-0 mr-2" />
            )}
            {query && !isLoading && !isFetchingProducts && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="p-1.5 rounded-full hover:bg-accent transition-colors mr-2"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            )}
            <button
              type="button"
              onClick={handleClose}
              className="text-xs text-muted-foreground bg-accent/80 px-2.5 py-1.5 rounded-lg hover:bg-accent transition-colors font-medium"
            >
              ESC
            </button>
          </div>
        </form>

        {/* Content */}
        <div className="max-h-[60vh] overflow-y-auto overscroll-contain">
          {/* Recent Searches */}
          {showRecent && (
            <div className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {t("search.recentSearches")}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((search, i) => (
                  <button
                    key={i}
                    onClick={() => handleRecentClick(search)}
                    className="px-3 py-1.5 text-sm bg-accent/60 hover:bg-accent text-foreground rounded-full transition-all duration-200 hover:scale-[1.02]"
                  >
                    {search}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Loading skeleton */}
          {showLoading && (
            <div className="p-4 space-y-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-3 rounded-xl"
                >
                  <div className="w-14 h-14 md:w-16 md:h-16 rounded-lg bg-muted animate-pulse flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-16 bg-muted animate-pulse rounded" />
                    <div className="h-4 w-3/4 bg-muted animate-pulse rounded" />
                    <div className="h-3 w-20 bg-muted animate-pulse rounded" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Results */}
          {showResults && (
            <div className="p-2 sm:p-3">
              <div className="flex items-center justify-between px-3 py-2">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-muted-foreground" />
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    {t("search.results")}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {results.length} {t("search.found")}
                </span>
              </div>
              <div className="space-y-0.5">
                {results.map((product, index) => (
                  <div
                    key={product.id}
                    style={{ animationDelay: `${index * 50}ms` }}
                    className="animate-in fade-in slide-in-from-bottom-2 duration-300 fill-mode-both"
                  >
                    <SearchResultItem
                      product={product}
                      onClick={handleResultClick}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {showEmpty && !isLoading && (
            <div className="p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted/50 flex items-center justify-center">
                <Search className="w-7 h-7 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium text-foreground mb-1">
                {t("search.nothingFound")}
              </p>
              <p className="text-xs text-muted-foreground">
                {t("search.tryDifferentQuery")}
              </p>
            </div>
          )}

          {/* Initial empty state */}
          {!query.trim() && !showRecent && (
            <div className="p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted/50 flex items-center justify-center">
                <Search className="w-7 h-7 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">
                {t("search.startTyping")}
              </p>
            </div>
          )}
        </div>

        {/* Footer hint */}
        {showResults && (
          <div className="px-4 py-3 border-t border-border/50 bg-accent/30">
            <p className="text-[11px] text-muted-foreground text-center">
              {t("search.clickProduct")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
