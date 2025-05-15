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