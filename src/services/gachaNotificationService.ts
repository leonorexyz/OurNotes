import { db } from "@/db";
import { gachaReminders, gachas, users } from "@/db/schema";
import { eq, and, desc, sql } from "drizzle-orm";

export interface GachaNotificationPayload {
  id: string;
  reminderId: string;
  userId: string | null;
  userName: string | null;
  userEmail: string | null;
  gachaId: string;
  gachaTitle: string;
  bannerCategory: string;
  bannerImageBg: string;
  status: "due" | "expiring_soon" | "ready_to_spark" | "scheduled";
  urgency: "low" | "medium" | "high" | "critical";
  title: string;
  message: string;
  savedStars: number;
  targetSpark: number;
  progressPercent: number;
  hoursRemaining: number | null;
  scheduledNotifyAt: string | null;
  bannerEndAt: string;
  actionUrl: string;
  channels: Array<"in_app" | "browser_push" | "email_mock" | "calendar">;
  timestamp: string;
}

export interface NotificationDispatchResult {
  success: boolean;
  timestamp: string;
  processedCount: number;
  dispatchedCount: number;
  notifications: GachaNotificationPayload[];
  summary: {
    readyToSpark: number;
    expiringSoon: number;
    scheduledDue: number;
  };
}

/**
 * Evaluates pending gacha reminders and prepares notification payloads.
 */
export async function evaluateGachaReminders(options?: {
  userId?: string;
  includeAlreadyNotified?: boolean;
}): Promise<GachaNotificationPayload[]> {
  const conditions = [];

  if (options?.userId) {
    conditions.push(eq(gachaReminders.userId, options.userId));
  }

  if (!options?.includeAlreadyNotified) {
    conditions.push(eq(gachaReminders.isNotified, 0));
  }

  const rows = await db
    .select({
      reminderId: gachaReminders.id,
      userId: gachaReminders.userId,
      userName: users.name,
      userEmail: users.email,
      gachaId: gachaReminders.gachaId,
      gachaTitle: gachas.title,
      gachaCategory: gachas.category,
      gachaStatus: gachas.status,
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
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(gachaReminders.createdAt))
    .all();

  const now = new Date();
  const notifications: GachaNotificationPayload[] = [];

  for (const row of rows) {
    if (!row.gachaId || !row.gachaTitle) continue;

    const bannerEnd = new Date(row.gachaEndAt || Date.now());
    const hoursRemaining = Math.round(
      (bannerEnd.getTime() - now.getTime()) / (1000 * 60 * 60)
    );

    const targetSpark = row.targetSpark ?? 300;
    const targetStars = targetSpark <= 300 ? targetSpark * 250 : targetSpark;
    const savedStars = row.savedStars ?? 0;
    const progressPercent =
      targetStars > 0 ? Math.min(100, Math.round((savedStars / targetStars) * 100)) : 0;
    const isReadyToSpark = savedStars >= targetStars;

    const scheduledDate = row.notifyAt ? new Date(row.notifyAt) : null;
    const isScheduledTimePassed = scheduledDate ? now >= scheduledDate : false;
    const isExpiringSoon = hoursRemaining > 0 && hoursRemaining <= 72; // within 3 days
    const isCriticalEnding = hoursRemaining > 0 && hoursRemaining <= 24; // within 24 hours

    let status: GachaNotificationPayload["status"] = "scheduled";
    let urgency: GachaNotificationPayload["urgency"] = "low";
    let title = `Pengingat Gacha: ${row.gachaTitle}`;
    let message = "";

    if (isReadyToSpark) {
      status = "ready_to_spark";
      urgency = isCriticalEnding ? "critical" : "high";
      title = `🎉 Target Stars Tercapai! Banner ${row.gachaTitle}`;
      message = `Tabungan Stars Anda (${savedStars.toLocaleString(
        "id-ID"
      )}) sudah mencukupi target Spark (${targetStars.toLocaleString(
        "id-ID"
      )} Stars). Siapkan penarikan sebelum banner berakhir!`;
    } else if (isCriticalEnding) {
      status = "expiring_soon";
      urgency = "critical";
      title = `⚠️ Waktu Hampir Habis! Banner ${row.gachaTitle} (${hoursRemaining} jam tersisa)`;
      message = `Banner akan ditutup dalam ${hoursRemaining} jam. Stars Anda saat ini: ${savedStars.toLocaleString(
        "id-ID"
      )} / ${targetStars.toLocaleString("id-ID")} (${progressPercent}%).`;
    } else if (isExpiringSoon) {
      status = "expiring_soon";
      urgency = "medium";
      title = `⏳ Pengingat Banner: ${row.gachaTitle}`;
      message = `Banner berakhir dalam ${Math.round(
        hoursRemaining / 24
      )} hari. Progres Spark saat ini: ${progressPercent}%.`;
    } else if (isScheduledTimePassed) {
      status = "due";
      urgency = "medium";
      title = `🔔 Jadwal Pengingat: ${row.gachaTitle}`;
      message =
        row.note && row.note.trim().length > 0
          ? `Catatan Anda: "${row.note}". Progres: ${savedStars.toLocaleString(
              "id-ID"
            )} / ${targetStars.toLocaleString("id-ID")} Stars.`
          : `Pengingat gacha terjadwal untuk banner "${row.gachaTitle}". Progres Stars: ${progressPercent}%.`;
    } else {
      // Future scheduled item
      status = "scheduled";
      urgency = "low";
      title = `📅 Pengingat Terjadwal: ${row.gachaTitle}`;
      message = `Pengingat diatur untuk ${row.notifyAt || "sebelum banner ditutup"}.`;
    }

    // Attach custom user note if available
    if (row.note && !message.includes(row.note)) {
      message += ` (Catatan: ${row.note})`;
    }

    notifications.push({
      id: `notif-${row.reminderId}-${Date.now()}`,
      reminderId: row.reminderId,
      userId: row.userId,
      userName: row.userName,
      userEmail: row.userEmail,
      gachaId: row.gachaId,
      gachaTitle: row.gachaTitle,
      bannerCategory: row.gachaCategory || "Gacha Banner",
      bannerImageBg: row.bannerImageBg || "from-rose-500 to-indigo-700",
      status,
      urgency,
      title,
      message,
      savedStars,
      targetSpark,
      progressPercent,
      hoursRemaining: hoursRemaining > 0 ? hoursRemaining : 0,
      scheduledNotifyAt: row.notifyAt,
      bannerEndAt: row.gachaEndAt || "",
      actionUrl: `/gacha/${row.gachaId}`,
      channels: ["in_app", "browser_push", "calendar"],
      timestamp: now.toISOString(),
    });
  }

  return notifications;
}

/**
 * Dispatches notifications and marks reminders as notified.
 */
export async function dispatchGachaNotifications(options?: {
  userId?: string;
  forceAll?: boolean;
}): Promise<NotificationDispatchResult> {
  const allNotifications = await evaluateGachaReminders({
    userId: options?.userId,
    includeAlreadyNotified: options?.forceAll,
  });

  // Filter actionable notifications (due, expiring soon, or ready to spark)
  const dueNotifications = options?.forceAll
    ? allNotifications
    : allNotifications.filter(
        (n) =>
          n.status === "due" ||
          n.status === "expiring_soon" ||
          n.status === "ready_to_spark"
      );

  let readyToSparkCount = 0;
  let expiringSoonCount = 0;
  let scheduledDueCount = 0;

  for (const notif of dueNotifications) {
    if (notif.status === "ready_to_spark") readyToSparkCount++;
    if (notif.status === "expiring_soon") expiringSoonCount++;
    if (notif.status === "due") scheduledDueCount++;

    // Update reminder record in DB
    await db.update(gachaReminders)
      .set({ isNotified: 1 })
      .where(eq(gachaReminders.id, notif.reminderId))
      .run();
  }

  return {
    success: true,
    timestamp: new Date().toISOString(),
    processedCount: allNotifications.length,
    dispatchedCount: dueNotifications.length,
    notifications: dueNotifications,
    summary: {
      readyToSpark: readyToSparkCount,
      expiringSoon: expiringSoonCount,
      scheduledDue: scheduledDueCount,
    },
  };
}

/**
 * Simulates sending an instant test notification for a reminder.
 */
export async function sendTestNotification(
  reminderId: string,
  customMessage?: string
): Promise<GachaNotificationPayload | null> {
  const row = await db
    .select({
      reminderId: gachaReminders.id,
      userId: gachaReminders.userId,
      userName: users.name,
      userEmail: users.email,
      gachaId: gachaReminders.gachaId,
      gachaTitle: gachas.title,
      gachaCategory: gachas.category,
      gachaStatus: gachas.status,
      gachaEndAt: gachas.endAt,
      bannerImageBg: gachas.bannerImageBg,
      targetSpark: gachaReminders.targetSpark,
      savedStars: gachaReminders.savedStars,
      notifyAt: gachaReminders.notifyAt,
      note: gachaReminders.note,
    })
    .from(gachaReminders)
    .leftJoin(gachas, eq(gachaReminders.gachaId, gachas.id))
    .leftJoin(users, eq(gachaReminders.userId, users.id))
    .where(eq(gachaReminders.id, reminderId))
    .get();

  if (!row || !row.gachaId || !row.gachaTitle) return null;

  const targetSpark = row.targetSpark ?? 300;
  const targetStars = targetSpark <= 300 ? targetSpark * 250 : targetSpark;
  const savedStars = row.savedStars ?? 0;
  const progressPercent =
    targetStars > 0 ? Math.min(100, Math.round((savedStars / targetStars) * 100)) : 0;

  return {
    id: `test-notif-${Date.now()}`,
    reminderId: row.reminderId,
    userId: row.userId,
    userName: row.userName,
    userEmail: row.userEmail,
    gachaId: row.gachaId,
    gachaTitle: row.gachaTitle,
    bannerCategory: row.gachaCategory || "Gacha Banner",
    bannerImageBg: row.bannerImageBg || "from-rose-500 to-indigo-700",
    status: "due",
    urgency: "medium",
    title: `[Uji Coba Notifikasi] Pengingat Gacha: ${row.gachaTitle}`,
    message:
      customMessage ||
      `Notifikasi berhasil diuji coba untuk banner "${row.gachaTitle}". Progres Stars Anda saat ini: ${savedStars.toLocaleString(
        "id-ID"
      )} / ${targetStars.toLocaleString("id-ID")} Stars (${progressPercent}%).`,
    savedStars,
    targetSpark,
    progressPercent,
    hoursRemaining: 48,
    scheduledNotifyAt: row.notifyAt,
    bannerEndAt: row.gachaEndAt || "",
    actionUrl: `/gacha/${row.gachaId}`,
    channels: ["in_app", "browser_push", "calendar"],
    timestamp: new Date().toISOString(),
  };
}
