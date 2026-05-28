import { adminDb } from "@/lib/firebase/admin";
import { cacheLife } from "next/cache";
import type { Vehicle } from "@/lib/vehicles/type";

const COLLECTION_NAME = "vehicles";

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

const mapDocToVehicle = (
  docSnap: FirebaseFirestore.DocumentSnapshot,
): Vehicle => {
  const data = docSnap.data() || {};
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
    images: data.images || [],
    description: data.description || "",
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  } as Vehicle;
};

export class VehicleService {
  static async getVehicles(
    filters: VehicleFilters,
    pagination: PaginationParams,
  ) {
    "use cache";
    cacheLife("minutes");

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
      const searchLower = filters.search.toLowerCase();
      vehicles = vehicles.filter(
        (v) =>
          v.brand.toLowerCase().includes(searchLower) ||
          v.model.toLowerCase().includes(searchLower),
      );
    }

    vehicles.sort((a, b) => {
      const timeA = new Date(a.createdAt).getTime();
      const timeB = new Date(b.createdAt).getTime();
      if (!isNaN(timeA) && !isNaN(timeB)) return timeB - timeA;
      return b.id.localeCompare(a.id);
    });

    const limitSize = pagination.limitSize || 10;
    let startIndex = 0;

    if (pagination.cursorId) {
      const decodedCursor = Buffer.from(pagination.cursorId, "base64").toString(
        "ascii",
      );
      const foundIndex = vehicles.findIndex((v) => v.id === decodedCursor);
      if (foundIndex !== -1) {
        startIndex = foundIndex + 1;
      }
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
      (acc, v) => {
        acc[v.brand] = (acc[v.brand] || 0) + 1;
        return acc;
      },
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
  }

  static async getById(id: string): Promise<Vehicle | null> {
    "use cache";
    cacheLife("minutes");
    const docSnap = await adminDb.collection(COLLECTION_NAME).doc(id).get();
    if (!docSnap.exists) return null;
    return mapDocToVehicle(docSnap);
  }

  static async create(data: Partial<Vehicle>): Promise<Vehicle> {
    const now = new Date().toISOString();
    const payload = {
      ...data,
      createdAt: now,
      updatedAt: now,
    };

    const docRef = await adminDb.collection(COLLECTION_NAME).add(payload);
    return this.getById(docRef.id) as Promise<Vehicle>;
  }

  static async update(
    id: string,
    data: Partial<Vehicle>,
  ): Promise<Vehicle | null> {
    const docRef = adminDb.collection(COLLECTION_NAME).doc(id);
    const docSnap = await docRef.get();
    if (!docSnap.exists) return null;

    const payload = { ...data, updatedAt: new Date().toISOString() };
    delete payload.id;

    await docRef.update(payload);
    return this.getById(id);
  }

  static async delete(id: string): Promise<boolean> {
    const docRef = adminDb.collection(COLLECTION_NAME).doc(id);
    const docSnap = await docRef.get();
    if (!docSnap.exists) return false;

    await docRef.delete();
    return true;
  }

  static async getRelated(
    id: string,
    limitSize: number = 10,
  ): Promise<Vehicle[]> {
    "use cache";
    cacheLife("minutes");
    const currentVehicle = await VehicleService.getById(id);
    if (!currentVehicle) return [];

    const snapshot = await adminDb
      .collection(COLLECTION_NAME)
      .where("category", "==", currentVehicle.category)
      .limit(limitSize + 1)
      .get();

    let related = snapshot.docs.map(mapDocToVehicle);
    related = related.filter((v) => v.id !== id);

    return related.slice(0, limitSize);
  }

  static async getAvailableCount(): Promise<number> {
    "use cache";
    cacheLife("minutes");
    const snapshot = await adminDb
      .collection(COLLECTION_NAME)
      .where("status", "==", "Disponível")
      .count()
      .get();
    return snapshot.data().count;
  }

  static async getBrandCounts(): Promise<{ brand: string; count: number }[]> {
    "use cache";
    cacheLife("minutes");
    const snapshot = await adminDb.collection(COLLECTION_NAME).get();
    const counts = snapshot.docs.reduce(
      (acc, docSnap) => {
        const brand = docSnap.data().brand;
        if (brand) acc[brand] = (acc[brand] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    return Object.entries(counts).map(([brand, count]) => ({ brand, count }));
  }

  static async getDashboardStats() {
    "use cache";
    cacheLife("minutes");
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
  }
}
