import { SiteHeader } from "@/components/site-header";
import { BarChart3, TrendingUp } from "lucide-react";

export default function RelatoriosPage() {
  return (
    <>
      <SiteHeader title="Relatórios" />
      <div className="flex flex-1 flex-col">
        <div className="flex flex-1 flex-col gap-2 p-4 md:gap-6 md:p-6">
          <div className="mb-4">
            <h1 className="font-display text-4xl">Relatórios</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Visão geral do desempenho de vendas e inventário.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="col-span-1 lg:col-span-2 rounded-xl border border-border bg-surface p-6">
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="text-gold" />
                <h2 className="font-display text-xl">Vendas por Mês</h2>
              </div>
              <div className="h-64 flex items-end gap-2 pt-4">
                {[40, 70, 45, 90, 65, 85, 120, 95].map((height, i) => (
                  <div
                    key={i}
                    className="flex-1 flex flex-col items-center justify-end gap-2 h-full"
                  >
                    <div
                      className="w-full bg-gold/20 rounded-t-sm hover:bg-gold/40 transition-colors cursor-pointer"
                      style={{ height: `${height}%` }}
                    />
                    <span className="text-[10px] text-muted-foreground uppercase">
                      {
                        [
                          "Jan",
                          "Fev",
                          "Mar",
                          "Abr",
                          "Mai",
                          "Jun",
                          "Jul",
                          "Ago",
                        ][i]
                      }
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="col-span-1 flex flex-col gap-6">
              <div className="rounded-xl border border-border bg-surface p-6 flex-1">
                <h2 className="font-display text-xl mb-4">Conversão</h2>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold font-display">4.2%</span>
                  <span className="text-sm text-whatsapp flex items-center gap-1">
                    <TrendingUp size={14} /> +1.2%
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Leads do WhatsApp que converteram em vendas.
                </p>
              </div>

              <div className="rounded-xl border border-border bg-surface p-6 flex-1">
                <h2 className="font-display text-xl mb-4">Top Categoria</h2>
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-full bg-gold/10 flex items-center justify-center text-gold font-bold text-xl">
                    SUV
                  </div>
                  <div>
                    <p className="font-medium">45% das vendas</p>
                    <p className="text-xs text-muted-foreground">
                      O segmento mais procurado.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
