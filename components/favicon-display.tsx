'use client';

import { LinkIcon } from 'lucide-react';
import Image from 'next/image';
import { useState, useEffect } from 'react';

import { getFaviconData } from '@/utils/favicon-helper';

interface FaviconDisplayProps {
  /**
   * The URL to extract favicon from
   */
  url: string;
  /**
   * Size of the favicon in pixels (default: 16)
   */
  size?: number;
  /**
   * Additional CSS classes for the container
   */
  className?: string;
}

/**
 * Displays a favicon for a given URL with fallback to LinkIcon
 */
export function FaviconDisplay({
  url,
  size = 16,
  className = '',
}: FaviconDisplayProps) {
  const [imageError, setImageError] = useState(false);
  const [currentFaviconUrl, setCurrentFaviconUrl] = useState<string>('');

  const { faviconUrl, hasValidDomain, domain } = getFaviconData(url, size);

  useEffect(() => {
    // Reset error state when URL changes
    setImageError(false);
    if (faviconUrl) {
      setCurrentFaviconUrl(faviconUrl);
    }
  }, [faviconUrl]);

  // If no valid domain or image failed to load, show fallback icon
  if (!hasValidDomain || imageError || !currentFaviconUrl) {
    return <LinkIcon className={`shrink-0 ${className}`} size={size} />;
  }

  return (
    <Image
      src={currentFaviconUrl}
      alt={`Favicon for ${domain}`}
      width={size}
      height={size}
      className={`shrink-0 ${className}`}
      onError={() => {
        console.warn(`Failed to load favicon for ${domain}`);
        setImageError(true);
      }}
    />
  );
}
