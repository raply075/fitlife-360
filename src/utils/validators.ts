/**
 * Validator Murni Bloom360
 * Setiap fungsi mengembalikan { valid: boolean, message?: string }
 */

import { ValidationResult } from '../types';

/**
 * Validasi alamat email dengan regex standar RFC 5322 ringkas
 */
export function validateEmail(email: string): ValidationResult {
  if (!email || email.trim() === '') {
    return { valid: false, message: 'Email tidak boleh kosong' };
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return { valid: false, message: 'Format email tidak valid (contoh: sarah@email.com)' };
  }
  return { valid: true };
}

/**
 * Validasi kata sandi (minimal 8 karakter)
 */
export function validatePassword(password: string): ValidationResult {
  if (!password) {
    return { valid: false, message: 'Kata sandi tidak boleh kosong' };
  }
  if (password.length < 8) {
    return { valid: false, message: 'Kata sandi minimal terdiri dari 8 karakter' };
  }
  return { valid: true };
}

/**
 * Validasi konfirmasi kata sandi
 */
export function validateConfirmPassword(password: string, confirmPassword: string): ValidationResult {
  if (!confirmPassword) {
    return { valid: false, message: 'Konfirmasi kata sandi tidak boleh kosong' };
  }
  if (password !== confirmPassword) {
    return { valid: false, message: 'Konfirmasi kata sandi tidak cocok' };
  }
  return { valid: true };
}

/**
 * Validasi berat porsi makanan (> 0 gram)
 */
export function validateFoodWeight(weightGrams: number): ValidationResult {
  if (weightGrams === undefined || weightGrams === null || isNaN(weightGrams)) {
    return { valid: false, message: 'Porsi makanan harus berupa angka' };
  }
  if (weightGrams <= 0) {
    return { valid: false, message: 'Porsi makanan harus lebih besar dari 0 gram' };
  }
  if (weightGrams > 5000) {
    return { valid: false, message: 'Porsi makanan melebihi batas wajar (maks 5.000g)' };
  }
  return { valid: true };
}

/**
 * Validasi target berat badan (antara 40 - 150 kg)
 */
export function validateTargetWeight(weightKg: number): ValidationResult {
  if (weightKg === undefined || weightKg === null || isNaN(weightKg)) {
    return { valid: false, message: 'Berat badan harus berupa angka' };
  }
  if (weightKg < 40 || weightKg > 150) {
    return { valid: false, message: 'Target berat badan harus berada di antara 40 - 150 kg' };
  }
  return { valid: true };
}

/**
 * Validasi field wajib diisi umum
 */
export function validateRequired(value: string, fieldName: string = 'Field'): ValidationResult {
  if (!value || value.trim() === '') {
    return { valid: false, message: `${fieldName} wajib diisi` };
  }
  return { valid: true };
}
