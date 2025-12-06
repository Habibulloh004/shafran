import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const useProfileStore = create(
  persist(
    (set) => ({
      activeTab: 'profile',
      setActiveTab: (tab) => set({ activeTab: tab }),
      orders: [],
      setOrders: (orders) => set({ orders }),
    }),
    {
      name: 'profile-storage', // unique name for localStorage key
      storage: createJSONStorage(() => localStorage), // use localStorage
      partialize: (state) => ({
        activeTab: state.activeTab,
        orders: state.orders,
      }), // only persist activeTab
    }
  )
);