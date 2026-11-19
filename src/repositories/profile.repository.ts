import { Profile } from '../types';

export interface ProfileRepository {
  getProfile(userId: string): Promise<Profile>;
  updateProfile(userId: string, data: Partial<Profile>): Promise<Profile>;
  updateTargets(
    userId: string,
    targetWeight: number,
    weeklyRunningTargetKm: number,
    weeklyWorkoutHoursTarget: number,
    dailyCalorieTarget: number
  ): Promise<Profile>;
}
