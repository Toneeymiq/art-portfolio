import { Skeleton } from "@/components/Skeleton";

export default function Loading() {
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex flex-col space-y-8">
                {/* Header Skeleton */}
                <div className="flex flex-col space-y-4 items-center justify-center text-center">
                    <Skeleton className="h-10 w-48" />
                    <Skeleton className="h-4 w-96 max-w-full" />
                </div>

                {/* Gallery Grid Skeleton */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="flex flex-col space-y-3">
                            <Skeleton className="h-[300px] w-full rounded-xl" />
                            <div className="space-y-2">
                                <Skeleton className="h-6 w-3/4" />
                                <Skeleton className="h-4 w-1/2" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
