"use client";

import { useState } from "react";
import { User, Menu, Search } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ModeToggle } from "./ModeToggle";
import { Button } from "./ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const navLinks = [
    { href: "/", label: "HOME" },
    { href: "/search", label: "PESQUISAR" },
    { href: "/#about", label: "SOBRE" },
    { href: "/#contact", label: "CONTATO" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full flex flex-col bg-background shadow-sm">
      {/* Nível 1: Topo */}
      <div className="bg-card">
        <div className="mx-auto flex h-20 max-w-[1400px] items-center justify-between px-4 sm:px-6 gap-4">
          {/* Esquerda: Logo */}
          <Link
            href="/"
            className="text-lg font-bold tracking-[0.3em] text-foreground shrink-0"
          >
            <span className="text-primary">IC</span>G
          </Link>

          {/* Centro: Barra de Pesquisa (Desktop) */}
          <form
            onSubmit={handleSearch}
            className="hidden flex-1 max-w-2xl items-center relative md:flex"
          >
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Pesquisar veículos por marca, modelo, localização..."
                className="w-full rounded-md border border-border bg-background py-3 pl-12 pr-4 text-sm outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
          </form>

          {/* Direita: Ações */}
          <div className="flex items-center gap-2 shrink-0">
            <ModeToggle />
            {/* Menu Mobile */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="px-4 w-[300px] sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle className="text-left text-xl font-bold tracking-[0.3em]">
                    <span className="text-primary">IC</span>G
                  </SheetTitle>
                </SheetHeader>

                {/* Busca Mobile */}
                <form onSubmit={handleSearch} className="mt-6 relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Pesquisar veículos..."
                    className="w-full rounded-md border border-border bg-background py-2 pl-10 pr-4 text-sm outline-none focus:border-primary"
                  />
                </form>

                <div className="mt-8 flex flex-col gap-2">
                  {navLinks.map((link) => {
                    const isActive =
                      pathname === link.href ||
                      (link.href === "/search" &&
                        pathname.startsWith("/search"));
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={`px-4 py-3 rounded-md text-sm font-medium transition-colors ${
                          isActive
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-accent hover:text-foreground"
                        }`}
                      >
                        {link.label}
                      </Link>
                    );
                  })}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Nível 2: Base (Navegação Desktop) */}
      <div className="hidden md:block bg-background dark:border-white border-b border-black">
        <div className="mx-auto flex max-w-[1400px] px-6 justify-center">
          <nav className="flex items-center">
            {navLinks.map((link) => {
              const isActive =
                pathname === link.href ||
                (link.href === "/search" && pathname.startsWith("/search"));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-6 py-3 text-sm font-bold tracking-wide transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
