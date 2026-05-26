import { generateVehicles } from "@/lib/vehicles/faker";
import type { Vehicle } from "@/lib/vehicles/type";
import { NextResponse } from "next/server";

const mockDatabase: Vehicle[] = generateVehicles(500);

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id: vehicleId } = await params;
  const { searchParams } = new URL(request.url);
  const limit = searchParams.get("limit");
  const vehicles = mockDatabase
    .filter((v) => v.id !== vehicleId)
    .slice(0, limit ? parseInt(limit) : 10);

  return NextResponse.json({
    success: true,
    data: vehicles,
    ts: Date.now(),
  });
}
