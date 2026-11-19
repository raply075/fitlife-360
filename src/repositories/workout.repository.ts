import { Workout, WeeklyProgressSummary } from '../types';

export interface WorkoutRepository {
  getWorkouts(userId: string): Promise<Workout[]>;
  getRecentRun(userId: string): Promise<Workout | null>;
  saveWorkout(workout: Omit<Workout, 'id' | 'createdAt'>): Promise<Workout>;
  getWeeklySummary(userId: string): Promise<WeeklyProgressSummary>;
}
