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
  relatedGachaId: text("related_gacha_id").references(() => gachas.id, { onDelete: "set null" }),
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

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  avatarUrl: text("avatar_url"),
  role: text("role").default("user"), // 'user' | 'admin'
  createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`),
});

export const teams = sqliteTable("teams", {
  id: text("id").primaryKey(),
  userId: text("user_id").references(() => users.id, { onDelete: "set null" }),
  name: text("name").notNull(),
  category: text("category").notNull().default("Score Attack"),
  notes: text("notes"),
  centerCharacterId: text("center_character_id"),
  effectiveBp: integer("effective_bp").notNull().default(0),
  totalHp: integer("total_hp").notNull().default(5000),
  synergyPercent: integer("synergy_percent").notNull().default(0),
  isPublic: integer("is_public").notNull().default(1),
  createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text("updated_at").default(sql`(CURRENT_TIMESTAMP)`),
});

export const teamMembers = sqliteTable("team_members", {
  id: text("id").primaryKey(),
  teamId: text("team_id")
    .notNull()
    .references(() => teams.id, { onDelete: "cascade" }),
  characterId: text("character_id")
    .notNull()
    .references(() => characters.id),
  slotNumber: integer("slot_number").notNull(), // 1 - 5
  isCenter: integer("is_center").notNull().default(0), // 0 or 1
  createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`),
});

export const recommendedTeams = sqliteTable("recommended_teams", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(), // 'Score Meta' | 'Mono-Band' | 'Event Point' | 'Survival / Healer'
  tagline: text("tagline").notNull(),
  targetRoom: text("target_room").notNull(),
  estimatedBp: integer("estimated_bp").notNull(),
  centerMemberId: text("center_member_id")
    .notNull()
    .references(() => characters.id),
  synergyTags: text("synergy_tags"), // JSON string array
  strategy: text("strategy").notNull(),
  recommendedAreaItems: text("recommended_area_items"), // JSON string array
  songSuitability: text("song_suitability").notNull(),
  createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`),
});

export const recommendedTeamMembers = sqliteTable("recommended_team_members", {
  id: text("id").primaryKey(),
  recommendedTeamId: text("recommended_team_id")
    .notNull()
    .references(() => recommendedTeams.id, { onDelete: "cascade" }),
  characterId: text("character_id")
    .notNull()
    .references(() => characters.id),
  slotNumber: integer("slot_number").notNull(), // 1 - 5
  isCenter: integer("is_center").notNull().default(0), // 0 or 1
  createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`),
});

export const gachas = sqliteTable("gachas", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  japaneseTitle: text("japanese_title"),
  category: text("category").notNull(),
  status: text("status").notNull(),
  startAt: text("start_at").notNull(),
  endAt: text("end_at").notNull(),
  bannerImageBg: text("banner_image_bg").notNull(),
  featuredCharacters: text("featured_characters"), // JSON
  pickupRates: text("pickup_rates"), // JSON
  pitySystem: text("pity_system"), // JSON
  cost: text("cost"), // JSON
  description: text("description").notNull(),
  isRecommended: integer("is_recommended").notNull().default(0), // 0 or 1
  tags: text("tags"), // JSON array
  createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text("updated_at").default(sql`(CURRENT_TIMESTAMP)`),
});

export const gachaReminders = sqliteTable("gacha_reminders", {
  id: text("id").primaryKey(),
  userId: text("user_id").references(() => users.id, { onDelete: "set null" }),
  gachaId: text("gacha_id")
    .notNull()
    .references(() => gachas.id, { onDelete: "cascade" }),
  targetSpark: integer("target_spark").default(300),
  savedStars: integer("saved_stars").default(0),
  notifyAt: text("notify_at"),
  note: text("note"),
  isNotified: integer("is_notified").notNull().default(0),
  createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`),
});

export const blogCategories = sqliteTable("blog_categories", {
  id: text("id").primaryKey(), // slug e.g. 'tips-gameplay'
  name: text("name").notNull(), // 'Tips & Gameplay'
  description: text("description"),
  icon: text("icon"),
  color: text("color"),
  createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`),
});

export const blogTags = sqliteTable("blog_tags", {
  id: text("id").primaryKey(), // slug e.g. 'expert'
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`),
});

export const blogArticles = sqliteTable("blog_articles", {
  id: text("id").primaryKey(), // slug e.g. 'tips-all-perfect-lagu-level-27-expert'
  title: text("title").notNull(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  categoryId: text("category_id").references(() => blogCategories.id, { onDelete: "set null" }),
  category: text("category").notNull(), // 'Tips & Gameplay'
  authorId: text("author_id").references(() => users.id, { onDelete: "set null" }),
  authorName: text("author_name").notNull(),
  authorAvatar: text("author_avatar"),
  authorRole: text("author_role"),
  authorBadgeColor: text("author_badge_color"),
  publishedAt: text("published_at").notNull(),
  readTime: text("read_time").notNull(),
  likes: integer("likes").notNull().default(0),
  commentsCount: integer("comments_count").notNull().default(0),
  views: integer("views").notNull().default(0),
  isFeatured: integer("is_featured").notNull().default(0), // 0 or 1
  coverImageBg: text("cover_image_bg").notNull(),
  tags: text("tags"), // JSON array
  createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text("updated_at").default(sql`(CURRENT_TIMESTAMP)`),
});

export const blogArticleTags = sqliteTable("blog_article_tags", {
  id: text("id").primaryKey(),
  articleId: text("article_id")
    .notNull()
    .references(() => blogArticles.id, { onDelete: "cascade" }),
  tagId: text("tag_id")
    .notNull()
    .references(() => blogTags.id, { onDelete: "cascade" }),
  createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`),
});

export const blogComments = sqliteTable("blog_comments", {
  id: text("id").primaryKey(),
  articleId: text("article_id")
    .notNull()
    .references(() => blogArticles.id, { onDelete: "cascade" }),
  userId: text("user_id").references(() => users.id, { onDelete: "set null" }),
  authorName: text("author_name").notNull(),
  authorAvatar: text("author_avatar"),
  authorBadge: text("author_badge"),
  parentId: text("parent_id"), // for threaded replies
  content: text("content").notNull(),
  likes: integer("likes").notNull().default(0),
  createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`),
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
export type TeamRecord = typeof teams.$inferSelect;
export type NewTeamRecord = typeof teams.$inferInsert;
export type TeamMemberRecord = typeof teamMembers.$inferSelect;
export type NewTeamMemberRecord = typeof teamMembers.$inferInsert;
export type RecommendedTeamRecord = typeof recommendedTeams.$inferSelect;
export type NewRecommendedTeamRecord = typeof recommendedTeams.$inferInsert;
export type RecommendedTeamMemberRecord = typeof recommendedTeamMembers.$inferSelect;
export type NewRecommendedTeamMemberRecord = typeof recommendedTeamMembers.$inferInsert;
export type UserRecord = typeof users.$inferSelect;
export type NewUserRecord = typeof users.$inferInsert;
export type GachaRecord = typeof gachas.$inferSelect;
export type NewGachaRecord = typeof gachas.$inferInsert;
export type GachaReminderRecord = typeof gachaReminders.$inferSelect;
export type NewGachaReminderRecord = typeof gachaReminders.$inferInsert;
export type BlogCategoryRecord = typeof blogCategories.$inferSelect;
export type NewBlogCategoryRecord = typeof blogCategories.$inferInsert;
export type BlogTagRecord = typeof blogTags.$inferSelect;
export type NewBlogTagRecord = typeof blogTags.$inferInsert;
export type BlogArticleRecord = typeof blogArticles.$inferSelect;
export type NewBlogArticleRecord = typeof blogArticles.$inferInsert;
export type BlogArticleTagRecord = typeof blogArticleTags.$inferSelect;
export type BlogCommentRecord = typeof blogComments.$inferSelect;
export type NewBlogCommentRecord = typeof blogComments.$inferInsert;

export const searchItems = sqliteTable("search_items", {
  id: text("id").primaryKey(),
  category: text("category").notNull(), // 'character' | 'band' | 'guide' | 'gacha' | 'blog' | 'team'
  categoryLabel: text("category_label").notNull(),
  title: text("title").notNull(),
  subtitle: text("subtitle"),
  snippet: text("snippet").notNull(),
  url: text("url").notNull(),
  tags: text("tags"), // JSON array string
  badgeText: text("badge_text"),
  badgeColor: text("badge_color"),
  metadata: text("metadata"), // JSON object string
  searchVector: text("search_vector"), // precomputed lowercase search text
  popularityScore: integer("popularity_score").notNull().default(0),
  createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text("updated_at").default(sql`(CURRENT_TIMESTAMP)`),
});

export const popularSearches = sqliteTable("popular_searches", {
  id: text("id").primaryKey(),
  term: text("term").notNull().unique(),
  hitCount: integer("hit_count").notNull().default(1),
  isTrending: integer("is_trending").notNull().default(0), // 0 or 1
  lastSearchedAt: text("last_searched_at").default(sql`(CURRENT_TIMESTAMP)`),
});

export const searchLogs = sqliteTable("search_logs", {
  id: text("id").primaryKey(),
  query: text("query").notNull(),
  category: text("category").notNull().default("all"),
  resultCount: integer("result_count").notNull().default(0),
  userId: text("user_id").references(() => users.id, { onDelete: "set null" }),
  createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`),
});

export type SearchItemRecord = typeof searchItems.$inferSelect;
export type NewSearchItemRecord = typeof searchItems.$inferInsert;
export type PopularSearchRecord = typeof popularSearches.$inferSelect;
export type NewPopularSearchRecord = typeof popularSearches.$inferInsert;
export type SearchLogRecord = typeof searchLogs.$inferSelect;
export type NewSearchLogRecord = typeof searchLogs.$inferInsert;

