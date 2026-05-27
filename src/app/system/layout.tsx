"use client";
import { ModeToggle } from "@/components/ModeToggle";
import {
  BarChart3,
  Car,
  LayoutDashboard,
  PlusCircle,
  Settings,
  Store,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const nav = [
  { to: "/system", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/system/vehicles", label: "Veículos", icon: Car },
  { to: "/system/vehicle-new", label: "Adicionar", icon: PlusCircle },
  { to: "/system/reports", label: "Relatórios", icon: BarChart3 },
  { to: "/system/settings", label: "Configurações", icon: Settings },
];

export default function SystemLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  return (
    <div className="flex min-h-screen bg-card text-foreground">
      <aside className="hidden w-64 shrink-0 flex-col  border-border bg-card p-4 md:flex">
        <Link href="/" className="mb-8 flex items-center gap-2 px-2 py-3">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-foreground text-background">
            <Store className="h-4 w-4" />
          </span>
          <span className="text-sm font-semibold tracking-[0.3em]">
            ICG ADMIN
          </span>
        </Link>
        <nav className="flex flex-1 flex-col gap-1">
          {nav.map((n) => {
            const active = n.exact
              ? pathname === n.to
              : pathname.startsWith(n.to);
            const Icon = n.icon;
            return (
              <Link
                key={n.to}
                href={n.to}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${
                  active
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" /> {n.label}
              </Link>
            );
          })}
        </nav>
        <Link
          href="/"
          className="mt-4 rounded-lg border border-border px-3 py-2 text-center text-xs text-muted-foreground hover:bg-accent hover:text-foreground"
        >
          ← Voltar ao site
        </Link>
      </aside>
      <div className="flex flex-1 flex-col rounded-3xl border border-border bg-background">
        <header className="flex h-14 items-center justify-between border-b border-border px-6">
          <h2 className="text-sm font-medium text-muted-foreground">
            Painel administrativo
          </h2>
          <ModeToggle />
        </header>
        <main className="flex-1 p-6 md:p-10">{children}</main>
      </div>
    </div>
  );
}
