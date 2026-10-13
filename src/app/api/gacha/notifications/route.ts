import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser, requireAuth } from "@/services/authService";
import {
  evaluateGachaReminders,
  dispatchGachaNotifications,
  sendTestNotification,
} from "@/services/gachaNotificationService";

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    const searchParams = request.nextUrl.searchParams;
    const includeAll = searchParams.get("includeAll") === "true";
    const urgency = searchParams.get("urgency");
    const status = searchParams.get("status");

    // If user is authenticated, query for their userId, otherwise query for demo/all if admin
    const targetUserId = user ? (user.role === "admin" && searchParams.get("userId") ? searchParams.get("userId")! : user.id) : undefined;

    let notifications = await evaluateGachaReminders({
      userId: targetUserId,
      includeAlreadyNotified: includeAll,
    });

    if (urgency) {
      notifications = notifications.filter((n) => n.urgency === urgency);
    }

    if (status) {
      notifications = notifications.filter((n) => n.status === status);
    }

    const summary = {
      total: notifications.length,
      readyToSpark: notifications.filter((n) => n.status === "ready_to_spark").length,
      expiringSoon: notifications.filter((n) => n.status === "expiring_soon").length,
      scheduledDue: notifications.filter((n) => n.status === "due").length,
      criticalUrgency: notifications.filter((n) => n.urgency === "critical").length,
    };

    return NextResponse.json({
      success: true,
      summary,
      data: notifications,
    });
  } catch (error: any) {
    if (error?.digest === "NEXT_PRERENDER_INTERRUPTED") {
      throw error;
    }
    console.error("Error fetching gacha notifications:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memuat notifikasi pengingat gacha" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAuth(request);
    if (authResult.errorResponse) {
      return authResult.errorResponse;
    }
    const currentUser = authResult.user;

    const body = await request.json().catch(() => ({}));
    const action = body.action || "dispatch";

    if (action === "test") {
      const reminderId = body.reminderId;
      if (!reminderId) {
        return NextResponse.json(
          { success: false, error: "ID pengingat (reminderId) wajib diisi untuk uji coba" },
          { status: 400 }
        );
      }

      const testResult = await sendTestNotification(reminderId, body.message);
      if (!testResult) {
        return NextResponse.json(
          { success: false, error: "Pengingat gacha tidak ditemukan" },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        message: "Notifikasi uji coba berhasil dikirim",
        notification: testResult,
      });
    }

    // Default: Dispatch actionable notifications
    const forceAll = Boolean(body.forceAll);
    const result = await dispatchGachaNotifications({
      userId: currentUser.role === "admin" && body.userId ? body.userId : currentUser.id,
      forceAll,
    });

    return NextResponse.json({
      success: true,
      message: `Berhasil memproses ${result.processedCount} pengingat, ${result.dispatchedCount} notifikasi dikirimkan.`,
      result,
    });
  } catch (error: any) {
    if (error?.digest === "NEXT_PRERENDER_INTERRUPTED") {
      throw error;
    }
    console.error("Error processing notification dispatch:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memproses pengiriman notifikasi pengingat" },
      { status: 500 }
    );
  }
}
