// Server Component – data fetched server-side

import { redirect, notFound } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Card, CardContent } from '@/components/ui/card';
import { formatEventDate } from '@/utils/dateFormatters';
import { SourcesSheet } from '@/app/timeline/components/internals/SourcesSheet';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';
import type { ArticlesData } from '@/types/events/articles';
import { PageViewTracker } from '@/components/PageViewTracker';
import { headers } from 'next/headers';

interface ArticlePageProps {
  params: Promise<{ id: string }>;
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { id } = await params;

  // Build the URL dynamically from the incoming request headers so that it
  // works in every environment (local dev, Vercel preview, production) and
  // removes the need for any env variables.
  // `headers()` is available in Server Components and returns the incoming
  // request headers at runtime.
  // The return type from `headers()` can vary across Next.js versions. We cast via
  // `unknown` to `Headers` so we can safely access `.get()` without using `any`.
  const host = (headers() as unknown as Headers).get('host') ?? 'localhost:3000';
  const protocol = host.startsWith('localhost') ? 'http' : 'https';
  const apiUrl = `${protocol}://${host}/api/events/${id}`;

  const res = await fetch(apiUrl, {
    cache: 'no-store',
  });

  if (!res.ok) {
    // If the event is not found, redirect back to the main timeline (or show 404)
    if (res.status === 404) {
      notFound();
    }
    redirect('/timeline');
  }

  const data = (await res.json()) as ArticlesData;

  return (
    <div className="min-h-screen flex flex-col pb-8 md:pb-12 lg:pb-16">
      <Header />
      <PageViewTracker />

      <main className="flex-1 w-full">
        <div className="w-full max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-4xl mx-auto p-2 md:p-4 lg:p-6 space-y-6 md:space-y-8">
          <Card className="shadow-none border-none">
            <CardContent className="space-y-4 md:space-y-6">
              <span className="text-sm text-muted-foreground">{formatEventDate(data.date)}</span>

              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold leading-snug">
                {data.title}
              </h1>

              <p className="text-base md:text-lg/relaxed">{data.summary}</p>

              {data.research && (
                <MarkdownRenderer
                  content={data.research}
                  className="prose prose-sm md:prose-base dark:prose-invert max-w-none"
                />
              )}

              <div className="flex items-center gap-3 pt-2">
                <SourcesSheet title={data.title} sources={data.sources} />
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
} 