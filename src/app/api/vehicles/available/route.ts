import { NextRequest, NextResponse } from "next/server";
import { VehicleService } from "@/lib/vehicles/services/vehicle-service";
import { checkHmac } from "@/lib/hmac";

export async function GET(request: NextRequest) {
  // const hmacError = await checkHmac(request)
  // if (hmacError) return hmacError

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
