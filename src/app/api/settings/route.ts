import { NextRequest, NextResponse } from "next/server";
import { SettingsService } from "@/lib/settings/services/settings-service";

export async function GET() {
  try {
    const settings = await SettingsService.getSettings();

    return NextResponse.json({
      success: true,
      data: settings,
      ts: Date.now(),
    });
  } catch (error) {
    console.error("GET settings error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch settings" },
      { status: 500 },
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const data = await req.json();

    // Basic validation
    if (!data.whatsappNumber) {
      return NextResponse.json(
        { success: false, error: "whatsappNumber is required" },
        { status: 400 },
      );
    }

    const updatedSettings = await SettingsService.updateSettings({
      whatsappNumber: data.whatsappNumber,
    });

    return NextResponse.json({
      success: true,
      data: updatedSettings,
      ts: Date.now(),
    });
  } catch (error) {
    console.error("PUT settings error:", error);
    return NextResponse.json(
      { success: false, error: "Invalid payload or update failed" },
      { status: 400 },
    );
  }
}
