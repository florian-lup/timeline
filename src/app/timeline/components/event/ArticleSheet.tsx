'use client';

import { ArticlesData } from '@/types/events/articles';
import { FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

interface ReportDialogProps {
  entry: ArticlesData;
}

export function ArticleSheet({ entry }: ReportDialogProps) {
  const handleReadClick = () => {
    window.open(`/article/${entry._id}`, '_blank');
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="p-1.5 md:p-2 h-auto w-auto"
          onClick={handleReadClick}
        >
          <FileText className="h-3.5 w-3.5 md:h-4 md:w-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent side="top">Read</TooltipContent>
    </Tooltip>
  );
}
