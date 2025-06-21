'use client';

import * as React from 'react';
import ReactMarkdown from 'react-markdown';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
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
      <div className="space-y-4">
        <div className="text-muted-foreground text-sm">Searching...</div>
        <Card>
          <CardHeader>
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </CardHeader>
          <CardContent className="space-y-2">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-2/3" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {query !== undefined && query !== '' && (
        <div className="text-muted-foreground text-sm">
          Results for &quot;{query}&quot;
        </div>
      )}

      <Card>
        <CardContent>
          <div className="prose prose-sm text-muted-foreground prose-headings:text-foreground prose-strong:text-foreground prose-pre:bg-muted prose-a:text-primary prose-a:underline hover:prose-a:text-primary/80 mb-4 max-w-none">
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
        </CardContent>
      </Card>
    </div>
  );
}
