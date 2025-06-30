import { notFound } from 'next/navigation';

import { StoryPage } from '@/components/story-page';
import { getStoryById } from '@/lib/services/story-repository';
import type { ArticleData } from '@/types/article-data';

interface StoryPageProps {
  params: Promise<{
    id: string;
  }>;
}

async function fetchStory(id: string): Promise<ArticleData | null> {
  try {
    return await getStoryById(id);
  } catch (error) {
    console.error('Error fetching story:', error);
    return null;
  }
}

export default async function Page({ params }: StoryPageProps) {
  const { id } = await params;
  const story = await fetchStory(id);

  if (!story) {
    notFound();
  }

  return <StoryPage story={story} />;
}

export async function generateMetadata({ params }: StoryPageProps) {
  const { id } = await params;
  const story = await fetchStory(id);

  if (!story) {
    return {
      title: 'Story Not Found',
    };
  }

  return {
    title: story.headline,
    openGraph: {
      title: story.headline,
      type: 'article',
      publishedTime: story.date.toString(),
    },
    twitter: {
      card: 'summary_large_image',
      title: story.headline,
    },
  };
}
