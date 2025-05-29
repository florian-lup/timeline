'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  fetchWebSearch,
  fetchTimelineSearch,
  type HistoryMessage,
} from '@/services/search/searchClient';

export interface SearchMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface UseSearchConversationParams {
  /** Whether the parent dialog is open */
  isOpen: boolean;
  /** The initial search query submitted by the user */
  searchQuery: string;
  /** True for a web search, false for a timeline search */
  isWeb: boolean;
}

interface UseSearchConversationReturn {
  messages: SearchMessage[];
  followUpQuery: string;
  setFollowUpQuery: (value: string) => void;
  isLoading: boolean;
  handleFollowUpSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
}

/**
 * Reusable hook that manages the conversational state for search results.
 * It takes care of:
 * 1. Bootstrapping the conversation with the initial search answer.
 * 2. Handling follow-up questions while keeping track of the full history.
 * 3. Resetting state once the parent dialog is closed.
 *
 * This keeps heavy business logic out of UI components so they stay small and declarative.
 */
export function useSearchConversation({
  isOpen,
  searchQuery,
  isWeb,
}: UseSearchConversationParams): UseSearchConversationReturn {
  const [messages, setMessages] = useState<SearchMessage[]>([]);
  const [followUpQuery, setFollowUpQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  /* -------------------------------------------------------------------------- */
  /*                             Initial question                               */
  /* -------------------------------------------------------------------------- */

  useEffect(() => {
    if (!isOpen || !searchQuery || messages.length > 0) return;

    async function initConversation() {
      // Clear any previous session when starting a new search
      setMessages([]);
      setIsLoading(true);

      try {
        const historyPayload: HistoryMessage[] = [
          { role: 'user', content: searchQuery },
        ];

        const result = isWeb
          ? await fetchWebSearch(searchQuery, historyPayload)
          : await fetchTimelineSearch(searchQuery, historyPayload);

        const initialMessage: SearchMessage = {
          id: `msg-${Date.now()}`,
          role: 'assistant',
          content: result.answer || `No answer found for "${searchQuery}"`,
        };

        setMessages([initialMessage]);
      } catch (error) {
        console.error('Search initialization failed:', error);
        setMessages([
          {
            id: `msg-${Date.now()}`,
            role: 'assistant',
            content:
              'Sorry, something went wrong while searching. Please try again later.',
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    }

    initConversation();
    // The exhaustive-deps lint rule is intentionally disabled because we only
    // want to run this effect when the dialog opens with a *new* query.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, searchQuery, isWeb]);

  /* -------------------------------------------------------------------------- */
  /*                             Follow-up search                               */
  /* -------------------------------------------------------------------------- */

  const handleFollowUpSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!followUpQuery.trim() || isLoading) return;

      // Optimistically add the user message to the UI
      const userMessage: SearchMessage = {
        id: `msg-${Date.now()}-user`,
        role: 'user',
        content: followUpQuery,
      };
      setMessages((prev) => [...prev, userMessage]);
      setFollowUpQuery('');
      setIsLoading(true);

      // Prepare history for the backend (exclude the optimistic user message we just set)
      const historyPayload: HistoryMessage[] = [
        ...messages,
        { role: 'user', content: followUpQuery },
      ].map((m) => ({ role: m.role, content: m.content } as HistoryMessage));

      try {
        const result = isWeb
          ? await fetchWebSearch(followUpQuery, historyPayload)
          : await fetchTimelineSearch(followUpQuery, historyPayload);

        const assistantMessage: SearchMessage = {
          id: `msg-${Date.now()}-assistant`,
          role: 'assistant',
          content: result.answer || "I couldn't find a direct answer.",
        };

        setMessages((prev) => [...prev, assistantMessage]);
      } catch (error) {
        console.error('Follow-up search failed:', error);
        const assistantMessage: SearchMessage = {
          id: `msg-${Date.now()}-assistant`,
          role: 'assistant',
          content:
            'Sorry, something went wrong while searching. Please try again later.',
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } finally {
        setIsLoading(false);
      }
    },
    [followUpQuery, isLoading, isWeb, messages]
  );

  /* -------------------------------------------------------------------------- */
  /*                         Reset on dialog close                              */
  /* -------------------------------------------------------------------------- */

  useEffect(() => {
    if (!isOpen && messages.length > 0) {
      setMessages([]);
      setFollowUpQuery('');
      setIsLoading(false);
    }
  }, [isOpen, messages.length]);

  return {
    messages,
    followUpQuery,
    setFollowUpQuery,
    isLoading,
    handleFollowUpSubmit,
  };
} 