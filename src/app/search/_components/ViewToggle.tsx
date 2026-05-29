"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback } from "react";
import { Button } from "@/components/ui/button";
import { LayoutGrid, Rows } from "lucide-react";

export function ViewToggle() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentView = searchParams.get("view") ?? "grid";

  const setView = useCallback(
    (view: "grid" | "list") => {
      const params = new URLSearchParams(searchParams.toString());
      if (view === "grid") {
        params.delete("view");
      } else {
        params.set("view", view);
      }
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [searchParams, pathname, router],
  );

  return (
    <div className="flex overflow-hidden rounded-full border border-border">
      <Button
        onClick={() => setView("grid")}
        aria-label="Visualização em grade"
        className={`p-2 rounded-full ${currentView === "grid" ? "bg-foreground text-background" : "bg-transparent text-muted-foreground hover:bg-accent"}`}
      >
        <LayoutGrid className="h-4 w-4" />
      </Button>
      <Button
        onClick={() => setView("list")}
        aria-label="Visualização em lista"
        className={`p-2 rounded-full hidden md:block ${currentView === "list" ? "bg-foreground text-background" : "bg-transparent text-muted-foreground hover:bg-accent"}`}
      >
        <Rows className="h-4 w-4" />
      </Button>
    </div>
  );
}
