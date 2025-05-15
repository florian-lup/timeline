import { toast } from "sonner";
import { trackShare } from "../features/analytics/shareTracking";

/**
 * Shares content using Web Share API if available, falls back to clipboard copy
 * Also tracks the share in analytics
 */
export const shareContent = async (
  options: {
    title?: string;
    text?: string;
    url?: string;
    onSuccess?: () => void;
  } = {}
) => {
  const {
    title = 'Timeline',
    text = 'Check out this timeline!',
    url = window.location.href,
    onSuccess
  } = options;

  // Track the share attempt
  await trackShare();

  if (navigator.share) {
    try {
      await navigator.share({
        title,
        text,
        url,
      });
      if (onSuccess) onSuccess();
    } catch (error) {
      // Check if it's an AbortError (user cancelled) or another error
      if (error instanceof DOMException && error.name === 'AbortError') {
        // User cancelled share, do nothing
        return;
      }

      // Actual share failure, fall back to clipboard
      copyToClipboard(url);
    }
  } else {
    copyToClipboard(url);
  }
};

/**
 * Copies text to clipboard and shows a toast notification
 */
export const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text)
    .then(() => {
      toast("Link copied", {
        description: "Timeline link copied to clipboard",
      });
    })
    .catch((err) => {
      console.error('Failed to copy: ', err);
      toast("Copy failed", {
        description: "Could not copy to clipboard",
      });
    });
}; 