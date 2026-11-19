import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthRepository } from '../auth.repository';
import { AuthUser } from '../../types';
import { MOCK_USER_ID, INITIAL_MOCK_PROFILE } from './mock-data';

const STORAGE_KEY_AUTH_USER = '@bloom360_auth_user';

export class MockAuthRepository implements AuthRepository {
  async login(email: string, password: string): Promise<AuthUser> {
    const cleanEmail = email.trim().toLowerCase();

    // Sesuai spesifikasi paten: sarah@email.com / Sarah123! berhasil
    if (cleanEmail === 'sarah@email.com' && password === 'Sarah123!') {
      const user: AuthUser = {
        id: MOCK_USER_ID,
        email: INITIAL_MOCK_PROFILE.email,
        fullName: INITIAL_MOCK_PROFILE.fullName,
      };
      await AsyncStorage.setItem(STORAGE_KEY_AUTH_USER, JSON.stringify(user));
      return user;
    }

    // Jika kredensial salah, lemparkan error persis sesuai spesifikasi
    throw new Error('Email atau kata sandi salah');
  }

  async register(email: string, _password: string, fullName: string): Promise<AuthUser> {
    const cleanEmail = email.trim().toLowerCase();
    const newUser: AuthUser = {
      id: `user-${Date.now()}`,
      email: cleanEmail,
      fullName: fullName.trim(),
    };
    await AsyncStorage.setItem(STORAGE_KEY_AUTH_USER, JSON.stringify(newUser));
    return newUser;
  }

  async requestPasswordReset(email: string): Promise<{ success: boolean; message: string; expiryMinutes: number }> {
    const cleanEmail = email.trim().toLowerCase();
    // Simulasi pengiriman token pemulihan 60 menit
    return {
      success: true,
      message: `Tautan dan token pemulihan kata sandi telah dikirim ke ${cleanEmail}. Berlaku selama 60 menit.`,
      expiryMinutes: 60,
    };
  }

  async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY_AUTH_USER);
      if (data) {
        return JSON.parse(data) as AuthUser;
      }
      return null;
    } catch {
      return null;
    }
  }

  async logout(): Promise<void> {
    await AsyncStorage.removeItem(STORAGE_KEY_AUTH_USER);
  }
}
