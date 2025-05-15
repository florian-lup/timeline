import { toast } from "sonner";

/**
 * Tracks a share in the analytics database
 * Returns a Promise that resolves after the database update
 */
export const trackShare = async (): Promise<boolean> => {
  try {
    const response = await fetch('/api/analytics/shares', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Wait for the response before returning
    if (response.ok) {
      await response.json(); // Ensure the response is fully processed
    }

    return response.ok;
  } catch (error) {
    console.error('Error tracking share:', error);
    return false;
  }
};

/**
 * Gets current share count from the API
 */
export const getSharesCount = async (): Promise<number> => {
  try {
    const response = await fetch('/api/analytics/shares');

    if (!response.ok) {
      throw new Error(`Error fetching shares count: ${response.statusText}`);
    }

    const data = await response.json();
    return data.count || 0;
  } catch (err) {
    console.error('Failed to fetch shares count:', err);
    return 0;
  }
};

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
    } catch {
      // User cancelled or share failed
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