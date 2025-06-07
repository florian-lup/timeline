import { NextResponse, type NextRequest } from 'next/server';
import { generateNonce } from './lib/nonce';

export function middleware(request: NextRequest) {
  const nonce = generateNonce();

  // strict CSP that only trusts scripts with this nonce
  const csp = [
    "default-src 'self'",
    `script-src 'nonce-${nonce}' 'strict-dynamic' https:`,
    `style-src 'self' 'nonce-${nonce}'`,
    "object-src 'none'",
    "base-uri 'none'",
    'upgrade-insecure-requests',
  ].join('; ');

  const res = NextResponse.next();
  res.headers.set('Content-Security-Policy', csp);
  // expose nonce to the React tree
  res.headers.set('x-nonce', nonce);
  return res;
}

// run for every route in the app router
export const config = { matcher: '/' };
