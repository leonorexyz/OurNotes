CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`avatar_url` text,
	`role` text DEFAULT 'user',
	`created_at` text DEFAULT (CURRENT_TIMESTAMP)
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_teams` (
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
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP),
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
INSERT INTO `__new_teams`("id", "user_id", "name", "category", "notes", "center_character_id", "effective_bp", "total_hp", "synergy_percent", "is_public", "created_at", "updated_at") SELECT "id", "user_id", "name", "category", "notes", "center_character_id", "effective_bp", "total_hp", "synergy_percent", "is_public", "created_at", "updated_at" FROM `teams`;--> statement-breakpoint
DROP TABLE `teams`;--> statement-breakpoint
ALTER TABLE `__new_teams` RENAME TO `teams`;--> statement-breakpoint
PRAGMA foreign_keys=ON;