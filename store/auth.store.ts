import { AuthUser, User } from "@/interfaces/user";
import { flattenUser } from "@/lib/utils";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  token: string | null;
  authUser: AuthUser | null; // flattened for easy access
  user: User | null; // raw user from API
  isAuthenticated: boolean;
  setToken: (token: string) => void;
  setAuth: (token: string, user: User) => void;
  clearAuth: () => void;
  updateUser: (userData: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      authUser: null,
      isAuthenticated: false,

      setToken: (token: string) => set({ token }),

      setAuth: (token, user) => {
        set({
          token,
          user,
          authUser: flattenUser(user),
          isAuthenticated: true,
        });
      },

      clearAuth: () =>
        set({
          token: null,
          user: null,
          authUser: null,
          isAuthenticated: false,
        }),

      updateUser: (userData) =>
        set((state) => {
          const updatedUser = state.user
            ? { ...state.user, ...userData }
            : (userData as User);

          return {
            user: updatedUser,
            authUser: flattenUser(updatedUser),
            isAuthenticated: true,
          };
        }),
    }),
    {
      name: "auth-storage",
    }
  )
);
