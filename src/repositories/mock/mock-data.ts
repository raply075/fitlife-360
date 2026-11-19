/**
 * Data Mock Awal Berdasarkan Persona Sarah Putri
 * Sesuai spesifikasi proyek Bloom360 & karya Dyah Purwaningsih
 */

import { Profile, FoodLog, Workout, UserReminder, WeeklyProgressSummary } from '../../types';

export const MOCK_USER_ID = 'user-sarah-putri-01';

export const INITIAL_MOCK_PROFILE: Profile = {
  id: MOCK_USER_ID,
  email: 'sarah@email.com',
  fullName: 'Sarah Putri',
  avatarUrl: undefined,
  currentWeight: 62.4, // kg
  targetWeight: 58.0, // kg
  dailyCalorieTarget: 1800, // kkal
  weeklyRunningTargetKm: 25.0, // km
  weeklyWorkoutHoursTarget: 5.0, // jam
};

// Dapatkan string tanggal hari ini (YYYY-MM-DD)
export const getTodayDateString = (): string => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const INITIAL_MOCK_FOOD_LOGS: FoodLog[] = [
  {
    id: 'food-01',
    userId: MOCK_USER_ID,
    mealType: 'sarapan',
    foodName: 'Oatmeal Bowl',
    servingWeightGrams: 100,
    calories: 320,
    carbsGrams: 45.0,
    proteinGrams: 12.0,
    fatGrams: 8.0,
    fiberGrams: 6.0,
    loggedDate: getTodayDateString(),
  },
  {
    id: 'food-02',
    userId: MOCK_USER_ID,
    mealType: 'siang',
    foodName: 'Chicken Salad',
    servingWeightGrams: 250,
    calories: 450,
    carbsGrams: 25.0,
    proteinGrams: 62.5,
    fatGrams: 11.2,
    fiberGrams: 8.0,
    loggedDate: getTodayDateString(),
  },
  {
    id: 'food-03',
    userId: MOCK_USER_ID,
    mealType: 'malam',
    foodName: 'Salmon Panggang',
    servingWeightGrams: 250,
    calories: 520,
    carbsGrams: 0.0,
    proteinGrams: 55.0,
    fatGrams: 32.5,
    fiberGrams: 0.0,
    loggedDate: getTodayDateString(),
  },
];

// Rute simulasi lari komplek Sarah Putri di Jakarta Barat / Sekitarnya
export const INITIAL_MOCK_WAYPOINTS = [
  { lat: -6.1852, lng: 106.7725, timestamp: 1700000000000, altitude: 12 }, // Start Komplek
  { lat: -6.1870, lng: 106.7740, timestamp: 1700000400000, altitude: 18 }, // Pos 1
  { lat: -6.1915, lng: 106.7780, timestamp: 1700000900000, altitude: 24 }, // Jalur Hijau
  { lat: -6.1940, lng: 106.7812, timestamp: 1700001458000, altitude: 36 }, // Finish (+24m elevasi)
];

export const INITIAL_MOCK_WORKOUTS: Workout[] = [
  {
    id: 'workout-01',
    userId: MOCK_USER_ID,
    workoutType: 'running',
    title: 'Lari Santai Komplek',
    durationSeconds: 1458, // 24m 18s
    distanceKm: 3.42,
    caloriesBurned: 245,
    avgPace: '7\'06"/km',
    elevationGainM: 24,
    gpsAccuracyPct: 99.4,
    routeWaypoints: INITIAL_MOCK_WAYPOINTS,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'workout-02',
    userId: MOCK_USER_ID,
    workoutType: 'cardio',
    title: 'Interval Training Tabata',
    durationSeconds: 1800, // 30m
    distanceKm: 0,
    caloriesBurned: 220,
    avgPace: '--\'--"',
    elevationGainM: 0,
    gpsAccuracyPct: 100,
    routeWaypoints: [],
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

export const INITIAL_MOCK_REMINDERS: UserReminder[] = [
  {
    id: 'rem-01',
    userId: MOCK_USER_ID,
    reminderType: 'morning_run',
    title: 'Pengingat Lari Pagi',
    scheduledTime: '06:00',
    isActive: true,
  },
  {
    id: 'rem-02',
    userId: MOCK_USER_ID,
    reminderType: 'lunch_log',
    title: 'Catat Makan Siang',
    scheduledTime: '12:30',
    isActive: true,
  },
  {
    id: 'rem-03',
    userId: MOCK_USER_ID,
    reminderType: 'dinner_log',
    title: 'Catat Makan Malam',
    scheduledTime: '19:30',
    isActive: true,
  },
  {
    id: 'rem-04',
    userId: MOCK_USER_ID,
    reminderType: 'goal_milestone',
    title: 'Notifikasi Rekor 25 km',
    scheduledTime: '20:00',
    isActive: true,
  },
];

export const INITIAL_WEEKLY_PROGRESS: WeeklyProgressSummary = {
  currentWeight: 62.4,
  targetWeight: 58.0,
  weightLossThisWeek: 0.6, // kg
  weeklyDistanceKm: 21.5, // Layar progres: 21,5/25 km (86%)
  weeklyTargetDistanceKm: 25.0,
  weeklyWorkoutHours: 5.2,
  weeklyTargetHours: 5.0,
  caloriesBurnedWeekly: 1480,
  stepsWeekly: 28400,
  avgSleepHours: 7.4,
};
