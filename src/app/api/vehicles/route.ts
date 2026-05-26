import { generateVehicles } from "@/lib/vehicles/faker";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import type { Vehicle } from "@/lib/vehicles/type";

// Create a static database of 500 vehicles to make filtering work consistently
export const mockDatabase: Vehicle[] = generateVehicles(500);

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const cursor = searchParams.get("cursor");
  const search = searchParams.get("search");
  const brandParam = searchParams.get("brand");
  const categoryParam = searchParams.get("category");
  const fuelParam = searchParams.get("fuel");
  const transmissionParam = searchParams.get("transmission");
  const minYear = searchParams.get("minYear");
  const maxYear = searchParams.get("maxYear");
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");

  let filteredVehicles = [...mockDatabase];

  // Apply filters
  if (search) {
    const s = search.toLowerCase();
    filteredVehicles = filteredVehicles.filter(
      (v) => v.brand.toLowerCase().includes(s) || v.model.toLowerCase().includes(s)
    );
  }

  if (brandParam) {
    const brands = brandParam.split(",");
    if (!brands.includes("all") && !brands.includes("Todos")) {
      filteredVehicles = filteredVehicles.filter((v) => brands.includes(v.brand));
    }
  }

  if (categoryParam) {
    const categories = categoryParam.split(",");
    filteredVehicles = filteredVehicles.filter((v) => categories.includes(v.category));
  }

  if (fuelParam) {
    const fuels = fuelParam.split(",");
    filteredVehicles = filteredVehicles.filter((v) => fuels.includes(v.fuel));
  }

  if (transmissionParam) {
    const transmissions = transmissionParam.split(",");
    filteredVehicles = filteredVehicles.filter((v) => transmissions.includes(v.transmission));
  }

  if (minYear) {
    filteredVehicles = filteredVehicles.filter((v) => v.year >= parseInt(minYear, 10));
  }

  if (maxYear) {
    filteredVehicles = filteredVehicles.filter((v) => v.year <= parseInt(maxYear, 10));
  }

  if (minPrice) {
    filteredVehicles = filteredVehicles.filter((v) => v.price >= parseInt(minPrice, 10));
  }

  if (maxPrice) {
    filteredVehicles = filteredVehicles.filter((v) => v.price <= parseInt(maxPrice, 10));
  }

  const brand = filteredVehicles.reduce(
    (acc, vehicle) => {
      acc[vehicle.brand] = (acc[vehicle.brand] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );
  
  const availableCount = filteredVehicles.filter(
    (vehicle) => vehicle.status === "Disponível",
  ).length;

  let startIndex = 0;
  if (cursor) {
    startIndex = parseInt(Buffer.from(cursor, "base64").toString("ascii"), 10);
    if (isNaN(startIndex)) startIndex = 0;
  }

  const paginatedVehicles = filteredVehicles.slice(startIndex, startIndex + limit);
  const nextIndex = startIndex + limit;
  const nextCursor =
    nextIndex < filteredVehicles.length
      ? Buffer.from(nextIndex.toString()).toString("base64")
      : null;

  return NextResponse.json({
    success: true,
    data: { vehicles: paginatedVehicles, brand, availableCount, nextCursor },
    ts: Date.now(),
  });
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    
    // basic validation
    if (!data.brand || !data.model || !data.price) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const newVehicle: Vehicle = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // add to our mock db (at the beginning)
    mockDatabase.unshift(newVehicle);

    return NextResponse.json({
      success: true,
      data: newVehicle,
      ts: Date.now(),
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: "Invalid payload" },
      { status: 400 }
    );
  }
}
