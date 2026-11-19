import AsyncStorage from '@react-native-async-storage/async-storage';
import { ReminderRepository } from '../reminder.repository';
import { UserReminder } from '../../types';
import { INITIAL_MOCK_REMINDERS } from './mock-data';

const STORAGE_KEY_REMINDER = '@bloom360_reminders';

export class MockReminderRepository implements ReminderRepository {
  private inMemoryReminders: UserReminder[] = [...INITIAL_MOCK_REMINDERS];

  private async loadFromStorage(userId: string): Promise<UserReminder[]> {
    try {
      const stored = await AsyncStorage.getItem(`${STORAGE_KEY_REMINDER}_${userId}`);
      if (stored) {
        this.inMemoryReminders = JSON.parse(stored);
      }
    } catch {
      // Fallback in-memory
    }
    return this.inMemoryReminders;
  }

  private async saveToStorage(userId: string): Promise<void> {
    try {
      await AsyncStorage.setItem(`${STORAGE_KEY_REMINDER}_${userId}`, JSON.stringify(this.inMemoryReminders));
    } catch {
      // Ignore
    }
  }

  async getReminders(userId: string): Promise<UserReminder[]> {
    await this.loadFromStorage(userId);
    return this.inMemoryReminders.filter(r => r.userId === userId);
  }

  async toggleReminder(id: string, isActive: boolean): Promise<UserReminder> {
    const item = this.inMemoryReminders.find(r => r.id === id);
    if (!item) {
      throw new Error('Pengingat tidak ditemukan');
    }
    item.isActive = isActive;
    await this.saveToStorage(item.userId);
    return { ...item };
  }

  async updateReminderTime(id: string, scheduledTime: string): Promise<UserReminder> {
    const item = this.inMemoryReminders.find(r => r.id === id);
    if (!item) {
      throw new Error('Pengingat tidak ditemukan');
    }
    item.scheduledTime = scheduledTime;
    await this.saveToStorage(item.userId);
    return { ...item };
  }
}
