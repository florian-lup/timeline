'use client';

import { getImageProps } from 'next/image';
import { memo } from 'react';

type ThemeLogoProps = {
  width?: number;
  height?: number;
  className?: string;
};

/**
 * Utility to omit the style property from image props for CSP compliance
 */
function omitStyle<T extends Record<string, unknown>>(
  props: T,
): Omit<T, 'style'> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { style, ...propsWithoutStyle } = props;
  return propsWithoutStyle;
}

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
  const lightLogoProps = getImageProps({
    src: '/logo-light.svg',
    alt: 'Timeline Logo – Light',
    width,
    height,
    priority: true,
  });

  const darkLogoProps = getImageProps({
    src: '/logo-dark.svg',
    alt: 'Timeline Logo – Dark',
    width,
    height,
    priority: true,
  });

  // Omit style property entirely for strict CSP compliance
  const lightPropsWithoutStyle = omitStyle(lightLogoProps.props);
  const darkPropsWithoutStyle = omitStyle(darkLogoProps.props);

  return (
    <div className={`${className} relative`} aria-label="Timeline Logo">
      {/* Light theme logo */}
      {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
      <img {...lightPropsWithoutStyle} className="block dark:hidden" />
      {/* Dark theme logo */}
      {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
      <img {...darkPropsWithoutStyle} className="hidden dark:block" />
    </div>
  );
});
