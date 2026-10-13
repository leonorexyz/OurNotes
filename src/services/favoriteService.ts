import { db } from "@/db";
import { userFavorites, UserFavoriteRecord, NewUserFavoriteRecord } from "@/db/schema";
import { eq, and, desc, asc, like, or } from "drizzle-orm";

export interface FavoriteFilterOptions {
  type?: string;
  q?: string;
  sort?: "newest" | "title";
}

export async function getUserFavorites(
  userId: string,
  options: FavoriteFilterOptions = {}
): Promise<UserFavoriteRecord[]> {
  try {
    let query = db
      .select()
      .from(userFavorites)
      .where(eq(userFavorites.userId, userId));

    const all = query.all();

    let filtered = all;
    if (options.type && options.type !== "semua") {
      filtered = filtered.filter(
        (f) =>
          f.targetType.toLowerCase() === options.type!.toLowerCase() ||
          (options.type === "karakter" && (f.targetType === "character" || f.targetType === "band")) ||
          (options.type === "panduan" && (f.targetType === "guide" || f.targetType === "blog"))
      );
    }

    if (options.q && options.q.trim()) {
      const search = options.q.toLowerCase().trim();
      filtered = filtered.filter(
        (f) =>
          f.title.toLowerCase().includes(search) ||
          (f.subtitle && f.subtitle.toLowerCase().includes(search)) ||
          (f.notes && f.notes.toLowerCase().includes(search))
      );
    }

    if (options.sort === "title") {
      filtered.sort((a, b) => a.title.localeCompare(b.title));
    } else {
      filtered.sort((a, b) => {
        const da = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const db = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return db - da;
      });
    }

    return filtered;
  } catch (error) {
    console.error("Error in getUserFavorites:", error);
    return [];
  }
}

export async function addFavorite(
  userId: string,
  data: Omit<NewUserFavoriteRecord, "id" | "userId" | "createdAt">
): Promise<UserFavoriteRecord> {
  const favoriteId = `fav-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

  // Check if already favorited
  const existing = db
    .select()
    .from(userFavorites)
    .where(
      and(
        eq(userFavorites.userId, userId),
        eq(userFavorites.targetId, data.targetId)
      )
    )
    .get();

  if (existing) {
    return existing;
  }

  db.insert(userFavorites)
    .values({
      id: favoriteId,
      userId,
      targetType: data.targetType,
      targetId: data.targetId,
      title: data.title,
      subtitle: data.subtitle || null,
      categoryLabel: data.categoryLabel || null,
      url: data.url,
      badge: data.badge || null,
      badgeColor: data.badgeColor || null,
      avatarUrl: data.avatarUrl || null,
      coverBg: data.coverBg || null,
      notes: data.notes || null,
    })
    .run();

  const created = db
    .select()
    .from(userFavorites)
    .where(eq(userFavorites.id, favoriteId))
    .get();

  return created!;
}

export async function removeFavorite(
  userId: string,
  favoriteIdOrTargetId: string
): Promise<boolean> {
  // Check if matching by id or targetId
  const item = db
    .select()
    .from(userFavorites)
    .where(
      and(
        eq(userFavorites.userId, userId),
        or(
          eq(userFavorites.id, favoriteIdOrTargetId),
          eq(userFavorites.targetId, favoriteIdOrTargetId)
        )
      )
    )
    .get();

  if (!item) {
    return false;
  }

  db.delete(userFavorites)
    .where(eq(userFavorites.id, item.id))
    .run();

  return true;
}

export async function checkIsFavorited(
  userId: string,
  targetId: string
): Promise<boolean> {
  const item = db
    .select()
    .from(userFavorites)
    .where(
      and(
        eq(userFavorites.userId, userId),
        eq(userFavorites.targetId, targetId)
      )
    )
    .get();

  return Boolean(item);
}
