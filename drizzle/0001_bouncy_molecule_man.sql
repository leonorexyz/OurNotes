CREATE TABLE `events` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`type` text NOT NULL,
	`status` text NOT NULL,
	`start_at` text NOT NULL,
	`end_at` text NOT NULL,
	`featured_attribute` text NOT NULL,
	`description` text NOT NULL,
	`featured_characters` text,
	`point_rewards` text,
	`tier_ranking_rewards` text,
	`badge_shop_highlights` text,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP)
);
