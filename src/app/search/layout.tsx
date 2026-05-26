import { Footer } from "@/components/Footer";
import { SearchNavbar } from "@/components/search/SearchNavbar";
import { Suspense } from "react";

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen text-white relative pt-[104px] md:pt-[104px]" id="search">
      <SearchNavbar />
      <div className="mx-auto max-w-(--breakpoint-xl) px-4 pb-4 text-black dark:text-white">
        {/* Centro — conteúdo principal */}
        <main className="w-full">
          <Suspense fallback={null}>{children}</Suspense>
        </main>
      </div>
      <Footer />
    </div>
  );
}
