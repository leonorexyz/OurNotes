CREATE TABLE `recommended_team_members` (
	`id` text PRIMARY KEY NOT NULL,
	`recommended_team_id` text NOT NULL,
	`character_id` text NOT NULL,
	`slot_number` integer NOT NULL,
	`is_center` integer DEFAULT 0 NOT NULL,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP),
	FOREIGN KEY (`recommended_team_id`) REFERENCES `recommended_teams`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`character_id`) REFERENCES `characters`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `recommended_teams` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`category` text NOT NULL,
	`tagline` text NOT NULL,
	`target_room` text NOT NULL,
	`estimated_bp` integer NOT NULL,
	`center_member_id` text NOT NULL,
	`synergy_tags` text,
	`strategy` text NOT NULL,
	`recommended_area_items` text,
	`song_suitability` text NOT NULL,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP),
	FOREIGN KEY (`center_member_id`) REFERENCES `characters`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `team_members` (
	`id` text PRIMARY KEY NOT NULL,
	`team_id` text NOT NULL,
	`character_id` text NOT NULL,
	`slot_number` integer NOT NULL,
	`is_center` integer DEFAULT 0 NOT NULL,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP),
	FOREIGN KEY (`team_id`) REFERENCES `teams`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`character_id`) REFERENCES `characters`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `teams` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text,
	`name` text NOT NULL,
	`category` text DEFAULT 'Score Attack' NOT NULL,
	`notes` text,
	`center_character_id` text,
	`effective_bp` integer DEFAULT 0 NOT NULL,
	`total_hp` integer DEFAULT 5000 NOT NULL,
	`synergy_percent` integer DEFAULT 0 NOT NULL,
	`is_public` integer DEFAULT 1 NOT NULL,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP),
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP)
);
