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
          className="flex items-center justify-center gap-2 font-medium text-base text-foreground/80 hover:text-foreground transition-colors"
        >
          <div className="flex items-center justify-center">
            <Image src="/logo.svg" alt="Timeline Logo" width={28} height={28} className="rounded-full" />
          </div>
          <span className="flex items-center">Timeline</span>
        </Link>
        <ThemeToggle />
      </div>
    </header>
  );
}
