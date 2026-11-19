import { FoodLog } from '../types';

export interface FoodRepository {
  getTodayLogs(userId: string): Promise<FoodLog[]>;
  getLogsByDate(userId: string, date: string): Promise<FoodLog[]>;
  addFoodLog(log: Omit<FoodLog, 'id'>): Promise<FoodLog>;
  deleteFoodLog(id: string): Promise<void>;
  getTodaySummary(userId: string): Promise<{
    totalCalories: number;
    totalProtein: number;
    totalCarbs: number;
    totalFat: number;
    totalFiber: number;
  }>;
}
