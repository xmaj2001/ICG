import { NextResponse } from "next/server";
import { generateVehicles } from "@/lib/vehicles/faker";

export async function GET() {
  const vehicles = generateVehicles(100);
  const brandCount = vehicles.reduce(
    (acc, vehicle) => {
      acc[vehicle.brand] = (acc[vehicle.brand] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );
  
  const brandCountArray = Object.entries(brandCount).map(([brand, count]) => ({
    brand,
    count,
  }));

  return NextResponse.json({ success: true, data: brandCountArray, ts: Date.now() });
}
