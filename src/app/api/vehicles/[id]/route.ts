import { NextRequest, NextResponse } from "next/server";
import { VehicleService } from "@/lib/vehicles/services/vehicle-service";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const vehicle = await VehicleService.getById(id);

    if (!vehicle) {
      return NextResponse.json(
        { success: false, message: "Vehicle not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, data: vehicle, ts: Date.now() });
  } catch (error) {
    console.error("GET vehicle by ID error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch vehicle" },
      { status: 500 },
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const data = await req.json();

    const updatedVehicle = await VehicleService.update(id, data);

    if (!updatedVehicle) {
      return NextResponse.json(
        { success: false, error: "Vehicle not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedVehicle,
      ts: Date.now(),
    });
  } catch (err) {
    console.error("PUT vehicle error:", err);
    return NextResponse.json(
      { success: false, error: "Invalid payload or update failed" },
      { status: 400 },
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const deleted = await VehicleService.delete(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "Vehicle not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: { id },
      ts: Date.now(),
    });
  } catch (error) {
    console.error("DELETE vehicle error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete vehicle" },
      { status: 500 },
    );
  }
}
