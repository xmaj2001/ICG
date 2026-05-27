import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Vehicle } from "@/lib/vehicles/type";
import Image from "next/image";

interface HeroSectionProps {
  vehicle?: Vehicle;
}

export function HeroSection({ vehicle }: HeroSectionProps) {
  return (
    <section className="grid items-center gap-12 lg:grid-cols-2">
      <div>
        <p className="mb-4 inline-flex items-center gap-2  bg-card px-3 py-1 text-xs uppercase tracking-wider text-muted-foreground">
          International Car Group
        </p>
        <h1 className="text-5xl font-bold leading-tight tracking-tight md:text-6xl">
          Encontre o carro <br /> dos seus sonhos
        </h1>
        <p className="mt-6 max-w-md text-lg text-muted-foreground">
          Catálogo premium com veículos selecionados. Fale conosco direto pelo
          WhatsApp.
        </p>
        <Link
          href="/search"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-foreground px-8 py-4 text-sm font-semibold text-background transition hover:opacity-90"
        >
          Ver estoque <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      <div className="relative h-[420px] overflow-hidden rounded-3xl p-8">
        {/* LOGO */}
        <Image
          src={"/ICG.svg"}
          width={500}
          height={500}
          className="object-contain invert dark:invert-0 opacity-80"
          alt="ICG Logo"
        />
      </div>
    </section>
  );
}
