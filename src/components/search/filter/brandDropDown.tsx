"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCollectionsBrands } from "@/hooks/use-collectionsBrands";
import { useRouter } from "next/navigation";

export default function BrandDropDown() {
  const { collectionBrands: collections, loading } = useCollectionsBrands();
  const router = useRouter();
  const searchByBrand = (brand: string) => {
    router.push(`/search?brand=${brand}`);
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <span className="sr-only">Marcas</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {loading ? (
          <div className="flex items-center justify-center">
            <span className="sr-only">Carregando...</span>
          </div>
        ) : (
          collections.map((collection) => (
            <DropdownMenuItem
              key={collection.slug}
              onClick={() => searchByBrand(collection.slug)}
            >
              {collection.title}
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
