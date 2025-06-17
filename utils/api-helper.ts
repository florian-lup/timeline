import { NextResponse } from 'next/server';

/**
 * Standard success response format
 * @param data Response data to return
 * @param status HTTP status code (default: 200)
 */
export function successResponse<T>(data: T, status = 200) {
  return NextResponse.json(data, { status });
}

/**
 * Standard error response format
 * @param message Error message
 * @param status HTTP status code (default: 500)
 * @param error Optional error details
 */
export function errorResponse(message: string, status = 500, error?: unknown) {
  console.error(`API Error (${status}): ${message}`, error);

  return NextResponse.json({ success: false, error: message }, { status });
}
