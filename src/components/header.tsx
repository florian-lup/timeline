import Link from 'next/link';
import Image from 'next/image';
import { ThemeToggle } from '@/components/ThemeToggle';

/**
 * Header component for the timeline page with navigation and theme toggle
 */
export function Header() {
  return (
    <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm">
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 w-full">
        <Link
          href="/"
          className="flex items-center gap-2 font-medium text-base text-foreground/80 hover:text-foreground transition-colors"
        >
          <Image src="/flame.png" alt="Timeline Logo" width={24} height={24} />
          Timeline
        </Link>
        <ThemeToggle />
      </div>
    </header>
  );
}
