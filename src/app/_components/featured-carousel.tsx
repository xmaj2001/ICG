import Link from "next/link";
import type { Vehicle } from "@/lib/vehicles/type";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { VehicleCard } from "@/components/vehicles/VehicleCard";

interface FeaturedCarouselProps {
  vehicles: Vehicle[];
}

export function FeaturedCarousel({ vehicles }: FeaturedCarouselProps) {
  return (
    <section className="mt-20">
      <div className="mb-8 flex items-end justify-between">
        <h2 className="text-3xl font-bold">Destaques</h2>
        <Link
          href="/search"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          Ver todos →
        </Link>
      </div>
      <Carousel opts={{ align: "start", loop: true }} className="w-full">
        <CarouselContent className="-ml-4">
          {vehicles.map((v) => (
            <CarouselItem key={v.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
              <VehicleCard vehicle={v} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden md:flex text-foreground " />
        <CarouselNext className="hidden md:flex" />
      </Carousel>
    </section>
  );
}
