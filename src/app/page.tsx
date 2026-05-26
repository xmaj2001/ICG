import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { VehicleCard } from "@/components/vehicles/VehicleCard";
import { getVehicles } from "@/lib/vehicles/use-case/get-vehicles";

export default async function Home() {
  const { data } = await getVehicles();
  const { vehicles, brand, availableCount } = data;

  return (
    <>
      <Navbar />
      {/* Hero */}
      <section className="relative grain-bg border-b border-border">
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-background pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-10 py-24 lg:py-32">
          <span className="inline-flex items-center label-eyebrow text-gold border border-gold/40 rounded-full px-3 py-1">
            Luanda · Angola
          </span>
          <h1 className="font-display mt-7 text-5xl md:text-7xl lg:text-[88px] leading-[0.95] tracking-tight max-w-4xl">
            O seu próximo veículo
            <br />
            <span className="italic text-gold">começa aqui.</span>
          </h1>
          <p className="mt-6 text-base md:text-lg text-muted-foreground max-w-xl">
            Selecção exclusiva de veículos premium e de luxo, importados e
            verificados ao detalhe.
          </p>

          <div className="mt-12 flex flex-wrap gap-3">
            {[
              {
                v: availableCount.toString(),
                l: "Em stock",
              },
              { v: Object.keys(brand).length.toString(), l: "Marcas" },
              { v: "100%", l: "Verificados" },
            ].map((s) => (
              <div
                key={s.l}
                className="bg-surface border border-border px-5 py-3.5 flex items-baseline gap-2.5"
              >
                <span className="font-display text-2xl text-gold">{s.v}</span>
                <span className="label-eyebrow text-muted-foreground">
                  {s.l}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Vehicle Grid */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map((v) => (
            <VehicleCard key={v.id} vehicle={v} />
          ))}
        </div>
        {vehicles.length === 0 && (
          <div className="text-center text-muted-foreground py-20">
            Sem veículos nesta categoria.
          </div>
        )}
      </section>
      <Footer />
    </>
  );
}
