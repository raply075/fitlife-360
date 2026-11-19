/**
 * Token Warna Desain Bloom360 (FitLife 360)
 * Sesuai panduan UI/UX FigCraft Dyah Purwaningsih
 */

export const colors = {
  // Brand Colors
  primary: '#16A34A',
  forest: '#15803D',
  primaryLight: '#22C55E',
  primaryDark: '#14532D',

  // Neutral Colors
  slate: '#0F172A',
  slateLight: '#334155',
  slateMuted: '#64748B',
  bg: '#F8FAFC',
  white: '#FFFFFF',
  surface: '#FFFFFF',
  border: '#E2E8F0',
  borderLight: '#F1F5F9',
  divider: '#CBD5E1',

  // Kartu & Aksen Fungsional
  cardHijau: '#DCFCE7',
  cardMakanan: '#FEF3C7',
  cardLari: '#E0F2FE',
  cardAuth: '#F3E8FF',

  // Status & Feedback
  success: '#16A34A',
  successLight: '#DCFCE7',
  error: '#EF4444',
  errorLight: '#FEE2E2',
  warning: '#F59E0B',
  warningLight: '#FEF3C7',
  info: '#0284C7',
  infoLight: '#E0F2FE',

  // Text Colors
  textPrimary: '#0F172A',
  textSecondary: '#475569',
  textMuted: '#94A3B8',
  textOnPrimary: '#FFFFFF',
  textSuccess: '#15803D',
  textWarning: '#B45309',
  textError: '#DC2626',
  textInfo: '#0369A1',
} as const;

export type ColorToken = keyof typeof colors;
