import { tavily } from '@tavily/core';

if (
  process.env['TAVILY_API_KEY'] === undefined ||
  process.env['TAVILY_API_KEY'] === ''
) {
  throw new Error('TAVILY_API_KEY is not set');
}

export const tavilyClient = tavily({
  apiKey: process.env['TAVILY_API_KEY'],
});
