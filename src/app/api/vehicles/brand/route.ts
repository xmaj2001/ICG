import { NextRequest, NextResponse } from "next/server";
import { VehicleService } from "@/lib/vehicles/services/vehicle-service";
import { checkHmac } from "@/lib/hmac";

export async function GET(request: NextRequest) {
  // const hmacError = await checkHmac(request)
  // if (hmacError) return hmacError

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
