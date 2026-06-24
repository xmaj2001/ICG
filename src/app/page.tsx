import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { VehicleService } from "@/lib/vehicles/services/vehicle-service";
import { HeroSection } from "./_components/hero-section";
import { AboutSection } from "./_components/about-section";
import { TestimonialsSection } from "./_components/testimonials-section";
import { ContactSection } from "./_components/contact-section";
import { VehicleCard } from "@/components/vehicles/VehicleCard";
import { Badge } from "@/lib/vehicles/type";
import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";
import { SettingsService } from "@/lib/settings/services/settings-service";

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
  const settings = await SettingsService.getSettings();
  const vehicles = data.vehicles;
  const featured = vehicles.filter((x) => x.badge === Badge.DESTAQUE);

  // Show up to 6 vehicles in the stock preview section (non-featured, or all if not enough)
  const stockPreview = vehicles.slice(0, 6);

  return (
    <>
      <Navbar />
      <main>
        {/* Hero Carousel — full-width, outside the container */}
        {featured.length > 0 && <HeroSection vehicles={featured} />}

        <div className="mx-auto max-w-[1400px] px-6 py-16">
          {/* Stock Preview Section */}
          <section className="mt-8">
            <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Catálogo
                </p>
                <h2 className="mt-1 text-3xl font-bold tracking-tight md:text-4xl">
                  Nosso Estoque
                </h2>
                <p className="mt-2 max-w-md text-sm text-muted-foreground">
                  Confira alguns dos veículos disponíveis. Qualidade,
                  procedência e os melhores preços do mercado.
                </p>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {stockPreview.map((v) => (
                <VehicleCard key={v.id} vehicle={v} />
              ))}
            </div>

            <div className="mt-10 flex justify-center">
              <Link
                href="/search"
                className="group inline-flex items-center gap-2 rounded-full bg-foreground px-8 py-4 text-sm font-semibold text-background transition-all hover:opacity-90"
              >
                Ver todo o estoque
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </section>

          {/* About */}
          <AboutSection />

          {/* Testimonials */}
          <TestimonialsSection />

          {/* Contact */}
          <ContactSection />
        </div>
      </main>
      <Footer />
      <FloatingWhatsApp whatsAppNumber={settings.whatsappNumber ?? ""} />
    </>
  );
}
