import { PlusCircle } from "lucide-react";
import Link from "next/link";
import type { Vehicle } from "@/lib/vehicles/type";
import { StatsCards } from "./_components/StatsCards";
import { formatPrice } from "@/lib/utils";

export default function dashboard() {
  const vehicles: Vehicle[] = [];
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Visão geral do estoque ICG.
          </p>
        </div>
        <Link
          href="/system/vehicle-new"
          className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-semibold text-background hover:opacity-90"
        >
          <PlusCircle className="h-4 w-4" /> Novo veículo
        </Link>
      </div>

      <StatsCards />

      <div className="p-6">
        <h2 className="mb-4 text-lg font-semibold">Veículos recentes</h2>
        <div className="divide-y divide-border">
          {vehicles.slice(0, 5).map((v) => (
            <div key={v.id} className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <div className="h-12 w-16 overflow-hidden rounded-lg p-1">
                  <img
                    src={v.images[0]}
                    alt={`${v.brand} ${v.model} ${v.year}`}
                    className="h-full w-full object-contain"
                  />
                </div>
                <div>
                  <p className="text-sm font-medium">{v.model}</p>
                  <p className="text-xs text-muted-foreground">
                    {v.brand} • {v.year}
                  </p>
                </div>
              </div>
              <span className="text-sm font-semibold">
                {formatPrice(v.price)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
