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

const siteUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://yourdomain.com';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Timeline - AI-Powered Global Events Platform',
    template: '%s | Timeline',
  },
  description:
    'Timeline is an AI-powered platform that captures and curates global events in real time, providing a seamless, interactive, and continuously evolving narrative of what is happening around the world.',
  keywords: [
    'timeline',
    'ai',
    'artificial intelligence',
    'global events',
    'news',
    'breaking news',
    'real-time updates',
    'world news',
    'event tracking',
    'interactive timeline',
  ],
  authors: [{ name: 'Timeline Team' }],
  creator: 'Timeline',
  publisher: 'Timeline',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'Timeline - AI-Powered Global Events Platform',
    description:
      'Timeline captures and curates global events in real time with AI, providing an interactive narrative of world events.',
    url: siteUrl,
    siteName: 'Timeline',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Timeline - AI-Powered Global Events Platform',
    description:
      'Timeline captures and curates global events in real time with AI, providing an interactive narrative of world events.',
    creator: '@timeline',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
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
