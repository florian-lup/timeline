/**
 * Formats a date as "DD Month YYYY" (e.g., "15 January 2023")
 * @param date Date string or Date object to format
 * @returns Formatted date string
 */
export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}
