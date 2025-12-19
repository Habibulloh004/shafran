"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { useCallback, useEffect, useState } from "react";

const FALLBACK_PRICE = { min: 0, max: 50000000, step: 500000 };

export default function SidebarFilter({
  filters = {},
  selectedFilters = {},
  onPriceChange,
  onBrandToggle,
  onParameterToggle,
  onClear,
}) {
  const priceFilter = filters.price || FALLBACK_PRICE;
  const [price, setPrice] = useState([
    selectedFilters.price?.[0] ?? priceFilter.min ?? FALLBACK_PRICE.min,
    selectedFilters.price?.[1] ?? priceFilter.max ?? FALLBACK_PRICE.max,
  ]);

  useEffect(() => {
    setPrice([
      selectedFilters.price?.[0] ?? priceFilter.min ?? FALLBACK_PRICE.min,
      selectedFilters.price?.[1] ?? priceFilter.max ?? FALLBACK_PRICE.max,
    ]);
  }, [selectedFilters.price, priceFilter.min, priceFilter.max]);

  const handlePriceChange = useCallback((value) => {
    setPrice(value);
  }, []);

  const handlePriceCommit = useCallback(
    (newPrice) => {
      onPriceChange?.(newPrice);
    },
    [onPriceChange]
  );

  const brandOptions = filters.brands || [];
  const parameterGroups = filters.parameters || [];

  const isBrandChecked = (brandId) =>
    Boolean(selectedFilters.brands?.has?.(brandId));

  const isParameterChecked = (groupId, value) =>
    Boolean(selectedFilters.parameters?.[groupId]?.has?.(value));

  return (
    <div className="w-full sm:max-w-64 space-y-4 p-4 rounded-2xl border shadow-sm bg-white dark:bg-neutral-900">
      <Accordion
        type="multiple"
        defaultValue={["price"]}
        className="w-full"
      >
        <AccordionItem value="price">
          <AccordionTrigger className="hover:no-underline">
            Цена
          </AccordionTrigger>
          <AccordionContent>
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="w-full px-2 py-1 border rounded-md text-sm text-center">
                {price[0].toLocaleString()} сум
              </span>
              <span className="text-sm shrink-0">—</span>
              <span className="w-full px-2 py-1 border rounded-md text-sm text-center">
                {price[1].toLocaleString()} сум
              </span>
            </div>
            <Slider
              value={price}
              min={priceFilter.min ?? FALLBACK_PRICE.min}
              max={priceFilter.max ?? FALLBACK_PRICE.max}
              step={priceFilter.step ?? FALLBACK_PRICE.step}
              onValueChange={handlePriceChange}
              onValueCommit={handlePriceCommit}
            />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="brands">
          <AccordionTrigger className="hover:no-underline">
            Бренды
          </AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-col gap-2 max-h-48 overflow-y-auto custom-scroll">
              {brandOptions.length === 0 && (
                <p className="text-xs text-muted-foreground">Нет брендов</p>
              )}
              {brandOptions.map((brand) => (
                <Label
                  key={brand.id}
                  className="flex items-center gap-2 text-sm cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 p-1 rounded"
                >
                  <Checkbox
                    checked={isBrandChecked(brand.id)}
                    onCheckedChange={() => onBrandToggle?.(brand.id)}
                  />
                  {brand.name}
                </Label>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {parameterGroups.map((group) => (
          <AccordionItem key={group.id} value={`param-${group.id}`}>
            <AccordionTrigger className="hover:no-underline">
              {group.label}
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-col gap-2 max-h-48 overflow-y-auto custom-scroll">
                {group.values.length === 0 && (
                  <p className="text-xs text-muted-foreground">
                    Нет значений
                  </p>
                )}
                {group.values.map((value) => (
                  <Label
                    key={`${group.id}-${value}`}
                    className="flex items-center gap-2 text-sm cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 p-1 rounded"
                  >
                    <Checkbox
                      checked={isParameterChecked(group.id, value)}
                      onCheckedChange={() =>
                        onParameterToggle?.(group.id, value)
                      }
                    />
                    {value}
                  </Label>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}

        <div className="pt-4 border-t">
          <button
            onClick={() => onClear?.()}
            className="w-full px-3 py-2 text-sm bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md transition-colors"
          >
            Очистить фильтры
          </button>
        </div>
      </Accordion>
    </div>
  );
}
