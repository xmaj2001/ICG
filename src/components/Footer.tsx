import { WHATSAPP_NUMBER } from "@/lib/constants";
import Image from "next/image";

export function Footer() {
  return (
    <footer id="contacto" className="border-t border-border bg-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-14 grid md:grid-cols-3 gap-10">
        <div>
          <div className="flex items-center gap-3">
            <Image
              src="/logo.svg"
              alt="ICG"
              width={150}
              height={150}
              className="object-contain  dark:invert-0"
            />
            <span className="text-sm font-medium">International Car Group</span>
          </div>
          <p className="mt-4 text-xs text-muted-foreground max-w-xs leading-relaxed">
            Veículos premium e de luxo. Luanda, Angola.
          </p>
        </div>
        <div>
          <div className="label-eyebrow text-muted-foreground mb-4">
            Navegação
          </div>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="#veiculos" className="hover:text-gold transition-colors">
                Veículos
              </a>
            </li>
            <li>
              <a href="#sobre" className="hover:text-gold transition-colors">
                Sobre
              </a>
            </li>
            <li>
              <a href="#contacto" className="hover:text-gold transition-colors">
                Contacto
              </a>
            </li>
          </ul>
        </div>
        <div>
          <div className="label-eyebrow text-muted-foreground mb-4">
            Contacto
          </div>
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-foreground hover:text-gold transition-colors"
          >
            +244 923 456 789
          </a>
          <div className="mt-4 flex gap-3">
            {["IG", "FB", "YT"].map((s) => (
              <a
                key={s}
                href="#"
                className="w-9 h-9 border border-border hover:border-gold/60 hover:text-gold flex items-center justify-center label-eyebrow transition-colors"
              >
                {s}
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-5 text-xs text-muted-foreground flex justify-between">
          <span>© 2026 ICG International Car Group</span>
          <span>Luanda · Angola</span>
        </div>
      </div>
    </footer>
  );
}
