'use client';

import { useEffect } from 'react';

/**
 * Global error boundary component for the Next.js app
 * Catches and displays runtime errors in the React component tree
 * Can be customized with error reporting service integration
 */
export default function ErrorPage({
  error,
}: {
  error: Error & { digest?: string };
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    // Replace with your error monitoring service in production
    // e.g., Sentry, LogRocket, etc.
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Something went wrong!</h2>
        <p className="text-muted-foreground mt-2">
          We apologize for the inconvenience.
        </p>
      </div>
    </div>
  );
}
