CREATE TABLE `live_scores` (
	`player_id` text PRIMARY KEY NOT NULL,
	`score` integer DEFAULT 0 NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`player_id`) REFERENCES `players`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_live_scores_updated` ON `live_scores` (`updated_at`);--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_player_wallets` (
	`player_id` text PRIMARY KEY NOT NULL,
	`coins` integer DEFAULT 0 NOT NULL,
	`selected_planet` text DEFAULT 'mercury' NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`player_id`) REFERENCES `players`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_player_wallets`("player_id", "coins", "selected_planet", "updated_at") SELECT "player_id", "coins", "selected_planet", "updated_at" FROM `player_wallets`;--> statement-breakpoint
DROP TABLE `player_wallets`;--> statement-breakpoint
ALTER TABLE `__new_player_wallets` RENAME TO `player_wallets`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
ALTER TABLE `runs` ADD `mode` text DEFAULT 'classic' NOT NULL;--> statement-breakpoint
ALTER TABLE `runs` ADD `adventure_level` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `runs` ADD `best_perfect_streak` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
CREATE INDEX `idx_runs_mode_player` ON `runs` (`mode`,`player_id`);