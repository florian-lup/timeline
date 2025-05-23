import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { ThemeProviderWrapper } from '@/components/ThemeProvider';
import { Toaster } from '@/components/ui/sonner';
import './globals.css';

// Load Inter font with optimization
const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Timeline',
  description:
    'Timeline is an AI-powered platform that captures and curates global events in real time, providing a seamless, interactive, and continuously evolving narrative of what is happening around the world.',
  keywords: ['timeline', 'ai', 'artificial intelligence', 'global events', 'news', 'breaking news', 'real-time updates', 'world news', 'event tracking', 'interactive timeline'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Preconnect to external resources */}
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* Browser prefetch hint */}
        <meta name="next-head-count" content="0" />
      </head>
      <body className={`${inter.variable} antialiased`}>
        <ThemeProviderWrapper>
          {children}
          <Toaster />
        </ThemeProviderWrapper>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
