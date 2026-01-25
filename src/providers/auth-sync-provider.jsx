"use client";

import { useEffect, useRef } from "react";
import { useAuthStore } from "@/store/authStore";

/**
 * AuthSyncProvider - Cookie va localStorage sinxronizatsiyasi
 *
 * Hozirgi arxitektura:
 * - Login: Server action cookie o'rnatadi + client localStorage'ga saqlaydi
 * - Logout: Cookie va localStorage tozalanadi
 * - Refresh: Cookie'dan session tekshiriladi va zustand store'ga sync qilinadi
 */
export function AuthSyncProvider({ children }) {
  const setAuth = useAuthStore((state) => state.setAuth);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const syncedRef = useRef(false);

  useEffect(() => {
    // Faqat bir marta sync qilish
    if (syncedRef.current) return;
    syncedRef.current = true;

    const syncSession = async () => {
      try {
        const response = await fetch("/api/auth/session", {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          // Cookie yo'q yoki expired - localStorage'ni ham tozalash
          clearAuth();
          return;
        }

        const data = await response.json();
        if (data.success && data.data?.token) {
          // Cookie'dan session bor - zustand'ga sync qilish
          setAuth({
            token: data.data.token,
            user: data.data.user,
          });
        } else {
          clearAuth();
        }
      } catch (error) {
        console.error("Failed to sync auth session:", error);
        // Network error - localStorage'dagi ma'lumotni saqlab qolish
      }
    };

    syncSession();
  }, [setAuth, clearAuth]);

  return children;
}
