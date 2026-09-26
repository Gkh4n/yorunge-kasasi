CREATE TABLE `daily_claims` (
	`player_id` text NOT NULL,
	`quest_day` text NOT NULL,
	`quest_id` text NOT NULL,
	`claimed_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	PRIMARY KEY(`player_id`, `quest_day`, `quest_id`),
	FOREIGN KEY (`player_id`) REFERENCES `players`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_daily_claims_player_day` ON `daily_claims` (`player_id`,`quest_day`);--> statement-breakpoint
CREATE TABLE `planet_mastery` (
	`player_id` text NOT NULL,
	`planet_id` text NOT NULL,
	`mastery_xp` integer DEFAULT 0 NOT NULL,
	`games_played` integer DEFAULT 0 NOT NULL,
	`perfect_hits` integer DEFAULT 0 NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	PRIMARY KEY(`player_id`, `planet_id`),
	FOREIGN KEY (`player_id`) REFERENCES `players`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_planet_mastery_player` ON `planet_mastery` (`player_id`);--> statement-breakpoint
ALTER TABLE `player_wallets` ADD `selected_trail` text DEFAULT 'mint' NOT NULL;--> statement-breakpoint
ALTER TABLE `runs` ADD `planet_id` text DEFAULT 'mercury' NOT NULL;--> statement-breakpoint
ALTER TABLE `runs` ADD `adventure_completed` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
CREATE INDEX `idx_runs_mode_created` ON `runs` (`mode`,`created_at`);--> statement-breakpoint
PRAGMA optimize;
