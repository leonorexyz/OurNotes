import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const guides = sqliteTable("guides", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  category: text("category").notNull(), // 'Pemula' | 'Tips' | 'Event' | 'FAQ'
  content: text("content").notNull(),
  summary: text("summary"),
  readTime: text("read_time"),
  difficulty: text("difficulty"), // 'Dasar' | 'Menengah' | 'Lanjutan'
  tags: text("tags"), // JSON array or comma separated
  createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text("updated_at").default(sql`(CURRENT_TIMESTAMP)`),
});

export const events = sqliteTable("events", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(), // 'Marathon' | 'VS Live' | 'Live Goals'
  status: text("status").notNull(), // 'Sedang Berlangsung' | 'Akan Datang' | 'Selesai'
  startAt: text("start_at").notNull(),
  endAt: text("end_at").notNull(),
  featuredAttribute: text("featured_attribute").notNull(),
  description: text("description").notNull(),
  featuredCharacters: text("featured_characters"), // JSON
  pointRewards: text("point_rewards"), // JSON
  tierRankingRewards: text("tier_ranking_rewards"), // JSON
  badgeShopHighlights: text("badge_shop_highlights"), // JSON
  createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`),
});

export const bands = sqliteTable("bands", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  japaneseName: text("japanese_name"),
  concept: text("concept").notNull(),
  description: text("description").notNull(),
  color: text("color").notNull(),
  gradient: text("gradient").notNull(),
  formedYear: text("formed_year"),
  memberCount: integer("member_count").notNull().default(5),
  createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`),
});

export const characters = sqliteTable("characters", {
  id: text("id").primaryKey(),
  bandId: text("band_id").notNull().references(() => bands.id),
  name: text("name").notNull(),
  japaneseName: text("japanese_name").notNull(),
  romaji: text("romaji"),
  role: text("role").notNull(),
  instrument: text("instrument"),
  attribute: text("attribute").notNull(), // 'Power' | 'Pure' | 'Cool' | 'Happy'
  rarity: integer("rarity").notNull().default(4),
  birthday: text("birthday"),
  seiyuu: text("seiyuu"),
  bio: text("bio"),
  avatarBg: text("avatar_bg").notNull(),
  cardTitle: text("card_title"),
  cardImage: text("card_image"),
  createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text("updated_at").default(sql`(CURRENT_TIMESTAMP)`),
});

export const characterStats = sqliteTable("character_stats", {
  id: text("id").primaryKey(),
  characterId: text("character_id").notNull().references(() => characters.id),
  total: integer("total").notNull(),
  performance: integer("performance").notNull(),
  technique: integer("technique").notNull(),
  visual: integer("visual").notNull(),
  hp: integer("hp").notNull().default(1000),
  skillName: text("skill_name").notNull(),
  skillType: text("skill_type").notNull(), // 'Score Up' | 'Recovery' | 'Accuracy / Lock'
  skillBoostValue: text("skill_boost_value").notNull(),
  skillDescription: text("skill_description").notNull(),
  skillDuration: integer("skill_duration").default(7),
  updatedAt: text("updated_at").default(sql`(CURRENT_TIMESTAMP)`),
});

export type Guide = typeof guides.$inferSelect;
export type NewGuide = typeof guides.$inferInsert;
export type GameEvent = typeof events.$inferSelect;
export type NewGameEvent = typeof events.$inferInsert;
export type BandRecord = typeof bands.$inferSelect;
export type NewBandRecord = typeof bands.$inferInsert;
export type CharacterRecord = typeof characters.$inferSelect;
export type NewCharacterRecord = typeof characters.$inferInsert;
export type CharacterStatRecord = typeof characterStats.$inferSelect;
export type NewCharacterStatRecord = typeof characterStats.$inferInsert;
