"use client";

import {
  BarChart3,
  Car,
  LayoutDashboard,
  PlusCircle,
  Settings,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const nav = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/vehicles", label: "Veículos", icon: Car },
  { to: "/admin/vehicle-new", label: "Adicionar", icon: PlusCircle },
  // { to: '/admin/reports', label: 'Relatórios', icon: BarChart3 },
  { to: "/admin/settings", label: "Configurações", icon: Settings },
];

export function SystemNavLinks() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <nav className="flex flex-1 flex-col gap-1">
      <div className="flex-1 space-y-1">
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
      </div>

      <button
        type="button"
        onClick={async () => {
          await fetch("/api/auth/logout", { method: "POST" });
          router.push("/login");
          router.refresh();
        }}
        className="mt-8 flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-red-500 transition hover:bg-red-500/10 dark:hover:bg-red-500/20 w-full text-left"
      >
        <LogOut className="h-4 w-4" /> Sair
      </button>
    </nav>
  );
}
