CREATE TABLE `popular_searches` (
	`id` text PRIMARY KEY NOT NULL,
	`term` text NOT NULL,
	`hit_count` integer DEFAULT 1 NOT NULL,
	`is_trending` integer DEFAULT 0 NOT NULL,
	`last_searched_at` text DEFAULT (CURRENT_TIMESTAMP)
);
--> statement-breakpoint
CREATE UNIQUE INDEX `popular_searches_term_unique` ON `popular_searches` (`term`);--> statement-breakpoint
CREATE TABLE `search_items` (
	`id` text PRIMARY KEY NOT NULL,
	`category` text NOT NULL,
	`category_label` text NOT NULL,
	`title` text NOT NULL,
	`subtitle` text,
	`snippet` text NOT NULL,
	`url` text NOT NULL,
	`tags` text,
	`badge_text` text,
	`badge_color` text,
	`metadata` text,
	`search_vector` text,
	`popularity_score` integer DEFAULT 0 NOT NULL,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP),
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP)
);
--> statement-breakpoint
CREATE TABLE `search_logs` (
	`id` text PRIMARY KEY NOT NULL,
	`query` text NOT NULL,
	`category` text DEFAULT 'all' NOT NULL,
	`result_count` integer DEFAULT 0 NOT NULL,
	`user_id` text,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP),
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null
);
