import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// Default admin credentials
const DEFAULT_ADMIN = {
  username: "admin",
  password: "password",
};

export const useAdminStore = create(
  persist(
    (set, get) => ({
      // Auth state
      isAuthenticated: false,
      admin: null,

      // Credentials (o'zgartirish mumkin)
      credentials: DEFAULT_ADMIN,

      // Login
      login: (username, password) => {
        const { credentials } = get();
        if (username === credentials.username && password === credentials.password) {
          set({
            isAuthenticated: true,
            admin: { username, loginTime: new Date().toISOString() },
          });
          return { success: true };
        }
        return { success: false, error: "Login yoki parol noto'g'ri" };
      },

      // Logout
      logout: () => {
        set({
          isAuthenticated: false,
          admin: null,
        });
      },

      // Parolni o'zgartirish
      changePassword: (currentPassword, newPassword) => {
        const { credentials } = get();
        if (currentPassword !== credentials.password) {
          return { success: false, error: "Joriy parol noto'g'ri" };
        }
        if (newPassword.length < 4) {
          return { success: false, error: "Yangi parol kamida 4 ta belgi bo'lishi kerak" };
        }
        set({
          credentials: { ...credentials, password: newPassword },
        });
        return { success: true, message: "Parol muvaffaqiyatli o'zgartirildi" };
      },

      // Username o'zgartirish
      changeUsername: (currentPassword, newUsername) => {
        const { credentials } = get();
        if (currentPassword !== credentials.password) {
          return { success: false, error: "Parol noto'g'ri" };
        }
        if (newUsername.length < 3) {
          return { success: false, error: "Username kamida 3 ta belgi bo'lishi kerak" };
        }
        set({
          credentials: { ...credentials, username: newUsername },
          admin: { ...get().admin, username: newUsername },
        });
        return { success: true, message: "Username muvaffaqiyatli o'zgartirildi" };
      },
    }),
    {
      name: "admin-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        admin: state.admin,
        credentials: state.credentials,
      }),
    }
  )
);
