import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { gachaReminders, gachas, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getCurrentUser, requireAuth } from "@/services/authService";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "Autentikasi diperlukan untuk melihat detail pengingat.",
          authRequired: true,
        },
        { status: 401 }
      );
    }

    const reminder = db
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
      .where(eq(gachaReminders.id, id))
      .get();

    if (!reminder) {
      return NextResponse.json(
        { success: false, error: "Pengingat gacha tidak ditemukan" },
        { status: 404 }
      );
    }

    if (reminder.userId !== user.id && user.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Akses ditolak ke pengingat ini" },
        { status: 403 }
      );
    }

    const targetSpark = reminder.targetSpark ?? 300;
    const savedStars = reminder.savedStars ?? 0;
    const targetStars = targetSpark <= 300 ? targetSpark * 250 : targetSpark;
    const progressPercent =
      targetStars > 0 ? Math.min(100, Math.round((savedStars / targetStars) * 100)) : 0;
    const remainingStars = Math.max(0, targetStars - savedStars);

    return NextResponse.json({
      success: true,
      data: {
        id: reminder.id,
        userId: reminder.userId,
        user: {
          name: reminder.userName,
          email: reminder.userEmail,
        },
        gacha: {
          id: reminder.gachaId,
          title: reminder.gachaTitle,
          japaneseTitle: reminder.gachaJapaneseTitle,
          category: reminder.gachaCategory,
          status: reminder.gachaStatus,
          startAt: reminder.gachaStartAt,
          endAt: reminder.gachaEndAt,
          bannerImageBg: reminder.bannerImageBg,
        },
        targetSpark,
        targetStars,
        savedStars,
        remainingStars,
        progressPercent,
        isReadyToSpark: savedStars >= targetStars,
        notifyAt: reminder.notifyAt,
        note: reminder.note,
        isNotified: reminder.isNotified === 1,
        createdAt: reminder.createdAt,
      },
    });
  } catch (error: any) {
    if (error?.digest === "NEXT_PRERENDER_INTERRUPTED") {
      throw error;
    }
    console.error("Error fetching reminder detail:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengambil detail pengingat" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const authResult = await requireAuth(request);
    if (authResult.errorResponse) {
      return authResult.errorResponse;
    }
    const currentUser = authResult.user;

    const existingReminder = db
      .select()
      .from(gachaReminders)
      .where(eq(gachaReminders.id, id))
      .get();

    if (!existingReminder) {
      return NextResponse.json(
        { success: false, error: "Pengingat gacha tidak ditemukan" },
        { status: 404 }
      );
    }

    if (existingReminder.userId !== currentUser.id && currentUser.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Anda tidak memiliki izin mengubah pengingat ini" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const updateData: Partial<typeof gachaReminders.$inferInsert> = {};

    if (typeof body.targetSpark === "number") {
      updateData.targetSpark = body.targetSpark;
    }
    if (typeof body.savedStars === "number") {
      updateData.savedStars = body.savedStars;
    }
    if (typeof body.notifyAt === "string") {
      updateData.notifyAt = body.notifyAt;
    }
    if (typeof body.note === "string") {
      updateData.note = body.note;
    }
    if (typeof body.isNotified === "number" || typeof body.isNotified === "boolean") {
      updateData.isNotified = body.isNotified ? 1 : 0;
    }

    db.update(gachaReminders)
      .set(updateData)
      .where(eq(gachaReminders.id, id))
      .run();

    const updated = db
      .select()
      .from(gachaReminders)
      .where(eq(gachaReminders.id, id))
      .get();

    return NextResponse.json({
      success: true,
      message: "Pengingat gacha berhasil diperbarui",
      data: updated,
    });
  } catch (error: any) {
    if (error?.digest === "NEXT_PRERENDER_INTERRUPTED") {
      throw error;
    }
    console.error("Error updating gacha reminder:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memperbarui pengingat gacha" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const authResult = await requireAuth(request);
    if (authResult.errorResponse) {
      return authResult.errorResponse;
    }
    const currentUser = authResult.user;

    const reminder = db
      .select()
      .from(gachaReminders)
      .where(eq(gachaReminders.id, id))
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

    db.delete(gachaReminders).where(eq(gachaReminders.id, id)).run();

    return NextResponse.json({
      success: true,
      message: "Pengingat gacha berhasil dihapus",
    });
  } catch (error: any) {
    if (error?.digest === "NEXT_PRERENDER_INTERRUPTED") {
      throw error;
    }
    console.error("Error deleting reminder:", error);
    return NextResponse.json(
      { success: false, error: "Gagal menghapus pengingat gacha" },
      { status: 500 }
    );
  }
}
