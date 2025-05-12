import { NextRequest } from 'next/server';
import { errorResponse } from './apiHelpers';

/**
 * Validates that a request has the required cron job secret token
 * @param request NextRequest object from the route handler
 * @param cronSecret Secret token that should match the Authorization header
 * @returns null if authorized, or an error response if unauthorized
 */
export function validateCronAuth(request: NextRequest, cronSecret: string) {
  // Skip authorization if no secret is configured
  if (!cronSecret) {
    return null;
  }
  
  const authHeader = request.headers.get('authorization');
  
  // Check if header exists and matches the expected format
  if (!authHeader || authHeader !== `Bearer ${cronSecret}`) {
    return errorResponse('Unauthorized', 401);
  }
  
  return null;
} 