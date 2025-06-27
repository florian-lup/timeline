'use client';

import { AnchorBroadcast } from '@/components/feed/anchor-broadcast';
import { SearchWidget } from '@/components/search/search-widget';
import { ThemeLogo } from '@/components/theme-logo';

/**
 * Sticky header for the newsfeed page
 */
export function Header() {
  return (
    <header className="fixed top-0 z-50 w-full backdrop-blur">
      <div className="mx-auto w-full max-w-xl px-3 md:max-w-2xl md:px-4 lg:max-w-3xl lg:px-6 xl:max-w-4xl">
        <div className="flex h-14 w-full items-center justify-between">
          {/* Logo on the left */}
          <div className="flex items-center gap-2">
            <ThemeLogo width={30} height={30} />
            Timeline
          </div>

          {/* Action buttons on the right */}
          <div className="flex items-center gap-3">
            <SearchWidget />
            <AnchorBroadcast />
          </div>
        </div>
      </div>
    </header>
  );
}
