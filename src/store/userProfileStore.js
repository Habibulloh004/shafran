'use client';

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const useUserProfileStore = create(
  persist(
    (set, get) => ({
      profile: null,
      setProfile: (profile) =>
        set({
          profile: profile ? { ...profile } : null,
        }),
      setAddresses: (addresses) =>
        set((state) => {
          const normalized =
            Array.isArray(addresses) && addresses.length > 0
              ? addresses
              : [];

          if (!state.profile) {
            return { profile: { addresses: normalized } };
          }

          return { profile: { ...state.profile, addresses: normalized } };
        }),
      updateProfile: (patch = {}) =>
        set((state) => ({
          profile: state.profile ? { ...state.profile, ...patch } : { ...patch },
        })),
      clearProfile: () => set({ profile: null }),
    }),
    {
      name: "user-profile-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ profile: state.profile }),
    }
  )
);
