import { toast } from 'sonner';
import { trackShare } from '@/services/analytics/shareTracking';

/**
 * Shares content using Web Share API if available, falls back to clipboard copy
 * Also tracks the share in analytics
 */
export const shareContent = async (
  options: {
    title?: string;
    url?: string;
    onSuccess?: () => void;
  } = {},
) => {
  const {
    title = 'Timeline',
    url = window.location.href,
    onSuccess,
  } = options;

  // Track the share attempt
  await trackShare();

  // Simple mobile check based on user agent
  const isMobile = /Mobi|Android|iPhone|iPad|iPod|Windows Phone/i.test(
    navigator.userAgent,
  );

  if (isMobile && navigator.share) {
    try {
      const shareData = {
        title,
        url,
      } satisfies ShareData;

      await navigator.share(shareData);
      if (onSuccess) onSuccess();
      return;
    } catch (error) {
      // AbortError (user canceled) — silently ignore.
      if (error instanceof DOMException && error.name === 'AbortError') {
        return;
      }
      // Any other failure: fall back to clipboard.
    }
  }

  // Desktop or mobile fallback
  copyToClipboard(url);
};

/**
 * Copies text to clipboard and shows a toast notification
 */
export const copyToClipboard = (text: string) => {
  navigator.clipboard
    .writeText(text)
    .then(() => {
      toast('Link copied', {
        description: 'Link copied to clipboard',
      });
    })
    .catch((err) => {
      console.error('Failed to copy: ', err);
      toast('Copy failed', {
        description: 'Could not copy to clipboard',
      });
    });
};
