'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center p-4">
      <h2 className="mb-4 text-2xl font-bold">Something went wrong!</h2>
      <p className="mb-6 text-muted-foreground">
        We apologize for the inconvenience. Please try again.
      </p>
      <Button
        onClick={() => reset()}
        variant="default"
      >
        Try again
      </Button>
    </div>
  );
} 