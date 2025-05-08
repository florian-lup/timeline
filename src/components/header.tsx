import Link from 'next/link';
import { ThemeToggle } from '@/components/ThemeToggle';
import { ThemeLogo } from '@/components/ThemeLogo';

/**
 * Header component for the timeline page with navigation and theme toggle
 */
export function Header() {
  return (
    <header className="sticky top-0 z-10 backdrop-blur-sm">
      <div className="flex items-center justify-between px-3 sm:px-4 md:px-6 lg:px-8 py-2 md:py-3 lg:py-4 w-full">
        <Link
          href="/"
          className="flex items-center justify-center gap-1 md:gap-2 font-medium text-sm md:text-base lg:text-lg"
        >
          <div className="flex items-center justify-center">
            <ThemeLogo width={24} height={24} className="rounded-full md:w-[28px] md:h-[28px] lg:w-[32px] lg:h-[32px]" />
          </div>
          <span className="flex items-center">Timeline</span>
        </Link>
        <ThemeToggle />
      </div>
    </header>
  );
}
