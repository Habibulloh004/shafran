"use client";

import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useState, useCallback, useTransition } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

const FALLBACK_PRICE = { min: 0, max: 5000, step: 50 };

export default function SidebarFilter({ filters, selectedFilters, categoryId }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const priceFilter = filters?.price || FALLBACK_PRICE;
  const [price, setPrice] = useState([
    selectedFilters?.price?.min ?? priceFilter?.min ?? FALLBACK_PRICE.min,
    selectedFilters?.price?.max ?? priceFilter?.max ?? FALLBACK_PRICE.max,
  ]);

  const brands = filters?.brands || [];
  const fragranceNotes = filters?.fragrance_notes || [];
  const seasons = filters?.seasons || [];
  const productTypes = filters?.product_types || [];

  // URL ni yangilash funksiyasi
  const updateFilter = useCallback((key, value, isArray = false) => {
    const params = new URLSearchParams(searchParams.toString());

    if (isArray) {
      const current = params.get(key)?.split(',').filter(Boolean) || [];
      const valueStr = String(value);
      const updated = current.includes(valueStr)
        ? current.filter(v => v !== valueStr)
        : [...current, valueStr];

      if (updated.length > 0) {
        params.set(key, updated.join(','));
      } else {
        params.delete(key);
      }
    } else {
      if (value !== null && value !== undefined && value !== '') {
        params.set(key, String(value));
      } else {
        params.delete(key);
      }
    }

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    });
  }, [router, pathname, searchParams]);

  // Narx filteri uchun
  const handlePriceChange = useCallback((newPrice) => {
    setPrice(newPrice);
  }, []);

  const handlePriceCommit = useCallback((newPrice) => {
    const params = new URLSearchParams(searchParams.toString());

    if (newPrice[0] !== (priceFilter?.min ?? FALLBACK_PRICE.min)) {
      params.set('price_min', String(newPrice[0]));
    } else {
      params.delete('price_min');
    }

    if (newPrice[1] !== (priceFilter?.max ?? FALLBACK_PRICE.max)) {
      params.set('price_max', String(newPrice[1]));
    } else {
      params.delete('price_max');
    }

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    });
  }, [router, pathname, searchParams, priceFilter]);

  // Unisex switch uchun
  const handleUnisexChange = useCallback((checked) => {
    updateFilter('unisex', checked ? 'true' : null);
  }, [updateFilter]);

  // Filterlarni tozalash
  const clearFilters = useCallback(() => {
    startTransition(() => {
      router.push(pathname, { scroll: false });
    });
    setPrice([
      priceFilter?.min ?? FALLBACK_PRICE.min,
      priceFilter?.max ?? FALLBACK_PRICE.max
    ]);
  }, [router, pathname, priceFilter]);

  // Checkbox checked holatini tekshirish
  const isChecked = (filterKey, itemId) => {
    return selectedFilters?.[filterKey]?.has?.(String(itemId)) || false;
  };

  return (
    <div className={`w-full sm:max-w-64 space-y-4 p-4 rounded-2xl border shadow-sm bg-white dark:bg-neutral-900 ${isPending ? 'opacity-70' : ''}`}>
      <Accordion
        type="multiple"
        defaultValue={[
          "price",
          "uni",
          "brands",
          "aroma",
          "season",
          "type",
        ]}
        className="w-full"
      >
        {/* Price Filter */}
        <AccordionItem value="price">
          <AccordionTrigger className="hover:no-underline">Цена</AccordionTrigger>
          <AccordionContent>
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="w-full px-2 py-1 border rounded-md text-sm">
                ${price[0]}
              </span>
              <span className="text-sm">To</span>
              <span className="w-full px-2 py-1 border rounded-md text-sm">
                ${price[1]}
              </span>
            </div>
            <Slider
              value={price}
              min={priceFilter?.min ?? FALLBACK_PRICE.min}
              max={priceFilter?.max ?? FALLBACK_PRICE.max}
              step={priceFilter?.step ?? FALLBACK_PRICE.step}
              onValueChange={handlePriceChange}
              onValueCommit={handlePriceCommit}
            />
          </AccordionContent>
        </AccordionItem>

        {/* Unisex Filter */}
        <AccordionItem value="uni">
          <AccordionTrigger className="hover:no-underline">Уни</AccordionTrigger>
          <AccordionContent>
            <div className="flex items-center space-x-2">
              <Switch
                id="uni"
                checked={selectedFilters?.unisex || false}
                onCheckedChange={handleUnisexChange}
              />
              <Label htmlFor="uni">Unisex</Label>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Brands */}
        <AccordionItem value="brands">
          <AccordionTrigger className="hover:no-underline">Бренды</AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-col gap-2 max-h-48 overflow-y-auto custom-scroll">
              {(brands.length ? brands : []).map((brand) => {
                const itemId = brand?.id || brand;
                const label = brand?.name || brand;
                return (
                  <Label
                    key={itemId}
                    className="flex items-center gap-2 text-sm cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 p-1 rounded"
                  >
                    <Checkbox
                      checked={isChecked('brand_ids', itemId)}
                      onCheckedChange={() => updateFilter('brand_ids', itemId, true)}
                    />
                    {label}
                  </Label>
                );
              })}
              {brands.length === 0 && (
                <p className="text-xs text-muted-foreground">Нет брендов</p>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Fragrance Notes / Aroma */}
        <AccordionItem value="aroma">
          <AccordionTrigger className="hover:no-underline">
            Аромат
          </AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-col gap-2 max-h-48 overflow-y-auto custom-scroll">
              {(fragranceNotes.length ? fragranceNotes : []).map((aroma) => {
                const itemId = aroma?.id || aroma;
                const label = aroma?.name || aroma;
                return (
                  <Label
                    key={itemId}
                    className="flex items-center gap-2 text-sm cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 p-1 rounded"
                  >
                    <Checkbox
                      checked={isChecked('fragrance_note_ids', itemId)}
                      onCheckedChange={() => updateFilter('fragrance_note_ids', itemId, true)}
                    />
                    {label}
                  </Label>
                );
              })}
              {fragranceNotes.length === 0 && (
                <p className="text-xs text-muted-foreground">Нет ароматов</p>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Seasons */}
        <AccordionItem value="season">
          <AccordionTrigger className="hover:no-underline">
            Сезон
          </AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-col gap-2">
              {(seasons.length ? seasons : []).map((season) => {
                const itemId = season?.id || season;
                const label = season?.name || season;
                return (
                  <Label
                    key={itemId}
                    className="flex items-center gap-2 text-sm cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 p-1 rounded"
                  >
                    <Checkbox
                      checked={isChecked('season_ids', itemId)}
                      onCheckedChange={() => updateFilter('season_ids', itemId, true)}
                    />
                    {label}
                  </Label>
                );
              })}
              {seasons.length === 0 && (
                <p className="text-xs text-muted-foreground">Нет сезонов</p>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Product Types */}
        <AccordionItem value="type">
          <AccordionTrigger className="hover:no-underline">
            Тип
          </AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-col gap-2">
              {(productTypes.length ? productTypes : []).map((type) => {
                const itemId = type?.id || type;
                const label = type?.name || type;
                return (
                  <Label
                    key={itemId}
                    className="flex items-center gap-2 text-sm cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 p-1 rounded"
                  >
                    <Checkbox
                      checked={isChecked('product_type_ids', itemId)}
                      onCheckedChange={() => updateFilter('product_type_ids', itemId, true)}
                    />
                    {label}
                  </Label>
                );
              })}
              {productTypes.length === 0 && (
                <p className="text-xs text-muted-foreground">Нет типов</p>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Clear Filters Button */}
        <div className="pt-4 border-t">
          <button
            onClick={clearFilters}
            disabled={isPending}
            className="w-full px-3 py-2 text-sm bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md transition-colors disabled:opacity-50"
          >
            Очистить фильтры
          </button>
        </div>
      </Accordion>
    </div>
  );
}
