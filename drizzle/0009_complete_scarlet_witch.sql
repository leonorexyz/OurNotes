CREATE TABLE `user_favorites` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`target_type` text NOT NULL,
	`target_id` text NOT NULL,
	`title` text NOT NULL,
	`subtitle` text,
	`category_label` text,
	`url` text NOT NULL,
	`badge` text,
	`badge_color` text,
	`avatar_url` text,
	`cover_bg` text,
	`notes` text,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP),
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `user_profiles` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`title` text DEFAULT 'Bintang Utama CiRCLE',
	`bio` text DEFAULT 'Produser aktif CiRCLE Live House Our Notes.',
	`favorite_band` text DEFAULT 'Poppin''Party',
	`favorite_character_id` text DEFAULT 'char-kasumi-toyama',
	`favorite_attribute` text DEFAULT 'Pure',
	`rank` integer DEFAULT 1,
	`note_speed` real DEFAULT 10,
	`timing_offset` real DEFAULT 0,
	`tap_sound_effect` text DEFAULT 'Tambourine',
	`show_cut_in` integer DEFAULT 1,
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP),
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_profiles_user_id_unique` ON `user_profiles` (`user_id`);