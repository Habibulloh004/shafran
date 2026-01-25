"use client";

import { Price } from "@/lib/functions";
import Image from "next/image";
import React, { useMemo } from "react";
import StarRating from "./StarRating";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { collectGalleryItems, resolveHeroImage } from "@/lib/media";
import { useOrderStore } from "@/store/orderStore";

const FALLBACK_IMAGE = "/img/res1.webp";

export default function ProductItem({
  product,
  className = "",
  section,
  genderParam,
  categoryIdOverride,
}) {
  const {
    id,
    name,
    slug,
    rating_average: rating = 0,
    rating_count: ratingCount = 0,
  } = product || {};

  const categoryFromProduct =
    product?.category ||
    (Array.isArray(product?.categories) ? product.categories[0] : null) ||
    null;

  const gender =
    genderParam ||
    product?.gender_audience ||
    categoryFromProduct?.gender_audience ||
    product?.gender ||
    null;

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

  const imageUrl = useMemo(() => {
    if (!product) return FALLBACK_IMAGE;
    const gallery = collectGalleryItems(product);
    return resolveHeroImage(product, gallery);
  }, [product]);

  const addItem = useOrderStore((state) => state.addItem);
  const cartItems = useOrderStore((state) => state.items);

  // Find quantity of this product in cart
  const quantityInCart = useMemo(() => {
    const cartItem = cartItems.find((item) => item.productId === id);
    return cartItem?.quantity || 0;
  }, [cartItems, id]);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (product) {
      addItem(product, { quantity: 1 });
    }
  };

  const categoryId =
    categoryIdOverride ||
    categoryFromProduct?.id ||
    product?.category_id ||
    null;
  const productId = id;

  const query = new URLSearchParams();
  if (section) {
    query.set("section", section);
  }

  if (gender) {
    query.set("gender", gender);
  }

  const queryString = query.toString();

  const href =
    categoryId && productId
      ? `/category/${categoryId}/product/${productId}${
          queryString ? `?${queryString}` : ""
        }`
      : "#";

  return (
    <Link
      href={href}
      className={cn(
        "text-primary bg-white/60 dark:bg-black/60 rounded-[20px] overflow-hidden w-auto flex flex-col transition-all hover:-translate-y-1 hover:shadow-lg dark:hover:shadow-primary/30",
        className,
        href === "#" && "pointer-events-none opacity-70"
      )}
      prefetch={false}
    >
      <div className="bg-white/60 dark:bg-black/60 relative w-auto h-32 md:h-40">
        <Image
          src={imageUrl}
          alt={name || "Product"}
          fill
          quality={90}
          className="object-cover"
          sizes="(max-width: 768px) 50vw, 25vw"
        />
      </div>
      <div className="backdrop-blur-2xl px-4 py-3 space-y-2">
        <div className="space-y-1">
          {gender && (
            <p className="text-[10px] uppercase tracking-wide line-clamp-1 md:text-xs text-primary dark:text-white/60">
              {gender === "male"
                ? "Для него"
                : gender === "female"
                ? "Для неё"
                : "Унисекс"}
            </p>
          )}
          <h1 className="text-xs line-clamp-2 md:text-sm lg:text-base font-semibold text-foreground dark:text-white">
            {name || slug || "Без названия"}
          </h1>
        </div>
        <div className="flex justify-between items-center gap-2">
          <Price amount={price} currency={currency} size="sm" className="flex-1 min-w-0" />
          <Button
            type="button"
            onClick={handleAddToCart}
            className="relative shrink-0 w-7 h-7 md:h-9 md:w-9 rounded-full hover:opacity-70 transition-all ease-linear duration-200 cursor-pointer bg-primary text-white"
          >
            <Plus className="w-3 h-3 md:w-4 md:h-4" />
            {quantityInCart > 0 && (
              <span className="absolute -top-1 -right-1 bg-green-500 text-white text-[10px] font-bold min-w-[18px] h-[18px] rounded-full flex items-center justify-center">
                {quantityInCart}
              </span>
            )}
          </Button>
        </div>
      </div>
    </Link>
  );
}
