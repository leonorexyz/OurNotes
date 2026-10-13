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

export type Guide = typeof guides.$inferSelect;
export type NewGuide = typeof guides.$inferInsert;
