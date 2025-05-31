import { lazy, Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const HomePage = lazy(() => import('./components/HomePage').then(module => ({ default: module.HomePage })));

// Loading component for suspense
function HomeLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-xl px-4">
        <Skeleton className="h-16 w-3/4 mx-auto mb-4" />
        <Skeleton className="h-8 w-full mb-8" />
        <Skeleton className="h-48 w-full" />
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<HomeLoading />}>
      <HomePage />
    </Suspense>
  );
}
