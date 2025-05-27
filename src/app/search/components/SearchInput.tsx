'use client';

import * as React from 'react';
import { Search } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

/**
 * Search input with leading search icon.
 * Extends the base `Input` component from the design system.
 */
const SearchInput = React.forwardRef<HTMLInputElement, React.ComponentProps<typeof Input>>(function SearchInput({ className, placeholder = 'Search events', ...props }, ref) {
  return (
    <div className="flex w-full">
      <div className="relative flex-1">
        {/* Search icon */}
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        {/* Text input */}
        <Input
          ref={ref}
          id="search-input"
          className={cn('pl-9 pr-4 rounded-r-none rounded-l-full focus-visible:ring-0', className)}
          type="search"
          {...props}
          placeholder={placeholder}
        />
      </div>
      <Button type="submit" className="rounded-l-none whitespace-nowrap h-9 px-4">
        Search
      </Button>
    </div>
  );
});
SearchInput.displayName = 'SearchInput';

export { SearchInput };
