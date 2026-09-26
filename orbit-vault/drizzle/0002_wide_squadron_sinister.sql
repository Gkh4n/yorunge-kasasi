ALTER TABLE `players` ADD `account_user_id` text;--> statement-breakpoint
ALTER TABLE `players` ADD `account_email` text;--> statement-breakpoint
ALTER TABLE `players` ADD `best_perfect_streak` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `players` ADD `total_play_ms` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX `idx_players_account_user` ON `players` (`account_user_id`);--> statement-breakpoint
ALTER TABLE `runs` ADD `duration_ms` integer DEFAULT 0 NOT NULL;