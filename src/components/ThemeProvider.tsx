'use client';

import { ThemeProvider } from 'next-themes';

/**
 * Provides theme context to the application
 */
export function ThemeProviderWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" enableSystem defaultTheme="system">
      {children}
    </ThemeProvider>
  );
}
