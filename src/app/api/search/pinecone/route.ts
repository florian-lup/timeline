import type { NextRequest } from 'next/server';
import { successResponse, errorResponse } from '@/utils/apiHelpers';
import { formatEventDate } from '@/utils/dateFormatters';

import OpenAI from 'openai';
import { Pinecone } from '@pinecone-database/pinecone';

export async function POST(req: NextRequest) {
  const { query, history = [] } = await req.json();

  if (!query || typeof query !== 'string') {
    return errorResponse('Missing query parameter', 400);
  }
  if (!Array.isArray(history)) {
    return errorResponse('Invalid history format', 400);
  }

  if (!process.env.OPENAI_API_KEY) {
    return errorResponse('OpenAI API key not configured', 500);
  }
  if (!process.env.PINECONE_API_KEY) {
    return errorResponse('Pinecone API key not configured', 500);
  }

  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    // Get current date for context
    const currentDate = formatEventDate(new Date());

    // 1. Use GPT-4o-mini to generate an optimized query for Pinecone search
    const queryOptimization = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0.3,
      messages: [
        {
          role: 'system',
          content: `You are a search query optimizer for a historical events database. 
Today's date is ${currentDate}.
Given a user's question or statement, generate an optimized search query that will help find the most relevant historical events.
Focus on extracting key concepts, dates, people, and events.
If the user uses relative time references (e.g., "10 years ago", "last century"), convert them to specific dates or date ranges.
The output should be a clear, concise search query optimized for semantic search.`,
        },
        {
          role: 'user',
          content: `User input: ${query}\n\nGenerate an optimized search query:`,
        },
      ],
      max_tokens: 100,
    });

    const optimizedQuery = queryOptimization.choices[0].message.content?.trim() || query;
    console.log('Optimized query for Pinecone:', optimizedQuery);

    // 2. Create embedding vector for the optimized query
    const embeddingRes = await openai.embeddings.create({
      model: 'text-embedding-3-large',
      input: optimizedQuery,
    });

    const vector = embeddingRes.data[0].embedding;

    // 3. Query Pinecone index
    const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
    const index = pinecone.index('events');

    // Query the index within the "research" namespace
    const { matches } = await index.namespace('research').query({
      vector,
      topK: 5,
      includeMetadata: true,
    });

    const PineconeContext = matches
      .map((m) => {
        const md = m.metadata as { text?: string } | undefined;
        return md?.text ? `- ${md.text}` : '';
      })
      .filter(Boolean)
      .join('\n');

    // 4. Ask GPT-4o-mini to formulate an answer for the user
    // Convert history into OpenAI chat format (limit to last 10 messages to control token usage)
    const recentHistory = (history as { role: 'user' | 'assistant'; content: string }[]).slice(-10);

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0.7,
      messages: [
        {
          role: 'system',
          content:
            'You are a helpful assistant that answers questions based on a historical events timeline. Use the provided events to craft your answer. If uncertain, say so briefly.',
        },
        ...recentHistory,
        {
          role: 'user',
          content: `User question: ${query}\n\nRelevant events:\n${PineconeContext}`,
        },
      ],
    });

    const answer = completion.choices[0].message.content ?? '';

    return successResponse({ answer });
  } catch (error) {
    console.error('Error performing timeline search:', error);
    return errorResponse('Internal server error', 500, error);
  }
}
