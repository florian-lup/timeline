'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { ArticlesData } from '@/types/events/articles';
import { Skeleton } from '@/components/ui/skeleton';
import { formatEventDate } from '@/utils/dateFormatters';
import { fetchEvents } from '@/services/events/api';

/**
 * Loading state for event card
 */
function EventCardSkeleton() {
  return (
    <div className="flex items-center w-full">
      <div className="flex justify-between items-center w-full">
        <Skeleton className="h-4 w-3/5" />
        <div className="ml-2 flex">
          <Skeleton className="h-5 w-24 rounded-full" />
        </div>
      </div>
    </div>
  );
}

/**
 * Empty state when no events available
 */
function EmptyEventCard() {
  return (
    <div className="flex items-center w-full">
      <div className="flex justify-between items-center w-full">
        <p className="text-xs md:text-sm text-center text-muted-foreground">No events available</p>
        <div className="ml-2 flex">
          <Skeleton className="h-5 w-24 rounded-full opacity-40" />
        </div>
      </div>
    </div>
  );
}

/**
 * Auto-scrolling event carousel with pagination dots
 */
export function EventCarousel() {
  const [activeEventIndex, setActiveEventIndex] = useState(0);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const [recentEvents, setRecentEvents] = useState<ArticlesData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch recent events from the API
  useEffect(() => {
    let isMounted = true;

    async function getRecentEvents() {
      try {
        const data = await fetchEvents(1, 5);

        if (isMounted) {
          setRecentEvents(data.entries);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Failed to fetch timeline entries:', error);
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    getRecentEvents();

    return () => {
      isMounted = false;
    };
  }, []);

  // Auto-scroll through events
  useEffect(() => {
    if (!isAutoScrolling || recentEvents.length === 0) return;

    const interval = setInterval(() => {
      setActiveEventIndex((prev) => (prev + 1) % recentEvents.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoScrolling, recentEvents.length]);

  // Pause auto-scroll when user interacts
  const handleEventClick = (index: number) => {
    setActiveEventIndex(index);
    setIsAutoScrolling(false);
    // Resume auto-scrolling after 10 seconds of inactivity
    setTimeout(() => setIsAutoScrolling(true), 10000);
  };

  return (
    <div className="w-full max-w-md md:max-w-2xl mx-auto">
      {/* Event Card */}
      <div className="w-full relative">
        <div className="bg-card border rounded-xl shadow-sm p-3 md:p-4">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <EventCardSkeleton />
            ) : recentEvents.length > 0 ? (
              <motion.div
                key={activeEventIndex}
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -10, opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="flex items-center w-full"
              >
                <div className="flex justify-between items-center w-full">
                  <p className="text-xs md:text-sm text-center">
                    {recentEvents[activeEventIndex].title}
                  </p>
                  <Badge variant="outline" className="ml-2 text-xs font-medium">
                    {formatEventDate(recentEvents[activeEventIndex].date)}
                  </Badge>
                </div>
              </motion.div>
            ) : (
              <EmptyEventCard />
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Pagination Dots */}
      {recentEvents.length > 0 && (
        <div className="flex justify-center mt-4 space-x-2">
          {recentEvents.map((_, index) => (
            <button
              key={index}
              onClick={() => handleEventClick(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${index === activeEventIndex
                ? 'bg-primary w-4'
                : 'bg-muted-foreground/30 hover:bg-muted-foreground/60'
                }`}
              aria-label={`Go to event ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
