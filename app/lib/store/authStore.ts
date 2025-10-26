// src/lib/store/authStore.ts

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: string;
  username: string;
  nama: string;
  role: "PEGAWAI" | "DIVISI_SDM" | "ADMIN";
}

interface AuthState {
  user: User | null;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
  isSDM: () => boolean;
  isPegawai: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,

      setAuth: (user, token) => {
        set({ user, token });
      },

      logout: () => {
        set({ user: null, token: null });
      },

      isAuthenticated: () => {
        return get().user !== null && get().token !== null;
      },

      isSDM: () => {
        return get().user?.role === "DIVISI_SDM" || get().user?.role === "ADMIN";
      },

      isPegawai: () => {
        return get().user?.role === "PEGAWAI";
      },
    }),
    {
      name: "auth-storage",
    }
  )
);