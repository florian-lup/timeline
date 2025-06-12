import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines multiple class names with proper Tailwind merging
 * Resolves conflicts between Tailwind classes automatically
 * @param inputs - Array of class names, objects, or conditional classes
 * @returns Merged class string with conflicts resolved
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
