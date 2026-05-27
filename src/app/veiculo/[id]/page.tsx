import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { getVehicleDetails } from "@/lib/vehicles/use-case/get-vehicle-dateils";
import Link from "next/link";
import { Gallery } from "../_components/Gallery";
import { Info } from "../_components/Info";
import { getVehiclesRelated } from "@/lib/vehicles/use-case/get-vehicles-related";
import { VehicleCard } from "@/components/vehicles/VehicleCard";
import { formatPrice } from "@/lib/utils";

/* ─── Dynamic SEO Metadata ─── */
interface VehiclePageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: VehiclePageProps): Promise<Metadata> {
  const { id } = await params;
  const response = await getVehicleDetails(id);

  if (!response.success) {
    return {
      title: "Veículo não encontrado",
    };
  }

  const v = response.data;
  const title = `${v.brand} ${v.model} ${v.year}`;
  const price = formatPrice(v.price);
  const description = `${title} — ${v.fuel}, ${v.transmission}, ${v.category}. ${price}. ${v.description.slice(0, 120)}...`;

  return {
    title,
    description,
    openGraph: {
      title: `${title} | ICG Angola`,
      description,
      type: "website",
      locale: "pt_AO",
      siteName: "ICG - International Car Group",
      images: v.images[0]
        ? [
            {
              url: v.images[0],
              width: 1200,
              height: 630,
              alt: `${v.brand} ${v.model}`,
            },
          ]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} — ${price}`,
      description,
      images: v.images[0] ? [v.images[0]] : [],
    },
  };
}

/* ─── Page Component ─── */
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

  // JSON-LD structured data for rich snippets
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Vehicle",
    name: `${vehicle.brand} ${vehicle.model}`,
    brand: { "@type": "Brand", name: vehicle.brand },
    model: vehicle.model,
    vehicleModelDate: String(vehicle.year),
    fuelType: vehicle.fuel,
    vehicleTransmission: vehicle.transmission,
    image: vehicle.images[0],
    description: vehicle.description,
    offers: {
      "@type": "Offer",
      price: vehicle.price,
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      seller: {
        "@type": "Organization",
        name: "ICG - International Car Group",
      },
    },
  };

  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-6 lg:px-10 py-10">
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        {/* Breadcrumb */}
        <nav
          className="label-eyebrow text-muted-foreground mb-8"
          aria-label="Breadcrumb"
        >
          <Link href="/search" className="hover:text-gold">
            Veículos
          </Link>
          <span className="mx-2">/</span>
          <Link
            href={`/search?category=${vehicle.category}`}
            className="hover:text-gold"
          >
            {vehicle.category}
          </Link>
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

        {/* Related */}
        <section className="mt-20">
          <div className="mb-8 flex items-end justify-between">
            <h2 className="text-2xl font-bold">Veículos relacionados</h2>
            <Link
              href="/search"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Ver todos →
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {relatedVehicles.map((v) => (
              <VehicleCard key={v.id} vehicle={v} />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
