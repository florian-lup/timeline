import OpenAI from 'openai';

// OpenAI SDK automatically reads from OPENAI_API_KEY environment variable
export const openai = new OpenAI();
