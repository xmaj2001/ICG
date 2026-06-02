import { NextRequest, NextResponse } from "next/server";
import { VehicleService } from "@/lib/vehicles/services/vehicle-service";
import { getAuthSession } from "@/lib/auth-session";

export async function GET(request: NextRequest) {
  // const hmacError = await checkHmac(request)
  // if (hmacError) return hmacError

  try {
    const searchParams = request.nextUrl.searchParams;
    const filters = {
      search: searchParams.get("search"),
      brand: searchParams.get("brand"),
      category: searchParams.get("category"),
      fuel: searchParams.get("fuel"),
      transmission: searchParams.get("transmission"),
      minYear: searchParams.get("minYear")
        ? parseInt(searchParams.get("minYear")!, 10)
        : undefined,
      maxYear: searchParams.get("maxYear")
        ? parseInt(searchParams.get("maxYear")!, 10)
        : undefined,
      minPrice: searchParams.get("minPrice")
        ? parseInt(searchParams.get("minPrice")!, 10)
        : undefined,
      maxPrice: searchParams.get("maxPrice")
        ? parseInt(searchParams.get("maxPrice")!, 10)
        : undefined,
      status: searchParams.get("status") || undefined,
      vehicleType: searchParams.get("vehicleType") || undefined,
    };
    const pagination = {
      limitSize: parseInt(searchParams.get("limit") || "10", 10),
      cursorId: searchParams.get("cursor"),
    };
    const data = await VehicleService.getVehicles(filters, pagination);
    return NextResponse.json({ success: true, data, ts: Date.now() });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch vehicles" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  const rawBody = await request.text();

  // const hmacError = await checkHmacWithBody(request, rawBody)
  // if (hmacError) return hmacError

  try {
    await getAuthSession();
  } catch {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const data = JSON.parse(rawBody);
    if (!data.brand || !data.model || !data.price) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 },
      );
    }
    const newVehicle = await VehicleService.create(data);
    return NextResponse.json(
      { success: true, data: newVehicle, ts: Date.now() },
      { status: 201 },
    );
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to create vehicle" },
      { status: 500 },
    );
  }
}
