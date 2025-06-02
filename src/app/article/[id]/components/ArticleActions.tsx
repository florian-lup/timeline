'use client';

import { memo } from 'react';
import { ArticlesData } from '@/types/events/articles';
import { ReactionsPopover } from '@/components/actions/reactions';
import { ShareButton } from '@/components/actions/share';
import { CopyButton } from '@/components/actions/copy';
import { CommentsButton } from '@/components/actions/comments';

interface ArticleActionsProps {
  entry: ArticlesData;
}

/**
 * Client component wrapper for article action buttons
 */
export const ArticleActions = memo(function ArticleActions({ entry }: ArticleActionsProps) {
  return (
    <div className="flex items-center gap-2 py-3">
      <ReactionsPopover entryId={entry._id} />
      <ShareButton entry={entry} />
      <CopyButton entry={entry} contentType="research" />
      <CommentsButton entry={entry} />
    </div>
  );
}); 