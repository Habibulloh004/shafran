'use client';

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { resolveHeroImage, collectGalleryItems } from "@/lib/media";

const resolvePrice = (product, variant) => {
  if (variant?.price) {
    return variant.price;
  }

  if (product?.price?.amount) {
    return product.price.amount;
  }

  if (typeof product?.base_price === "number") {
    return product.base_price;
  }

  return product?.shop_prices?.[0]?.retail_price ?? 0;
};

const resolveCurrency = (product, variant) => {
  if (variant?.currency) {
    return variant.currency;
  }

  if (product?.price?.currency) {
    return product.price.currency;
  }

  if (product?.currency) {
    return product.currency;
  }

  return product?.shop_prices?.[0]?.retail_currency ?? "USD";
};

const resolveImage = (product) => {
  const gallery = collectGalleryItems(product);
  return resolveHeroImage(product, gallery);
};

const buildCartItem = (product, quantity = 1, variant) => {
  if (!product || !product.id) {
    throw new Error("Invalid product payload");
  }

  const variantId = variant?.id || variant?.variant_id || null;
  const key = variantId ? `${product.id}:${variantId}` : product.id;

  return {
    key,
    productId: product.id,
    categoryId:
      product.category_id ||
      product.category?.id ||
      product.categories?.[0]?.id ||
      null,
    name: product.name || product.slug || "Без названия",
    description:
      product.short_description ||
      product.long_description ||
      product.description ||
      "",
    variantLabel: variant?.label || variant?.name || null,
    variantId,
    price: resolvePrice(product, variant),
    currency: resolveCurrency(product, variant),
    quantity,
    image: resolveImage(product),
    productSnapshot: product,
  };
};

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product, options = {}) => {
        const { quantity = 1, variant = null } = options;
        const item = buildCartItem(product, quantity, variant);
        const exists = get().items.find((cartItem) => cartItem.key === item.key);

        if (exists) {
          set({
            items: get().items.map((cartItem) =>
              cartItem.key === item.key
                ? { ...cartItem, quantity: cartItem.quantity + quantity }
                : cartItem
            ),
          });
        } else {
          set({ items: [...get().items, item] });
        }
      },
      removeItem: (key) => {
          set({ items: get().items.filter((item) => item.key !== key) });
      },
      updateQuantity: (key, quantity) => {
        if (quantity <= 0) {
          set({ items: get().items.filter((item) => item.key !== key) });
          return;
        }

        set({
          items: get().items.map((item) =>
            item.key === key ? { ...item, quantity } : item
          ),
        });
      },
      clearCart: () => set({ items: [] }),
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export const computeCartTotals = (items = []) =>
  items.reduce(
    (acc, item) => {
      acc.quantity += item.quantity;
      acc.amount += item.quantity * (item.price || 0);
      acc.currency = item.currency || acc.currency;
      return acc;
    },
    { quantity: 0, amount: 0, currency: "USD" }
  );

export const selectCartTotals = (state) => computeCartTotals(state.items);
