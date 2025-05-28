'use client';

import { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';

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

interface Message {
  id: string;
  role: 'user' | 'system';
  content: string;
}

interface SearchResultsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  searchQuery: string;
}

/**
 * Sheet component that slides from the top after search submission, showing
 * search results and allowing follow-up questions in a conversation format.
 */
export function SearchResultsDialog({
  isOpen,
  onOpenChange,
  searchQuery,
}: SearchResultsDialogProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [followUpQuery, setFollowUpQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize conversation with search results when dialog opens
  useEffect(() => {
    if (isOpen && searchQuery && messages.length === 0) {
      // Simulate initial search results
      const initialMessage: Message = {
        id: `msg-${Date.now()}`,
        role: 'system',
        content: `Here are the search results for "${searchQuery}". I found several relevant events and articles. What specific aspect would you like to explore further?`,
      };
      setMessages([initialMessage]);
    }
  }, [isOpen, searchQuery, messages.length]);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleFollowUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!followUpQuery.trim() || isLoading) return;

    const userMessage: Message = {
      id: `msg-${Date.now()}-user`,
      role: 'user',
      content: followUpQuery,
    };

    setMessages(prev => [...prev, userMessage]);
    setFollowUpQuery('');
    setIsLoading(true);

    // Simulate API response (replace with actual API call)
    setTimeout(() => {
      const assistantMessage: Message = {
        id: `msg-${Date.now()}-assistant`,
        role: 'system',
        content: `That's an interesting follow-up question about "${followUpQuery}". Let me search for more specific information related to your query.`,
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="top-0 flex flex-col gap-6 p-4"
      >
        <SheetHeader className="w-full max-w-2xl mx-auto p-0">
          <SheetTitle className="mt-6">Search Results for "{searchQuery}"</SheetTitle>
          <SheetDescription>
            Explore search results and ask follow-up questions to get more specific information.
          </SheetDescription>
        </SheetHeader>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto space-y-4 w-full max-w-2xl mx-auto pr-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                'flex w-full flex-col gap-2 rounded-lg px-3 py-2 text-sm',
                message.role === 'user'
                  ? 'ml-auto bg-primary text-primary-foreground'
                  : 'bg-muted'
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
        <form onSubmit={handleFollowUpSubmit} className="flex gap-2 pt-4 border-t w-full max-w-2xl mx-auto">
          <Input
            value={followUpQuery}
            onChange={(e) => setFollowUpQuery(e.target.value)}
            placeholder="Ask a follow up question"
            disabled={isLoading}
            className="flex-1"
            id="follow-up-input"
          />
          <Button className="rounded-md" type="submit" size="icon" disabled={!followUpQuery.trim() || isLoading}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
} 