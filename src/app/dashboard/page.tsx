"use client";

import { useEffect, useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { VehicleTable } from "@/app/system/_components/VehicleTable";
import { DeleteDialog } from "@/components/dashboard/DeleteDialog";
import { getVehicles } from "@/lib/vehicles/use-case/get-vehicles";
import { deleteVehicle } from "@/lib/vehicles/use-case/delete-vehicle";
import type { Vehicle } from "@/lib/vehicles/type";
import { Input } from "@/components/ui/input";
import { Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  
  // Modal states for delete (Keep delete in modal, edit/create go to pages)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchVehicles = async (query = "") => {
    try {
      setIsLoading(true);
      const res = await getVehicles({ search: query, limit: 50 });
      if (res.success) {
        setVehicles(res.data.vehicles);
      }
    } catch (error) {
      console.error("Failed to fetch vehicles", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchVehicles(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const handleAdd = () => {
    router.push("/dashboard/veiculos/novo");
  };

  const handleEdit = (vehicle: Vehicle) => {
    router.push(`/dashboard/veiculos/${vehicle.id}/editar`);
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
      setIsDeleteDialogOpen(false);
      setSelectedVehicle(null);
      fetchVehicles(search);
    } catch (error) {
      console.error("Failed to delete", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <SiteHeader title="Inventário" />
      <div className="flex flex-1 flex-col">
        <div className="flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 p-4 md:gap-6 md:p-6">
            
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-4">
              <div>
                <span className="text-gold font-medium text-sm tracking-wider uppercase">Dashboard</span>
                <h1 className="font-display text-4xl mt-2">Gestão de Veículos</h1>
              </div>
              <Button 
                onClick={handleAdd}
                className="inline-flex items-center gap-2 bg-gold hover:bg-gold/90 text-background px-4 py-2.5 text-sm font-medium transition-colors"
              >
                <Plus size={16} />
                Adicionar veículo
              </Button>
            </div>

            <StatsCards />

            <div className="mb-2 flex items-center justify-between gap-4 mt-6">
              <h2 className="font-display text-2xl">Inventário</h2>
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Pesquisar veículos..." 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 bg-surface border-border"
                />
              </div>
            </div>

            <VehicleTable 
              vehicles={vehicles} 
              isLoading={isLoading} 
              onEdit={handleEdit}
              onDelete={handleDeleteRequest}
            />

          </div>
        </div>
      </div>

      <DeleteDialog 
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
        vehicleName={selectedVehicle ? `${selectedVehicle.brand} ${selectedVehicle.model}` : ""}
      />
    </>
  );
}
