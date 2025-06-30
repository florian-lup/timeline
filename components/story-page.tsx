'use client';

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';

import { CopyButton } from '@/components/copy-to-clipbaord';
import { ReactionsPopover } from '@/components/emoji-reactions';
import { ShareButton } from '@/components/share-story';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import type { ArticleData } from '@/types/article-data';
import { formatDate } from '@/utils/date-formatter';

import { SourcesSheet } from './feed/sources';

interface StoryPageProps {
  story: ArticleData;
}

export function StoryPage({ story }: StoryPageProps) {
  return (
    <div className="bg-background min-h-screen">
      {/* Header with back button */}
      <header className="bg-background/60 sticky top-0 z-10 backdrop-blur">
        <div className="mx-auto max-w-4xl px-4 py-4">
          <Link href="/">
            <Button variant="secondary" size="sm" className="gap-2">
              <ArrowLeft />
              Back to Feed
            </Button>
          </Link>
        </div>
      </header>

      {/* Main content */}
      <main className="mx-auto max-w-4xl px-4 py-8">
        <Card className="border-border/50 shadow-sm">
          <CardHeader className="space-y-4">
            {/* Meta information */}
            <div className="flex items-center gap-4">
              <span className="text-muted-foreground text-sm">
                {formatDate(story.date)}
              </span>
              <SourcesSheet title={story.headline} sources={story.sources} />
            </div>

            {/* Title and summary */}
            <div className="space-y-4">
              <h1 className="text-2xl leading-tight font-bold md:text-3xl lg:text-4xl">
                {story.headline}
              </h1>
              <p className="text-muted-foreground text-lg leading-relaxed">
                {story.summary}
              </p>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Full story content */}
            <div className="border-t pt-6">
              <div className="prose prose-sm text-muted-foreground prose-headings:text-foreground prose-strong:text-foreground prose-code:text-foreground prose-pre:bg-muted md:prose-base max-w-none">
                <ReactMarkdown>{story.story}</ReactMarkdown>
              </div>
            </div>
          </CardContent>

          <CardFooter className="justify-end border-t pt-4">
            <div className="flex items-center gap-2">
              <ReactionsPopover entryId={story._id} />
              <ShareButton entry={story} />
              <CopyButton entry={story} mode="full" />
            </div>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}
