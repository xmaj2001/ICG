"use client";

import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Filters } from "./Filters";

interface FilterDrawerTriggerProps {
  brands: { brand: string; count: number }[];
}

export function FilterDrawerTrigger({ brands }: FilterDrawerTriggerProps) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-foreground text-background shadow-xl lg:hidden">
          <SlidersHorizontal className="h-5 w-5" />
          <span className="sr-only">Abrir filtros</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-[320px] overflow-y-auto sm:w-[380px]"
      >
        <SheetHeader>
          <SheetTitle>Filtros</SheetTitle>
        </SheetHeader>
        <div className="mt-4 px-4">
          <Filters brands={brands} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
