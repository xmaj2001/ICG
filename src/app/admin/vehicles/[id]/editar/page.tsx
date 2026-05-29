import { Suspense } from "react";
import { VehicleService } from "@/lib/vehicles/services/vehicle-service";
import { connection } from "next/server";
import { VehicleForm } from "@/app/admin/_components/VehicleForm";
import Loading from "./loading";

async function EditarVeiculoContent({
  paramsPromise,
}: {
  paramsPromise: Promise<{ id: string }>;
}) {
  await connection();
  const { id } = await paramsPromise;
  const vehicle = await VehicleService.getById(id);

  if (!vehicle) {
    return (
      <div className="mx-auto mt-20 w-full max-w-4xl p-6 text-center">
        <h2 className="mb-4 font-display text-2xl">Veículo não encontrado</h2>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <VehicleForm vehicle={vehicle} />
    </div>
  );
}

export function generateStaticParams() {
  return [{ id: "1" }];
}

export default function EditarVeiculoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense fallback={<Loading />}>
      <EditarVeiculoContent paramsPromise={params} />
    </Suspense>
  );
}
