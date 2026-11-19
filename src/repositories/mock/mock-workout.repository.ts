import AsyncStorage from '@react-native-async-storage/async-storage';
import { WorkoutRepository } from '../workout.repository';
import { Workout, WeeklyProgressSummary } from '../../types';
import { INITIAL_MOCK_WORKOUTS, INITIAL_WEEKLY_PROGRESS } from './mock-data';

const STORAGE_KEY_WORKOUT = '@bloom360_workouts';

export class MockWorkoutRepository implements WorkoutRepository {
  private inMemoryWorkouts: Workout[] = [...INITIAL_MOCK_WORKOUTS];

  private async loadFromStorage(userId: string): Promise<Workout[]> {
    try {
      const stored = await AsyncStorage.getItem(`${STORAGE_KEY_WORKOUT}_${userId}`);
      if (stored) {
        this.inMemoryWorkouts = JSON.parse(stored);
      }
    } catch {
      // Fallback in-memory
    }
    return this.inMemoryWorkouts;
  }

  private async saveToStorage(userId: string): Promise<void> {
    try {
      await AsyncStorage.setItem(`${STORAGE_KEY_WORKOUT}_${userId}`, JSON.stringify(this.inMemoryWorkouts));
    } catch {
      // Ignore
    }
  }

  async getWorkouts(userId: string): Promise<Workout[]> {
    await this.loadFromStorage(userId);
    return this.inMemoryWorkouts.filter(w => w.userId === userId);
  }

  async getRecentRun(userId: string): Promise<Workout | null> {
    const workouts = await this.getWorkouts(userId);
    const runningWorkouts = workouts.filter(w => w.workoutType === 'running');
    if (runningWorkouts.length === 0) return null;
    // Mengembalikan lari terakhir yang tercatat
    return runningWorkouts[0];
  }

  async saveWorkout(workout: Omit<Workout, 'id' | 'createdAt'>): Promise<Workout> {
    await this.loadFromStorage(workout.userId);
    const newWorkout: Workout = {
      ...workout,
      id: `workout-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    // Masukkan ke urutan paling depan (terbaru)
    this.inMemoryWorkouts.unshift(newWorkout);
    await this.saveToStorage(workout.userId);
    return newWorkout;
  }

  async getWeeklySummary(_userId: string): Promise<WeeklyProgressSummary> {
    // Sesuai data paten persona Sarah Putri: 21.5 / 25 km (86%)
    return { ...INITIAL_WEEKLY_PROGRESS };
  }
}
