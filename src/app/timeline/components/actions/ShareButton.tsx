'use client';

import { ArticlesData } from '@/types/events/articles';
import { Share as ShareIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { shareContent } from '@/utils/shareHelper';

interface ShareButtonProps {
  entry: ArticlesData;
}

export function ShareButton({ entry }: ShareButtonProps) {
  const handleShare = () => {
    shareContent({
      title: entry.title,
      url: `${window.location.origin}/article/${entry._id}`,
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
} 