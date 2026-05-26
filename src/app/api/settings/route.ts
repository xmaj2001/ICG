import { NextRequest, NextResponse } from "next/server";

// Simple in-memory store for settings
// In production, this would go to a database
let settings = {
  whatsappNumber: "244923456789",
};

export async function GET() {
  return NextResponse.json({
    success: true,
    data: settings,
    ts: Date.now(),
  });
}

export async function PUT(req: NextRequest) {
  try {
    const data = await req.json();
    
    if (data.whatsappNumber) {
      settings.whatsappNumber = data.whatsappNumber;
    }

    return NextResponse.json({
      success: true,
      data: settings,
      ts: Date.now(),
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Invalid payload" },
      { status: 400 }
    );
  }
}
