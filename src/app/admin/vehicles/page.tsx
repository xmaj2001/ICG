"use client";

import { Suspense, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { VehicleCard } from "@/components/vehicles/VehicleCard";
import { VehicleTable } from "@/app/admin/_components/VehicleTable";
import { DashboardFilters } from "@/app/admin/_components/DashboardFilters";
import { DeleteDialog } from "@/components/dashboard/DeleteDialog";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import type { Vehicle } from "@/lib/vehicles/type";
import { deleteVehicle } from "@/lib/vehicles/use-case/delete-vehicle";
import { deleteCloudinaryImages } from "@/lib/cloudinary/use-case/delete-cloudinary-images";
import { useVehicles } from "@/lib/vehicles/hooks";
import {
  LayoutGrid,
  PlusCircle,
  Rows,
  Search,
  Pencil,
  Trash2,
  SlidersHorizontal,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { toast } from "sonner";

function VehiclesDashboard() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const view = searchParams.get("view") || "grid";

  // Modal states for delete
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const params = {
    search: searchParams.get("search") || undefined,
    brand: searchParams.get("brand") || undefined,
    category: searchParams.get("category") || undefined,
    fuel: searchParams.get("fuel") || undefined,
    transmission: searchParams.get("transmission") || undefined,
    status: searchParams.get("status") || undefined,
    minYear: searchParams.get("minYear")
      ? Number(searchParams.get("minYear"))
      : undefined,
    maxYear: searchParams.get("maxYear")
      ? Number(searchParams.get("maxYear"))
      : undefined,
    minPrice: searchParams.get("minPrice")
      ? Number(searchParams.get("minPrice"))
      : undefined,
    maxPrice: searchParams.get("maxPrice")
      ? Number(searchParams.get("maxPrice"))
      : undefined,
    limit: 50,
  };

  const { vehicles, isLoading, mutate } = useVehicles(params);

  const [localSearch, setLocalSearch] = useState(params.search || "");

  // Update URL when view changes
  const setView = (newView: string) => {
    const sp = new URLSearchParams(searchParams.toString());
    sp.set("view", newView);
    router.push(pathname + "?" + sp.toString());
  };

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      const sp = new URLSearchParams(searchParams.toString());
      if (localSearch) {
        sp.set("search", localSearch);
      } else {
        sp.delete("search");
      }
      router.push(pathname + "?" + sp.toString());
    }, 500);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localSearch]);

  const handleEdit = (vehicle: Vehicle) => {
    router.push(`/admin/vehicles/${vehicle.id}/editar`);
  };

  const handleDeleteRequest = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedVehicle) return;
    try {
      setIsDeleting(true);
      await deleteVehicle(selectedVehicle.id);

      // Eliminar as imagens do Cloudinary para não ocupar espaço
      if (selectedVehicle.images && selectedVehicle.images.length > 0) {
        await deleteCloudinaryImages(selectedVehicle.images);
      }

      setIsDeleteDialogOpen(false);
      setSelectedVehicle(null);

      mutate();
      toast.success("Veículo eliminado com sucesso!");
    } catch (error) {
      console.error("Failed to delete", error);
      toast.error("Ocorreu um erro ao eliminar o veículo.");
    } finally {
      setIsDeleting(false);
    }
  };

  // Count active filters for the badge
  const activeFilterCount = [
    searchParams.get("brand"),
    searchParams.get("category"),
    searchParams.get("fuel"),
    searchParams.get("transmission"),
    searchParams.get("status"),
    searchParams.get("minYear"),
    searchParams.get("minPrice"),
  ].filter(Boolean).length;

  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);

  return (
    <div className="flex flex-col md:flex-row gap-8">
      {/* Sidebar - Filters (desktop only) */}
      <div className="hidden md:block w-64 shrink-0">
        <h2 className="text-xl font-bold mb-4">Filtros</h2>
        <DashboardFilters />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col gap-4 sm:gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Veículos</h1>
            <p className="text-sm text-muted-foreground">
              Gestão de estoque ICG.
            </p>
          </div>
          <Link
            href="/admin/vehicle-new"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-semibold text-background hover:opacity-90 w-full sm:w-auto"
          >
            <PlusCircle className="h-4 w-4" /> Novo veículo
          </Link>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 justify-between">
          {/* Search */}
          <div className="relative w-full sm:max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Pesquisar veículos..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="pl-9 w-full bg-surface"
            />
          </div>

          {/* View Toggle */}
          <div className="flex w-full sm:w-auto overflow-hidden rounded-full border border-border bg-surface">
            <Button
              variant="ghost"
              onClick={() => setView("grid")}
              aria-label="Visualização em grade"
              className={`flex-1 sm:flex-none p-2 rounded-none ${view === "grid" ? "bg-foreground text-background hover:bg-foreground hover:text-background" : "text-muted-foreground hover:bg-accent"}`}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              onClick={() => setView("list")}
              aria-label="Visualização em lista"
              className={`flex-1 sm:flex-none p-2 rounded-none ${view === "list" ? "bg-foreground text-background hover:bg-foreground hover:text-background" : "text-muted-foreground hover:bg-accent"}`}
            >
              <Rows className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Content area */}
        <div className="min-h-[400px]">
          {view === "list" ? (
            <VehicleTable
              vehicles={vehicles}
              isLoading={isLoading}
              onEdit={handleEdit}
              onDelete={handleDeleteRequest}
            />
          ) : (
            <div>
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div
                      key={i}
                      className="h-[420px] rounded-sm bg-surface animate-pulse"
                    />
                  ))}
                </div>
              ) : vehicles.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-center border rounded-xl border-dashed">
                  <p className="text-lg font-medium text-muted-foreground">
                    Nenhum veículo encontrado.
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Tente ajustar os filtros ou limpar a pesquisa.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {vehicles.map((vehicle) => (
                    <div key={vehicle.id} className="relative group">
                      <VehicleCard vehicle={vehicle} />
                      <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="secondary"
                          size="icon"
                          onClick={(e) => {
                            e.preventDefault();
                            handleEdit(vehicle);
                          }}
                          className="h-10 w-10 shadow-lg border border-border bg-background hover:bg-muted"
                        >
                          <Pencil size={18} />
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={(e) => {
                            e.preventDefault();
                            handleDeleteRequest(vehicle);
                          }}
                          className="h-10 w-10 shadow-lg"
                        >
                          <Trash2 size={18} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Mobile Floating Filter Button (FAB) ── */}
      <Button
        variant="default"
        size="icon"
        onClick={() => setIsFilterSheetOpen(true)}
        className="fixed bottom-6 right-6 z-40 size-14 rounded-full shadow-xl md:hidden bg-foreground text-background hover:bg-foreground/90"
        aria-label="Abrir filtros"
      >
        <SlidersHorizontal className="size-5" />
        {activeFilterCount > 0 && (
          <span className="absolute -top-1 -right-1 grid size-5 place-items-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
            {activeFilterCount}
          </span>
        )}
      </Button>

      {/* ── Mobile Filter Sheet ── */}
      <Sheet open={isFilterSheetOpen} onOpenChange={setIsFilterSheetOpen}>
        <SheetContent side="right" className="w-[300px] p-0">
          <SheetHeader className="border-b border-border p-4">
            <SheetTitle>Filtros</SheetTitle>
            <SheetDescription>
              Refine a sua pesquisa de veículos.
            </SheetDescription>
          </SheetHeader>
          <div className="p-4 overflow-y-auto flex-1">
            <DashboardFilters />
          </div>
        </SheetContent>
      </Sheet>

      {/* Delete Dialog */}
      <DeleteDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
        vehicleName={
          selectedVehicle
            ? `${selectedVehicle.brand} ${selectedVehicle.model}`
            : ""
        }
      />
    </div>
  );
}

export default function VehiclesPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-[50vh]">
          <div className="animate-pulse flex items-center gap-2 text-muted-foreground">
            <LayoutGrid className="animate-spin h-5 w-5" /> Carregando painel...
          </div>
        </div>
      }
    >
      <VehiclesDashboard />
    </Suspense>
  );
}
