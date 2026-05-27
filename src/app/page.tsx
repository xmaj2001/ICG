import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { VehicleService } from "@/lib/vehicles/services/vehicle-service";
import { HeroSection } from "./_components/hero-section";
import { FeaturedCarousel } from "./_components/featured-carousel";
import { AboutSection } from "./_components/about-section";
import { ContactSection } from "./_components/contact-section";

export const metadata: Metadata = {
  title: "Encontre o Carro dos Seus Sonhos em Angola",
  description:
    "A ICG (International Car Group) oferece veículos premium em Luanda, Angola. SUVs, Sedans, Pickups — catálogo actualizado, preços competitivos e atendimento via WhatsApp.",
  keywords: [
    "carros à venda Angola",
    "comprar carro Luanda",
    "ICG Angola",
    "SUV Angola",
    "stand automóvel Luanda",
    "veículos importados Angola",
  ],
  openGraph: {
    title: "ICG - International Car Group | Venda de Carros em Angola",
    description:
      "Catálogo premium de veículos em Angola. Encontre SUVs, Sedans, Pickups e mais na ICG.",
    type: "website",
    locale: "pt_AO",
    siteName: "ICG - International Car Group",
  },
};

export default async function Home() {
  const data = await VehicleService.getVehicles({}, {});
  const vehicles = data.vehicles;
  const featured = vehicles.slice(0, 3);

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-[1400px] px-6 py-16">
        {/* Hero Section */}
        <HeroSection vehicle={featured[0] ?? undefined} />

        {/* Featured carousel */}
        <FeaturedCarousel vehicles={featured} />

        {/* About */}
        <AboutSection />

        {/* Contact */}
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
