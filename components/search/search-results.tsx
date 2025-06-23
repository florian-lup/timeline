'use client';

import * as React from 'react';
import ReactMarkdown from 'react-markdown';

import { Skeleton } from '@/components/ui/skeleton';
import type { SearchResponse } from '@/lib/services/search-service';

interface SearchResultsProps {
  query?: string;
  loading?: boolean;
  result?: SearchResponse | null;
}

export function SearchResults({
  query,
  loading = false,
  result,
}: SearchResultsProps) {
  if (loading) {
    return (
      <div className="space-y-4 p-4">
        <div className="text-muted-foreground text-sm">Searching...</div>
        <div className="space-y-3">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-2/3" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-4/5" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4">
      {query !== undefined && query !== '' && (
        <div className="text-muted-foreground text-sm">
          Results for &quot;{query}&quot;
        </div>
      )}

      <div className="prose prose-sm text-muted-foreground prose-headings:text-foreground prose-strong:text-foreground prose-a:text-primary hover:prose-a:text-primary/80 [&_ol]:marker:text-foreground [&_ul]:marker:text-foreground max-w-none">
        <ReactMarkdown
          components={{
            a: ({ ...props }) => (
              <a {...props} target="_blank" rel="noopener noreferrer" />
            ),
          }}
        >
          {result?.summary ?? 'No results found'}
        </ReactMarkdown>
      </div>
    </div>
  );
}
