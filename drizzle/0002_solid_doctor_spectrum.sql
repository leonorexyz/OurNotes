CREATE TABLE `bands` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`japanese_name` text,
	`concept` text NOT NULL,
	`description` text NOT NULL,
	`color` text NOT NULL,
	`gradient` text NOT NULL,
	`formed_year` text,
	`member_count` integer DEFAULT 5 NOT NULL,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP)
);
--> statement-breakpoint
CREATE TABLE `character_stats` (
	`id` text PRIMARY KEY NOT NULL,
	`character_id` text NOT NULL,
	`total` integer NOT NULL,
	`performance` integer NOT NULL,
	`technique` integer NOT NULL,
	`visual` integer NOT NULL,
	`hp` integer DEFAULT 1000 NOT NULL,
	`skill_name` text NOT NULL,
	`skill_type` text NOT NULL,
	`skill_boost_value` text NOT NULL,
	`skill_description` text NOT NULL,
	`skill_duration` integer DEFAULT 7,
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP),
	FOREIGN KEY (`character_id`) REFERENCES `characters`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `characters` (
	`id` text PRIMARY KEY NOT NULL,
	`band_id` text NOT NULL,
	`name` text NOT NULL,
	`japanese_name` text NOT NULL,
	`romaji` text,
	`role` text NOT NULL,
	`instrument` text,
	`attribute` text NOT NULL,
	`rarity` integer DEFAULT 4 NOT NULL,
	`birthday` text,
	`seiyuu` text,
	`bio` text,
	`avatar_bg` text NOT NULL,
	`card_title` text,
	`card_image` text,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP),
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP),
	FOREIGN KEY (`band_id`) REFERENCES `bands`(`id`) ON UPDATE no action ON DELETE no action
);
