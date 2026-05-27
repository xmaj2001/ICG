import { NextResponse } from "next/server";
import { VehicleService } from "@/lib/vehicles/services/vehicle-service";

export async function GET() {
  try {
    const stats = await VehicleService.getDashboardStats();

    return NextResponse.json({
      success: true,
      data: stats,
      ts: Date.now(),
    });
  } catch (error) {
    console.error("GET stats error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
