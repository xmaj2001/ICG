"use client";

import { useVehicles } from "@/lib/vehicles/hooks";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

import { VehicleTable } from "./VehicleTable";
import { useRouter } from "next/navigation";
import type { Vehicle } from "@/lib/vehicles/type";

export function RecentVehiclesTable() {
  const router = useRouter();
  const { vehicles, isLoading } = useVehicles({ limit: 8 });

  const handleEdit = (vehicle: Vehicle) => {
    router.push(`/admin/vehicles/${vehicle.id}/editar`);
  };

  const handleDeleteRequest = (vehicle: Vehicle) => {
    // setSelectedVehicle(vehicle);
    // setIsDeleteDialogOpen(true);
    console.log(vehicle);
  };
  if (isLoading) {
    return (
      <Skeleton className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index.toString()} className="relative group">
              <Skeleton className="w-full h-full bg-background flex items-center justify-center text-[10px] text-muted-foreground" />
              <Skeleton className="w-full h-full bg-background flex items-center justify-center text-[10px] text-muted-foreground" />
              <Skeleton className="w-full h-full bg-background flex items-center justify-center text-[10px] text-muted-foreground" />
              <Skeleton className="w-full h-full bg-background flex items-center justify-center text-[10px] text-muted-foreground" />
              <Skeleton className="w-full h-full bg-background flex items-center justify-center text-[10px] text-muted-foreground" />
              <Skeleton className="w-full h-full bg-background flex items-center justify-center text-[10px] text-muted-foreground" />
              <Skeleton className="w-full h-full bg-background flex items-center justify-center text-[10px] text-muted-foreground" />
              <Skeleton className="w-full h-full bg-background flex items-center justify-center text-[10px] text-muted-foreground" />
            </div>
          ))}
        </div>
      </Skeleton>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Registos recentes</h2>
        <Link
          href="/admin/vehicles"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Ver todos →
        </Link>
      </div>
      <VehicleTable
        vehicles={vehicles}
        onDelete={handleDeleteRequest}
        onEdit={handleEdit}
        isLoading={isLoading}
      />
    </div>
  );
}
