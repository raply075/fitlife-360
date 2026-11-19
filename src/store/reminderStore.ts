import { create } from 'zustand';
import { UserReminder } from '../types';
import { reminderRepository } from '../repositories';

interface ReminderState {
  reminders: UserReminder[];
  isLoading: boolean;
  error: string | null;

  fetchReminders: (userId: string) => Promise<void>;
  toggleReminder: (id: string, isActive: boolean) => Promise<boolean>;
  updateReminderTime: (id: string, scheduledTime: string) => Promise<boolean>;
  clearError: () => void;
}

export const useReminderStore = create<ReminderState>((set) => ({
  reminders: [],
  isLoading: false,
  error: null,

  fetchReminders: async (userId: string) => {
    set({ isLoading: true, error: null });
    try {
      const reminders = await reminderRepository.getReminders(userId);
      set({ reminders, isLoading: false, error: null });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Gagal memuat pengingat';
      set({ error: message, isLoading: false });
    }
  },

  toggleReminder: async (id: string, isActive: boolean): Promise<boolean> => {
    try {
      const updated = await reminderRepository.toggleReminder(id, isActive);
      set((state) => ({
        reminders: state.reminders.map((r) => (r.id === id ? updated : r)),
      }));
      return true;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Gagal mengubah status pengingat';
      set({ error: message });
      return false;
    }
  },

  updateReminderTime: async (id: string, scheduledTime: string): Promise<boolean> => {
    try {
      const updated = await reminderRepository.updateReminderTime(id, scheduledTime);
      set((state) => ({
        reminders: state.reminders.map((r) => (r.id === id ? updated : r)),
      }));
      return true;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Gagal mengubah waktu pengingat';
      set({ error: message });
      return false;
    }
  },

  clearError: () => set({ error: null }),
}));
