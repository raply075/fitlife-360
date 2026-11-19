import { create } from 'zustand';
import { FoodLog } from '../types';
import { foodRepository } from '../repositories';

interface FoodState {
  todayLogs: FoodLog[];
  todaySummary: {
    totalCalories: number;
    totalProtein: number;
    totalCarbs: number;
    totalFat: number;
    totalFiber: number;
  };
  isLoading: boolean;
  error: string | null;

  fetchTodayLogs: (userId: string) => Promise<void>;
  addFood: (log: Omit<FoodLog, 'id'>) => Promise<boolean>;
  deleteFood: (id: string, userId: string) => Promise<boolean>;
  clearError: () => void;
}

export const useFoodStore = create<FoodState>((set, get) => ({
  todayLogs: [],
  todaySummary: {
    totalCalories: 0,
    totalProtein: 0,
    totalCarbs: 0,
    totalFat: 0,
    totalFiber: 0,
  },
  isLoading: false,
  error: null,

  fetchTodayLogs: async (userId: string) => {
    set({ isLoading: true, error: null });
    try {
      const logs = await foodRepository.getTodayLogs(userId);
      const summary = await foodRepository.getTodaySummary(userId);
      set({ todayLogs: logs, todaySummary: summary, isLoading: false, error: null });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Gagal memuat catatan makanan';
      set({ error: message, isLoading: false });
    }
  },

  addFood: async (log: Omit<FoodLog, 'id'>): Promise<boolean> => {
    set({ isLoading: true, error: null });
    try {
      await foodRepository.addFoodLog(log);
      // Re-fetch to update summary and logs
      const logs = await foodRepository.getTodayLogs(log.userId);
      const summary = await foodRepository.getTodaySummary(log.userId);
      set({ todayLogs: logs, todaySummary: summary, isLoading: false, error: null });
      return true;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Gagal menyimpan makanan';
      set({ error: message, isLoading: false });
      return false;
    }
  },

  deleteFood: async (id: string, userId: string): Promise<boolean> => {
    set({ isLoading: true, error: null });
    try {
      await foodRepository.deleteFoodLog(id);
      const logs = await foodRepository.getTodayLogs(userId);
      const summary = await foodRepository.getTodaySummary(userId);
      set({ todayLogs: logs, todaySummary: summary, isLoading: false, error: null });
      return true;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Gagal menghapus makanan';
      set({ error: message, isLoading: false });
      return false;
    }
  },

  clearError: () => set({ error: null }),
}));
