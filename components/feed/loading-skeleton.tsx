import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

/**
 * Skeleton card for loading state
 */
export function SkeletonCard() {
  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="flex flex-col space-y-3">
          <Skeleton className="h-[125px] w-full rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function SkeletonList() {
  return (
    <div className="flex w-full flex-col space-y-4 pt-4 md:space-y-5 lg:space-y-7">
      {Array.from({ length: 3 }, (_, index) => (
        <SkeletonCard key={index} />
      ))}
    </div>
  );
}
