import { NextResponse, NextRequest } from "next/server";
import { VehicleService } from "@/lib/vehicles/services/vehicle-service";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    
    const filters = {
      search: searchParams.get("search"),
      brand: searchParams.get("brand"),
      category: searchParams.get("category"),
      fuel: searchParams.get("fuel"),
      transmission: searchParams.get("transmission"),
      minYear: searchParams.get("minYear") ? parseInt(searchParams.get("minYear")!, 10) : undefined,
      maxYear: searchParams.get("maxYear") ? parseInt(searchParams.get("maxYear")!, 10) : undefined,
      minPrice: searchParams.get("minPrice") ? parseInt(searchParams.get("minPrice")!, 10) : undefined,
      maxPrice: searchParams.get("maxPrice") ? parseInt(searchParams.get("maxPrice")!, 10) : undefined,
    };

    const pagination = {
      limitSize: parseInt(searchParams.get("limit") || "10", 10),
      cursorId: searchParams.get("cursor")
    };

    const data = await VehicleService.getVehicles(filters, pagination);

    return NextResponse.json({
      success: true,
      data,
      ts: Date.now(),
    });
  } catch (error) {
    console.error("GET vehicles error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch vehicles" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    
    // basic validation
    if (!data.brand || !data.model || !data.price) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const newVehicle = await VehicleService.create(data);

    return NextResponse.json({
      success: true,
      data: newVehicle,
      ts: Date.now(),
    });
  } catch (err) {
    console.error("POST vehicle error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to create vehicle" },
      { status: 500 }
    );
  }
}
