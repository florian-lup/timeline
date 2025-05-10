'use client';

import { TypewriterDots } from '@/features/home/components/typewriter-dots';
import { Button } from '@/components/ui/button';
import { DateReel } from '@/features/home/components/spotlight';
import Link from 'next/link';

export function HeroSection() {
  return (
    <main className="flex flex-col flex-grow items-center justify-center max-w-5xl mx-auto w-full px-4 md:px-6 lg:px-8 mt-8 md:mt-12 lg:mt-16 xl:mt-20">
      <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 md:mb-6 lg:mb-8 text-center">
        Writing history
        <TypewriterDots />
      </h1>

      <p className="text-sm md:text-lg lg:text-xl xl:text-2xl mb-6 md:mb-8 lg:mb-10 leading-relaxed max-w-xs md:max-w-xl lg:max-w-2xl xl:max-w-3xl text-center">
        Powered by AI, the platform tracks noteworthy events around the world and stitches them into a smooth, ever-growing thread
      </p>

      {/* Date Reel component */}
      <div className="w-full mb-6 md:mb-8 lg:mb-10">
        <DateReel />
      </div>

      <div className="flex justify-center">
        <Link href="/timeline">
          <Button>Read Timeline</Button>
        </Link>
      </div>
    </main>
  );
} 