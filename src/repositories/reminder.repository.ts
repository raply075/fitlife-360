import { UserReminder } from '../types';

export interface ReminderRepository {
  getReminders(userId: string): Promise<UserReminder[]>;
  toggleReminder(id: string, isActive: boolean): Promise<UserReminder>;
  updateReminderTime(id: string, scheduledTime: string): Promise<UserReminder>;
}
