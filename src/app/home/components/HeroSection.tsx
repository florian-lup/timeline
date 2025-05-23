'use client';

import { TypewriterDots } from './typewriter-dots';
import { TimelineMetrics } from '@/app/home/components/TimelineMetrics';

/**
 * Animated hero section with recent timeline events
 */
export function HeroSection() {
  return (
    <main className="flex flex-col flex-grow items-center justify-center w-full p-4 md:p-6 lg:p-8">
      <div className="relative z-10 flex flex-col items-center max-w-5xl mx-auto w-full">
        <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 md:mb-6 lg:mb-8 text-center">
          Writing history
          <TypewriterDots />
        </h1>

        <p className="text-sm md:text-lg lg:text-xl xl:text-2xl mb-6 md:mb-8 lg:mb-10 leading-relaxed max-w-xs md:max-w-xl lg:max-2xl xl:max-w-3xl text-center">
          Powered by AI, the platform tracks noteworthy events around the world and stitches them
          into a smooth, ever-growing thread
        </p>

        {/* Timeline Metrics */}
        <TimelineMetrics compact={true} />
      </div>
    </main>
  );
}
