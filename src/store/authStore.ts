import { create } from 'zustand';
import { AuthUser } from '../types';
import { authRepository } from '../repositories';

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, fullName: string) => Promise<boolean>;
  resetPassword: (email: string) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
  checkAuthSession: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (email: string, password: string): Promise<boolean> => {
    set({ isLoading: true, error: null });
    try {
      const user = await authRepository.login(email, password);
      set({ user, isAuthenticated: true, isLoading: false, error: null });
      return true;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Gagal masuk akun';
      set({ error: message, isLoading: false, isAuthenticated: false });
      return false;
    }
  },

  register: async (email: string, password: string, fullName: string): Promise<boolean> => {
    set({ isLoading: true, error: null });
    try {
      const user = await authRepository.register(email, password, fullName);
      set({ user, isAuthenticated: true, isLoading: false, error: null });
      return true;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Gagal mendaftarkan akun';
      set({ error: message, isLoading: false });
      return false;
    }
  },

  resetPassword: async (email: string) => {
    set({ isLoading: true, error: null });
    try {
      const res = await authRepository.requestPasswordReset(email);
      set({ isLoading: false });
      return { success: res.success, message: res.message };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Gagal memproses reset kata sandi';
      set({ error: message, isLoading: false });
      return { success: false, message };
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await authRepository.logout();
    } finally {
      set({ user: null, isAuthenticated: false, isLoading: false, error: null });
    }
  },

  checkAuthSession: async () => {
    set({ isLoading: true });
    try {
      const user = await authRepository.getCurrentUser();
      if (user) {
        set({ user, isAuthenticated: true, isLoading: false });
      } else {
        set({ user: null, isAuthenticated: false, isLoading: false });
      }
    } catch {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  clearError: () => set({ error: null }),
}));
