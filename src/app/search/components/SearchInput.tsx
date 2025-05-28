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
const SearchInput = React.forwardRef<HTMLInputElement, React.ComponentProps<typeof Input>>(function SearchInput({ className, value, ...props }, ref) {
  const [isWeb, setIsWeb] = React.useState(false);

  const placeholder = isWeb ? 'search the web...' : 'search in timeline...';
  const isInputEmpty = !value || (typeof value === 'string' && value.trim() === '');

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
          id="search-mode-toggle"
          name="search-mode"
          checked={isWeb}
          onCheckedChange={setIsWeb}
          className="absolute left-8 top-1/2 -translate-y-1/2 scale-75"
        />

        {/* Text input */}
        <Input
          ref={ref}
          id="search-input"
          name="search-query"
          className={cn('pl-[4.5rem] pr-4 rounded-r-none rounded-l-full focus-visible:ring-0', className)}
          type="search"
          value={value}
          {...props}
          placeholder={placeholder}
        />
      </div>
      <Button type="submit" disabled={isInputEmpty} className="rounded-l-none whitespace-nowrap h-9 px-4">
        Search
      </Button>
    </div>
  );
});
SearchInput.displayName = 'SearchInput';

export { SearchInput };
