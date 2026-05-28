import { NextRequest, NextResponse } from "next/server";
import { VehicleService } from "@/lib/vehicles/services/vehicle-service";
import { checkHmac } from "@/lib/hmac";
import { getAuthSession } from "@/lib/auth-session";

export async function GET(request: NextRequest) {
  // const hmacError = await checkHmac(request)
  // if (hmacError) return hmacError

  try {
    await getAuthSession();
  } catch {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

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
      { status: 500 },
    );
  }
}
