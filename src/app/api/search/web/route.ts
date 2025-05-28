import type { NextRequest } from 'next/server';
import { successResponse, errorResponse } from '@/utils/apiHelpers';

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const query = searchParams.get('query');

  if (!query) {
    return errorResponse('Missing query parameter', 400);
  }

  if (!process.env.TAVILY_API_KEY) {
    return errorResponse('Tavily API key not configured', 500);
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

    return successResponse(data);
  } catch (error) {
    console.error('Error fetching tavily search:', error);
    return errorResponse('Internal server error', 500, error);
  }
} 