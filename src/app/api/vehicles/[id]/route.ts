import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { Vehicle } from "@/lib/vehicles/type";
import { mockDatabase } from "../route";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  console.log(id);
  const vehicle = mockDatabase.find((v) => v.id === id);
  if (!vehicle) {
    return NextResponse.json(
      { success: false, message: "Vehicle not found" },
      { status: 404 },
    );
  }
  return NextResponse.json({ success: true, data: vehicle, ts: Date.now() });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const index = mockDatabase.findIndex((v) => v.id === id);
  
  if (index === -1) {
    return NextResponse.json(
      { success: false, error: "Vehicle not found" },
      { status: 404 },
    );
  }

  try {
    const data = await req.json();
    mockDatabase[index] = {
      ...mockDatabase[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      data: mockDatabase[index],
      ts: Date.now(),
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: "Invalid payload" },
      { status: 400 },
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const index = mockDatabase.findIndex((v) => v.id === id);
  
  if (index === -1) {
    return NextResponse.json(
      { success: false, error: "Vehicle not found" },
      { status: 404 },
    );
  }

  mockDatabase.splice(index, 1);

  return NextResponse.json({
    success: true,
    data: { id },
    ts: Date.now(),
  });
}
