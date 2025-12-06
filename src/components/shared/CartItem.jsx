'use client';

import { Price } from "@/lib/functions";
import Image from "next/image";
import { Button } from "../ui/button";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useOrderStore } from "@/store/orderStore";

const stripHtml = (value = "") =>
  value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

export default function CartItem({ item }) {
  const updateQuantity = useOrderStore((state) => state.updateQuantity);
  const removeItem = useOrderStore((state) => state.removeItem);

  if (!item) return null;

  const increment = () => updateQuantity(item.key, item.quantity + 1);
  const decrement = () => updateQuantity(item.key, item.quantity - 1);
  const summary = stripHtml(item.description || "").slice(0, 140);

  return (
    <main className="w-full rounded-2xl bg-white/95 dark:bg-black/35 p-3 shadow-sm border border-black/5 dark:border-white/5">
      <div className="flex gap-3">
        <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-white dark:bg-white/10 overflow-hidden shrink-0">
          <Image
            src={item.image}
            alt={item.name}
            fill
            sizes="80px"
            className="object-contain"
          />
        </div>
        <div className="flex-1 min-w-0 space-y-1">
          <h1 className="font-semibold text-sm md:text-base line-clamp-2 text-foreground">
            {item.name}
          </h1>
          {item.variantLabel && (
            <p className="text-[11px] uppercase tracking-wide text-primary">
              {item.variantLabel}
            </p>
          )}
          {summary && (
            <p className="text-muted-foreground text-xs md:text-sm line-clamp-2">
              {summary}
            </p>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => removeItem(item.key)}
          className="self-start text-muted-foreground hover:text-destructive"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex flex-col gap-3 border-t border-black/5 dark:border-white/5 pt-3 mt-3 sm:flex-row sm:items-center sm:justify-between">
        <Price
          amount={item.price}
          currency={item.currency}
          className="text-lg font-bold text-foreground w-full sm:w-auto"
        />
        <div className="flex items-center gap-2 justify-end">
          <Button
            variant="icon"
            className="h-8 w-8 rounded-full bg-primary/10 text-primary hover:bg-primary/20"
            onClick={decrement}
          >
            <Minus className="w-3.5 h-3.5" />
          </Button>
          <span className="w-8 text-center font-semibold">{item.quantity}</span>
          <Button
            variant="icon"
            className="h-8 w-8 rounded-full bg-primary text-white hover:bg-primary/90"
            onClick={increment}
          >
            <Plus className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    </main>
  );
}
