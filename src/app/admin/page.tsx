import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { StatsCards } from "./_components/StatsCards";
import { RecentVehiclesTable } from "./_components/RecentVehiclesTable";

export default function Dashboard() {
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
          href="/admin/vehicle-new"
          className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-semibold text-background hover:opacity-90"
        >
          <PlusCircle className="h-4 w-4" /> Novo veículo
        </Link>
      </div>

      <StatsCards />

      <RecentVehiclesTable />
    </div>
  );
}
