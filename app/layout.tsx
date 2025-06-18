import { Analytics } from '@vercel/analytics/react';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { headers } from 'next/headers';

import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';

// Configure the Geist Sans font with variable support
const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

// Configure the Geist Mono font with variable support
const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

// Viewport configuration for better mobile experience
export const viewport = {
  maximumScale: 1, // Disable auto-zoom on mobile Safari
};

// SEO metadata configuration with relevant keywords
export const metadata: Metadata = {
  metadataBase: new URL(
    process.env['NEXT_PUBLIC_SITE_URL'] ?? 'http://localhost:3000',
  ),
  title: 'Timeline',
  description: 'AI-Powered News Tracking',
  keywords: [
    'timeline',
    'news',
    'global events',
    'global news',
    'world news',
    'breaking news',
    'global news tracking',
  ],
};

/**
 * Root layout component that wraps all pages
 * Configures theme support, fonts, and CSP nonce
 */
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const nonce = (await headers()).get('x-nonce') ?? '';
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          nonce={nonce}
        >
          {children}
          {process.env['VERCEL_ENV'] === 'production' && <Analytics />}
        </ThemeProvider>
      </body>
    </html>
  );
}
