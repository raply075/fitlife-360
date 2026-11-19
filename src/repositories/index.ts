/**
 * Repositories Entry Point
 * Layar dan store HANYA mengimpor dari file ini (bukan folder mock langsung).
 * Saat beralih ke Supabase, cukup ganti instansiasi di file ini.
 */

import { AuthRepository } from './auth.repository';
import { ProfileRepository } from './profile.repository';
import { FoodRepository } from './food.repository';
import { WorkoutRepository } from './workout.repository';
import { ReminderRepository } from './reminder.repository';

// Implementasi Mock (Data In-Memory + AsyncStorage)
import { MockAuthRepository } from './mock/mock-auth.repository';
import { MockProfileRepository } from './mock/mock-profile.repository';
import { MockFoodRepository } from './mock/mock-food.repository';
import { MockWorkoutRepository } from './mock/mock-workout.repository';
import { MockReminderRepository } from './mock/mock-reminder.repository';

// Export Interfaces
export * from './auth.repository';
export * from './profile.repository';
export * from './food.repository';
export * from './workout.repository';
export * from './reminder.repository';

// Singletons yang dipakai aplikasi
export const authRepository: AuthRepository = new MockAuthRepository();
export const profileRepository: ProfileRepository = new MockProfileRepository();
export const foodRepository: FoodRepository = new MockFoodRepository();
export const workoutRepository: WorkoutRepository = new MockWorkoutRepository();
export const reminderRepository: ReminderRepository = new MockReminderRepository();
