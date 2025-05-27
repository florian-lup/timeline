'use client';

import * as React from 'react';
import { History, Globe } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';

/**
 * Search input with leading search icon.
 * Extends the base `Input` component from the design system.
 */
const SearchInput = React.forwardRef<HTMLInputElement, React.ComponentProps<typeof Input>>(function SearchInput({ className, ...props }, ref) {
  const [isWeb, setIsWeb] = React.useState(false);

  const placeholder = isWeb ? 'search the web...' : 'search the timeline...';

  return (
    <div className="flex w-full">
      <div className="relative flex-1">
        {/* Icons */}
        {isWeb ? (
          <Globe className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        ) : (
          <History className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        )}

        {/* Switch toggle */}
        <Switch
          checked={isWeb}
          onCheckedChange={setIsWeb}
          className="absolute left-8 top-1/2 -translate-y-1/2 scale-75"
        />

        {/* Text input */}
        <Input
          ref={ref}
          id="search-input"
          className={cn('pl-[4.5rem] pr-4 rounded-r-none rounded-l-full focus-visible:ring-0', className)}
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
