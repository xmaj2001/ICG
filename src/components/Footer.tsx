import Image from "next/image";
import Link from "next/link";
import { MapPin, Phone, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer
      id="contacto"
      className="border-t border-border bg-card overflow-hidden"
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
        {/* Coluna 1: Marca e Descrição */}
        <div className="flex flex-col gap-6 lg:pr-8">
          <Link href="/" className="inline-block">
            <Image
              src="/ICG-LOGO-black.png"
              alt="ICG Logo"
              width={120}
              height={120}
              className="object-contain"
            />
          </Link>
          <p className="text-sm text-muted-foreground leading-relaxed">
            A International Car Group (ICG) é a sua parceira de confiança na
            importação e venda de veículos premium e de luxo em Luanda, Angola.
            Garantimos qualidade, exclusividade e excelência no atendimento.
          </p>
        </div>

        {/* Coluna 2: Navegação Rápida */}
        <div>
          <h4 className="font-semibold mb-6 uppercase tracking-wider text-sm">
            Navegação Rápida
          </h4>
          <ul className="space-y-4 text-sm text-muted-foreground">
            <li>
              <Link
                href="/"
                className="hover:text-foreground hover:translate-x-1 transition-transform inline-block"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/search"
                className="hover:text-foreground hover:translate-x-1 transition-transform inline-block"
              >
                Pesquisar Veículos
              </Link>
            </li>
            <li>
              <Link
                href="/#about"
                className="hover:text-foreground hover:translate-x-1 transition-transform inline-block"
              >
                Sobre Nós
              </Link>
            </li>
            <li>
              <Link
                href="/#contact"
                className="hover:text-foreground hover:translate-x-1 transition-transform inline-block"
              >
                Fale Connosco
              </Link>
            </li>
          </ul>
        </div>

        {/* Coluna 3: Categorias */}
        <div>
          <h4 className="font-semibold mb-6 uppercase tracking-wider text-sm">
            Categorias
          </h4>
          <ul className="space-y-4 text-sm text-muted-foreground">
            <li>
              <Link
                href="/search?category=SUV"
                className="hover:text-foreground hover:translate-x-1 transition-transform inline-block"
              >
                SUVs
              </Link>
            </li>
            <li>
              <Link
                href="/search?category=Sedan"
                className="hover:text-foreground hover:translate-x-1 transition-transform inline-block"
              >
                Sedans
              </Link>
            </li>
            <li>
              <Link
                href="/search?category=Luxo"
                className="hover:text-foreground hover:translate-x-1 transition-transform inline-block"
              >
                Luxo
              </Link>
            </li>
            <li>
              <Link
                href="/search?category=Pickup"
                className="hover:text-foreground hover:translate-x-1 transition-transform inline-block"
              >
                PICK-UP
              </Link>
            </li>
          </ul>
        </div>

        {/* Coluna 4: Contacto */}
        <div>
          <h4 className="font-semibold mb-6 uppercase tracking-wider text-sm">
            Contactos
          </h4>
          <ul className="space-y-4 text-sm text-muted-foreground">
            <li className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-primary shrink-0" />
              <span>
                Av. Principal, Luanda
                <br />
                Angola
              </span>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-primary shrink-0" />
              <span>+244 923 456 789</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-primary shrink-0" />
              <span>contacto@icg.co.ao</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Barra Base */}
      <div className="border-t border-border bg-background">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>
            © 2026 ICG - International Car Group. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-6">
            <Link href="#" className="hover:text-foreground transition-colors">
              Termos de Serviço
            </Link>
            <Link href="#" className="hover:text-foreground transition-colors">
              Política de Privacidade
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
