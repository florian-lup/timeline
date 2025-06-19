'use client';

import { Link } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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

const mockResult: SearchResult = {
  id: '1',
  title: 'Breaking: Tech Giant Announces Revolutionary AI Framework',
  summary:
    'A major technology company has unveiled a groundbreaking artificial intelligence framework that promises to transform how developers build intelligent applications. The new system offers unprecedented performance improvements and simplified deployment processes. This breakthrough is expected to accelerate AI adoption across various industries and make advanced machine learning capabilities more accessible to developers worldwide.A major technology company has unveiled a groundbreaking artificial intelligence framework that promises to transform how developers build intelligent applications.The new system offers unprecedented performance improvements and simplified deployment processes.This breakthrough is expected to accelerate AI adoption across various industries and make advanced machine learning capabilities more accessible to developers worldwide.',
  url: 'https://example.com/tech-news-1',
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
        <Card className="animate-pulse">
          <CardHeader>
            <div className="bg-muted h-4 w-3/4 rounded"></div>
            <div className="bg-muted h-3 w-1/2 rounded"></div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="bg-muted h-3 rounded"></div>
              <div className="bg-muted h-3 rounded"></div>
              <div className="bg-muted h-3 w-2/3 rounded"></div>
            </div>
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

      <Card className="transition-shadow hover:shadow-md">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg leading-tight">
            {result.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
            {result.summary}
          </p>
          {result.url != null && result.url !== '' && (
            <Button variant="outline" size="sm" className="gap-2" asChild>
              <a href={result.url} target="_blank" rel="noopener noreferrer">
                Sources
                <Link className="h-3 w-3" />
              </a>
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
