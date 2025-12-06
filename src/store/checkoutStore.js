'use client';

import { create } from "zustand";

const initialState = {
  deliveryMethod: "address",
  selectedAddress: null,
  paymentMethod: "card",
  selectedDigitalPayment: "",
  useBonus: true,
  bonusAmount: "50000",
  cardNumber: "",
  expiry: "",
  language: "ru",
};

export const useCheckoutStore = create((set) => ({
  ...initialState,
  setDeliveryMethod: () =>
    set({
      deliveryMethod: "address",
    }),
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
  setUseBonus: (value) => set({ useBonus: value === true }),
  setBonusAmount: (value) => set({ bonusAmount: value }),
  setCardNumber: (value) => set({ cardNumber: value }),
  setExpiry: (value) => set({ expiry: value }),
  setLanguage: (language) => set({ language }),
  resetCheckout: () => set({ ...initialState }),
}));
