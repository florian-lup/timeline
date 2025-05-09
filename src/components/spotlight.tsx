'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';

// Sample date entries - shortened longer location names
const dateEntries = [
  { date: '2 May, 2025', time: '19:35', location: 'England' },
  { date: '15 June, 2025', time: '08:12', location: 'Tokyo' },
  { date: '3 April, 2025', time: '14:27', location: 'New York' },
  { date: '21 December, 2025', time: '22:45', location: 'Paris' },
  { date: '7 August, 2025', time: '11:03', location: 'Sydney' },
  { date: '19 September, 2025', time: '16:58', location: 'Berlin' },
  { date: '11 January, 2025', time: '05:22', location: 'Moscow' },
  { date: '27 March, 2025', time: '13:40', location: 'Rio' },
  { date: '9 July, 2025', time: '10:15', location: 'Cape Town' },
  { date: '4 October, 2025', time: '07:51', location: 'Dubai' },
  { date: '3 May, 2025', time: '21:33', location: 'Singapore' },
  { date: '16 February, 2025', time: '15:47', location: 'Toronto' },
  { date: '8 May, 2025', time: '12:29', location: 'Amsterdam' },
  { date: '25 June, 2025', time: '18:04', location: 'Barcelona' },
  { date: '13 August, 2025', time: '23:17', location: 'Seoul' },
];

export const DateReel = () => {
  // Independent state for each reel
  const [firstReelIndex, setFirstReelIndex] = useState(0);
  const [secondReelIndex, setSecondReelIndex] = useState(1);
  const [thirdReelIndex, setThirdReelIndex] = useState(2);
  const [mobileReelIndex, setMobileReelIndex] = useState(0);

  useEffect(() => {
    // Different timing for each reel
    const firstInterval = setInterval(() => {
      setFirstReelIndex(prev => (prev + 1) % dateEntries.length);
    }, 6000); // First reel changes every 6 seconds

    const secondInterval = setInterval(() => {
      setSecondReelIndex(prev => (prev + 1) % dateEntries.length);
    }, 6800); // Second reel changes every 6.8 seconds

    const thirdInterval = setInterval(() => {
      setThirdReelIndex(prev => (prev + 1) % dateEntries.length);
    }, 6500); // Third reel changes every 6.5 seconds

    // Mobile reel timing (cycles through more frequently)
    const mobileInterval = setInterval(() => {
      setMobileReelIndex(prev => (prev + 1) % dateEntries.length);
    }, 5000); // Mobile reel changes every 5 seconds

    return () => {
      clearInterval(firstInterval);
      clearInterval(secondInterval);
      clearInterval(thirdInterval);
      clearInterval(mobileInterval);
    };
  }, []);

  // Configuration for each reel to make them visually distinct
  const reelConfigs = [
    { 
      index: firstReelIndex, 
      transitionSpeed: 1.8,
    },
    { 
      index: secondReelIndex, 
      transitionSpeed: 2.0,
    },
    { 
      index: thirdReelIndex, 
      transitionSpeed: 1.9,
    }
  ];

  return (
    <>
      {/* Mobile view - single date reel */}
      <div className="block md:hidden w-full mb-6 md:mb-8">
        <Card className="backdrop-blur-sm min-h-[3rem] sm:min-h-[3.5rem] py-0 flex items-center justify-center overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={mobileReelIndex}
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -40, opacity: 0 }}
              transition={{ duration: 1.5 }}
              className="w-full"
            >
              <CardContent className="p-3 sm:p-4 text-center">
                <div className="inline-flex items-center whitespace-nowrap text-xs sm:text-sm">
                  <span className="font-medium">{dateEntries[mobileReelIndex].date}</span>
                  <span className="mx-1 sm:mx-1.5">•</span>
                  <span>{dateEntries[mobileReelIndex].time}</span>
                  <span className="mx-1 sm:mx-1.5">•</span>
                  <span>{dateEntries[mobileReelIndex].location}</span>
                </div>
              </CardContent>
            </motion.div>
          </AnimatePresence>
        </Card>
      </div>

      {/* Medium view - two date reels */}
      <div className="hidden md:grid lg:hidden md:grid-cols-2 md:gap-3 lg:gap-4 mb-6 md:mb-8 w-full">
        {reelConfigs.slice(0, 2).map((config, reelIndex) => (
          <Card 
            key={reelIndex} 
            className="backdrop-blur-sm min-h-[2.75rem] md:min-h-[3rem] py-0 flex items-center justify-center overflow-hidden"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={config.index}
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -40, opacity: 0 }}
                transition={{ duration: config.transitionSpeed }}
                className="w-full"
              >
                <CardContent className="p-3 md:p-4 text-center">
                  <div className="inline-flex items-center whitespace-nowrap text-xs md:text-sm">
                    <span className="font-medium">{dateEntries[config.index].date}</span>
                    <span className="mx-1 md:mx-1.5">•</span>
                    <span>{dateEntries[config.index].time}</span>
                    <span className="mx-1 md:mx-1.5">•</span>
                    <span>{dateEntries[config.index].location}</span>
                  </div>
                </CardContent>
              </motion.div>
            </AnimatePresence>
          </Card>
        ))}
      </div>

      {/* Large view - three date reels */}
      <div className="hidden lg:grid lg:grid-cols-3 lg:gap-3 xl:gap-4 mb-6 lg:mb-8 w-full">
        {reelConfigs.map((config, reelIndex) => (
          <Card 
            key={reelIndex} 
            className="backdrop-blur-sm min-h-[2.75rem] lg:min-h-[3rem] xl:min-h-[3.5rem] py-0 flex items-center justify-center overflow-hidden"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={config.index}
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -40, opacity: 0 }}
                transition={{ duration: config.transitionSpeed }}
                className="w-full"
              >
                <CardContent className="p-3 lg:p-4 xl:p-5 text-center">
                  <div className="inline-flex items-center whitespace-nowrap text-xs lg:text-sm xl:text-base">
                    <span className="font-medium">{dateEntries[config.index].date}</span>
                    <span className="mx-1 lg:mx-1.5">•</span>
                    <span>{dateEntries[config.index].time}</span>
                    <span className="mx-1 lg:mx-1.5">•</span>
                    <span>{dateEntries[config.index].location}</span>
                  </div>
                </CardContent>
              </motion.div>
            </AnimatePresence>
          </Card>
        ))}
      </div>
    </>
  );
};
