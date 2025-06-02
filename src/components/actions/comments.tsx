'use client';

import { memo } from 'react';
import { MessageSquareText, Reply, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { ArticlesData } from '@/types/events/articles';

interface CommentsButtonProps {
  entry: ArticlesData;
}

// Mock comments data until real functionality is implemented
const mockComments = [
  {
    id: 1,
    author: 'Alex Chen',
    avatar: 'AC',
    timestamp: '2 hours ago',
    content: 'This is a significant development. The implications for the industry could be far-reaching.',
    likes: 12,
    replies: 3
  },
  {
    id: 2,
    author: 'Sarah Johnson',
    avatar: 'SJ',
    timestamp: '4 hours ago',
    content: 'Great summary! The timeline really helps put this in context with recent events.',
    likes: 8,
    replies: 1
  },
  {
    id: 3,
    author: 'Mike Rodriguez',
    avatar: 'MR',
    timestamp: '6 hours ago',
    content: 'Thanks for sharing this. I was looking for more details on this topic.',
    likes: 5,
    replies: 0
  }
];

/**
 * Comment item component
 */
const CommentItem = memo(function CommentItem({ comment }: { comment: typeof mockComments[0] }) {
  return (
    <div className="border-b border-border/50 pb-4 last:border-b-0">
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-accent-blue flex items-center justify-center text-white text-xs font-medium">
          {comment.avatar}
        </div>

        {/* Comment content */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-sm">{comment.author}</span>
            <span className="text-xs text-muted-foreground">{comment.timestamp}</span>
          </div>

          <p className="text-sm text-muted-foreground mb-2">{comment.content}</p>

          {/* Comment actions */}
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="h-auto p-1 text-xs">
              <Heart className="h-3 w-3 mr-1" />
              {comment.likes}
            </Button>

            <Button variant="ghost" size="sm" className="h-auto p-1 text-xs">
              <Reply className="h-3 w-3 mr-1" />
              {comment.replies > 0 ? `${comment.replies} replies` : 'Reply'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
});

/**
 * Button component for opening comments sheet
 */
export const CommentsButton = memo(function CommentsButton({ entry }: CommentsButtonProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <div>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="p-1.5 md:p-2 h-auto w-auto">
                <MessageSquareText className="h-3.5 w-3.5 md:h-4 md:w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">View comments</TooltipContent>
          </Tooltip>
        </div>
      </SheetTrigger>

      <SheetContent className="w-full sm:max-w-md bg-card">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2 mt-6">
            Comments
            <Badge variant="secondary" className="text-xs">
              {mockComments.length}
            </Badge>
          </SheetTitle>
          <SheetDescription className="sr-only">
            {entry.title}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-4">
          {/* Comment input placeholder */}
          <div className="mb-6 p-3 border border-border/50 rounded-lg bg-muted/30">
            <p className="text-sm text-muted-foreground">Add a comment...</p>
            <p className="text-xs text-muted-foreground mt-1">
              Comment functionality coming soon
            </p>
          </div>

          {/* Comments list */}
          <div className="space-y-4">
            {mockComments.map((comment) => (
              <CommentItem key={comment.id} comment={comment} />
            ))}
          </div>

          {/* Load more placeholder */}
          <div className="mt-6 text-center">
            <Button variant="ghost" size="sm" disabled>
              Load more comments
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
});
