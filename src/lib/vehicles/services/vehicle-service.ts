import { adminDb } from "@/lib/firebase/admin";
import { cacheLife, cacheTag, revalidateTag } from "next/cache";
import type { Vehicle } from "@/lib/vehicles/type";

const COLLECTION_NAME = "vehicles";

// ─── Cache Tag Constants ──────────────────────────────────────────────────────
const TAG_VEHICLES = "vehicles";
const TAG_DASHBOARD = "dashboard";
const vehicleTag = (id: string) => `vehicle-${id}`;

// ─── Types ───────────────────────────────────────────────────────────────────
export interface VehicleFilters {
  search?: string | null;
  brand?: string | null;
  category?: string | null;
  fuel?: string | null;
  transmission?: string | null;
  minYear?: number;
  maxYear?: number;
  minPrice?: number;
  maxPrice?: number;
}

export interface PaginationParams {
  limitSize?: number;
  cursorId?: string | null;
}

// ─── Mapper ──────────────────────────────────────────────────────────────────
const mapDocToVehicle = (
  docSnap: FirebaseFirestore.DocumentSnapshot,
): Vehicle => {
  const data = docSnap.data() ?? {};
  return {
    id: docSnap.id,
    brand: data.brand,
    model: data.model,
    year: data.year,
    price: data.price,
    engineSize: data.engineSize,
    fuel: data.fuel,
    transmission: data.transmission,
    category: data.category,
    badge: data.badge,
    status: data.status,
    images: data.images ?? [],
    description: data.description ?? "",
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  } as Vehicle;
};

// ─── Service ─────────────────────────────────────────────────────────────────
// Objeto const em vez de classe com só métodos estáticos (biome/noStaticOnlyClass)
export const VehicleService = {
  // ── READ ────────────────────────────────────────────────────────────────

  async getVehicles(filters: VehicleFilters, pagination: PaginationParams) {
    "use cache";
    cacheLife("minutes");
    cacheTag(TAG_VEHICLES);

    let q: FirebaseFirestore.Query = adminDb.collection(COLLECTION_NAME);

    if (filters.brand && filters.brand !== "all" && filters.brand !== "Todos") {
      const brands = filters.brand.split(",");
      if (brands.length > 0 && brands.length <= 10) {
        q = q.where("brand", "in", brands);
      }
    }
    if (filters.category) {
      const categories = filters.category.split(",");
      if (categories.length > 0 && categories.length <= 10) {
        q = q.where("category", "in", categories);
      }
    }
    if (filters.fuel) {
      const fuels = filters.fuel.split(",");
      if (fuels.length > 0 && fuels.length <= 10) {
        q = q.where("fuel", "in", fuels);
      }
    }
    if (filters.transmission) {
      const transmissions = filters.transmission.split(",");
      if (transmissions.length > 0 && transmissions.length <= 10) {
        q = q.where("transmission", "in", transmissions);
      }
    }

    const snapshot = await q.get();
    let vehicles = snapshot.docs.map(mapDocToVehicle);

    if (filters.minYear)
      vehicles = vehicles.filter((v) => v.year >= filters.minYear!);
    if (filters.maxYear)
      vehicles = vehicles.filter((v) => v.year <= filters.maxYear!);
    if (filters.minPrice)
      vehicles = vehicles.filter((v) => v.price >= filters.minPrice!);
    if (filters.maxPrice)
      vehicles = vehicles.filter((v) => v.price <= filters.maxPrice!);

    if (filters.search) {
      const s = filters.search.toLowerCase();
      vehicles = vehicles.filter(
        (v) =>
          v.brand.toLowerCase().includes(s) ||
          v.model.toLowerCase().includes(s),
      );
    }

    vehicles.sort((a, b) => {
      const tA = new Date(a.createdAt).getTime();
      const tB = new Date(b.createdAt).getTime();
      if (!isNaN(tA) && !isNaN(tB)) return tB - tA;
      return b.id.localeCompare(a.id);
    });

    const limitSize = pagination.limitSize ?? 10;
    let startIndex = 0;

    if (pagination.cursorId) {
      const decoded = Buffer.from(pagination.cursorId, "base64").toString(
        "ascii",
      );
      const idx = vehicles.findIndex((v) => v.id === decoded);
      if (idx !== -1) startIndex = idx + 1;
    }

    const paginatedVehicles = vehicles.slice(
      startIndex,
      startIndex + limitSize,
    );
    const nextItem = vehicles[startIndex + limitSize];
    const nextCursor = nextItem
      ? Buffer.from(nextItem.id).toString("base64")
      : null;

    const brandCounts = vehicles.reduce(
      (acc, v) => ({ ...acc, [v.brand]: (acc[v.brand] ?? 0) + 1 }),
      {} as Record<string, number>,
    );

    const availableCount = vehicles.filter(
      (v) => v.status === "Disponível",
    ).length;

    return {
      vehicles: paginatedVehicles,
      brand: brandCounts,
      availableCount,
      nextCursor,
    };
  },

  async getById(id: string): Promise<Vehicle | null> {
    "use cache";
    cacheLife("minutes");
    cacheTag(TAG_VEHICLES, vehicleTag(id));

    const docSnap = await adminDb.collection(COLLECTION_NAME).doc(id).get();
    if (!docSnap.exists) return null;
    return mapDocToVehicle(docSnap);
  },

  async getRelated(id: string, limitSize = 10): Promise<Vehicle[]> {
    "use cache";
    cacheLife("minutes");
    cacheTag(TAG_VEHICLES, vehicleTag(id));

    const current = await VehicleService.getById(id);
    if (!current) return [];

    const snapshot = await adminDb
      .collection(COLLECTION_NAME)
      .where("category", "==", current.category)
      .limit(limitSize + 1)
      .get();

    return snapshot.docs
      .map(mapDocToVehicle)
      .filter((v) => v.id !== id)
      .slice(0, limitSize);
  },

  async getAvailableCount(): Promise<number> {
    "use cache";
    cacheLife("minutes");
    cacheTag(TAG_VEHICLES);

    const snapshot = await adminDb
      .collection(COLLECTION_NAME)
      .where("status", "==", "Disponível")
      .count()
      .get();
    return snapshot.data().count;
  },

  async getBrandCounts(): Promise<{ brand: string; count: number }[]> {
    "use cache";
    cacheLife("minutes");
    cacheTag(TAG_VEHICLES);

    const snapshot = await adminDb.collection(COLLECTION_NAME).get();
    const counts = snapshot.docs.reduce(
      (acc, d) => {
        const brand = d.data().brand;
        if (brand) acc[brand] = (acc[brand] ?? 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );
    return Object.entries(counts).map(([brand, count]) => ({ brand, count }));
  },

  async getDashboardStats() {
    "use cache";
    cacheLife("minutes");
    cacheTag(TAG_VEHICLES, TAG_DASHBOARD);

    const snapshot = await adminDb.collection(COLLECTION_NAME).get();
    const vehicles = snapshot.docs.map(mapDocToVehicle);

    const inStock = vehicles.filter((v) => v.status === "Disponível").length;
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const soldThisMonth = vehicles.filter((v) => {
      if (v.status !== "Vendido") return false;
      const d = new Date(v.updatedAt);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    }).length;
    const uniqueBrands = new Set(vehicles.map((v) => v.brand)).size;

    return {
      inStock,
      soldThisMonth,
      totalBrands: uniqueBrands,
      totalVehicles: vehicles.length,
    };
  },

  // ── WRITE — invalidam o cache após mutação ──────────────────────────────

  async create(data: Partial<Vehicle>): Promise<Vehicle> {
    const now = new Date().toISOString();
    const payload = { ...data, createdAt: now, updatedAt: now };
    const docRef = await adminDb.collection(COLLECTION_NAME).add(payload);

    revalidateTag(TAG_VEHICLES, "default");

    return VehicleService.getById(docRef.id) as Promise<Vehicle>;
  },

  async update(id: string, data: Partial<Vehicle>): Promise<Vehicle | null> {
    const docRef = adminDb.collection(COLLECTION_NAME).doc(id);
    const docSnap = await docRef.get();
    if (!docSnap.exists) return null;

    const payload = { ...data, updatedAt: new Date().toISOString() };
    delete payload.id;
    await docRef.update(payload);

    revalidateTag(vehicleTag(id), "default"); // getById + getRelated deste id
    revalidateTag(TAG_VEHICLES, "default"); // listas, counts, stats, dashboard

    return VehicleService.getById(id);
  },

  async delete(id: string): Promise<boolean> {
    const docRef = adminDb.collection(COLLECTION_NAME).doc(id);
    const docSnap = await docRef.get();
    if (!docSnap.exists) return false;

    await docRef.delete();

    revalidateTag(vehicleTag(id), "default"); // remove cache do documento apagado
    revalidateTag(TAG_VEHICLES, "default"); // listas, counts, stats, dashboard

    return true;
  },
} as const;
