import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-6 lg:px-10 py-10">
        <div className="mb-8 h-4 w-48 rounded bg-muted animate-pulse" />
        <div className="grid lg:grid-cols-[1.4fr_1fr] gap-10">
          <div>
            <Skeleton className="w-full aspect-[16/10] rounded-xl" />
            <div className="flex gap-4 mt-4">
              <Skeleton className="w-24 h-16 rounded-md" />
              <Skeleton className="w-24 h-16 rounded-md" />
              <Skeleton className="w-24 h-16 rounded-md" />
            </div>
          </div>
          <div className="space-y-6">
            <Skeleton className="h-10 w-3/4 rounded" />
            <Skeleton className="h-8 w-1/2 rounded" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full rounded" />
              <Skeleton className="h-4 w-full rounded" />
              <Skeleton className="h-4 w-2/3 rounded" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-16 w-full rounded-xl" />
              <Skeleton className="h-16 w-full rounded-xl" />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
