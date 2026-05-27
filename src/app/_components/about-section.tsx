import { AboutCard } from "@/components/home/AboutCard";
import { MapPin, Shield, Sparkles, Users } from "lucide-react";

export function AboutSection() {
  return (
    <section id="about" className="mt-24 scroll-mt-20">
      <div className="grid gap-12 lg:grid-cols-2">
        <div>
          <p className="text-xs uppercase tracking-wider text-muted-foreground">
            Sobre nós
          </p>
          <h2 className="mt-2 text-4xl font-bold">
            ICG — International Car Group
          </h2>
          <p className="mt-6 text-lg text-muted-foreground">
            Somos uma concessionária multimarca especializada na importação e
            venda de veículos premium. Há mais de uma década conectamos clientes
            exigentes aos melhores carros do mercado internacional, com
            curadoria, transparência e atendimento personalizado.
          </p>
          <p className="mt-4 text-muted-foreground">
            Cada veículo do nosso estoque passa por inspeção rigorosa,
            garantindo procedência, histórico e qualidade impecáveis.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <AboutCard
            icon={<Shield />}
            title="Procedência"
            text="Inspeção completa e histórico verificado."
          />
          <AboutCard
            icon={<Sparkles />}
            title="Curadoria"
            text="Seleção premium multimarca."
          />
          <AboutCard
            icon={<Users />}
            title="Atendimento"
            text="Consultores dedicados a você."
          />
          <AboutCard
            icon={<MapPin />}
            title="Internacional"
            text="Importação direta com agilidade."
          />
        </div>
      </div>
    </section>
  );
}
