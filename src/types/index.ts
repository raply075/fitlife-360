/**
 * Definisi Type Data Bloom360 (FitLife 360)
 * Siap diganti backend Supabase nantinya
 */

export interface Profile {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  currentWeight: number; // kg, misal: 62.4
  targetWeight: number; // kg, misal: 58.0
  dailyCalorieTarget: number; // kkal, misal: 1800
  weeklyRunningTargetKm: number; // km, misal: 25.0
  weeklyWorkoutHoursTarget: number; // jam, misal: 5.0
}

export type MealType = 'sarapan' | 'siang' | 'malam' | 'cemilan';

export interface FoodLog {
  id: string;
  userId: string;
  mealType: MealType;
  foodName: string;
  servingWeightGrams: number; // gram
  calories: number; // kkal
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
  fiberGrams: number;
  loggedDate: string; // YYYY-MM-DD
}

export type WorkoutType = 'running' | 'cardio' | 'strength' | 'yoga';

export interface RouteWaypoint {
  lat: number;
  lng: number;
  timestamp: number;
  altitude?: number;
  speed?: number;
}

export interface Workout {
  id: string;
  userId: string;
  workoutType: WorkoutType;
  title: string;
  durationSeconds: number; // detik
  distanceKm: number; // kilometer, misal: 3.42
  caloriesBurned: number; // kkal, misal: 245
  avgPace: string; // misal: "7'06\"/km"
  elevationGainM: number; // meter, misal: 24
  gpsAccuracyPct: number; // persen, misal: 99.4
  routeWaypoints: RouteWaypoint[];
  createdAt: string; // ISO 8601 string
}

export type ReminderType = 'morning_run' | 'lunch_log' | 'dinner_log' | 'goal_milestone';

export interface UserReminder {
  id: string;
  userId: string;
  reminderType: ReminderType;
  title: string;
  scheduledTime: string; // "HH:mm", misal "06:00"
  isActive: boolean;
}

export interface ValidationResult {
  valid: boolean;
  message?: string;
}

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
}

export interface WeeklyProgressSummary {
  currentWeight: number;
  targetWeight: number;
  weightLossThisWeek: number;
  weeklyDistanceKm: number;
  weeklyTargetDistanceKm: number;
  weeklyWorkoutHours: number;
  weeklyTargetHours: number;
  caloriesBurnedWeekly: number;
  stepsWeekly: number;
  avgSleepHours: number;
}

export interface MacroNutrients {
  calories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
  fiberGrams: number;
}
