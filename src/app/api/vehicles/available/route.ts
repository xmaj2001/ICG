import { NextResponse } from "next/server";
import { VehicleService } from "@/lib/vehicles/services/vehicle-service";

export async function GET() {
  try {
    const availableCount = await VehicleService.getAvailableCount();

    return NextResponse.json({
      success: true,
      data: availableCount,
      ts: Date.now(),
    });
  } catch (error) {
    console.error("GET available vehicles count error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch available count" },
      { status: 500 },
    );
  }
}
