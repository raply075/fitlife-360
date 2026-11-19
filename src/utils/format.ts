/**
 * Helper Format Angka, Durasi, dan Tanggal Indonesia
 */

/**
 * Format detik menjadi format "HH:mm:ss" atau "mm:ss"
 * Contoh: 1458 detik -> "24:18", 3665 detik -> "01:01:05"
 */
export function formatDurationStopwatch(seconds: number): string {
  if (!seconds || seconds < 0) return '00:00';

  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);

  const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);

  if (h > 0) {
    return `${pad(h)}:${pad(m)}:${pad(s)}`;
  }
  return `${pad(m)}:${pad(s)}`;
}

/**
 * Format detik menjadi gaya teks bahasa Indonesia, misal "24m 18s" atau "1j 15m"
 */
export function formatDurationIndo(seconds: number): string {
  if (!seconds || seconds <= 0) return '0d';

  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);

  if (h > 0) {
    return m > 0 ? `${h}j ${m}m` : `${h}j`;
  }
  if (m > 0) {
    return s > 0 ? `${m}m ${s}s` : `${m}m`;
  }
  return `${s}s`;
}

/**
 * Format angka ke desimal bahasa Indonesia (menggunakan koma)
 * Contoh: 62.4 -> "62,4", 3.42 -> "3,42"
 */
export function formatNumberId(value: number, decimals: number = 1): string {
  if (value === undefined || value === null || isNaN(value)) return '0';
  const fixed = value.toFixed(decimals);
  return fixed.replace('.', ',');
}

/**
 * Format angka ribuan dengan titik
 * Contoh: 1800 -> "1.800", 28400 -> "28.400"
 */
export function formatThousands(value: number): string {
  if (value === undefined || value === null || isNaN(value)) return '0';
  return Math.round(value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

/**
 * Format tanggal YYYY-MM-DD ke format Indonesia panjang
 * Contoh: "2026-11-19" -> "Kamis, 19 November 2026"
 */
export function formatDateIndo(dateStr: string): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;

  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  const dayName = days[date.getDay()];
  const day = date.getDate();
  const monthName = months[date.getMonth()];
  const year = date.getFullYear();

  return `${dayName}, ${day} ${monthName} ${year}`;
}
