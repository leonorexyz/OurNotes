import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { gachaReminders, gachas } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { getCurrentUser, requireAuth } from "@/services/authService";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: gachaId } = await params;
    const user = await getCurrentUser(request);

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "Autentikasi diperlukan.",
          authRequired: true,
        },
        { status: 401 }
      );
    }

    const reminder = await db
      .select()
      .from(gachaReminders)
      .where(
        and(
          eq(gachaReminders.gachaId, gachaId),
          eq(gachaReminders.userId, user.id)
        )
      )
      .get();

    if (!reminder) {
      return NextResponse.json({
        success: true,
        hasReminder: false,
        data: null,
      });
    }

    return NextResponse.json({
      success: true,
      hasReminder: true,
      data: reminder,
    });
  } catch (error: any) {
    if (error?.digest === "NEXT_PRERENDER_INTERRUPTED") {
      throw error;
    }
    console.error("Error checking gacha reminder:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memeriksa pengingat gacha" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: gachaId } = await params;
    const authResult = await requireAuth(request);
    if (authResult.errorResponse) {
      return authResult.errorResponse;
    }
    const currentUser = authResult.user;

    const gachaRecord = await db
      .select()
      .from(gachas)
      .where(eq(gachas.id, gachaId))
      .get();

    if (!gachaRecord) {
      return NextResponse.json(
        { success: false, error: "Banner gacha tidak ditemukan" },
        { status: 404 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const { targetSpark, savedStars, notifyAt, note } = body;

    const existing = await db
      .select()
      .from(gachaReminders)
      .where(
        and(
          eq(gachaReminders.gachaId, gachaId),
          eq(gachaReminders.userId, currentUser.id)
        )
      )
      .get();

    const reminderId = existing?.id || `reminder-${Date.now()}`;
    const resolvedTargetSpark =
      typeof targetSpark === "number" && targetSpark > 0 ? targetSpark : 300;
    const resolvedSavedStars =
      typeof savedStars === "number" && savedStars >= 0 ? savedStars : 0;
    const resolvedNotifyAt = notifyAt || gachaRecord.endAt;
    const resolvedNote = typeof note === "string" ? note.trim() : "";

    if (existing) {
      await db.update(gachaReminders)
        .set({
          targetSpark: resolvedTargetSpark,
          savedStars: resolvedSavedStars,
          notifyAt: resolvedNotifyAt,
          note: resolvedNote,
          isNotified: 0,
        })
        .where(eq(gachaReminders.id, reminderId))
        .run();
    } else {
      await db.insert(gachaReminders)
        .values({
          id: reminderId,
          userId: currentUser.id,
          gachaId,
          targetSpark: resolvedTargetSpark,
          savedStars: resolvedSavedStars,
          notifyAt: resolvedNotifyAt,
          note: resolvedNote,
          isNotified: 0,
        })
        .run();
    }

    const saved = db
      .select()
      .from(gachaReminders)
      .where(eq(gachaReminders.id, reminderId))
      .get();

    return NextResponse.json({
      success: true,
      message: existing
        ? "Pengingat gacha berhasil diperbarui"
        : "Pengingat gacha berhasil dipasang",
      data: saved,
    });
  } catch (error: any) {
    if (error?.digest === "NEXT_PRERENDER_INTERRUPTED") {
      throw error;
    }
    console.error("Error setting banner reminder:", error);
    return NextResponse.json(
      { success: false, error: "Gagal menyimpan pengingat gacha" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: gachaId } = await params;
    const authResult = await requireAuth(request);
    if (authResult.errorResponse) {
      return authResult.errorResponse;
    }
    const currentUser = authResult.user;

    const existing = await db
      .select()
      .from(gachaReminders)
      .where(
        and(
          eq(gachaReminders.gachaId, gachaId),
          eq(gachaReminders.userId, currentUser.id)
        )
      )
      .get();

    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Pengingat tidak ditemukan untuk banner ini" },
        { status: 404 }
      );
    }

    await db.delete(gachaReminders)
      .where(eq(gachaReminders.id, existing.id))
      .run();

    return NextResponse.json({
      success: true,
      message: "Pengingat gacha berhasil dibatalkan",
    });
  } catch (error: any) {
    if (error?.digest === "NEXT_PRERENDER_INTERRUPTED") {
      throw error;
    }
    console.error("Error removing banner reminder:", error);
    return NextResponse.json(
      { success: false, error: "Gagal membatalkan pengingat gacha" },
      { status: 500 }
    );
  }
}
