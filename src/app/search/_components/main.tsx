import { Suspense } from "react";
import type { Vehicle } from "@/lib/vehicles/type";
import { InfiniteServicesGrid } from "@/components/infinite-services-grid";
import { Filters } from "./Filters";
import { ViewToggle } from "./ViewToggle";
import { FilterDrawerTrigger } from "./FilterDrawerTrigger";

interface SearchMainProps {
  vehicles: Vehicle[];
  totalCount: number;
  searchParams: Record<string, string | string[] | undefined>;
  nextCursor: string | null;
  brands: { brand: string; count: number }[];
}

export function SearchMain({
  vehicles,
  totalCount,
  searchParams,
  nextCursor,
  brands,
}: SearchMainProps) {
  const view = (searchParams.view as string) === "list" ? "list" : "grid";

  return (
    <div className="flex gap-10">
      {/* ── Desktop Sidebar (sticky, hidden on mobile) ── */}
      <div className="hidden lg:block lg:w-[280px] lg:shrink-0">
        <div className="sticky top-24 max-h-[calc(100vh-6rem)] overflow-y-auto pb-8 pr-2">
          <Suspense fallback={null}>
            <Filters brands={brands} />
          </Suspense>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="min-w-0 flex-1">
        {/* Header bar */}
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold">
            Em estoque{" "}
            <span className="text-muted-foreground">({totalCount})</span>
          </h1>
          <div className="flex items-center gap-3">
            <Suspense fallback={null}>
              <ViewToggle />
            </Suspense>
          </div>
        </div>

        {/* Vehicle grid / list */}
        {vehicles.length > 0 ? (
          <InfiniteServicesGrid
            initialServices={vehicles}
            searchParams={searchParams}
            initialNextCursor={nextCursor}
            view={view}
          />
        ) : (
          <div className="rounded-2xl border border-dashed border-border p-16 text-center text-muted-foreground">
            Nenhum veículo encontrado com esses filtros.
          </div>
        )}
      </div>

      {/* ── Mobile FAB + Drawer (visible only on < lg) ── */}
      <Suspense fallback={null}>
        <FilterDrawerTrigger brands={brands} />
      </Suspense>
    </div>
  );
}
