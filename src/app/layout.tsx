import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { ThemeProviderWrapper } from '@/components/ThemeProvider';
import { Toaster } from '@/components/ui/sonner';
import './globals.css';

// Optimize font loading
const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap', // Ensure text remains visible during font loading
});

export const metadata: Metadata = {
  title: 'Timeline',
  description:
    'Powered by AI, the platform captures global events as they unfold, seamlessly weaving them into a continuous, evolving narrative.',
  icons: {
    icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }],
    apple: [{ url: '/favicon.svg', type: 'image/svg+xml' }],
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
        {/* Preconnect to domains that will be used */}
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* Add a prefetch strategy hint for browsers */}
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
