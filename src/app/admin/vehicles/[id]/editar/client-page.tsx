"use client";

import { use } from "react";
import { useVehicle } from "@/lib/vehicles/hooks";
import { VehicleForm } from "@/app/admin/_components/VehicleForm";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function EditarVeiculoClient({
  paramsPromise,
}: {
  paramsPromise: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id } = use(paramsPromise);
  const { vehicle, isLoading } = useVehicle(id);

  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-4xl space-y-6 sm:space-y-8 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6 sm:mb-8">
          <Skeleton className="h-10 w-10" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-96" />
          </div>
        </div>
        <Skeleton className="h-[600px] w-full rounded-xl" />
      </div>
    );
  }

  if (!vehicle && !isLoading) {
    return (
      <div className="mx-auto mt-20 w-full max-w-4xl p-4 sm:p-6 text-center">
        <h2 className="mb-4 font-display text-xl sm:text-2xl">Veículo não encontrado</h2>
        <Button onClick={() => router.push("/admin/vehicles")} className="w-full sm:w-auto">
          Voltar ao Inventário
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col">
      <VehicleForm vehicle={vehicle} />
    </div>
  );
}
