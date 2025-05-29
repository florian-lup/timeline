import type { NextRequest } from 'next/server';
import { successResponse, errorResponse } from '@/utils/apiHelpers';

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
    // 1. Create embedding vector for the query
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const embeddingRes = await openai.embeddings.create({
      model: 'text-embedding-3-large',
      input: query,
    });

    const vector = embeddingRes.data[0].embedding;

    // 2. Query Pinecone index
    const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
    const index = pinecone.index('events');

    // Query the index within the "research" namespace
    const { matches } = await index.namespace('research').query({
      vector,
      topK: 5,
      includeMetadata: true,
    });

    // Build a context string that contains ONLY the `text` field from each match's metadata
    const PineconeContext = matches
      .map((m) => {
        const md = m.metadata as { text?: string } | undefined;
        return md?.text ? `- ${md.text}` : '';
      })
      .filter(Boolean)
      .join('\n');

    // 3. Ask GPT-4o-mini to formulate an answer for the user
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