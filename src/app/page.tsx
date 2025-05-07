'use client';

import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Button } from '@/ui/button';
import { DateReel } from '@/components/spotlight';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />

      {/* Hero section */}
      <main className="flex flex-col flex-grow items-center justify-center max-w-5xl mx-auto w-full px-5 mt-12 md:mt-16">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-center">
          Writing history
          <span className="typewriter-dots"></span>
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed max-w-3xl text-center">
          Powered by AI, the platform tracks noteworthy events around the world and stitches them into a smooth, ever-growing thread
        </p>

        {/* Date Reel component */}
        <div className="w-full mb-10">
          <DateReel />
        </div>

        <div className="flex justify-center">
          <Link href="/timeline">
            <Button size="sm">Read Timeline</Button>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
