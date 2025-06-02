'use client';

import { memo } from 'react';
import { ArticlesData } from '@/types/events/articles';
import { Share as ShareIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { toast } from 'sonner';
import { trackShare } from '@/services/analytics/shareTracking';

interface ShareButtonProps {
  entry: ArticlesData;
}

/**
 * Copies text to clipboard and shows a toast notification
 */
const copyToClipboard = (text: string) => {
  // Try modern clipboard API first
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast('Link copied', {
          description: 'Link copied to clipboard',
        });
      })
      .catch((err) => {
        console.error('Clipboard API failed: ', err);
        // Fallback to legacy method if clipboard API fails
        fallbackCopyToClipboard(text);
      });
  } else {
    // Fallback for browsers without clipboard API
    fallbackCopyToClipboard(text);
  }
};

/**
 * Fallback method using temporary textarea element
 */
const fallbackCopyToClipboard = (text: string) => {
  try {
    // Create a temporary textarea element
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    // Use the older execCommand API
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);

    if (successful) {
      toast('Link copied', {
        description: 'Link copied to clipboard',
      });
    } else {
      throw new Error('execCommand failed');
    }
  } catch (err) {
    console.error('Fallback copy failed: ', err);
    toast('Copy failed', {
      description: 'Could not copy to clipboard. Please copy manually.',
    });
  }
};

/**
 * Shares content using Web Share API if available, falls back to clipboard copy
 * Also tracks the share in analytics
 */
const shareContent = async (
  options: {
    title?: string;
    url?: string;
    onSuccess?: () => void;
  } = {},
) => {
  const { title = 'Timeline', url = window.location.href, onSuccess } = options;

  // Track the share attempt
  await trackShare();

  // Simple mobile check based on user agent
  const isMobile = /Mobi|Android|iPhone|iPad|iPod|Windows Phone/i.test(navigator.userAgent);

  if (isMobile && navigator.share) {
    try {
      const shareData = {
        title,
        url,
      } satisfies ShareData;

      await navigator.share(shareData);
      if (onSuccess) onSuccess();
      return;
    } catch (error) {
      // AbortError (user canceled) — silently ignore.
      if (error instanceof DOMException && error.name === 'AbortError') {
        return;
      }
      // Any other failure: fall back to clipboard.
    }
  }

  // Desktop or mobile fallback
  copyToClipboard(url);
};

export const ShareButton = memo(function ShareButton({ entry }: ShareButtonProps) {
  const handleShare = () => {
    // Check if we're already on the article page for this entry
    const currentPath = window.location.pathname;
    const isOnArticlePage = currentPath === `/article/${entry._id}`;

    shareContent({
      title: entry.title,
      url: isOnArticlePage
        ? window.location.href  // Use current URL if already on article page
        : `${window.location.origin}/article/${entry._id}`, // Generate article URL from other pages
    });
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="p-1.5 md:p-2 h-auto w-auto"
          onClick={handleShare}
        >
          <ShareIcon className="h-3.5 w-3.5 md:h-4 md:w-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent side="top">Share</TooltipContent>
    </Tooltip>
  );
});
