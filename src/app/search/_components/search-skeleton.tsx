export function SearchSkeleton() {
  return (
    <div className="flex gap-10 animate-pulse">
      {/* Sidebar skeleton (desktop) */}
      <div className="hidden lg:block lg:w-[280px] lg:shrink-0">
        <div className="space-y-6">
          <div className="h-6 w-24 rounded bg-muted" />
          <div className="h-10 w-full rounded-full bg-muted" />
          <div className="space-y-3">
            <div className="h-4 w-20 rounded bg-muted" />
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-8 w-20 rounded-full bg-muted" />
              ))}
            </div>
          </div>
          <div className="space-y-3">
            <div className="h-4 w-24 rounded bg-muted" />
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-8 w-24 rounded-full bg-muted" />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main content skeleton */}
      <div className="min-w-0 flex-1">
        <div className="mb-8 flex items-center justify-between">
          <div className="h-9 w-48 rounded bg-muted" />
          <div className="h-9 w-20 rounded-full bg-muted" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 mt-10">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-border overflow-hidden"
            >
              <div className="aspect-[16/10] bg-muted" />
              <div className="p-5 space-y-3">
                <div className="h-5 w-3/4 rounded bg-muted" />
                <div className="h-4 w-1/2 rounded bg-muted" />
                <div className="h-6 w-1/3 rounded bg-muted" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
