import { redirect } from "next/navigation";
import { getAuthSessionOrNull } from "@/lib/auth-session";
import { ModeToggle } from "@/components/ModeToggle";
import { Store } from "lucide-react";
import Link from "next/link";
import { SystemNavLinks } from "./SystemNavLinks";
import { MobileSidebar } from "./_components/MobileSidebar";
import { Suspense } from "react";

async function SystemLayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  // Verificação real do token Firebase — se expirou ou foi adulterado, redireciona
  const session = await getAuthSessionOrNull();
  if (!session) redirect("/login?expired=true");

  return (
    <div className="flex min-h-screen w-full">
      <aside className="hidden w-64 shrink-0 flex-col border-border bg-card p-4 md:flex">
        <Link href="/" className="mb-8 flex items-center gap-2 px-2 py-3">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-foreground text-background">
            <Store className="h-4 w-4" />
          </span>
          <span className="text-sm font-semibold tracking-[0.3em]">
            ICG ADMIN
          </span>
        </Link>

        <SystemNavLinks />

        <Link
          href="/"
          className="mt-4 rounded-lg border border-border px-3 py-2 text-center text-xs text-muted-foreground hover:bg-accent hover:text-foreground"
        >
          ← Voltar ao site
        </Link>
      </aside>
      <div className="flex flex-1 flex-col rounded-3xl border border-border bg-background">
        <header className="flex h-14 items-center justify-between border-b border-border px-4 md:px-6">
          <div className="flex items-center gap-3">
            <MobileSidebar />
            <h2 className="text-xs sm:text-sm font-medium text-muted-foreground truncate">
              Painel — {session.email}
            </h2>
          </div>
          <ModeToggle />
        </header>
        <main className="flex-1 p-4 md:p-10">{children}</main>
      </div>
    </div>
  );
}

export default function SystemLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          A carregar painel...
        </div>
      }
    >
      <SystemLayoutContent>{children}</SystemLayoutContent>
    </Suspense>
  );
}
