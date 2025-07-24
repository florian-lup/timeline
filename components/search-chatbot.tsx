'use client';

import { ArrowLeft, Send, Bot, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

import { ChatSources } from '@/components/chat-sources';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import type {
  ChatMessage,
  ChatApiRequest,
  ChatApiResponse,
} from '@/types/chat-data';

export function SearchChatbot() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (typeof input !== 'string' || input.trim().length === 0 || isLoading)
      return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      content: input.trim(),
      role: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const requestBody: ChatApiRequest = {
        message: userMessage.content,
        conversation: messages,
      };

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = (await response.json()) as ChatApiResponse;

      if (data.error) {
        throw new Error(data.error);
      }

      // Convert timestamp string back to Date object
      const messageWithDateTimestamp = {
        ...data.message,
        timestamp: new Date(data.message.timestamp),
      };

      setMessages(prev => [...prev, messageWithDateTimestamp]);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Something went wrong';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      void handleSubmit(e);
    }
  };

  return (
    <div className="bg-background min-h-screen">
      {/* Header with back button */}
      <header className="bg-background/60 sticky top-0 z-10 backdrop-blur">
        <div className="mx-auto max-w-4xl px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="secondary" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Feed
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main chat interface */}
      <main className="mx-auto max-w-4xl px-4 py-6">
        <div className="flex h-[calc(100vh-140px)] max-h-[800px] flex-col">
          {/* Messages container */}
          <div className="mb-4 flex-1 space-y-4 overflow-y-auto">
            {messages.length === 0 && (
              <Card className="border-dashed">
                <CardContent className="p-8 text-center">
                  <Bot className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
                  <h2 className="mb-2 text-xl font-semibold">
                    Welcome to News Search AI
                  </h2>
                  <p className="text-muted-foreground">
                    Ask me about current news, sports, politics, technology, or
                    any newsworthy topic. I&apos;ll search for the latest
                    information and provide you with accurate, up-to-date
                    answers.
                  </p>
                  <div className="mt-6 grid grid-cols-1 gap-3 text-sm md:grid-cols-2">
                    <div className="bg-muted rounded-lg p-3">
                      <strong>Example:</strong> &quot;What&apos;s the latest
                      news in UK sports?&quot;
                    </div>
                    <div className="bg-muted rounded-lg p-3">
                      <strong>Example:</strong> &quot;Summarize today&apos;s
                      technology news&quot;
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {messages.map(message => (
              <div key={message.id}>
                <Card className="border-border/50 bg-background w-full border-none">
                  <CardContent
                    className={`p-4 ${message.role === 'user' ? 'text-right' : 'text-left'}`}
                  >
                    {message.role === 'assistant' ? (
                      <div className="prose prose-sm dark:prose-invert prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground prose-em:text-foreground prose-code:text-foreground prose-pre:bg-muted prose-blockquote:border-border prose-blockquote:text-muted-foreground prose-a:text-primary prose-a:underline prose-a:underline-offset-2 hover:prose-a:text-primary/80 hover:prose-a:no-underline prose-ul:text-foreground prose-ol:text-foreground prose-li:text-foreground max-w-none">
                        <ReactMarkdown>{message.content}</ReactMarkdown>
                      </div>
                    ) : (
                      <div>
                        <p className="text-foreground whitespace-pre-wrap">
                          {message.content}
                        </p>
                      </div>
                    )}
                    <div
                      className={`mt-2 flex items-center ${
                        message.role === 'user'
                          ? 'justify-end'
                          : 'justify-between'
                      }`}
                    >
                      <div className="text-muted-foreground text-xs">
                        {message.timestamp.toLocaleTimeString()}
                      </div>
                      {message.role === 'assistant' &&
                        message.sources &&
                        message.sources.length > 0 && (
                          <ChatSources
                            sources={message.sources}
                            timestamp={message.timestamp}
                          />
                        )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <Card className="border-border/50">
                  <CardContent className="p-4">
                    <div className="text-muted-foreground flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Searching for latest news...
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Error display */}
          {error !== null && error !== '' && (
            <Card className="border-destructive mb-4">
              <CardContent className="p-4">
                <div className="text-destructive text-sm">{error}</div>
              </CardContent>
            </Card>
          )}

          {/* Input form */}
          <form
            onSubmit={e => {
              void handleSubmit(e);
            }}
            className="flex gap-2"
          >
            <Textarea
              value={input}
              onChange={e => {
                setInput(e.target.value);
              }}
              onKeyDown={handleKeyDown}
              placeholder="Ask about current news..."
              className="min-h-[60px] resize-none"
              disabled={isLoading}
            />
            <Button
              type="submit"
              disabled={!input || isLoading}
              className="self-end px-4"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
}
