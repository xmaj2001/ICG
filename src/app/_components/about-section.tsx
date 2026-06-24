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
            A International Car Group (ICG)
          </h2>
          <p className="mt-6 text-lg text-muted-foreground">
            É a sua parceira de confiança na
            importação, exportação e comercialização de veículos premium e de
            luxo, sediada em Castelo Branco, Portugal.
            Especializamo-nos no fornecimento de automóveis de elevada qualidade
            para os mercados de Cabo Verde, Angola, Guiné-Bissau, São Tomé e
            Príncipe e Moçambique, assegurando um serviço completo, transparente
            e seguro em todas as etapas do processo.
          </p>
          <p className="mt-4 text-muted-foreground">
            Comprometemo-nos a oferecer veículos selecionados, atendimento
            personalizado e soluções de transporte internacional eficientes,
            garantindo aos nossos clientes confiança, exclusividade e
            excelência.
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
