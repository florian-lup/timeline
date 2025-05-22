'use client';

import { useEffect } from 'react';
import { trackPageView } from '@/services/analytics/viewTracking';

export function PageViewTracker() {
  useEffect(() => {
    trackPageView();
  }, []);
  return null;
}
