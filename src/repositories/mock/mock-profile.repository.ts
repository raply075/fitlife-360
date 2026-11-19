import AsyncStorage from '@react-native-async-storage/async-storage';
import { ProfileRepository } from '../profile.repository';
import { Profile } from '../../types';
import { INITIAL_MOCK_PROFILE } from './mock-data';

const STORAGE_KEY_PROFILE = '@bloom360_user_profile';

export class MockProfileRepository implements ProfileRepository {
  private inMemoryProfile: Profile = { ...INITIAL_MOCK_PROFILE };

  async getProfile(userId: string): Promise<Profile> {
    try {
      const stored = await AsyncStorage.getItem(`${STORAGE_KEY_PROFILE}_${userId}`);
      if (stored) {
        this.inMemoryProfile = JSON.parse(stored);
        return this.inMemoryProfile;
      }
    } catch {
      // Fallback in-memory
    }
    return this.inMemoryProfile;
  }

  async updateProfile(userId: string, data: Partial<Profile>): Promise<Profile> {
    const current = await this.getProfile(userId);
    const updated: Profile = {
      ...current,
      ...data,
    };
    this.inMemoryProfile = updated;
    await AsyncStorage.setItem(`${STORAGE_KEY_PROFILE}_${userId}`, JSON.stringify(updated));
    return updated;
  }

  async updateTargets(
    userId: string,
    targetWeight: number,
    weeklyRunningTargetKm: number,
    weeklyWorkoutHoursTarget: number,
    dailyCalorieTarget: number
  ): Promise<Profile> {
    return this.updateProfile(userId, {
      targetWeight,
      weeklyRunningTargetKm,
      weeklyWorkoutHoursTarget,
      dailyCalorieTarget,
    });
  }
}
