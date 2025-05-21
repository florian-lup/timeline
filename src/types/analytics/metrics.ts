/**
 * Constants and type guards for analytics metrics
 */
export const ALLOWED_METRICS = ['views', 'shares', 'reactions'] as const;
export type Metric = (typeof ALLOWED_METRICS)[number];

export function isMetric(str: string): str is Metric {
  return (ALLOWED_METRICS as readonly string[]).includes(str);
}
