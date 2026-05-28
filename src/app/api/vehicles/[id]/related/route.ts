import { NextRequest, NextResponse } from "next/server";
import { VehicleService } from "@/lib/vehicles/services/vehicle-service";
import { checkHmac } from "@/lib/hmac";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  // const hmacError = await checkHmac(request)
  // if (hmacError) return hmacError

  try {
    const { id: vehicleId } = await params;
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get("limit");

    const limitSize = limit ? parseInt(limit, 10) : 10;

    const vehicles = await VehicleService.getRelated(vehicleId, limitSize);

    return NextResponse.json({
      success: true,
      data: vehicles,
      ts: Date.now(),
    });
  } catch (error) {
    console.error("GET related vehicles error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch related vehicles" },
      { status: 500 },
    );
  }
}
