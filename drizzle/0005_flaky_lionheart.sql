CREATE TABLE `gacha_reminders` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text,
	`gacha_id` text NOT NULL,
	`target_spark` integer DEFAULT 300,
	`saved_stars` integer DEFAULT 0,
	`notify_at` text,
	`note` text,
	`is_notified` integer DEFAULT 0 NOT NULL,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP),
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`gacha_id`) REFERENCES `gachas`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `gachas` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`japanese_title` text,
	`category` text NOT NULL,
	`status` text NOT NULL,
	`start_at` text NOT NULL,
	`end_at` text NOT NULL,
	`banner_image_bg` text NOT NULL,
	`featured_characters` text,
	`pickup_rates` text,
	`pity_system` text,
	`cost` text,
	`description` text NOT NULL,
	`is_recommended` integer DEFAULT 0 NOT NULL,
	`tags` text,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP),
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP)
);
