import { NextRequest, NextResponse } from "next/server";
import { calculateTeamSynergy } from "@/services/teamSynergyService";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = await calculateTeamSynergy(body);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error("Error calculating team synergy:", error);
    return NextResponse.json(
      { success: false, error: "Gagal menghitung sinergi formasi tim" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const membersParam =
      searchParams.get("members") ||
      searchParams.get("memberIds") ||
      searchParams.get("characters") ||
      searchParams.get("ids") ||
      "";
    const centerParam = searchParams.get("center") || searchParams.get("centerMemberId") || undefined;

    const memberIds = membersParam
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const result = await calculateTeamSynergy({
      memberIds,
      centerMemberId: centerParam,
    });

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    if (error?.digest === "NEXT_PRERENDER_INTERRUPTED") {
      throw error;
    }
    console.error("Error calculating team synergy via GET:", error);
    return NextResponse.json(
      { success: false, error: "Gagal menghitung sinergi formasi tim" },
      { status: 500 }
    );
  }
}
