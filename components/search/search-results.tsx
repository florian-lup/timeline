'use client';

import { Link } from 'lucide-react';
import * as React from 'react';
import ReactMarkdown from 'react-markdown';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface SearchResult {
  id: string;
  title: string;
  summary: string;
  url?: string;
}

interface SearchResultsProps {
  query?: string;
  loading?: boolean;
  result?: SearchResult;
}

// Mock data for development
const mockResult: SearchResult = {
  id: '1',
  title: 'Mock Search Result',
  summary: 'This is a placeholder result for development purposes.',
  url: 'https://example.com',
};

export function SearchResults({
  query,
  loading = false,
  result = mockResult,
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
      {query != null && query !== '' && (
        <div className="text-muted-foreground text-sm">
          Results for &quot;{query}&quot;
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-lg leading-tight">
            {result.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm prose-headings:text-foreground prose-strong:text-foreground prose-code:text-foreground prose-pre:bg-muted text-muted-foreground mb-4 max-w-none">
            <ReactMarkdown>{result.summary}</ReactMarkdown>
          </div>
          {result.url != null && result.url !== '' && (
            <Button variant="outline" size="sm" className="gap-2" asChild>
              <a href={result.url} target="_blank" rel="noopener noreferrer">
                Sources
                <Link />
              </a>
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
