import { create } from 'zustand';
import { Workout, WeeklyProgressSummary } from '../types';
import { workoutRepository } from '../repositories';

interface WorkoutState {
  workouts: Workout[];
  recentRun: Workout | null;
  weeklySummary: WeeklyProgressSummary | null;
  isLoading: boolean;
  error: string | null;

  fetchWorkouts: (userId: string) => Promise<void>;
  fetchRecentRun: (userId: string) => Promise<void>;
  fetchWeeklySummary: (userId: string) => Promise<void>;
  saveWorkoutSession: (workout: Omit<Workout, 'id' | 'createdAt'>) => Promise<Workout | null>;
  clearError: () => void;
}

export const useWorkoutStore = create<WorkoutState>((set, get) => ({
  workouts: [],
  recentRun: null,
  weeklySummary: null,
  isLoading: false,
  error: null,

  fetchWorkouts: async (userId: string) => {
    set({ isLoading: true, error: null });
    try {
      const workouts = await workoutRepository.getWorkouts(userId);
      set({ workouts, isLoading: false, error: null });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Gagal memuat daftar latihan';
      set({ error: message, isLoading: false });
    }
  },

  fetchRecentRun: async (userId: string) => {
    set({ isLoading: true, error: null });
    try {
      const recent = await workoutRepository.getRecentRun(userId);
      set({ recentRun: recent, isLoading: false, error: null });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Gagal memuat sesi lari terakhir';
      set({ error: message, isLoading: false });
    }
  },

  fetchWeeklySummary: async (userId: string) => {
    set({ isLoading: true, error: null });
    try {
      const summary = await workoutRepository.getWeeklySummary(userId);
      set({ weeklySummary: summary, isLoading: false, error: null });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Gagal memuat ringkasan mingguan';
      set({ error: message, isLoading: false });
    }
  },

  saveWorkoutSession: async (workout: Omit<Workout, 'id' | 'createdAt'>): Promise<Workout | null> => {
    set({ isLoading: true, error: null });
    try {
      const saved = await workoutRepository.saveWorkout(workout);
      const workouts = await workoutRepository.getWorkouts(workout.userId);
      const recent = await workoutRepository.getRecentRun(workout.userId);
      set({ workouts, recentRun: recent, isLoading: false, error: null });
      return saved;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Gagal menyimpan sesi latihan';
      set({ error: message, isLoading: false });
      return null;
    }
  },

  clearError: () => set({ error: null }),
}));
