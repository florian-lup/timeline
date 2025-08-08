'use client';

import { LinkIcon } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';

import { getFaviconData, getFaviconCandidates } from '@/utils/favicon-helper';

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
  const [fallbackIndex, setFallbackIndex] = useState(0);

  const { hasValidDomain, domain } = getFaviconData(url, size);
  const candidates = useMemo(
    () => (hasValidDomain ? getFaviconCandidates(url, size) : []),
    [hasValidDomain, url, size],
  );

  useEffect(() => {
    // Reset state when inputs change
    setImageError(false);
    setFallbackIndex(0);
    if (candidates.length > 0) {
      setCurrentFaviconUrl(candidates[0] ?? '');
    } else {
      setCurrentFaviconUrl('');
    }
  }, [candidates]);

  // If no valid domain or image failed to load, show fallback icon
  if (!hasValidDomain || imageError || !currentFaviconUrl) {
    return <LinkIcon className={`shrink-0 ${className}`} size={size} />;
  }

  const handleError = () => {
    const nextIndex = fallbackIndex + 1;
    if (nextIndex < candidates.length) {
      setFallbackIndex(nextIndex);
      setCurrentFaviconUrl(candidates[nextIndex] ?? '');
      return;
    }
    console.warn(`Failed to load favicon for ${domain}`);
    setImageError(true);
  };

  return (
    <Image
      src={currentFaviconUrl}
      alt={`Favicon for ${domain}`}
      width={size}
      height={size}
      className={`shrink-0 ${className}`}
      style={{ width: size, height: size }}
      referrerPolicy="no-referrer"
      loading="lazy"
      unoptimized
      onError={handleError}
    />
  );
}
