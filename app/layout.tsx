import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { headers } from 'next/headers';
import type { ReactNode } from 'react';

import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Next.js Starter Kit',
  description: 'A starter template for your Next.js project',
  keywords: [
    'template',
    'scaffolding',
    'next.js',
    'react',
    'tailwind',
    'shadcn',
    'ui',
    'components',
    'design',
    'system',
    'framework',
  ],
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const nonce = (await headers()).get('x-nonce') ?? '';

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* inline script */}
        <script
          nonce={nonce}
          dangerouslySetInnerHTML={{ __html: 'console.log("CSP script loaded")' }}
        />

        {/* inline style */}
        <style nonce={nonce}></style>
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
