import { Skeleton } from "@/components/ui/skeleton";

export function ProductCardSkeleton() {
  return (
    <div>
      <Skeleton className="aspect-[4/5] w-full mb-5 rounded-none bg-onyx/5" />
      <div className="flex flex-col items-center gap-2">
        <Skeleton className="h-3 w-16 bg-onyx/5" />
        <Skeleton className="h-5 w-40 bg-onyx/5" />
        <Skeleton className="h-4 w-24 bg-onyx/5" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function ProductDetailSkeleton() {
  return (
    <div className="pt-32 md:pt-36 pb-20">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 grid lg:grid-cols-2 gap-12 lg:gap-20">
        <Skeleton className="aspect-square bg-onyx/5 rounded-none" />
        <div className="space-y-5 lg:pt-6">
          <Skeleton className="h-12 w-3/4 bg-onyx/5" />
          <Skeleton className="h-9 w-40 bg-onyx/5" />
          <Skeleton className="h-4 w-full bg-onyx/5" />
          <Skeleton className="h-14 w-full bg-onyx/5 mt-8" />
        </div>
      </div>
    </div>
  );
}