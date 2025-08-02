import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Member } from "@/entities/member";

const STORAGE_KEY = "scheduo-auth";

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: Member | null;

  setAuth: (accessToken: string, refreshToken: string, user?: Member) => void;
  clearAuth: () => void;
  updateAccessToken: (accessToken: string) => void;
  setUser: (user: Member) => void;
  updateUser: (updates: Partial<Member>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      user: null,

      setAuth: (accessToken, refreshToken, user) =>
        set((state) => ({
          accessToken,
          refreshToken,
          user: user ?? state.user,
        })),

      clearAuth: () =>
        set({
          accessToken: null,
          refreshToken: null,
          user: null,
        }),

      updateAccessToken: (accessToken) => set({ accessToken }),

      setUser: (user) => set({ user }),

      updateUser: (updates) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),
    }),
    {
      name: STORAGE_KEY,
    },
  ),
);
