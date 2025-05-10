'use client';

import { useState, useEffect } from 'react';
import { TypewriterDots } from '@/features/home/components/typewriter-dots';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';

// Historical events for the interactive timeline
const historicalEvents = [
  { date: 'Jan 15, 2025', description: 'First commercial quantum computer available to the public' },
  { date: 'Mar 22, 2025', description: 'Global climate agreement signed by 195 countries' },
  { date: 'May 10, 2025', description: 'First successful brain-computer interface implant' },
  { date: 'Jul 04, 2025', description: 'New energy storage technology doubles battery capacity' },
  { date: 'Sep 18, 2025', description: 'First fully autonomous public transport network launched' },
  { date: 'Nov 30, 2025', description: 'Breakthrough medical treatment reverses cellular aging' },
];

export function HeroSection() {
  const [activeEventIndex, setActiveEventIndex] = useState(0);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);

  // Auto-scroll through events
  useEffect(() => {
    if (!isAutoScrolling) return;
    
    const interval = setInterval(() => {
      setActiveEventIndex((prev) => (prev + 1) % historicalEvents.length);
    }, 4000);
    
    return () => clearInterval(interval);
  }, [isAutoScrolling]);

  // Pause auto-scroll when user interacts
  const handleEventClick = (index: number) => {
    setActiveEventIndex(index);
    setIsAutoScrolling(false);
    // Resume auto-scrolling after 10 seconds of inactivity
    setTimeout(() => setIsAutoScrolling(true), 10000);
  };

  return (
    <main className="flex flex-col flex-grow items-center justify-center w-full p-4 md:p-6 lg:p-8">
      <div className="relative z-10 flex flex-col items-center max-w-5xl mx-auto w-full">
      <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 md:mb-6 lg:mb-8 text-center">
        Writing history
        <TypewriterDots />
      </h1>

      <p className="text-sm md:text-lg lg:text-xl xl:text-2xl mb-6 md:mb-8 lg:mb-10 leading-relaxed max-w-xs md:max-w-xl lg:max-w-2xl xl:max-w-3xl text-center">
        Powered by AI, the platform tracks noteworthy events around the world and stitches them into a smooth, ever-growing thread
      </p>

        {/* Event Carousel */}
        <div className="w-full max-w-md md:max-w-2xl mx-auto px-6 mb-8">
          {/* Event Card */}
          <div className="w-full relative">
            <div className="bg-card border rounded-lg shadow-sm p-3 md:p-4">
              <AnimatePresence mode="wait">
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
                      {historicalEvents[activeEventIndex].description}
                    </p>
                    <Badge variant="outline" className="ml-2 text-xs font-medium">
                      {historicalEvents[activeEventIndex].date}
                    </Badge>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
          
          {/* Pagination Dots */}
          <div className="flex justify-center mt-4 space-x-2">
            {historicalEvents.map((_, index) => (
              <button
                key={index}
                onClick={() => handleEventClick(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === activeEventIndex 
                    ? 'bg-primary w-4'
                    : 'bg-muted-foreground/30 hover:bg-muted-foreground/60'
                }`}
                aria-label={`Go to event ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
} 