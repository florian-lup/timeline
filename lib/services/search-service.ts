import type { ChatCompletionMessageParam } from 'openai/resources/chat/completions';

import { openai } from '@/lib/clients/openai';
import { pineconeIndex } from '@/lib/clients/pinecone';
import { tavilyClient } from '@/lib/clients/tavily';
import { SEARCH_CONFIG } from '@/lib/config/search-config';
import { searchTools } from '@/lib/tools/search-tools';

export interface SearchRequest {
  query: string;
  searchType: 'web' | 'history';
}

export interface SearchResponse {
  summary: string;
}

interface ToolCallArgs {
  query: string;
}

/**
 * Search Pinecone for historical timeline data
 */
async function searchPinecone(query: string) {
  try {
    // Generate embedding for the query
    const embedding = await openai.embeddings.create({
      model: SEARCH_CONFIG.openai.embeddingModel,
      input: query,
    });

    const embeddingVector = embedding.data[0]?.embedding || [];

    // Search Pinecone
    const results = await pineconeIndex
      .namespace(SEARCH_CONFIG.pinecone.namespace)
      .query({
        vector: embeddingVector,
        topK: SEARCH_CONFIG.pinecone.topK,
        includeMetadata: SEARCH_CONFIG.pinecone.includeMetadata,
      });

    return results.matches;
  } catch (error) {
    console.error('Pinecone search error:', error);
    return [];
  }
}

/**
 * Search Tavily for current web information
 */
async function searchTavily(query: string) {
  try {
    const results = await tavilyClient.search(query, {
      searchDepth: SEARCH_CONFIG.tavily.searchDepth,
      topic: SEARCH_CONFIG.tavily.topic,
      timeRange: SEARCH_CONFIG.tavily.timeRange,
      days: SEARCH_CONFIG.tavily.days,
      includeAnswer: SEARCH_CONFIG.tavily.includeAnswer,
      maxResults: SEARCH_CONFIG.tavily.maxResults,
    });

    return results;
  } catch (error) {
    console.error('Tavily search error:', error);
    return { results: [], answer: null };
  }
}

/**
 * Main search service using OpenAI function calling
 */
export class SearchService {
  async search({ query, searchType }: SearchRequest): Promise<SearchResponse> {
    try {
      // Force the appropriate tool based on searchType
      const toolChoice =
        searchType === 'history'
          ? { type: 'function' as const, function: { name: 'search_pinecone' } }
          : { type: 'function' as const, function: { name: 'search_tavily' } };

      // Use the appropriate system message based on search type
      const systemMessage =
        searchType === 'history'
          ? SEARCH_CONFIG.prompts.history
          : SEARCH_CONFIG.prompts.web;

      const messages: ChatCompletionMessageParam[] = [
        {
          role: 'system',
          content: systemMessage,
        },
        { role: 'user', content: query },
      ];

      let completion = await openai.chat.completions.create({
        model: SEARCH_CONFIG.openai.model,
        temperature: SEARCH_CONFIG.openai.temperature,
        max_tokens: SEARCH_CONFIG.openai.maxTokens,
        messages,
        tools: searchTools,
        tool_choice: toolChoice,
      });

      let message = completion.choices[0]?.message;

      if (message?.tool_calls !== undefined && message.tool_calls.length > 0) {
        const toolCall = message.tool_calls[0];
        if (toolCall !== undefined) {
          const args = JSON.parse(toolCall.function.arguments) as ToolCallArgs;
          let toolResult: unknown;

          if (toolCall.function.name === 'search_pinecone') {
            toolResult = await searchPinecone(args.query);
          } else if (toolCall.function.name === 'search_tavily') {
            toolResult = await searchTavily(args.query);
          }

          const updatedMessages: ChatCompletionMessageParam[] = [
            ...messages,
            message,
            {
              role: 'tool',
              tool_call_id: toolCall.id,
              content: JSON.stringify(toolResult),
            },
          ];

          // Get the final response
          completion = await openai.chat.completions.create({
            model: SEARCH_CONFIG.openai.model,
            temperature: SEARCH_CONFIG.openai.temperature,
            max_tokens: SEARCH_CONFIG.openai.maxTokens,
            messages: updatedMessages,
          });

          message = completion.choices[0]?.message;
        }
      }

      return {
        summary:
          message?.content !== undefined &&
          message.content !== null &&
          message.content !== ''
            ? message.content
            : 'No results found.',
      };
    } catch (error) {
      console.error('Search service error:', error);
      return {
        summary: 'An error occurred while searching. Please try again.',
      };
    }
  }
}
