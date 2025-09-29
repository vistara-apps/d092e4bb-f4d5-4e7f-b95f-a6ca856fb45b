import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatRiskLevel(riskLevel: string): string {
  return riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1);
}

export function formatTemperature(temp: number): string {
  return `${Math.round(temp)}°C`;
}

export function formatPrecipitation(mm: number): string {
  if (mm < 0.1) return '0 mm';
  if (mm < 1) return '< 1 mm';
  return `${Math.round(mm)} mm`;
}

export function formatWindSpeed(speed: number): string {
  return `${Math.round(speed)} m/s`;
}

export function getRiskColor(riskLevel: string): string {
  switch (riskLevel) {
    case 'extreme':
      return 'text-red-600';
    case 'high':
      return 'text-orange-600';
    case 'medium':
      return 'text-yellow-600';
    case 'low':
      return 'text-blue-600';
    case 'none':
      return 'text-green-600';
    default:
      return 'text-gray-600';
  }
}

export function getRiskBgColor(riskLevel: string): string {
  switch (riskLevel) {
    case 'extreme':
      return 'bg-red-100';
    case 'high':
      return 'bg-orange-100';
    case 'medium':
      return 'bg-yellow-100';
    case 'low':
      return 'bg-blue-100';
    case 'none':
      return 'bg-green-100';
    default:
      return 'bg-gray-100';
  }
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

