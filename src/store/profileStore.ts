import { create } from 'zustand';
import { Profile } from '../types';
import { profileRepository } from '../repositories';

interface ProfileState {
  profile: Profile | null;
  isLoading: boolean;
  error: string | null;

  fetchProfile: (userId: string) => Promise<void>;
  updateProfile: (userId: string, data: Partial<Profile>) => Promise<boolean>;
  updateTargets: (
    userId: string,
    targetWeight: number,
    weeklyRunningTargetKm: number,
    weeklyWorkoutHoursTarget: number,
    dailyCalorieTarget: number
  ) => Promise<boolean>;
  clearError: () => void;
}

export const useProfileStore = create<ProfileState>((set, get) => ({
  profile: null,
  isLoading: false,
  error: null,

  fetchProfile: async (userId: string) => {
    set({ isLoading: true, error: null });
    try {
      const profile = await profileRepository.getProfile(userId);
      set({ profile, isLoading: false, error: null });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Gagal memuat profil';
      set({ error: message, isLoading: false });
    }
  },

  updateProfile: async (userId: string, data: Partial<Profile>): Promise<boolean> => {
    set({ isLoading: true, error: null });
    try {
      const updated = await profileRepository.updateProfile(userId, data);
      set({ profile: updated, isLoading: false, error: null });
      return true;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Gagal memperbarui profil';
      set({ error: message, isLoading: false });
      return false;
    }
  },

  updateTargets: async (
    userId: string,
    targetWeight: number,
    weeklyRunningTargetKm: number,
    weeklyWorkoutHoursTarget: number,
    dailyCalorieTarget: number
  ): Promise<boolean> => {
    set({ isLoading: true, error: null });
    try {
      const updated = await profileRepository.updateTargets(
        userId,
        targetWeight,
        weeklyRunningTargetKm,
        weeklyWorkoutHoursTarget,
        dailyCalorieTarget
      );
      set({ profile: updated, isLoading: false, error: null });
      return true;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Gagal memperbarui target kebugaran';
      set({ error: message, isLoading: false });
      return false;
    }
  },

  clearError: () => set({ error: null }),
}));
