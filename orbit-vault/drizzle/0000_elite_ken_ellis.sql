CREATE TABLE IF NOT EXISTS `adventure_progress` (
	`player_id` text PRIMARY KEY NOT NULL,
	`unlocked_level` integer DEFAULT 1 NOT NULL,
	`highest_completed` integer DEFAULT 0 NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`player_id`) REFERENCES `players`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `player_planets` (
	`player_id` text NOT NULL,
	`planet_id` text NOT NULL,
	`unlocked_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	PRIMARY KEY(`player_id`, `planet_id`),
	FOREIGN KEY (`player_id`) REFERENCES `players`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `player_wallets` (
	`player_id` text PRIMARY KEY NOT NULL,
	`coins` integer DEFAULT 0 NOT NULL,
	`selected_planet` text DEFAULT 'lime' NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`player_id`) REFERENCES `players`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `players` (
	`id` text PRIMARY KEY NOT NULL,
	`username` text NOT NULL UNIQUE COLLATE NOCASE,
	`token_hash` text NOT NULL,
	`best_score` integer DEFAULT 0 NOT NULL,
	`total_score` integer DEFAULT 0 NOT NULL,
	`xp` integer DEFAULT 0 NOT NULL,
	`level` integer DEFAULT 1 NOT NULL,
	`games_played` integer DEFAULT 0 NOT NULL,
	`perfect_hits` integer DEFAULT 0 NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `idx_players_score` ON `players` (`best_score`);--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `runs` (
	`run_id` text PRIMARY KEY NOT NULL,
	`player_id` text NOT NULL,
	`score` integer NOT NULL,
	`hits` integer NOT NULL,
	`perfect` integer NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`player_id`) REFERENCES `players`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `idx_runs_created_at` ON `runs` (`created_at`);--> statement-breakpoint
DROP INDEX IF EXISTS `idx_players_level`;--> statement-breakpoint
PRAGMA optimize;
