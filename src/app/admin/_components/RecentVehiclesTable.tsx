"use client";

import { useVehicles } from "@/lib/vehicles/hooks";
import { formatPrice, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function RecentVehiclesTable() {
  const { vehicles, isLoading } = useVehicles({ limit: 8 });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Registos recentes</h2>
        </div>
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="w-[80px]">Foto</TableHead>
                <TableHead>Veículo</TableHead>
                <TableHead>Ano</TableHead>
                <TableHead>Preço</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Adicionado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[1, 2, 3, 4, 5].map((i) => (
                <TableRow key={i} className="border-border">
                  <TableCell>
                    <Skeleton className="h-10 w-14 rounded-md" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-32" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-12" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-20 rounded-full" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
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

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent text-muted-foreground">
              <TableHead className="w-[80px]">Foto</TableHead>
              <TableHead className="font-medium">Veículo</TableHead>
              <TableHead className="font-medium">Ano</TableHead>
              <TableHead className="font-medium">Preço (AOA)</TableHead>
              <TableHead className="font-medium">Estado</TableHead>
              <TableHead className="font-medium">Adicionado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vehicles.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="h-24 text-center text-muted-foreground"
                >
                  Nenhum veículo registado ainda.
                </TableCell>
              </TableRow>
            ) : (
              vehicles.map((vehicle) => (
                <TableRow
                  key={vehicle.id}
                  className="border-border hover:bg-accent/50 transition-colors"
                >
                  <TableCell>
                    <div className="relative h-10 w-14 overflow-hidden rounded-md bg-muted">
                      {vehicle.images?.[0] ? (
                        <Image
                          src={vehicle.images[0]}
                          alt={`${vehicle.brand} ${vehicle.model}`}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-background flex items-center justify-center text-[10px] text-muted-foreground">
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
                  <TableCell className="text-muted-foreground text-xs">
                    {formatDate(vehicle.createdAt)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
