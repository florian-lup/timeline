import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { SearchService } from '@/lib/services/search-service';

interface SearchRequestBody {
  query: string;
  searchType: 'web' | 'history';
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as SearchRequestBody;
    const { query, searchType } = body;

    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    const searchService = new SearchService();
    const result = await searchService.search({ query, searchType });

    return NextResponse.json(result);
  } catch (error: unknown) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { error: 'An error occurred while searching' },
      { status: 500 },
    );
  }
}
