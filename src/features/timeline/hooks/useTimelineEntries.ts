import { useState, useEffect } from 'react';
import { TimelineEntry } from '../types/TimelineEntry';
import { fetchTimelineEntries } from '../services/timelineService';

/**
 * Custom hook for fetching and managing timeline entries
 * Falls back to mock data if fetching fails
 */
export function useTimelineEntries() {
  const [entries, setEntries] = useState<TimelineEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadTimelineEntries() {
      try {
        setIsLoading(true);
        const data = await fetchTimelineEntries();
        setEntries(data);
        setError(null);
      } catch (err) {
        console.error('Error loading timeline entries:', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadTimelineEntries();
  }, []);

  return { entries, isLoading, error };
} 