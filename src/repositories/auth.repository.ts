import { AuthUser } from '../types';

export interface AuthRepository {
  login(email: string, password: string): Promise<AuthUser>;
  register(email: string, password: string, fullName: string): Promise<AuthUser>;
  requestPasswordReset(email: string): Promise<{ success: boolean; message: string; expiryMinutes: number }>;
  getCurrentUser(): Promise<AuthUser | null>;
  logout(): Promise<void>;
}
