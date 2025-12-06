'use client';

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const buildAddress = (payload = {}) => {
  const now = new Date().toISOString();
  return {
    id: payload.id || payload.address_id || crypto.randomUUID?.() || `addr_${Date.now()}`,
    label: payload.label || payload.title || "Home",
    fullAddress: payload.fullAddress || payload.address || payload.value || "",
    latitude:
      typeof payload.latitude === "number"
        ? payload.latitude
        : typeof payload.lat === "number"
        ? payload.lat
        : typeof payload.latitude === "string"
        ? Number(payload.latitude)
        : typeof payload.latitude === "object" && payload.latitude !== null
        ? Number(payload.latitude)
        : null,
    longitude:
      typeof payload.longitude === "number"
        ? payload.longitude
        : typeof payload.lon === "number"
        ? payload.lon
        : typeof payload.longitude === "string"
        ? Number(payload.longitude)
        : typeof payload.longitude === "object" && payload.longitude !== null
        ? Number(payload.longitude)
        : null,
    createdAt: payload.createdAt || payload.created_at || now,
    isDefault: Boolean(payload.isDefault || payload.is_primary || payload.is_default),
    source: payload.source || "local",
  };
};

export const useAddressStore = create(
  persist(
    (set, get) => ({
      addresses: [],
      hydrateFromServer: (serverAddresses = []) => {
        if (!Array.isArray(serverAddresses) || serverAddresses.length === 0) {
          return;
        }

        const merged = [...get().addresses];
        serverAddresses.forEach((entry) => {
          const normalized = buildAddress({
            ...entry,
            source: "remote",
          });
          if (!merged.some((addr) => addr.id === normalized.id)) {
            merged.push(normalized);
          }
        });

        set({ addresses: merged });
      },
      addAddress: (address) => {
        const entry = buildAddress(address);
        set({ addresses: [...get().addresses, entry] });
        return entry;
      },
      updateAddress: (addressId, patch) => {
        set({
          addresses: get().addresses.map((addr) =>
            addr.id === addressId ? { ...addr, ...patch } : addr
          ),
        });
      },
      setAddresses: (addresses) => {
        set({
          addresses: Array.isArray(addresses)
            ? addresses.map((entry) => buildAddress(entry))
            : [],
        });
      },
      clearAddresses: () => set({ addresses: [] }),
    }),
    {
      name: "address-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export const adaptServerAddress = (entry) =>
  entry ? buildAddress({ ...entry, source: "remote" }) : null;
