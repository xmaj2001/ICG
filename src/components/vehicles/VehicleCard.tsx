import Link from "next/link";
import type { Vehicle } from "@/lib/vehicles/type";
import { formatEngineSize } from "@/lib/vehicles/type";
import { ArrowUpRight } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface VehicleCardProps {
  vehicle: Vehicle;
}

export function VehicleCard({ vehicle }: VehicleCardProps) {
  return (
    <article className="group relative w-full overflow-hidden transition-all duration-500 sm:aspect-auto sm:h-[420px]">
      <Link
        href={`/veiculo/${vehicle.id}`}
        className={`group hover:border-white duration-500 border relative flex flex-col overflow-hidden rounded-sm bg-card p-6 transition hover:shadow-xl`}
      >
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-xl font-semibold text-foreground">
              {vehicle.brand} {vehicle.model}
            </h3>
            <p className="mt-1 text-xs text-muted-foreground">
              {vehicle.category} | {vehicle.fuel}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-foreground">
              {formatPrice(vehicle.price)}
            </span>
            <span className="grid h-8 w-8 place-items-center rounded-full border border-border bg-background/60 transition group-hover:bg-accent">
              <ArrowUpRight className="h-4 w-4" />
            </span>
          </div>
        </div>

        <div className="relative my-6 flex h-48 items-center justify-center">
          <img
            src={vehicle.images[0]}
            alt={`${vehicle.brand} ${vehicle.model}`}
            className="max-h-full w-full object-cover drop-shadow-2xl transition-transform group-hover:scale-105"
          />
        </div>

        <div className="mt-auto grid grid-cols-3 gap-2 border-t border-black/10 pt-4 text-center">
          <Stat value={formatEngineSize(vehicle)} label="Motor" />
          <Stat value={vehicle.transmission} label="Transmissão" />
          <Stat value={`${vehicle.year}`} label="Ano" />
        </div>
      </Link>
    </article>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="text-base font-bold text-foreground">{value}</div>
      <div className="mt-0.5 text-[10px] uppercase tracking-wide text-muted-foreground">
        {label}
      </div>
    </div>
  );
}
