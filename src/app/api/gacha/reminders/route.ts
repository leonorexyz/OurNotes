import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { gachaReminders, gachas, users } from "@/db/schema";
import { eq, and, desc, sql } from "drizzle-orm";
import { getCurrentUser, requireAuth } from "@/services/authService";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const gachaIdParam = searchParams.get("gachaId");
    const isNotifiedParam = searchParams.get("isNotified");

    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Autentikasi diperlukan. Silakan masuk atau sertakan header autentikasi untuk melihat pengingat gacha Anda.",
          authRequired: true,
        },
        { status: 401 }
      );
    }

    // Determine query conditions
    const conditions = [];

    // Filter by user ID (regular user only views their own reminders; admin can pass ?userId=)
    const targetUserId =
      user.role === "admin" && searchParams.get("userId")
        ? searchParams.get("userId")!
        : user.id;

    conditions.push(eq(gachaReminders.userId, targetUserId));

    if (gachaIdParam) {
      conditions.push(eq(gachaReminders.gachaId, gachaIdParam));
    }

    if (isNotifiedParam !== null) {
      conditions.push(
        eq(gachaReminders.isNotified, isNotifiedParam === "1" || isNotifiedParam === "true" ? 1 : 0)
      );
    }

    const rows = await db
      .select({
        id: gachaReminders.id,
        userId: gachaReminders.userId,
        userName: users.name,
        userEmail: users.email,
        gachaId: gachaReminders.gachaId,
        gachaTitle: gachas.title,
        gachaJapaneseTitle: gachas.japaneseTitle,
        gachaCategory: gachas.category,
        gachaStatus: gachas.status,
        gachaStartAt: gachas.startAt,
        gachaEndAt: gachas.endAt,
        bannerImageBg: gachas.bannerImageBg,
        targetSpark: gachaReminders.targetSpark,
        savedStars: gachaReminders.savedStars,
        notifyAt: gachaReminders.notifyAt,
        note: gachaReminders.note,
        isNotified: gachaReminders.isNotified,
        createdAt: gachaReminders.createdAt,
      })
      .from(gachaReminders)
      .leftJoin(gachas, eq(gachaReminders.gachaId, gachas.id))
      .leftJoin(users, eq(gachaReminders.userId, users.id))
      .where(and(...conditions))
      .orderBy(desc(gachaReminders.createdAt))
      .all();

    const data = rows.map((r) => {
      const targetSpark = r.targetSpark ?? 300;
      const savedStars = r.savedStars ?? 0;
      // In Bandori, spark is either 300 seals (75,000 stars) or direct star target
      const targetStars = targetSpark <= 300 ? targetSpark * 250 : targetSpark;
      const progressPercent =
        targetStars > 0 ? Math.min(100, Math.round((savedStars / targetStars) * 100)) : 0;
      const remainingStars = Math.max(0, targetStars - savedStars);

      return {
        id: r.id,
        userId: r.userId,
        user: {
          name: r.userName,
          email: r.userEmail,
        },
        gacha: {
          id: r.gachaId,
          title: r.gachaTitle,
          japaneseTitle: r.gachaJapaneseTitle,
          category: r.gachaCategory,
          status: r.gachaStatus,
          startAt: r.gachaStartAt,
          endAt: r.gachaEndAt,
          bannerImageBg: r.bannerImageBg,
        },
        targetSpark,
        targetStars,
        savedStars,
        remainingStars,
        progressPercent,
        isReadyToSpark: savedStars >= targetStars,
        notifyAt: r.notifyAt,
        note: r.note,
        isNotified: r.isNotified === 1,
        createdAt: r.createdAt,
      };
    });

    return NextResponse.json({
      success: true,
      total: data.length,
      data,
    });
  } catch (error: any) {
    if (error?.digest === "NEXT_PRERENDER_INTERRUPTED") {
      throw error;
    }
    console.error("Error fetching gacha reminders:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengambil daftar pengingat gacha" },
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

    const body = await request.json();
    const { gachaId, targetSpark, savedStars, notifyAt, note } = body;

    if (!gachaId || typeof gachaId !== "string") {
      return NextResponse.json(
        { success: false, error: "ID gacha banner (gachaId) wajib disertakan" },
        { status: 400 }
      );
    }

    // Verify gacha banner exists
    const gachaRecord = await db
      .select({ id: gachas.id, title: gachas.title, endAt: gachas.endAt })
      .from(gachas)
      .where(eq(gachas.id, gachaId))
      .get();

    if (!gachaRecord) {
      return NextResponse.json(
        { success: false, error: `Banner gacha dengan ID '${gachaId}' tidak ditemukan` },
        { status: 404 }
      );
    }

    // Check if reminder already exists for this user and banner
    const existingReminder = await db
      .select()
      .from(gachaReminders)
      .where(
        and(
          eq(gachaReminders.userId, currentUser.id),
          eq(gachaReminders.gachaId, gachaId)
        )
      )
      .get();

    const reminderId = existingReminder?.id || body.id || `reminder-${Date.now()}`;
    const resolvedTargetSpark =
      typeof targetSpark === "number" && targetSpark > 0 ? targetSpark : 300;
    const resolvedSavedStars =
      typeof savedStars === "number" && savedStars >= 0 ? savedStars : 0;
    const resolvedNotifyAt = notifyAt || gachaRecord.endAt;
    const resolvedNote = typeof note === "string" ? note.trim() : "";

    if (existingReminder) {
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

    const createdRecord = await db
      .select()
      .from(gachaReminders)
      .where(eq(gachaReminders.id, reminderId))
      .get();

    return NextResponse.json(
      {
        success: true,
        message: existingReminder
          ? "Pengingat gacha berhasil diperbarui"
          : "Pengingat gacha berhasil dibuat",
        data: createdRecord,
      },
      { status: existingReminder ? 200 : 210 }
    );
  } catch (error: any) {
    if (error?.digest === "NEXT_PRERENDER_INTERRUPTED") {
      throw error;
    }
    console.error("Error creating gacha reminder:", error);
    return NextResponse.json(
      { success: false, error: "Gagal menyimpan pengingat gacha" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const authResult = await requireAuth(request);
    if (authResult.errorResponse) {
      return authResult.errorResponse;
    }
    const currentUser = authResult.user;

    const searchParams = request.nextUrl.searchParams;
    let reminderId = searchParams.get("id");

    if (!reminderId) {
      try {
        const body = await request.json();
        reminderId = body.id;
      } catch {
        // empty body
      }
    }

    if (!reminderId) {
      return NextResponse.json(
        { success: false, error: "ID pengingat (id) wajib disertakan" },
        { status: 400 }
      );
    }

    const reminder = await db
      .select()
      .from(gachaReminders)
      .where(eq(gachaReminders.id, reminderId))
      .get();

    if (!reminder) {
      return NextResponse.json(
        { success: false, error: "Pengingat gacha tidak ditemukan" },
        { status: 404 }
      );
    }

    if (reminder.userId !== currentUser.id && currentUser.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Anda tidak memiliki izin menghapus pengingat ini" },
        { status: 403 }
      );
    }

    await db.delete(gachaReminders).where(eq(gachaReminders.id, reminderId)).run();

    return NextResponse.json({
      success: true,
      message: "Pengingat gacha berhasil dihapus",
    });
  } catch (error: any) {
    if (error?.digest === "NEXT_PRERENDER_INTERRUPTED") {
      throw error;
    }
    console.error("Error deleting gacha reminder:", error);
    return NextResponse.json(
      { success: false, error: "Gagal menghapus pengingat gacha" },
      { status: 500 }
    );
  }
}
