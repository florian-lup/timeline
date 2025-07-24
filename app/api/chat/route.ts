import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import type {
  ChatApiRequest,
  ChatApiResponse,
  ChatMessage,
  PerplexityRequest,
  PerplexityResponse,
} from '@/types/chat-data';

const PERPLEXITY_API_KEY = process.env['PERPLEXITY_API_KEY'];
const PERPLEXITY_BASE_URL = 'https://api.perplexity.ai';

/**
 * POST handler for chat requests
 * Integrates with Perplexity Sonar for news-focused responses
 */
export async function POST(request: NextRequest) {
  try {
    if (
      typeof PERPLEXITY_API_KEY !== 'string' ||
      PERPLEXITY_API_KEY.length === 0
    ) {
      return NextResponse.json(
        { error: 'Perplexity API key not configured' },
        { status: 500 },
      );
    }

    const body = (await request.json()) as ChatApiRequest;
    const { message, conversation = [] } = body;

    if (typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 },
      );
    }

    // Get current date for prompt and filtering
    const currentDate = new Date();
    const searchAfterDate = `${String(currentDate.getMonth() + 1)}/${String(currentDate.getDate())}/${String(currentDate.getFullYear())}`;
    const todaysDate = currentDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    // Prepare conversation history for Perplexity
    const messages = [
      {
        role: 'system' as const,
        content: `You are a helpful news search assistant. Today is ${todaysDate}. You specialize in finding and summarizing current news, events, and information from reliable sources. Always provide accurate, up-to-date information.`,
      },
      // Add conversation history
      ...conversation.map(msg => ({
        role: msg.role === 'user' ? ('user' as const) : ('assistant' as const),
        content: msg.content,
      })),
      // Add current message
      {
        role: 'user' as const,
        content: message,
      },
    ];

    const perplexityRequest: PerplexityRequest = {
      model: 'sonar',
      messages,
      max_tokens: 2048,
      search_after_date_filter: searchAfterDate,
      return_citations: true,
    };

    // Call Perplexity API
    const response = await fetch(`${PERPLEXITY_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${PERPLEXITY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(perplexityRequest),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Perplexity API error:', errorText);
      return NextResponse.json(
        { error: 'Failed to get response from news search service' },
        { status: 500 },
      );
    }

    const perplexityResponse = (await response.json()) as PerplexityResponse;

    console.log(
      'Full Perplexity response:',
      JSON.stringify(perplexityResponse, null, 2),
    );

    const assistantMessage = perplexityResponse.choices[0]?.message.content;
    if (
      typeof assistantMessage !== 'string' ||
      assistantMessage.trim().length === 0
    ) {
      return NextResponse.json(
        { error: 'No response from news search service' },
        { status: 500 },
      );
    }

    // Clean up the response by removing citation markers like [1], [2], [3], etc.
    const cleanedMessage = assistantMessage.replace(/\[\d+\]/g, '').trim();

    // Extract sources from various possible locations in the response
    let sources: string[] = [];

    // Check for citations in the response
    if (
      perplexityResponse.citations &&
      perplexityResponse.citations.length > 0
    ) {
      sources = perplexityResponse.citations;
    }

    // Check for search_results in the response
    if (
      perplexityResponse.search_results &&
      perplexityResponse.search_results.length > 0
    ) {
      sources = [
        ...sources,
        ...perplexityResponse.search_results.map(result => result.url),
      ];
    }

    // Fallback: Extract markdown links from the content
    if (sources.length === 0) {
      // Fix: Use safer regex with character class limits
      const markdownLinkRegex = /\[([^[\]]+)\]\((https?:\/\/[^\s()]+)\)/g;
      const matches = cleanedMessage.match(markdownLinkRegex);
      if (matches) {
        sources = matches
          .map(match => {
            const urlMatch = RegExp(/\((https?:\/\/[^\s()]+)\)/).exec(match);
            return urlMatch?.[1];
          })
          .filter(Boolean) as string[];
      }
    }

    // Remove duplicates and filter out empty URLs
    sources = [...new Set(sources)].filter(url => {
      return Boolean(url && url.trim().length > 0);
    });

    // Create response message
    const responseMessage: ChatMessage = {
      id: crypto.randomUUID(),
      content: cleanedMessage,
      role: 'assistant',
      timestamp: new Date(),
      ...(sources.length > 0 ? { sources } : {}),
    };

    const apiResponse: ChatApiResponse = {
      message: responseMessage,
    };

    return NextResponse.json(apiResponse);
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
