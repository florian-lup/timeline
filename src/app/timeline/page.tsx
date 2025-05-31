import { lazy, Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const Timeline = lazy(() => import('./components/TimelinePage').then(module => ({ default: module.Timeline })));

// Loading component for suspense
function TimelineLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-xl px-4">
        <Skeleton className="h-12 w-full mb-4" />
        <Skeleton className="h-64 w-full" />
      </div>
    </div>
  );
}

export default function ThreadPage() {
  return (
    <Suspense fallback={<TimelineLoading />}>
      <Timeline />
    </Suspense>
  );
}
