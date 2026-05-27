import { ShoppingBag, User, Menu } from "lucide-react";
import Link from "next/link";
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
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-6">
        <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
          <Link
            href="/"
            className="hover:text-foreground [&.active]:font-semibold [&.active]:text-foreground"
          >
            Home
          </Link>
          <Link
            href="/search"
            className="hover:text-foreground [&.active]:font-semibold [&.active]:text-foreground"
          >
            Pesquisar
          </Link>
          <a href="/#about" className="hover:text-foreground">
            Sobre
          </a>
          <a href="/#contact" className="hover:text-foreground">
            Contato
          </a>
          <Link href="/admin" className="hover:text-foreground">
            Admin
          </Link>
        </nav>
        <Link
          href="/"
          className="text-lg font-semibold tracking-[0.3em] text-foreground"
        >
          ICG
        </Link>
        <div className="flex items-center gap-2 text-muted-foreground">
          <ModeToggle />
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full hover:bg-accent hover:text-foreground"
          >
            <ShoppingBag className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="hidden md:inline-flex rounded-full hover:bg-accent hover:text-foreground"
          >
            <User className="h-5 w-5" />
          </Button>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle className="text-left text-lg tracking-[0.3em]">
                  ICG
                </SheetTitle>
              </SheetHeader>
              <div className="mt-8 flex flex-col gap-6 text-base text-muted-foreground">
                <Link href="/" className="hover:text-foreground">
                  Home
                </Link>
                <Link href="/search" className="hover:text-foreground">
                  Pesquisar
                </Link>
                <a href="/#about" className="hover:text-foreground">
                  Sobre
                </a>
                <a href="/#contact" className="hover:text-foreground">
                  Contato
                </a>
                <Link href="/admin" className="hover:text-foreground">
                  Admin
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
