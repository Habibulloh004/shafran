import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { AUTH_COOKIE } from "@/lib/auth/constants";

export const getAuthCookieName = () => AUTH_COOKIE;

export const useAuthStore = create(
  persist(
    (set) => ({
      token: null,
      user: null,
      setAuth: ({ token, user }) => set({ token, user }),
      clearAuth: () => set({ token: null, user: null }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        token: state.token,
        user: state.user,
      }),
    }
  )
);

export const persistAuthCookie = async (session, maxAgeSeconds = 60 * 60 * 24 * 7) => {
  if (typeof window === "undefined") return;

  const payload =
    typeof session === "string"
      ? { token: session }
      : {
          token: session?.token,
          user: session?.user || null,
          phone_number: session?.phone_number,
        };

  if (!payload?.token) {
    console.warn("persistAuthCookie requires a session token");
    return;
  }

  try {
    await fetch("/api/auth/session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...payload,
        maxAge: maxAgeSeconds,
      }),
    });
  } catch (error) {
    console.error("Failed to persist auth session", error);
  }
};

export const clearAuthCookie = async () => {
  if (typeof window === "undefined") return;

  try {
    await fetch("/api/auth/session", {
      method: "DELETE",
    });
  } catch (error) {
    console.error("Failed to clear auth session", error);
  }
};
