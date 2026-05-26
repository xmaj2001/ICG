import { NextResponse } from "next/server";
import { generateVehicles } from "@/lib/vehicles/faker";

export async function GET() {
  const vehicles = generateVehicles(100);
  const availableCount = vehicles.filter(
    (vehicle) => vehicle.status === "Disponível",
  ).length;
  return NextResponse.json({
    success: true,
    data: availableCount,
    ts: Date.now(),
  });
}
