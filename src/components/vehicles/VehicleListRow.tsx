import { formatEngineSize, type Vehicle } from "@/lib/vehicles/type";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { formatPrice } from "@/lib/utils";

export function VehicleListRow({ vehicle }: { vehicle: Vehicle }) {
  return (
    <Link
      href={`/veiculo/${vehicle.id}`}
      className="group flex items-center gap-6 rounded-2xl border border-border bg-card p-4 transition hover:shadow-lg"
    >
      <div className="flex h-28 w-40 shrink-0 items-center justify-center overflow-hidden rounded-xl p-2">
        <img
          src={vehicle.images[0]}
          alt={`${vehicle.brand} ${vehicle.model}`}
          className="h-full w-full object-cover drop-shadow-lg transition-transform group-hover:scale-105"
        />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold">{`${vehicle.brand} ${vehicle.model}`}</h3>
            <p className="text-xs text-muted-foreground">
              {vehicle.brand} • {vehicle.fuel}
            </p>
          </div>
          <span className="text-lg font-bold">
            {formatPrice(vehicle.price)}
          </span>
        </div>
        <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-xs text-muted-foreground">
          <span>
            Motor: <b className="text-foreground">{formatEngineSize(vehicle)}</b>
          </span>
          <span>
            Transmissão:{" "}
            <b className="text-foreground">{vehicle.transmission}</b>
          </span>
          <span>
            Combustível: <b className="text-foreground">{vehicle.fuel}</b>
          </span>
          <span>
            Ano: <b className="text-foreground">{vehicle.year}</b>
          </span>
          <span>
            Categoria: <b className="text-foreground">{vehicle.category}</b>
          </span>
        </div>
      </div>

      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-border transition group-hover:bg-accent">
        <ArrowUpRight className="h-4 w-4" />
      </span>
    </Link>
  );
}
