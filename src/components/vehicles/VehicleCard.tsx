import Link from "next/link";
import { WhatsAppIcon } from "@/lib/svg";
import type { Vehicle } from "@/lib/vehicles/type";
import { buildWhatsAppUrl } from "@/lib/constants";
import { FuelIcon, RoadIcon } from "lucide-react";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";

interface VehicleCardProps {
  vehicle: Vehicle;
  variant?: "normal" | "large";
}

export function VehicleCard({ vehicle, variant = "normal" }: VehicleCardProps) {
  if (variant === "large") {
    return <VehicleCardExtraLarge vehicle={vehicle} />;
  }

  return <VehicleCardNormal vehicle={vehicle} />;
}

function VehicleCardExtraLarge({ vehicle }: VehicleCardProps) {
  return (
    <article className="group relative w-full overflow-hidden border border-border bg-surface transition-all duration-500 hover:border-gold/60 hover:shadow-xl aspect-[4/3] sm:aspect-auto sm:h-[420px]">
      {/* Background Image */}
      <div className="absolute inset-0 z-0 bg-black">
        <img
          src={vehicle.images[0]}
          alt={vehicle.model}
          className="w-full h-full object-cover opacity-90 transition-all duration-500 group-hover:scale-110 group-hover:blur-md group-hover:opacity-40"
        />
      </div>

      {/* Main Link Area */}
      <Link
        href={`/veiculo/${vehicle.id}`}
        className="absolute inset-0 z-10"
        aria-label={`Ver detalhes do ${vehicle.model}`}
      />

      {/* Badge */}
      {vehicle.badge && (
        <span className="absolute top-4 left-4 z-20 label-eyebrow px-3 py-1.5 bg-gold text-background shadow-md pointer-events-none">
          {vehicle.badge}
        </span>
      )}

      {/* Default State (Visible when not hovered) */}
      <div className="absolute inset-0 z-20 pointer-events-none flex flex-col justify-end bg-linear-to-t from-black/90 via-black/20 to-transparent p-6 transition-all duration-500 group-hover:opacity-0">
        <h3 className="text-xl md:text-2xl font-bold text-white drop-shadow-md">
          {vehicle.brand} {vehicle.model}
        </h3>
        <div className="text-gold font-bold text-2xl drop-shadow-md mt-1">
          {formatPrice(vehicle.price)}
        </div>
      </div>

      {/* Hover State Details */}
      <div className="absolute inset-0 z-20 pointer-events-none flex flex-col justify-center px-6 pt-6 pb-20 opacity-0 transition-all duration-500 group-hover:opacity-100">
        <div className="translate-y-8 transform transition-all duration-500 group-hover:translate-y-0">
          <div className="text-gold text-xs font-bold uppercase tracking-widest mb-1">
            {vehicle.brand}
          </div>
          <h3 className="text-2xl font-bold text-white mb-1 leading-tight">
            {vehicle.model}
          </h3>
          <div className="text-xl font-medium text-white mb-6">
            {formatPrice(vehicle.price)}
          </div>

          <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-sm text-neutral-200">
            <div className="flex flex-col">
              <span className="text-neutral-400 text-[11px] uppercase tracking-wider">
                Ano
              </span>
              <span className="font-medium">{vehicle.year}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-neutral-400 text-[11px] uppercase tracking-wider">
                Caixa
              </span>
              <span className="font-medium">{vehicle.transmission}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-neutral-400 text-[11px] uppercase tracking-wider">
                Motor
              </span>
              <span className="font-medium flex items-center gap-1.5">
                <RoadIcon className="w-3.5 h-3.5" />
                {vehicle.engineSize} L
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-neutral-400 text-[11px] uppercase tracking-wider">
                Combustível
              </span>
              <span className="font-medium flex items-center gap-1.5">
                <FuelIcon className="w-3.5 h-3.5" />
                {vehicle.fuel}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* WhatsApp Button (Interactive, z-30) */}
      <div className="absolute bottom-6 left-6 right-6 z-30 translate-y-8 transform opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
        <a
          href={buildWhatsAppUrl(vehicle)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full justify-center items-center gap-2 bg-whatsapp hover:bg-whatsapp-hover text-white text-sm font-medium px-4 py-3.5 rounded-full transition-colors shadow-lg"
        >
          <WhatsAppIcon />
          Tenho Interesse
        </a>
      </div>
    </article>
  );
}

function VehicleCardNormal({ vehicle }: VehicleCardProps) {
  return (
    <article className="group bg-surface border border-border hover:border-gold/60 transition-all duration-200">
      <Link href={`/veiculo/${vehicle.id}`} className="block">
        <div className={`relative aspect-video overflow-hidden`}>
          {vehicle.badge && (
            <span
              className={`absolute top-3 left-3 label-eyebrow px-2.5 py-1 ${vehicle.badge === "NOVO" ? "bg-gold text-background" : "bg-background/80 text-gold border border-gold/40"}`}
            >
              {vehicle.badge}
            </span>
          )}
          <div className="absolute inset-0 flex items-center justify-center opacity-30 group-hover:opacity-50 transition-opacity">
            <Image
              src={vehicle.images[0]}
              alt={vehicle.model}
              width={500}
              height={500}
              className="object-cover"
            />
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-gold/40 to-transparent" />
        </div>
      </Link>

      <div className="p-5">
        <Link href={`/veiculo/${vehicle.id}`} className="block">
          <div className="label-eyebrow text-gold">{vehicle.brand}</div>
          <h3 className="mt-1.5 text-[15px] font-medium text-foreground group-hover:text-gold transition-colors">
            {vehicle.model}
          </h3>
        </Link>
        <div className="mt-1 text-xs text-muted-foreground">
          {vehicle.year} · {vehicle.category} · {vehicle.transmission}
        </div>

        <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <RoadIcon />
            {vehicle.engineSize} L
          </span>
          <span className="flex items-center gap-1.5">
            <FuelIcon />
            {vehicle.fuel}
          </span>
        </div>

        <div className="mt-5 pt-5 border-t border-border flex items-center justify-between gap-3">
          <div>
            <div className="label-eyebrow text-muted-foreground">Preço</div>
            <div className="text-xl font-medium text-foreground tracking-tight">
              {formatPrice(vehicle.price)}
            </div>
          </div>
          <a
            href={buildWhatsAppUrl(vehicle)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-whatsapp hover:bg-whatsapp-hover text-white text-xs font-medium px-4 py-2.5 rounded-full transition-colors"
          >
            <WhatsAppIcon />
            WhatsApp
          </a>
        </div>
      </div>
    </article>
  );
}
