"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Fuel, Gauge } from "lucide-react";
import type { Vehicle } from "@/lib/vehicles/type";
import { formatEngineSize } from "@/lib/vehicles/type";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";

interface HeroSectionProps {
  vehicles: Vehicle[];
}

export function HeroSection({ vehicles }: HeroSectionProps) {
  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true }),
  );

  const [api, setApi] = React.useState<CarouselApi>();
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  React.useEffect(() => {
    if (!api) return;
    const onSelect = () => setSelectedIndex(api.selectedScrollSnap());
    api.on("select", onSelect);
    onSelect();
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  if (!vehicles || vehicles.length === 0) return null;

  return (
    <section className="relative overflow-hidden bg-foreground">
      <Carousel
        opts={{ loop: true, duration: 40 }}
        plugins={[plugin.current]}
        setApi={setApi}
        className="w-full"
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
      >
        <CarouselContent className="ml-0">
          {vehicles.map((vehicle, index) => (
            <CarouselItem key={vehicle.id} className="pl-0">
              <HeroSlide
                vehicle={vehicle}
                index={index}
                isActive={index === selectedIndex}
              />
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Navigation arrows — hidden on mobile */}
        <CarouselPrevious className="absolute left-4 top-1/2 z-20 hidden size-12 -translate-y-1/2 rounded-full border-white/20 bg-black/40 text-white/80 backdrop-blur-sm hover:bg-black/60 hover:text-white md:flex" />
        <CarouselNext className="absolute right-4 top-1/2 z-20 hidden size-12 -translate-y-1/2 rounded-full border-white/20 bg-black/40 text-white/80 backdrop-blur-sm hover:bg-black/60 hover:text-white md:flex" />
      </Carousel>

      {/* Dot indicators */}
      <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2">
        {vehicles.map((_, i) => (
          <button
            type="button"
            key={`dot-${vehicles[i].id}`}
            onClick={() => api?.scrollTo(i)}
            aria-label={`Ir para slide ${i + 1}`}
            className={cn(
              "h-1.5 rounded-full transition-all duration-500",
              i === selectedIndex
                ? "w-8 bg-white"
                : "w-1.5 bg-white/40 hover:bg-white/60",
            )}
          />
        ))}
      </div>
    </section>
  );
}

/* ─── Individual Slide ─── */

function HeroSlide({
  vehicle,
  index,
  isActive,
}: {
  vehicle: Vehicle;
  index: number;
  isActive: boolean;
}) {
  return (
    <div className="relative min-w-0 shrink-0 grow-0 basis-full">
      <div className="relative flex h-[600px] flex-col overflow-hidden bg-neutral-950 md:h-[680px] md:flex-row md:items-center">
        {/* Imagem de Fundo de Alta Performance (Substitui o CSS inline problemático no Mobile) */}
        {vehicle.images[0] && (
          <div className="absolute inset-0 z-0 pointer-events-none">
            <Image
              src={vehicle.images[0]}
              alt={`${vehicle.brand} ${vehicle.model}`}
              fill
              sizes="100vw"
              className="object-cover object-center"
              priority={index === 0}
              loading={index === 0 ? undefined : "lazy"}
            />
          </div>
        )}

        {/* Overlay para contraste */}
        <div className="absolute inset-0 z-10 bg-black/50 md:bg-black/40" />

        {/* ── Content Side (Desktop) ── */}
        <div className="hidden md:flex relative z-20 flex-1 flex-col justify-center px-6 pb-4 pt-24 md:px-16 md:py-20 lg:px-24">
          {/* Category badge */}
          <span className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-black px-4 py-1.5 text-[10px] font-medium uppercase tracking-[0.2em] text-white/60 backdrop-blur-sm">
            {vehicle.category}
          </span>

          {/* Vehicle name */}
          <h1
            className={cn(
              "text-4xl font-bold leading-[1.05] tracking-tight text-white/90 transition-all duration-700 sm:text-5xl lg:text-6xl xl:text-7xl",
              isActive
                ? "translate-y-0 opacity-100"
                : "translate-y-4 opacity-0",
            )}
          >
            {vehicle.brand}
            <br />
            <span className="text-white/90">{vehicle.model}</span>
          </h1>

          {/* Price */}
          <p
            className={cn(
              "mt-5 text-2xl font-semibold text-white/90 transition-all delay-100 duration-700 md:text-3xl",
              isActive
                ? "translate-y-0 opacity-100"
                : "translate-y-4 opacity-0",
            )}
          >
            {formatPrice(vehicle.price)}
          </p>

          {/* Stats row */}
          <div
            className={cn(
              "mt-6 flex flex-wrap items-center gap-4 transition-all delay-200 duration-700 md:gap-6",
              isActive
                ? "translate-y-0 opacity-100"
                : "translate-y-4 opacity-0",
            )}
          >
            <StatPill
              icon={<Gauge className="size-3.5" />}
              label={formatEngineSize(vehicle)}
            />
            <StatPill label={vehicle.transmission} />
            <StatPill
              icon={<Fuel className="size-3.5" />}
              label={vehicle.fuel}
            />
            <StatPill label={`${vehicle.year}`} />
          </div>

          {/* CTA buttons */}
          <div
            className={cn(
              "mt-8 flex flex-wrap items-center gap-3 transition-all delay-300 duration-700 md:mt-10",
              isActive
                ? "translate-y-0 opacity-100"
                : "translate-y-4 opacity-0",
            )}
          >
            <Link
              href={`/veiculo/${vehicle.id}`}
              className="group inline-flex items-center gap-2 rounded-full bg-card px-7 py-3.5 text-sm font-semibold text-foreground transition-all hover:bg-card/90 hover:shadow-lg hover:shadow-white/10"
            >
              Ver detalhes
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/search"
              className="inline-flex items-center gap-2 rounded-full border border-white px-7 py-3.5 text-sm font-medium text-white transition-all hover:border-white/40 hover:text-white/70"
            >
              Ver estoque
            </Link>
          </div>
        </div>

        {/* ── Image Side (Destaque Central no Desktop) ── */}
        <div className="mb-25 flex relative h-full z-20 flex-1 items-center justify-center px-6 md:px-8">
          <div
            className={cn(
              "relative flex w-full max-w-md items-center justify-center transition-all duration-700 md:max-w-lg",
              isActive
                ? "translate-x-0 scale-100 opacity-100"
                : "translate-x-8 scale-95 opacity-0",
            )}
          >
            {/* Glow behind car */}
            <div className="absolute inset-0 -z-10 scale-110 bg-foreground/10 blur-3xl" />

            {vehicle.images[0] && (
              <div className="relative z-10 border border-white/10 h-full w-full p-2 rounded-sm backdrop-blur-xs bg-black/20">
                <Image
                  src={vehicle.images[0]}
                  width={1920}
                  height={1080}
                  alt={`${vehicle.brand} ${vehicle.model}`}
                  className="max-h-[400px] w-full rounded-sm object-cover md:max-h-[420px]"
                  loading={index === 0 ? "eager" : "lazy"}
                />
              </div>
            )}
          </div>
        </div>

        {/* ── Mobile Content ── */}
        <ContentMobile vehicle={vehicle} isActive={isActive} />
      </div>
    </div>
  );
}

/* ─── Stat Pill (desktop) ─── */
function StatPill({ icon, label }: { icon?: React.ReactNode; label: string }) {
  return (
    <span className="hidden items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs font-medium text-white/70 md:inline-flex">
      {icon}
      {label}
    </span>
  );
}

/* ─── Mobile Content ─── */
function ContentMobile({
  vehicle,
  isActive,
}: {
  vehicle: Vehicle;
  isActive: boolean;
}) {
  return (
    <div
      className={cn(
        "w-full absolute bottom-8 left-0 right-0 z-30 px-6 transition-all duration-700 md:hidden",
        isActive ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
      )}
    >
      {/* Cores fixas escuras com desfoque para contraste impecável em cima de qualquer imagem */}
      <div className="flex flex-col gap-3 rounded-2xl bg-black/60 p-5 border border-white/10 backdrop-blur-md">
        {/* Title & Price */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold leading-tight text-white">
              {vehicle.brand}
              <br />
              <span className="text-base font-medium text-white/70">
                {vehicle.model}
              </span>
            </h2>
          </div>
          <div className="text-right">
            <p className="text-xl font-bold text-white">
              {formatPrice(vehicle.price)}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 border-y border-white/10 py-3">
          <MobileStat value={formatEngineSize(vehicle)} label="Motor" />
          <MobileStat value={vehicle.transmission} label="Transmissão" />
          <MobileStat value={`${vehicle.year}`} label="Ano" />
        </div>

        {/* Action */}
        <Link
          href={`/veiculo/${vehicle.id}`}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-white py-3 text-sm font-semibold text-black active:scale-[0.99] transition-transform"
        >
          Ver detalhes
          <ArrowRight className="size-4" />
        </Link>
      </div>
    </div>
  );
}

/* ─── Mobile Stat ─── */
function MobileStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <div className="text-sm font-bold text-white">{value}</div>
      <div className="mt-0.5 text-[9px] uppercase tracking-wider text-white/40">
        {label}
      </div>
    </div>
  );
}
