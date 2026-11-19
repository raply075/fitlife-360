import AsyncStorage from '@react-native-async-storage/async-storage';
import { FoodRepository } from '../food.repository';
import { FoodLog } from '../../types';
import { INITIAL_MOCK_FOOD_LOGS, getTodayDateString } from './mock-data';

const STORAGE_KEY_FOOD = '@bloom360_food_logs';

export class MockFoodRepository implements FoodRepository {
  private inMemoryLogs: FoodLog[] = [...INITIAL_MOCK_FOOD_LOGS];

  private async loadFromStorage(userId: string): Promise<FoodLog[]> {
    try {
      const stored = await AsyncStorage.getItem(`${STORAGE_KEY_FOOD}_${userId}`);
      if (stored) {
        this.inMemoryLogs = JSON.parse(stored);
      }
    } catch {
      // Fallback in-memory
    }
    return this.inMemoryLogs;
  }

  private async saveToStorage(userId: string): Promise<void> {
    try {
      await AsyncStorage.setItem(`${STORAGE_KEY_FOOD}_${userId}`, JSON.stringify(this.inMemoryLogs));
    } catch {
      // Ignore
    }
  }

  async getTodayLogs(userId: string): Promise<FoodLog[]> {
    const today = getTodayDateString();
    return this.getLogsByDate(userId, today);
  }

  async getLogsByDate(userId: string, date: string): Promise<FoodLog[]> {
    await this.loadFromStorage(userId);
    return this.inMemoryLogs.filter(log => log.userId === userId && log.loggedDate === date);
  }

  async addFoodLog(log: Omit<FoodLog, 'id'>): Promise<FoodLog> {
    await this.loadFromStorage(log.userId);
    const newLog: FoodLog = {
      ...log,
      id: `food-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    };
    this.inMemoryLogs.push(newLog);
    await this.saveToStorage(log.userId);
    return newLog;
  }

  async deleteFoodLog(id: string): Promise<void> {
    const target = this.inMemoryLogs.find(l => l.id === id);
    if (!target) return;
    this.inMemoryLogs = this.inMemoryLogs.filter(l => l.id !== id);
    await this.saveToStorage(target.userId);
  }

  async getTodaySummary(userId: string): Promise<{
    totalCalories: number;
    totalProtein: number;
    totalCarbs: number;
    totalFat: number;
    totalFiber: number;
  }> {
    const todayLogs = await this.getTodayLogs(userId);
    return todayLogs.reduce(
      (acc, curr) => ({
        totalCalories: acc.totalCalories + curr.calories,
        totalProtein: Number((acc.totalProtein + curr.proteinGrams).toFixed(1)),
        totalCarbs: Number((acc.totalCarbs + curr.carbsGrams).toFixed(1)),
        totalFat: Number((acc.totalFat + curr.fatGrams).toFixed(1)),
        totalFiber: Number((acc.totalFiber + curr.fiberGrams).toFixed(1)),
      }),
      { totalCalories: 0, totalProtein: 0, totalCarbs: 0, totalFat: 0, totalFiber: 0 }
    );
  }
}
