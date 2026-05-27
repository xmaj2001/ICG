"use client";

import { Calendar, Fuel, Gauge, Zap } from "lucide-react";
import type { Vehicle } from "@/lib/vehicles/type";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { formatPrice } from "@/lib/utils";

interface InfoProps {
  vehicle: Vehicle;
}

export function Info({ vehicle }: InfoProps) {
  return (
    <aside>
      <p className="text-sm uppercase tracking-wider text-muted-foreground">
        {vehicle.brand}
      </p>
      <h1 className="mt-2 text-4xl font-bold">{`${vehicle.brand} ${vehicle.model}`}</h1>
      <p className="mt-2 text-sm text-muted-foreground">{vehicle.fuel}</p>

      <div className="mt-6 text-4xl font-bold">
        {formatPrice(vehicle.price)}
      </div>

      <p className="mt-6 text-muted-foreground">{vehicle.description}</p>

      <div className="mt-8 grid grid-cols-2 gap-4">
        <Spec
          icon={<Zap className="h-4 w-4" />}
          label="Motor"
          value={`${vehicle.engineSize}`}
        />
        <Spec
          icon={<Calendar className="h-4 w-4" />}
          label="Postado em"
          value={vehicle.createdAt}
        />
        <Spec
          icon={<Fuel className="h-4 w-4" />}
          label="Combustível"
          value={vehicle.fuel}
        />
        <Spec
          icon={<Gauge className="h-4 w-4" />}
          label="Categoria"
          value={vehicle.category}
        />
        <Spec
          icon={<Calendar className="h-4 w-4" />}
          label="Ano"
          value={String(vehicle.year)}
        />
        <Spec
          icon={<Gauge className="h-4 w-4" />}
          label="Transmissão"
          value={vehicle.transmission}
        />
      </div>

      <div className="mt-8 bg-card p-6">
        <h3 className="font-semibold">Interessado neste veículo?</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Fale com um consultor pelo WhatsApp. No desktop, escaneie o QR Code.
        </p>
        <WhatsAppButton vehicle={vehicle} className="mt-4 w-full" />
      </div>
    </aside>
  );
}

function Spec({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="border-b-[0.1px] border-border p-4">
      <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
        {icon} {label}
      </div>
      <div className="mt-1 font-semibold">{value}</div>
    </div>
  );
}
