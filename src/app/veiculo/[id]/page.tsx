import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { getVehicleDetails } from "@/lib/vehicles/use-case/get-vehicle-dateils";
import Link from "next/link";
import { Gallery } from "../_components/Gallery";
import { Info } from "../_components/Info";
import { getVehiclesRelated } from "@/lib/vehicles/use-case/get-vehicles-related";
import { VehicleCard } from "@/components/vehicles/VehicleCard";

interface VehiclePageProps {
  params: Promise<{ id: string }>;
}

export default async function VehiclePage({ params }: VehiclePageProps) {
  const { id } = await params;
  const response = await getVehicleDetails(id);
  if (!response.success) {
    return (
      <main className="max-w-7xl mx-auto px-6 lg:px-10 py-10">
        <p>Veiculo não encontrado</p>
      </main>
    );
  }

  const vehicle = response.data;

  const { data: relatedVehicles } = await getVehiclesRelated(id);
  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-6 lg:px-10 py-10">
        {" "}
        {/* Breadcrumb */}
        <nav className="label-eyebrow text-muted-foreground mb-8">
          <Link href="/search" className="hover:text-gold">
            Veículos
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gold">{vehicle.category}</span>
          <span className="mx-2">/</span>
          <span className="text-foreground">
            {vehicle.brand} {vehicle.model}
          </span>
        </nav>
        <div className="grid lg:grid-cols-[1.4fr_1fr] gap-10">
          <div>
            <Gallery
              images={vehicle.images}
              brand={vehicle.brand}
              badge={vehicle.badge}
            />
          </div>
          <Info vehicle={vehicle} />
        </div>
        <section className="mt-16 grid md:grid-cols-3 gap-10 border-t border-border pt-12">
          <div>
            <span className="label-eyebrow text-gold">Descrição</span>
            <h2 className="font-display text-3xl mt-3">Detalhes do veículo</h2>
          </div>
          <div className="md:col-span-2 text-muted-foreground leading-relaxed space-y-4">
            <p>{vehicle.description}</p>
          </div>
        </section>
        {/* Related */}
        <section className="mt-16 border-t border-border pt-12">
          <div className="flex items-end justify-between mb-6">
            <h2 className="font-display text-3xl">Também poderá gostar</h2>
            <Link
              href="/search"
              className="label-eyebrow text-gold hover:underline"
            >
              Ver todo o stock →
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {relatedVehicles.map((v) => (
              <VehicleCard vehicle={v} key={v.id} />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
