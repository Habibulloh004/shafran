'use client';

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { resolveHeroImage, collectGalleryItems } from "@/lib/media";

// ============ Price/Currency/Image Helpers ============
const resolvePrice = (product, variant) => {
  if (variant?.price) return variant.price;
  if (product?.price?.amount) return product.price.amount;
  if (typeof product?.base_price === "number") return product.base_price;
  return product?.shop_prices?.[0]?.retail_price ?? 0;
};

const resolveCurrency = (product, variant) => {
  if (variant?.currency) return variant.currency;
  if (product?.price?.currency) return product.price.currency;
  if (product?.currency) return product.currency;
  return product?.shop_prices?.[0]?.retail_currency ?? "UZS";
};

const resolveImage = (product) => {
  const gallery = collectGalleryItems(product);
  return resolveHeroImage(product, gallery);
};

// ============ Cart Item Builder ============
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

// ============ Initial State ============
const initialState = {
  // Cart
  items: [],

  // Checkout options
  deliveryMethod: "address",
  selectedAddress: null,
  paymentMethod: "cash",
  selectedDigitalPayment: "",
  cardNumber: "",
  expiry: "",
  language: "ru",
};

// ============ Order Store ============
export const useOrderStore = create(
  persist(
    (set, get) => ({
      ...initialState,

      // ============ Cart Actions ============
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

      // ============ Checkout Actions ============
      setDeliveryMethod: (method) => set({ deliveryMethod: method || "address" }),

      setSelectedAddress: (address) =>
        set({
          selectedAddress: address || null,
          deliveryMethod: "address",
        }),

      setPaymentMethod: (method) =>
        set({
          paymentMethod: method,
          selectedDigitalPayment: "",
        }),

      setDigitalPayment: (provider) => set({ selectedDigitalPayment: provider }),

      setCardNumber: (value) => set({ cardNumber: value }),

      setExpiry: (value) => set({ expiry: value }),

      setLanguage: (language) => set({ language }),

      // ============ Reset Actions ============
      resetCheckout: () =>
        set({
          deliveryMethod: initialState.deliveryMethod,
          selectedAddress: initialState.selectedAddress,
          paymentMethod: initialState.paymentMethod,
          selectedDigitalPayment: initialState.selectedDigitalPayment,
          cardNumber: initialState.cardNumber,
          expiry: initialState.expiry,
          language: initialState.language,
        }),

      resetOrder: () => set({ ...initialState }),
    }),
    {
      name: "order-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// ============ Selectors ============
export const computeOrderTotals = (items = []) =>
  items.reduce(
    (acc, item) => {
      acc.quantity += item.quantity;
      acc.amount += item.quantity * (item.price || 0);
      acc.currency = item.currency || acc.currency;
      return acc;
    },
    { quantity: 0, amount: 0, currency: "UZS" }
  );

export const selectOrderTotals = (state) => computeOrderTotals(state.items);
