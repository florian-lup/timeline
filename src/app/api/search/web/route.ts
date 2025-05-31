import type { NextRequest } from 'next/server';
import { successResponse, errorResponse } from '@/utils/apiHelpers';
import { formatEventDate } from '@/utils/dateFormatters';
import OpenAI from 'openai';

export async function POST(req: NextRequest) {
  const { query, history = [] } = await req.json();

  if (!query || typeof query !== 'string') {
    return errorResponse('Missing query parameter', 400);
  }

  if (!Array.isArray(history)) {
    return errorResponse('Invalid history format', 400);
  }

  if (!process.env.TAVILY_API_KEY) {
    return errorResponse('Tavily API key not configured', 500);
  }

  if (!process.env.OPENAI_API_KEY) {
    return errorResponse('OpenAI API key not configured', 500);
  }

  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    // Get current date for context
    const currentDate = formatEventDate(new Date());

    // 1. Use GPT-4o-mini to generate an optimized query for web search
    const queryOptimization = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0.3,
      messages: [
        {
          role: 'system',
          content: `You are a search query optimizer for web news search. 
Today's date is ${currentDate}.
Given a user's question or statement, generate an optimized search query that will help find the most relevant recent news and information.
Focus on extracting key concepts, entities, and current events.
If the user asks about "recent", "today", "this week", etc., use appropriate current dates.
The output should be a clear, concise search query optimized for news search.
Make it specific and actionable for current events search.`,
        },
        {
          role: 'user',
          content: `User input: ${query}\n\nGenerate an optimized search query:`,
        },
      ],
      max_tokens: 100,
    });

    const optimizedQuery = queryOptimization.choices[0].message.content?.trim() || query;
    console.log('Optimized query for Tavily:', optimizedQuery);

    // 2. Search using Tavily with the optimized query
    const tavilyRes = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.TAVILY_API_KEY}`,
      },
      body: JSON.stringify({
        query: optimizedQuery,
        topic: 'news',
        days: 7,
        search_depth: 'basic',
        max_results: 5,
        include_answer: true,
      }),
    });

    if (!tavilyRes.ok) {
      const errorBody = await tavilyRes.text();
      console.error('Tavily error', tavilyRes.status, errorBody);
      return errorResponse('Failed to fetch data from Tavily', tavilyRes.status);
    }

    const data = await tavilyRes.json();

    const WebContext = data.answer ?? '';

    // 3. Use GPT-4o-mini to formulate a conversational answer
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0.7,
      messages: [
        {
          role: 'system',
          content:
            'You are a helpful assistant that answers user questions based on web search results. Use the provided answer to craft a concise, friendly response.',
        },
        ...(history as { role: 'user' | 'assistant'; content: string }[]).slice(-10),
        {
          role: 'user',
          content: `User question: ${query}\n\nAnswer from web search: ${WebContext}`,
        },
      ],
    });

    const answer = completion.choices[0].message.content ?? WebContext;

    return successResponse({ answer });
  } catch (error) {
    console.error('Error fetching tavily search:', error);
    return errorResponse('Internal server error', 500, error);
  }
}
