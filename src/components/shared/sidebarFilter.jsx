"use client";

import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export default function SidebarFilter() {
  const [price, setPrice] = useState([100, 3000]);

  return (
    <div className="w-full sm:max-w-64 space-y-4 p-4 rounded-2xl border shadow-sm bg-white dark:bg-neutral-900">
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
              <span className="w-full px-2 py-1 border rounded-md text-sm">${price[0]}</span>
              <span className="text-sm">To</span>
              <span className="w-full px-2 py-1 border rounded-md text-sm">${price[1]}</span>
            </div>
            <Slider
              defaultValue={price}
              min={0}
              max={5000}
              step={50}
              onValueChange={setPrice}
            />
          </AccordionContent>
        </AccordionItem>

        {/* Unisex Filter */}
        <AccordionItem value="uni">
          <AccordionTrigger className="hover:no-underline">Уни</AccordionTrigger>
          <AccordionContent>
            <div className="flex items-center space-x-2">
              <Switch id="uni" />
              <Label htmlFor="uni">Unisex</Label>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Brands */}
        <AccordionItem value="brands">
          <AccordionTrigger className="hover:no-underline">Бренды</AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-col gap-2 max-h-48 overflow-y-auto custom-scroll">
              {[
                "Creed",
                "Swedoft",
                "Versace",
                "Dior",
                "Hugo Boss",
                "Calvin Klein",
                "Chanel",
                "Tom Ford",
                "Gucci",
                "Armani",
                "Prada",
                "Burberry",
              ].map((brand) => (
                <Label
                  key={brand}
                  className="flex items-center gap-2 text-sm cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 p-1 rounded"
                >
                  <Checkbox /> {brand}
                </Label>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Aroma */}
        <AccordionItem value="aroma">
          <AccordionTrigger className="hover:no-underline">Аромат</AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-col gap-2 max-h-48 overflow-y-auto custom-scroll">
              {[
                "Альдегидные",
                "Ванильные",
                "Вишневые",
                "Фиалковый",
                "Древесные",
                "Цитрусовые",
                "Цветочные",
                "Свежие",
                "Восточные",
                "Пряные",
              ].map((aroma) => (
                <Label
                  key={aroma}
                  className="flex items-center gap-2 text-sm cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 p-1 rounded"
                >
                  <Checkbox /> {aroma}
                </Label>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Season */}
        <AccordionItem value="season">
          <AccordionTrigger className="hover:no-underline">Сезон</AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-col gap-2">
              {["Весна", "Лето", "Осень", "Зима"].map((season) => (
                <Label
                  key={season}
                  className="flex items-center gap-2 text-sm cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 p-1 rounded"
                >
                  <Checkbox /> {season}
                </Label>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Type */}
        <AccordionItem value="type">
          <AccordionTrigger className="hover:no-underline">Тип</AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-col gap-2">
              {["Парфюм", "Одеколон", "Дезодорант"].map((type) => (
                <Label
                  key={type}
                  className="flex items-center gap-2 text-sm cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 p-1 rounded"
                >
                  <Checkbox /> {type}
                </Label>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Clear Filters Button */}
        <div className="pt-4 border-t">
          <button className="w-full px-3 py-2 text-sm bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md transition-colors">
            Очистить фильтры
          </button>
        </div>
      </Accordion>
    </div>
  );
}
