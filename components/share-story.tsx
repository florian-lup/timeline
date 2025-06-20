'use client';

import { Share } from 'lucide-react';
import { useState, memo } from 'react';

import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import type { StoryData } from '@/types/story';

interface ShareButtonProps {
  entry: StoryData;
}

export const ShareButton = memo(function ShareButton({
  entry,
}: ShareButtonProps) {
  const [isSharing, setIsSharing] = useState(false);

  const handleShare = async () => {
    setIsSharing(true);

    // Generate the shareable link using the story ID
    const shareUrl = `${window.location.origin}/story/${entry._id}`;

    const shareData = {
      title: entry.title,
      url: shareUrl,
    };

    try {
      if ('share' in navigator && navigator.canShare(shareData)) {
        // Use native share API if available
        await navigator.share(shareData);
      } else {
        // Fallback: copy URL to clipboard
        await navigator.clipboard.writeText(shareUrl);
        // You could add a toast notification here
        console.log('Link copied to clipboard');
      }
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        // User didn't cancel the share, there was an actual error
        console.error('Error sharing:', error);

        // Fallback: try to copy to clipboard
        try {
          await navigator.clipboard.writeText(shareUrl);
          console.log('Link copied to clipboard as fallback');
        } catch (clipboardError) {
          console.error('Failed to copy to clipboard:', clipboardError);
        }
      }
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              void handleShare();
            }}
            disabled={isSharing}
          >
            <Share />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Share</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
});
