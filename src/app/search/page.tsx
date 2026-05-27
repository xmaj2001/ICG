import type { Metadata } from "next";
import { Suspense } from "react";

import { Navbar } from "@/components/Navbar";
import { SearchContent } from "./_components/search-content";
import { SearchSkeleton } from "./_components/search-skeleton";

/* ─── Dynamic SEO Metadata ─── */
interface SearchPageProps {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({
  searchParams,
}: SearchPageProps): Promise<Metadata> {
  const params = (await searchParams) ?? {};
  const brand = params.brand as string | undefined;
  const fuel = params.fuel as string | undefined;
  const category = params.category as string | undefined;

  // Build a human-readable title from active filters
  const parts: string[] = [];
  if (brand) parts.push(brand.split(",").join(", "));
  if (category) parts.push(category.split(",").join(", "));
  if (fuel) parts.push(fuel.split(",").join(", "));

  const filterText = parts.length > 0 ? parts.join(" · ") + " — " : "";

  return {
    title: `${filterText}Veículos à Venda`,
    description: `Encontre ${filterText ? filterText.toLowerCase() : ""}veículos de qualidade na ICG Angola. Filtros avançados, estoque actualizado e os melhores preços.`,
    robots: { index: true, follow: true },
  };
}

/* ─── Page Component (static shell) ─── */
export default function SearchPage({ searchParams }: SearchPageProps) {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-[1400px] px-4 py-16 sm:px-6">
        <Suspense fallback={<SearchSkeleton />}>
          <SearchContent searchParamsPromise={searchParams} />
        </Suspense>
      </main>
    </>
  );
}
