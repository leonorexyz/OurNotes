CREATE TABLE `guides` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`category` text NOT NULL,
	`content` text NOT NULL,
	`summary` text,
	`read_time` text,
	`difficulty` text,
	`tags` text,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP),
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP)
);
