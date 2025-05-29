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
import { fetchWebSearch, fetchTimelineSearch, type HistoryMessage } from '@/services/search/searchClient';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

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
  const [messages, setMessages] = useState<Message[]>([]);
  const [followUpQuery, setFollowUpQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize conversation with search results when dialog opens
  useEffect(() => {
    if (!isOpen || !searchQuery || messages.length > 0) return;

    async function initConversation() {
      // Clear previous conversation when starting a new search
      setMessages([]);

      if (isWeb) {
        // Perform web search via API route
        setIsLoading(true);
        try {
          const historyPayload: HistoryMessage[] = [{ role: 'user', content: searchQuery }];
          const result = await fetchWebSearch(searchQuery, historyPayload);

          const initialMessage: Message = {
            id: `msg-${Date.now()}`,
            role: 'assistant',
            content: result.answer || `No answer found for "${searchQuery}"`,
          };

          setMessages([initialMessage]);
        } catch (error) {
          console.error('Failed to fetch web search results:', error);
          setMessages([
            {
              id: `msg-${Date.now()}`,
              role: 'assistant',
              content: 'Sorry, something went wrong while searching the web. Please try again later.',
            },
          ]);
        } finally {
          setIsLoading(false);
        }
      } else {
        // Perform timeline search via API route (Pinecone)
        setIsLoading(true);
        try {
          const historyPayload: HistoryMessage[] = [{ role: 'user', content: searchQuery }];
          const result = await fetchTimelineSearch(searchQuery, historyPayload);

          const initialMessage: Message = {
            id: `msg-${Date.now()}`,
            role: 'assistant',
            content: result.answer || `No answer found for "${searchQuery}"`,
          };

          setMessages([initialMessage]);
        } catch (error) {
          console.error('Failed to fetch timeline search results:', error);
          setMessages([
            {
              id: `msg-${Date.now()}`,
              role: 'assistant',
              content: 'Sorry, something went wrong while searching the timeline. Please try again later.',
            },
          ]);
        } finally {
          setIsLoading(false);
        }
      }
    }

    initConversation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, searchQuery, isWeb]);

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

    // Prepare history to send (convert current messages to HistoryMessage)
    const historyPayload: HistoryMessage[] = messages.map((m) => ({
      role: m.role,
      content: m.content,
    }));

    if (isWeb) {
      try {
        const result = await fetchWebSearch(followUpQuery, historyPayload);
        const assistantMessage: Message = {
          id: `msg-${Date.now()}-assistant`,
          role: 'assistant',
          content: result.answer || `I couldn't find a direct answer.`,
        };

        setMessages(prev => [...prev, assistantMessage]);
      } catch (error) {
        console.error('Follow-up web search failed:', error);
        const assistantMessage: Message = {
          id: `msg-${Date.now()}-assistant`,
          role: 'assistant',
          content: 'Sorry, something went wrong while searching the web. Please try again later.',
        };
        setMessages(prev => [...prev, assistantMessage]);
      } finally {
        setIsLoading(false);
      }
    } else {
      try {
        const result = await fetchTimelineSearch(followUpQuery, historyPayload);

        const assistantMessage: Message = {
          id: `msg-${Date.now()}-assistant`,
          role: 'assistant',
          content: result.answer || `I couldn't find an answer.`,
        };

        setMessages(prev => [...prev, assistantMessage]);
      } catch (error) {
        console.error('Follow-up timeline search failed:', error);
        const assistantMessage: Message = {
          id: `msg-${Date.now()}-assistant`,
          role: 'assistant',
          content: 'Sorry, something went wrong while searching the timeline. Please try again later.',
        };
        setMessages(prev => [...prev, assistantMessage]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Reset session when the dialog closes
  useEffect(() => {
    if (!isOpen && messages.length > 0) {
      setMessages([]);
      setFollowUpQuery('');
      setIsLoading(false);
    }
    // Only run when isOpen changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="top-0 flex flex-col gap-6 p-4 focus-visible:outline-none focus-visible:ring-0 ring-0 border-0"
      >
        <SheetHeader className="w-full max-w-2xl mx-auto p-0">
          <SheetTitle className="mt-6">Search Results</SheetTitle>
          <SheetDescription>
            Ask follow-up questions to get more specific information.
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