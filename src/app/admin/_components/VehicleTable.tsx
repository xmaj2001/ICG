"use client";

import { Pencil, Trash2 } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import type { Vehicle } from "@/lib/vehicles/type";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";

interface VehicleTableProps {
  vehicles: Vehicle[];
  isLoading: boolean;
  onEdit: (vehicle: Vehicle) => void;
  onDelete: (vehicle: Vehicle) => void;
}

export function VehicleTable({
  vehicles,
  isLoading,
  onEdit,
  onDelete,
}: VehicleTableProps) {
  if (isLoading) {
    return (
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="w-[80px]">Foto</TableHead>
              <TableHead>Veículo</TableHead>
              <TableHead>Ano</TableHead>
              <TableHead>Preço</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[1, 2, 3, 4, 5].map((i) => (
              <TableRow key={i} className="border-border">
                <TableCell>
                  <Skeleton className="h-12 w-16 rounded-md" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-32" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-16" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-24" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-20 rounded-full" />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Skeleton className="h-8 w-8 rounded-md" />
                    <Skeleton className="h-8 w-8 rounded-md" />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-border hover:bg-transparent text-muted-foreground">
            <TableHead className="w-[80px]">Foto</TableHead>
            <TableHead className="font-medium">Veículo</TableHead>
            <TableHead className="font-medium">Ano</TableHead>
            <TableHead className="font-medium">Preço (AOA)</TableHead>
            <TableHead className="font-medium">Estado</TableHead>
            <TableHead className="text-right font-medium">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {vehicles.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={6}
                className="h-24 text-center text-muted-foreground"
              >
                Nenhum veículo encontrado.
              </TableCell>
            </TableRow>
          ) : (
            vehicles.map((vehicle) => (
              <TableRow
                key={vehicle.id}
                className="border-border hover:bg-white/5 transition-colors"
              >
                <TableCell>
                  <div className="relative h-12 w-16 overflow-hidden rounded-md bg-muted">
                    {vehicle.images?.[0] ? (
                      <Image
                        src={vehicle.images[0]}
                        alt={`${vehicle.brand} ${vehicle.model}`}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-background flex items-center justify-center text-xs text-muted-foreground">
                        S/ Foto
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium text-foreground">
                      {vehicle.brand} {vehicle.model}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {vehicle.category} • {vehicle.fuel}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {vehicle.year}
                </TableCell>
                <TableCell className="font-medium">
                  {formatPrice(vehicle.price)}
                </TableCell>
                <TableCell>
                  {vehicle.status === "Disponível" ? (
                    <Badge
                      variant="outline"
                      className="bg-whatsapp/10 text-whatsapp border-whatsapp/20 font-normal"
                    >
                      Disponível
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="bg-destructive/10 text-destructive border-destructive/20 font-normal"
                    >
                      Vendido
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(vehicle)}
                      className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-white/10"
                    >
                      <Pencil size={16} />
                      <span className="sr-only">Editar</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(vehicle)}
                      className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 size={16} />
                      <span className="sr-only">Eliminar</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
