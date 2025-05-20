export const trackReaction = async (): Promise<boolean> => {
  try {
    const response = await fetch('/api/analytics/reactions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Ensure response processed
    if (response.ok) {
      await response.json();
    }

    return response.ok;
  } catch (error) {
    console.error('Error tracking reaction:', error);
    return false;
  }
};

export const getReactionsCount = async (): Promise<number> => {
  try {
    const response = await fetch('/api/analytics/reactions');

    if (!response.ok) {
      throw new Error(`Error fetching reactions count: ${response.statusText}`);
    }

    const data = await response.json();
    return data.count || 0;
  } catch (error) {
    console.error('Failed to fetch reactions count:', error);
    return 0;
  }
};
