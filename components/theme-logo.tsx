'use client';

import Image from 'next/image';
import { memo } from 'react';

type ThemeLogoProps = {
  width?: number;
  height?: number;
  className?: string;
};

/**
 * Logo that swaps automatically using Tailwind's `dark` class.
 * We render both variants (light & dark) and let CSS decide which one is visible,
 * eliminating the need to wait for client-side hydration.
 */
export const ThemeLogo = memo(function ThemeLogo({
  width = 24,
  height = 24,
  className = '',
}: ThemeLogoProps) {
  return (
    <div
      className={className}
      style={{ width, height, position: 'relative' }}
      aria-label="Timeline Logo"
    >
      {/* Light theme logo */}
      <Image
        src="/logo-light.svg"
        alt="Timeline Logo – Light"
        width={width}
        height={height}
        className="block dark:hidden"
        priority
      />
      {/* Dark theme logo */}
      <Image
        src="/logo-dark.svg"
        alt="Timeline Logo – Dark"
        width={width}
        height={height}
        className="hidden dark:block"
        priority
      />
    </div>
  );
});
