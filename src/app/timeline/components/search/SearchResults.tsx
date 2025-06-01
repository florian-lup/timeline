'use client';

import { useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import * as VisuallyHidden from '@radix-ui/react-visually-hidden';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useSearchConversation, type SearchMessage } from '@/hooks/search/useSearchConversation';

interface SearchResultsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  searchQuery: string;
  /** Determines if the current search was a web search (Tavily) or timeline search */
  isWeb: boolean;
}

/**
 * Sheet component that slides from the top after search submission, showing
 * search results and allowing follow-up questions in a conversation format.
 */
export function SearchResultsDialog({
  isOpen,
  onOpenChange,
  searchQuery,
  isWeb,
}: SearchResultsDialogProps) {
  const { messages, followUpQuery, setFollowUpQuery, isLoading, handleFollowUpSubmit } =
    useSearchConversation({ isOpen, searchQuery, isWeb });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="top-0 flex flex-col gap-6 p-4 focus-visible:outline-none focus-visible:ring-0 ring-0 border-0"
      >
        <SheetHeader className="w-full max-w-2xl mx-auto p-0">
          <SheetTitle className="mt-6">Search Results</SheetTitle>
          <VisuallyHidden.Root>
            <SheetDescription>Ask follow-up questions to get more information.</SheetDescription>
          </VisuallyHidden.Root>
        </SheetHeader>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto space-y-4 w-full max-w-2xl mx-auto pr-4">
          {messages.map((message: SearchMessage) => (
            <div
              key={message.id}
              className={cn(
                'flex w-full flex-col gap-2 rounded-lg px-3 py-2 text-sm',
                message.role === 'user' ? 'ml-auto bg-primary text-primary-foreground' : 'bg-muted',
              )}
            >
              <p>{message.content}</p>
            </div>
          ))}

          {isLoading && (
            <div className="flex w-full flex-col gap-2 rounded-lg px-3 py-2 text-sm bg-muted">
              <div className="flex items-end">
                <span className="text-muted-foreground">Searching</span>
                <div className="flex space-x-1 ml-1 mb-0.5">
                  <div className="h-1 w-1 bg-muted-foreground/60 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="h-1 w-1 bg-muted-foreground/60 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="h-1 w-1 bg-muted-foreground/60 rounded-full animate-bounce"></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Follow-up Input */}
        <form
          onSubmit={handleFollowUpSubmit}
          className="flex gap-2 pt-4 border-t w-full max-w-2xl mx-auto"
        >
          <Input
            value={followUpQuery}
            onChange={(e) => setFollowUpQuery(e.target.value)}
            placeholder="Ask a follow up question"
            disabled={isLoading}
            className="flex-1"
            id="follow-up-input"
          />
          <Button
            className="rounded-md"
            type="submit"
            size="icon"
            disabled={!followUpQuery.trim() || isLoading}
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}
