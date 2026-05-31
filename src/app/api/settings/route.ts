import { NextRequest, NextResponse } from "next/server";
import { SettingsService } from "@/lib/settings/services/settings-service";
import { getAuthSession } from "@/lib/auth-session";

export async function GET(request: NextRequest) {
  // const hmacError = await checkHmac(request)
  // if (hmacError) return hmacError

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

export async function PUT(request: NextRequest) {
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

    // Basic validation
    if (!data.whatsappNumber) {
      return NextResponse.json(
        { success: false, error: "whatsappNumber is required" },
        { status: 400 },
      );
    }

    const updatedSettings = await SettingsService.updateSettings({
      whatsappNumber: data.whatsappNumber,
      email: data.email,
      address: data.address,
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
