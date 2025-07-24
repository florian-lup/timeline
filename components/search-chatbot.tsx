'use client';

import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Send, Bot, Loader2 } from 'lucide-react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';

import { ChatSources } from '@/components/chat-sources';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import type { ChatMessage, ChatApiRequest, ChatApiResponse } from '@/types/chat-data';

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
    
    if (!input.trim() || isLoading) return;

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

      const data = await response.json() as ChatApiResponse;
      
      if (data.error) {
        throw new Error(data.error);
      }

      // Convert timestamp string back to Date object
      const messageWithDateTimestamp = {
        ...data.message,
        timestamp: new Date(data.message.timestamp)
      };

      setMessages(prev => [...prev, messageWithDateTimestamp]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Something went wrong';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
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
        <div className="flex flex-col h-[calc(100vh-140px)] max-h-[800px]">
          {/* Messages container */}
          <div className="flex-1 overflow-y-auto mb-4 space-y-4">
            {messages.length === 0 && (
              <Card className="border-dashed">
                <CardContent className="p-8 text-center">
                  <Bot className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h2 className="text-xl font-semibold mb-2">Welcome to News Search AI</h2>
                  <p className="text-muted-foreground">
                    Ask me about current news, sports, politics, technology, or any newsworthy topic. 
                    I'll search for the latest information and provide you with accurate, up-to-date answers.
                  </p>
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div className="p-3 bg-muted rounded-lg">
                      <strong>Example:</strong> "What's the latest news in UK sports?"
                    </div>
                    <div className="p-3 bg-muted rounded-lg">
                      <strong>Example:</strong> "Summarize today's technology news"
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

                         {messages.map((message) => (
               <div
                 key={message.id}
                 className={`flex ${
                   message.role === 'user' ? 'justify-end' : 'justify-start'
                 }`}
               >
                 <Card className="max-w-[80%] border-border/50 bg-background border-none">
                   <CardContent className="p-4">
                     {message.role === 'assistant' ? (
                       <div className="prose prose-sm max-w-none dark:prose-invert prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground prose-em:text-foreground prose-code:text-foreground prose-pre:bg-muted prose-blockquote:border-border prose-blockquote:text-muted-foreground prose-a:text-primary prose-a:underline prose-a:underline-offset-2 hover:prose-a:text-primary/80 hover:prose-a:no-underline prose-ul:text-foreground prose-ol:text-foreground prose-li:text-foreground">
                         <ReactMarkdown>{message.content}</ReactMarkdown>
                       </div>
                     ) : (
                       <div>
                         <p className="whitespace-pre-wrap text-foreground">{message.content}</p>
                       </div>
                     )}
                     <div className="flex items-center justify-between mt-2">
                       <div className="text-xs text-muted-foreground">
                         {message.timestamp.toLocaleTimeString()}
                       </div>
                       {message.role === 'assistant' && message.sources && message.sources.length > 0 && (
                         <ChatSources sources={message.sources} timestamp={message.timestamp} />
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
                     <div className="flex items-center gap-2 text-muted-foreground">
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
          {error && (
            <Card className="mb-4 border-destructive">
              <CardContent className="p-4">
                <div className="text-destructive text-sm">{error}</div>
              </CardContent>
            </Card>
          )}

          {/* Input form */}
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about current news, sports, politics, or any topic..."
              className="min-h-[60px] resize-none"
              disabled={isLoading}
            />
            <Button 
              type="submit" 
              disabled={!input.trim() || isLoading}
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