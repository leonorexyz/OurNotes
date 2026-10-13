import { db } from "@/db";
import { users, userProfiles, UserProfileRecord } from "@/db/schema";
import { eq } from "drizzle-orm";

export interface UpdateProfileInput {
  name?: string;
  avatarUrl?: string;
  title?: string;
  bio?: string;
  favoriteBand?: string;
  favoriteCharacterId?: string;
  favoriteAttribute?: "Power" | "Pure" | "Cool" | "Happy";
  rank?: number;
  noteSpeed?: number;
  timingOffset?: number;
  tapSoundEffect?: string;
  showCutIn?: boolean | number;
}

export async function getUserProfile(userId: string) {
  const user = db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      avatarUrl: users.avatarUrl,
      role: users.role,
      createdAt: users.createdAt,
    })
    .from(users)
    .where(eq(users.id, userId))
    .get();

  if (!user) {
    return null;
  }

  let profile = db
    .select()
    .from(userProfiles)
    .where(eq(userProfiles.userId, userId))
    .get();

  if (!profile) {
    // Create default profile if not exists
    const defaultProfileId = `prof-${userId}`;
    db.insert(userProfiles)
      .values({
        id: defaultProfileId,
        userId,
        title: "Bintang Utama CiRCLE",
        bio: "Produser aktif CiRCLE Live House Our Notes.",
        favoriteBand: "Poppin'Party",
        favoriteCharacterId: "char-kasumi-toyama",
        favoriteAttribute: "Pure",
        rank: 1,
        noteSpeed: 10.0,
        timingOffset: 0.0,
        tapSoundEffect: "Tambourine",
        showCutIn: 1,
      })
      .onConflictDoNothing()
      .run();

    profile = db
      .select()
      .from(userProfiles)
      .where(eq(userProfiles.userId, userId))
      .get();
  }

  return {
    user,
    profile,
  };
}

export async function updateUserProfile(
  userId: string,
  input: UpdateProfileInput
) {
  // 1. Update users table if name or avatarUrl provided
  const userUpdates: Partial<{ name: string; avatarUrl: string }> = {};
  if (typeof input.name === "string" && input.name.trim()) {
    userUpdates.name = input.name.trim();
  }
  if (typeof input.avatarUrl === "string" && input.avatarUrl.trim()) {
    userUpdates.avatarUrl = input.avatarUrl.trim();
  }

  if (Object.keys(userUpdates).length > 0) {
    db.update(users)
      .set(userUpdates)
      .where(eq(users.id, userId))
      .run();
  }

  // 2. Prepare user_profiles updates
  const profileUpdates: Partial<UserProfileRecord> = {};
  if (typeof input.title === "string") profileUpdates.title = input.title.trim();
  if (typeof input.bio === "string") profileUpdates.bio = input.bio.trim();
  if (typeof input.favoriteBand === "string") profileUpdates.favoriteBand = input.favoriteBand.trim();
  if (typeof input.favoriteCharacterId === "string") profileUpdates.favoriteCharacterId = input.favoriteCharacterId.trim();
  if (typeof input.favoriteAttribute === "string") profileUpdates.favoriteAttribute = input.favoriteAttribute;
  if (typeof input.rank === "number") profileUpdates.rank = input.rank;
  if (typeof input.noteSpeed === "number") profileUpdates.noteSpeed = input.noteSpeed;
  if (typeof input.timingOffset === "number") profileUpdates.timingOffset = input.timingOffset;
  if (typeof input.tapSoundEffect === "string") profileUpdates.tapSoundEffect = input.tapSoundEffect.trim();
  if (input.showCutIn !== undefined) {
    profileUpdates.showCutIn = typeof input.showCutIn === "boolean" ? (input.showCutIn ? 1 : 0) : input.showCutIn;
  }

  // Upsert user_profiles
  const existingProfile = db
    .select()
    .from(userProfiles)
    .where(eq(userProfiles.userId, userId))
    .get();

  if (existingProfile) {
    if (Object.keys(profileUpdates).length > 0) {
      db.update(userProfiles)
        .set(profileUpdates)
        .where(eq(userProfiles.userId, userId))
        .run();
    }
  } else {
    db.insert(userProfiles)
      .values({
        id: `prof-${userId}`,
        userId,
        ...profileUpdates,
      })
      .run();
  }

  return getUserProfile(userId);
}
