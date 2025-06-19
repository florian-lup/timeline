'use client';

import { AudioLines } from 'lucide-react';

import { ChatWidget } from '@/components/search/search-widget';
import { ThemeLogo } from '@/components/theme-logo';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

/**
 * Sticky header for the newsfeed page
 */
export function Header() {
  const handleSearchSubmit = (text: string, searchType: string) => {
    console.log('Search submitted:', text, 'Type:', searchType);
  };

  const handleSearchTypeChange = (type: string) => {
    console.log('Search type changed:', type);
  };

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur">
      <div className="mx-auto w-full max-w-xl px-3 md:max-w-2xl md:px-4 lg:max-w-3xl lg:px-6 xl:max-w-4xl">
        <div className="flex h-14 w-full items-center justify-between">
          {/* Logo on the left */}
          <div className="flex items-center gap-2">
            <ThemeLogo width={30} height={30} />
            Timeline
          </div>

          {/* Action buttons on the right */}
          <div className="flex items-center gap-3">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <ChatWidget
                    onSubmit={handleSearchSubmit}
                    onSearchTypeChange={handleSearchTypeChange}
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Search stories</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="default"
                    onClick={() => {
                      // coming soon
                    }}
                    aria-label="Audio Lines"
                  >
                    <AudioLines />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Coming soon</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>
    </header>
  );
}
