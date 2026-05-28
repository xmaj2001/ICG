'use client'

import {
  BarChart3,
  Car,
  LayoutDashboard,
  PlusCircle,
  Settings,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const nav = [
  { to: '/system', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { to: '/system/vehicles', label: 'Veículos', icon: Car },
  { to: '/system/vehicle-new', label: 'Adicionar', icon: PlusCircle },
  { to: '/system/reports', label: 'Relatórios', icon: BarChart3 },
  { to: '/system/settings', label: 'Configurações', icon: Settings },
]

export function SystemNavLinks() {
  const pathname = usePathname()

  return (
    <nav className="flex flex-1 flex-col gap-1">
      {nav.map((n) => {
        const active = n.exact
          ? pathname === n.to
          : pathname.startsWith(n.to)
        const Icon = n.icon
        return (
          <Link
            key={n.to}
            href={n.to}
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${
              active
                ? 'bg-foreground text-background'
                : 'text-muted-foreground hover:bg-accent hover:text-foreground'
            }`}
          >
            <Icon className="h-4 w-4" /> {n.label}
          </Link>
        )
      })}
    </nav>
  )
}
