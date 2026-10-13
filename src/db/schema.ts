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

export type Guide = typeof guides.$inferSelect;
export type NewGuide = typeof guides.$inferInsert;
export type GameEvent = typeof events.$inferSelect;
export type NewGameEvent = typeof events.$inferInsert;
