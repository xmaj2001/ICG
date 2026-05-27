import { db } from "@/lib/firebase/config";
import { cacheLife } from "next/cache";
import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  getCountFromServer,
  QueryConstraint,
  DocumentData,
  QueryDocumentSnapshot,
  Timestamp,
} from "firebase/firestore";
import type { Vehicle } from "@/lib/vehicles/type";

const COLLECTION_NAME = "vehicles";
const vehiclesRef = collection(db, COLLECTION_NAME);

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
  cursorId?: string | null; // using document ID as cursor
}

/**
 * Maps a Firestore document to a Vehicle object.
 */
const mapDocToVehicle = (
  docSnap: QueryDocumentSnapshot<DocumentData>,
): Vehicle => {
  const data = docSnap.data();
  return {
    id: docSnap.id, // Use Firestore document ID
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
  /**
   * Retrieves vehicles based on filters and pagination.
   * Note: Firestore doesn't support advanced full-text search directly.
   * For the 'search' parameter, we will fetch data and filter in memory if needed,
   * or rely on exact match if possible. For robust search, Algolia or similar is recommended.
   * Here, we apply basic filters at the database level and do text search in memory to keep it simple.
   */
  static async getVehicles(
    filters: VehicleFilters,
    pagination: PaginationParams,
  ) {
    "use cache";
    cacheLife("minutes");
    let q = query(vehiclesRef);
    const constraints: QueryConstraint[] = [];

    // 1. Apply basic equality filters
    if (filters.brand && filters.brand !== "all" && filters.brand !== "Todos") {
      // If brand is a comma-separated list, we can use 'in' (up to 10 items)
      const brands = filters.brand.split(",");
      if (brands.length > 0 && brands.length <= 10) {
        constraints.push(where("brand", "in", brands));
      }
    }

    if (filters.category) {
      const categories = filters.category.split(",");
      if (categories.length > 0 && categories.length <= 10) {
        constraints.push(where("category", "in", categories));
      }
    }

    if (filters.fuel) {
      const fuels = filters.fuel.split(",");
      if (fuels.length > 0 && fuels.length <= 10) {
        constraints.push(where("fuel", "in", fuels));
      }
    }

    if (filters.transmission) {
      const transmissions = filters.transmission.split(",");
      if (transmissions.length > 0 && transmissions.length <= 10) {
        constraints.push(where("transmission", "in", transmissions));
      }
    }

    // Combine constraints
    q = query(vehiclesRef, ...constraints);

    // Fetch all matched docs for now to apply range and search filters in memory,
    // since Firestore requires inequality filters to be on the same field as orderBy,
    // which complicates multiple range filters (price, year) and text search.
    // For a production app with huge data, consider using Typesense or Algolia.
    const snapshot = await getDocs(q);
    let vehicles = snapshot.docs.map(mapDocToVehicle);

    // 2. In-memory range filters (Year, Price)
    if (filters.minYear)
      vehicles = vehicles.filter((v) => v.year >= filters.minYear!);
    if (filters.maxYear)
      vehicles = vehicles.filter((v) => v.year <= filters.maxYear!);
    if (filters.minPrice)
      vehicles = vehicles.filter((v) => v.price >= filters.minPrice!);
    if (filters.maxPrice)
      vehicles = vehicles.filter((v) => v.price <= filters.maxPrice!);

    // 3. In-memory text search
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      vehicles = vehicles.filter(
        (v) =>
          v.brand.toLowerCase().includes(searchLower) ||
          v.model.toLowerCase().includes(searchLower),
      );
    }

    // Ensure deterministic ordering (newest first based on createdAt or fallback to ID)
    vehicles.sort((a, b) => {
      const timeA = new Date(a.createdAt).getTime();
      const timeB = new Date(b.createdAt).getTime();
      if (!isNaN(timeA) && !isNaN(timeB)) return timeB - timeA;
      return b.id.localeCompare(a.id);
    });

    // 4. Pagination
    const limitSize = pagination.limitSize || 10;
    let startIndex = 0;

    if (pagination.cursorId) {
      const decodedCursor = Buffer.from(pagination.cursorId, "base64").toString(
        "ascii",
      );
      const foundIndex = vehicles.findIndex((v) => v.id === decodedCursor);
      if (foundIndex !== -1) {
        startIndex = foundIndex + 1; // start after the cursor
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

    // Calculate aggregated stats from filtered result
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
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return null;
    return mapDocToVehicle(docSnap);
  }

  static async create(data: Partial<Vehicle>): Promise<Vehicle> {
    const now = new Date().toISOString();
    const payload = {
      ...data,
      createdAt: now,
      updatedAt: now,
    };

    // addDoc auto-generates the ID in Firestore
    const docRef = await addDoc(vehiclesRef, payload);
    return this.getById(docRef.id) as Promise<Vehicle>;
  }

  static async update(
    id: string,
    data: Partial<Vehicle>,
  ): Promise<Vehicle | null> {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return null;

    const payload = {
      ...data,
      updatedAt: new Date().toISOString(),
    };

    // Remove id from payload if it exists to avoid overwriting the document ID
    delete payload.id;

    await updateDoc(docRef, payload);
    return this.getById(id);
  }

  static async delete(id: string): Promise<boolean> {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return false;

    await deleteDoc(docRef);
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

    // Query for same category
    const q = query(
      vehiclesRef,
      where("category", "==", currentVehicle.category),
      limit(limitSize + 1), // Fetch one extra in case we need to filter out the current ID
    );

    const snapshot = await getDocs(q);
    let related = snapshot.docs.map(mapDocToVehicle);

    // Filter out the current vehicle
    related = related.filter((v) => v.id !== id);

    return related.slice(0, limitSize);
  }

  static async getAvailableCount(): Promise<number> {
    "use cache";
    cacheLife("minutes");
    const q = query(vehiclesRef, where("status", "==", "Disponível"));
    const snapshot = await getCountFromServer(q);
    return snapshot.data().count;
  }

  static async getBrandCounts(): Promise<{ brand: string; count: number }[]> {
    "use cache";
    cacheLife("minutes");
    // For counts, we fetch all (or use a cached metadata doc in production)
    const snapshot = await getDocs(vehiclesRef);
    const counts = snapshot.docs.reduce(
      (acc, docSnap) => {
        const brand = docSnap.data().brand;
        if (brand) {
          acc[brand] = (acc[brand] || 0) + 1;
        }
        return acc;
      },
      {} as Record<string, number>,
    );

    return Object.entries(counts).map(([brand, count]) => ({ brand, count }));
  }

  static async getDashboardStats() {
    "use cache";
    cacheLife("minutes");
    const snapshot = await getDocs(vehiclesRef);
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
