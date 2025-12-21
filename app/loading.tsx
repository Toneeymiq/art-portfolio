import { Skeleton } from "@/components/Skeleton";

export default function Loading() {
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 flex justify-center items-center min-h-[50vh]">
            <div className="flex flex-col items-center space-y-6">
                <Skeleton className="h-12 w-12 rounded-full" />
                <Skeleton className="h-4 w-48" />
            </div>
        </div>
    );
}
