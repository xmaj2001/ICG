"use client";

import { useState } from "react";
import { Menu, Store } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import { SystemNavLinks } from "../SystemNavLinks";

export function MobileSidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen(true)}
        className="md:hidden"
        aria-label="Abrir menu de navegação"
      >
        <Menu />
      </Button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <SheetHeader className="border-b border-border p-4">
            <SheetTitle>
              <SheetClose asChild>
                <Link
                  href="/"
                  className="flex items-center gap-2"
                >
                  <span className="grid size-8 place-items-center rounded-lg bg-foreground text-background">
                    <Store className="size-4" />
                  </span>
                  <span className="text-sm font-semibold tracking-[0.3em]">
                    ICG ADMIN
                  </span>
                </Link>
              </SheetClose>
            </SheetTitle>
          </SheetHeader>

          <nav className="flex flex-1 flex-col p-4" onClick={() => setOpen(false)} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setOpen(false); }}>
            <SystemNavLinks />

            <Link
              href="/"
              className="mt-4 rounded-lg border border-border px-3 py-2 text-center text-xs text-muted-foreground hover:bg-accent hover:text-foreground"
            >
              ← Voltar ao site
            </Link>
          </nav>
        </SheetContent>
      </Sheet>
    </>
  );
}
