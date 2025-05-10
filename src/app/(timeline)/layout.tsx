'use client';

import type { ReactNode } from 'react';
import { ThemeProvider } from 'next-themes';

// Timeline group layout loads specific CSS only needed for the timeline
export default function TimelineLayout({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class">
      {children}
    </ThemeProvider>
  );
} 