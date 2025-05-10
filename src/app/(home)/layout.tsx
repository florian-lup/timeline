'use client';

import type { ReactNode } from 'react';
import { ThemeProvider } from 'next-themes';

export default function HomeLayout({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class">
      {children}
    </ThemeProvider>
  );
} 