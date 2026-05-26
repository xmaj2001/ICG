import { NextResponse } from "next/server";
import { mockDatabase } from "../vehicles/route";

export async function GET() {
  try {
    const inStock = mockDatabase.filter(
      (v) => v.status === "Disponível"
    ).length;

    // A simple mock for sold this month: we'll count sold items
    // Since mock dates are random, this is just illustrative
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const soldThisMonth = mockDatabase.filter((v) => {
      if (v.status !== "Vendido") return false;
      const d = new Date(v.updatedAt);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    }).length;

    const uniqueBrands = new Set(mockDatabase.map((v) => v.brand)).size;

    return NextResponse.json({
      success: true,
      data: {
        inStock,
        soldThisMonth,
        totalBrands: uniqueBrands,
        totalVehicles: mockDatabase.length,
      },
      ts: Date.now(),
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
