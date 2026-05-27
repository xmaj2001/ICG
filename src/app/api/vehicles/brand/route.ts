import { NextResponse } from "next/server";
import { VehicleService } from "@/lib/vehicles/services/vehicle-service";

export async function GET() {
  try {
    const brandCountArray = await VehicleService.getBrandCounts();

    return NextResponse.json({
      success: true,
      data: brandCountArray,
      ts: Date.now(),
    });
  } catch (error) {
    console.error("GET brand counts error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch brand counts" },
      { status: 500 },
    );
  }
}
