import Image from "next/image";
import Link from "next/link";

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 backdrop-blur border-b border-border">
      {/* <div className="bg-gold h-5 w-full"></div> */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/logo.png" alt="ICG Logo" width={40} height={40} />
          <span className="hidden sm:block text-sm font-medium tracking-wide">
            International Car Group
          </span>
        </Link>
        <nav className="flex items-center gap-7 text-sm">
          <Link
            href="/search"
            className="text-foreground hover:text-gold transition-colors"
          >
            Veículos
          </Link>
          <Link
            href="#sobre"
            className="text-muted-foreground hover:text-gold transition-colors"
          >
            Sobre
          </Link>
          <Link
            href="#contacto"
            className="text-muted-foreground hover:text-gold transition-colors"
          >
            Contacto
          </Link>
          <Link
            href="/admin"
            className="hidden md:inline label-eyebrow text-muted-foreground hover:text-gold transition-colors"
          >
            Admin
          </Link>
        </nav>
      </div>
    </header>
  );
}
