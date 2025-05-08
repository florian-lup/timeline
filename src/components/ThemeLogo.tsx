'use client';

import { useTheme } from 'next-themes';
import Image from 'next/image';
import { useState, useEffect } from 'react';

type ThemeLogoProps = {
  width?: number;
  height?: number;
  className?: string;
};

export function ThemeLogo({ width = 24, height = 24, className = '' }: ThemeLogoProps) {
  const [mounted, setMounted] = useState(false);
  const { theme, resolvedTheme } = useTheme();

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  // Use resolvedTheme to also handle system preference
  const currentTheme = theme === 'system' ? resolvedTheme : theme;
  
  if (!mounted) {
    // Return a placeholder to avoid layout shift
    return <div style={{ width, height }} className={className} />;
  }

  const logoSrc = currentTheme === 'dark' ? '/logo-dark.svg' : '/logo-light.svg';

  return (
    <Image 
      src={logoSrc} 
      alt="Timeline Logo" 
      width={width} 
      height={height} 
      className={className} 
    />
  );
} 