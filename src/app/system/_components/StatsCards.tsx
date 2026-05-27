"use client";

import { useEffect, useState } from "react";
import { Car, Tag, HardDrive, MessageCircle } from "lucide-react";
import {
  getStats,
  type DashboardStats,
} from "@/lib/vehicles/use-case/get-stats";
import {
  getCloudinaryUsage,
  type CloudinaryUsage,
} from "@/lib/cloudinary/use-case/get-cloudinary-usage";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";

export function StatsCards() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [cloudUsage, setCloudUsage] = useState<CloudinaryUsage | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [statsRes, cloudRes] = await Promise.all([
          getStats(),
          getCloudinaryUsage(),
        ]);
        if (statsRes.success) setStats(statsRes.data);
        if (cloudRes.success) setCloudUsage(cloudRes.data);
      } catch (error) {
        console.error("Failed to load stats", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  if (isLoading || !stats || !cloudUsage) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-32 w-full rounded-xl bg-card" />
        ))}
      </div>
    );
  }

  const cloudPercentage = (cloudUsage.used / cloudUsage.limit) * 100;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
      {/* Em Stock */}
      <div className="rounded-sm border border-border bg-card dark:bg-black p-6 shadow-sm">
        <div className="flex flex-row items-center justify-between pb-2">
          <h3 className="text-sm font-medium text-muted-foreground tracking-tight">
            Em Stock
          </h3>
          <Car className="h-4 w-4 text-muted-foreground" />
        </div>
        <div>
          <div className="text-2xl font-bold font-display">{stats.inStock}</div>
          <p className="text-xs text-muted-foreground mt-1 text-whatsapp">
            Disponíveis para venda
          </p>
        </div>
      </div>

      {/* Vendidos */}
      <div className="rounded-sm border border-border bg-card dark:bg-black  p-6 shadow-sm">
        <div className="flex flex-row items-center justify-between pb-2">
          <h3 className="text-sm font-medium text-muted-foreground tracking-tight">
            Vendidos
          </h3>
          <Tag className="h-4 w-4 text-muted-foreground" />
        </div>
        <div>
          <div className="text-2xl font-bold font-display">
            {stats.soldThisMonth}
          </div>
          <p className="text-xs text-muted-foreground mt-1">Este mês</p>
        </div>
      </div>

      {/* Cloudinary */}
      <div className="rounded-sm border border-border bg-card dark:bg-black  p-6 shadow-sm">
        <div className="flex flex-row items-center justify-between pb-2">
          <h3 className="text-sm font-medium text-muted-foreground tracking-tight">
            Armazenamento Cloudinary
          </h3>
          <HardDrive className="h-4 w-4 text-muted-foreground" />
        </div>
        <div>
          <div className="text-2xl font-bold font-display">
            {cloudUsage.used} {cloudUsage.unit}
          </div>
          <Progress value={cloudPercentage} className="h-2 mt-3" />
          <p className="text-xs text-muted-foreground mt-2 text-right">
            de {cloudUsage.limit} {cloudUsage.unit}
          </p>
        </div>
      </div>

      {/* Leads / Total */}
      <div className="rounded-sm border border-border bg-card dark:bg-black  p-6 shadow-sm">
        <div className="flex flex-row items-center justify-between pb-2">
          <h3 className="text-sm font-medium text-muted-foreground tracking-tight">
            Leads WhatsApp
          </h3>
          <MessageCircle className="h-4 w-4 text-muted-foreground" />
        </div>
        <div>
          <div className="text-2xl font-bold font-display">+124</div>
          <p className="text-xs text-muted-foreground mt-1 text-whatsapp">
            +14% vs último mês
          </p>
        </div>
      </div>
    </div>
  );
}
