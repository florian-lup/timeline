'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import type { ThemeProviderProps } from 'next-themes';
import { memo } from 'react';

/**
 * Theme provider component to enable dark/light mode
 * Wraps next-themes library with client-side rendering
 * Supports system preference detection and theme switching
 */
export const ThemeProvider = memo(function ThemeProvider({
  children,
  ...props
}: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
});
