import { NextRequest, NextResponse } from 'next/server';
import type { 
  ChatApiRequest, 
  ChatApiResponse, 
  ChatMessage,
  PerplexityRequest,
  PerplexityResponse 
} from '@/types/chat-data';

const PERPLEXITY_API_KEY = process.env['PERPLEXITY_API_KEY'];
const PERPLEXITY_BASE_URL = 'https://api.perplexity.ai';

/**
 * POST handler for chat requests
 * Integrates with Perplexity Sonar for news-focused responses
 */
export async function POST(request: NextRequest) {
  try {
    if (!PERPLEXITY_API_KEY) {
      return NextResponse.json(
        { error: 'Perplexity API key not configured' },
        { status: 500 }
      );
    }

    const body = await request.json() as ChatApiRequest;
    const { message, conversation = [] } = body;

    if (!message || message.trim().length === 0) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Prepare conversation history for Perplexity
    const messages = [
      {
        role: 'system' as const,
        content: 'You are a helpful news search assistant. You specialize in finding and summarizing current news, events, and information from reliable sources. Always provide accurate, up-to-date information. IMPORTANT: Never include any inline citations, numbered references like [1], [2], [3], or source links in your response text. Write clean, flowing text without any reference markers or brackets.'
      },
      // Add conversation history
      ...conversation.map(msg => ({
        role: msg.role === 'user' ? 'user' as const : 'assistant' as const,
        content: msg.content
      })),
      // Add current message
      {
        role: 'user' as const,
        content: message
      }
    ];

    // Get current date in %m/%d/%Y format for filtering recent news
    const currentDate = new Date();
    const searchAfterDate = `${currentDate.getMonth() + 1}/${currentDate.getDate()}/${currentDate.getFullYear()}`;

    const perplexityRequest: PerplexityRequest = {
      model: 'sonar',
      messages,
      max_tokens: 2048,
      temperature: 0.2,
      stream: false,
      search_after_date_filter: searchAfterDate,
      return_citations: true,
      return_images: false,
      return_related_questions: false
    };

    // Call Perplexity API
    const response = await fetch(`${PERPLEXITY_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PERPLEXITY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(perplexityRequest),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Perplexity API error:', errorText);
      return NextResponse.json(
        { error: 'Failed to get response from news search service' },
        { status: 500 }
      );
    }

    const perplexityResponse = await response.json() as PerplexityResponse;
    
    let assistantMessage = perplexityResponse.choices[0]?.message?.content;
    if (!assistantMessage) {
      return NextResponse.json(
        { error: 'No response from news search service' },
        { status: 500 }
      );
    }

    // Clean up the response by removing citation markers like [1], [2], [3], etc.
    assistantMessage = assistantMessage.replace(/\[\d+\]/g, '').trim();

    // Extract sources from various possible locations in the response
    let sources: string[] = [];
    
    // Check for citations in the response
    if (perplexityResponse.citations && perplexityResponse.citations.length > 0) {
      sources = perplexityResponse.citations;
    }
    
    // Check for search_results in the response
    if (perplexityResponse.search_results && perplexityResponse.search_results.length > 0) {
      sources = [...sources, ...perplexityResponse.search_results.map(result => result.url)];
    }
    
    // Fallback: Extract markdown links from the content
    if (sources.length === 0) {
      const markdownLinkRegex = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g;
      const matches = assistantMessage.match(markdownLinkRegex);
      if (matches) {
        sources = matches
          .map(match => {
            const urlMatch = match.match(/\((https?:\/\/[^\s)]+)\)/);
            return urlMatch?.[1];
          })
          .filter((url): url is string => !!url && url.length > 0);
      }
    }
    
    // Remove duplicates and filter out empty URLs
    sources = [...new Set(sources)].filter(url => url && url.trim().length > 0);

    // Create response message
    const responseMessage: ChatMessage = {
      id: crypto.randomUUID(),
      content: assistantMessage,
      role: 'assistant',
      timestamp: new Date(),
      ...(sources.length > 0 && { sources }),
    };

    const apiResponse: ChatApiResponse = {
      message: responseMessage
    };

    return NextResponse.json(apiResponse);

  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 