/**
 * Perhitungan Pace Lari Real-time & Rata-rata
 * Format output: "m'ss\"/km" (contoh: "7'06\"/km")
 * Jika jarak 0 atau tidak valid → mengembalikan "--'--\""
 */

export function calculatePace(durationSeconds: number, distanceKm: number): string {
  if (!distanceKm || distanceKm <= 0 || durationSeconds <= 0) {
    return '--\'--"';
  }

  // Pace adalah total detik per kilometer
  const secondsPerKm = Math.round(durationSeconds / distanceKm);

  // Jika pace lebih dari 60 menit/km atau tidak masuk akal
  if (secondsPerKm >= 3600) {
    return '59\'59"';
  }

  const minutes = Math.floor(secondsPerKm / 60);
  const seconds = secondsPerKm % 60;

  const formattedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
  return `${minutes}'${formattedSeconds}"`;
}
