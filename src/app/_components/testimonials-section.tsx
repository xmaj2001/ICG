import { Star, Quote } from "lucide-react";

interface Testimonial {
  id: number;
  name: string;
  location: string;
  vehicle: string;
  rating: number;
  text: string;
  initials: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Carlos Silva",
    location: "Luanda, Angola",
    vehicle: "Range Rover Sport",
    rating: 5,
    text: "Serviço de importação incrivelmente profissional. A ICG tratou de toda a burocracia e transporte para Luanda de forma clara e transparente. Recomendo totalmente!",
    initials: "CS",
  },
  {
    id: 2,
    name: "Adiatu Djaló",
    location: "Bissau, Guiné-Bissau",
    vehicle: "Toyota Land Cruiser Prado",
    rating: 5,
    text: "Excelente atendimento personalizado. O veículo chegou a Bissau em perfeito estado e com todo o histórico verificado. Uma parceria de confiança.",
    initials: "AD",
  },
  {
    id: 3,
    name: "Manuel Semedo",
    location: "Praia, Cabo Verde",
    vehicle: "Mercedes-Benz GLE Coupé",
    rating: 5,
    text: "A equipa em Castelo Branco foi fantástica no acompanhamento. Todo o processo de transporte internacional foi muito seguro. Carro espetacular!",
    initials: "MS",
  },
  {
    id: 4,
    name: "Sofia Antunes",
    location: "Castelo Branco, Portugal",
    vehicle: "Porsche Macan",
    rating: 5,
    text: "Atendimento premium com uma curadoria de luxo exemplar. Comprar com a ICG localmente foi uma experiência muito exclusiva e segura.",
    initials: "SA",
  },
  {
    id: 5,
    name: "Edmilson Costa",
    location: "São Tomé, São Tomé e Príncipe",
    vehicle: "Toyota Hilux",
    rating: 5,
    text: "Eficiência e transparência do início ao fim. A melhor opção em Portugal para exportação segura de veículos para São Tomé.",
    initials: "EC",
  },
];

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="mt-24 scroll-mt-20">
      <div className="mb-12 text-center md:text-left">
        <p className="text-xs uppercase tracking-wider text-muted-foreground">
          Depoimentos
        </p>
        <h2 className="mt-2 text-4xl font-bold tracking-tight">
          O que dizem os nossos clientes
        </h2>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          A satisfação e a confiança dos nossos clientes são a nossa maior
          prioridade. Veja a experiência de quem já importou e comprou veículos
          premium com a ICG.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((t) => (
          <div
            key={t.id}
            className="group relative flex flex-col justify-between rounded-2xl border border-border bg-card p-8 transition-all duration-300 hover:-translate-y-1 hover:border-gold/50 hover:shadow-lg hover:shadow-gold-soft"
          >
            {/* Background Quote Icon for high-end look */}
            <div className="absolute right-6 top-6 text-foreground/5 opacity-10 transition-opacity group-hover:opacity-20">
              <Quote className="h-12 w-12" />
            </div>

            <div>
              {/* Stars Rating */}
              <div className="mb-5 flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4.5 w-4.5 ${
                      i < Math.floor(t.rating)
                        ? "fill-gold text-gold"
                        : "text-muted"
                    }`}
                  />
                ))}
                <span className="ml-1 text-xs font-semibold text-gold">
                  {t.rating.toFixed(1)}
                </span>
              </div>

              {/* Depoimento Text */}
              <p className="italic text-muted-foreground leading-relaxed">
                &ldquo;{t.text}&rdquo;
              </p>
            </div>

            {/* Client Info Footer */}
            <div className="mt-8 flex items-center gap-4 border-t border-border/50 pt-5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-gold/30 to-gold/5 font-semibold text-gold ring-1 ring-gold/20">
                {t.initials}
              </div>
              <div>
                <h4 className="font-semibold text-foreground">{t.name}</h4>
                <p className="text-xs text-muted-foreground">
                  {t.location}
                </p>
                <p className="mt-0.5 text-[10px] uppercase tracking-wider font-semibold text-gold">
                  {t.vehicle}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
