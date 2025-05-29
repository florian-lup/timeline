import type { NextRequest } from 'next/server';
import { successResponse, errorResponse } from '@/utils/apiHelpers';
import OpenAI from 'openai';

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const query = searchParams.get('query');

  if (!query) {
    return errorResponse('Missing query parameter', 400);
  }

  if (!process.env.TAVILY_API_KEY) {
    return errorResponse('Tavily API key not configured', 500);
  }

  if (!process.env.OPENAI_API_KEY) {
    return errorResponse('OpenAI API key not configured', 500);
  }

  try {
    const tavilyRes = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.TAVILY_API_KEY}`,
      },
      body: JSON.stringify({
        query,
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

    // Use GPT-4o-mini to formulate a conversational answer
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0.7,
      messages: [
        {
          role: 'system',
          content:
            'You are a helpful assistant that answers user questions based on web search results. Use the provided answer to craft a concise, friendly response.',
        },
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