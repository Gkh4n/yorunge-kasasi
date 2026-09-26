CREATE TABLE `auth_attempts` (
	`attempt_key` text PRIMARY KEY NOT NULL,
	`failure_count` integer DEFAULT 0 NOT NULL,
	`window_started_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `player_sessions` (
	`token_hash` text PRIMARY KEY NOT NULL,
	`player_id` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`last_used_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`player_id`) REFERENCES `players`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_player_sessions_player` ON `player_sessions` (`player_id`);--> statement-breakpoint
INSERT OR IGNORE INTO `player_sessions` (`token_hash`, `player_id`)
SELECT `token_hash`, `id` FROM `players`;--> statement-breakpoint
ALTER TABLE `players` ADD `password_salt` text;--> statement-breakpoint
ALTER TABLE `players` ADD `password_hash` text;
