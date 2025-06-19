'use client';

import * as VisuallyHidden from '@radix-ui/react-visually-hidden';
import { Search } from 'lucide-react';
import * as React from 'react';

import { SearchResults } from '@/components/search/search-results';
import { TextareaInput } from '@/components/search/textarea-input';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog';

interface ChatWidgetProps {
  onSubmit?: (text: string, searchType: string) => void;
  onSearchTypeChange?: (type: string) => void;
  searchType?: string;
  disabled?: boolean;
}

export function ChatWidget({
  onSubmit,
  onSearchTypeChange,
  searchType = 'web',
  disabled = false,
}: ChatWidgetProps) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const [hasSearched, setHasSearched] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = (text: string, type: string) => {
    setQuery(text);
    setLoading(true);
    setHasSearched(true);

    // Simulate search delay
    setTimeout(() => {
      setLoading(false);
    }, 1500);

    onSubmit?.(text, type);
    // Optionally close dialog after submission
    // setOpen(false)
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" aria-label="Search" disabled={disabled}>
          <Search />
        </Button>
      </DialogTrigger>
      <DialogContent className="flex max-h-[80vh] flex-col overflow-hidden sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Search news</DialogTitle>
          <VisuallyHidden.Root>
            <DialogDescription>
              Search for stories by asking a question or searching for a topic.
            </DialogDescription>
          </VisuallyHidden.Root>
        </DialogHeader>
        {hasSearched && (
          <div className="no-scrollbar mt-4 flex-1 overflow-auto">
            <SearchResults query={query} loading={loading} />
          </div>
        )}
        <div className={hasSearched ? 'mt-4' : 'mt-4 flex-1'}>
          <TextareaInput
            onSubmit={handleSubmit}
            {...(onSearchTypeChange && { onSearchTypeChange })}
            searchType={searchType}
            disabled={disabled || loading}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
