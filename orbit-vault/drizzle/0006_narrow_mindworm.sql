CREATE TABLE `deleted_account_sessions` (
	`player_id` text NOT NULL,
	`token_hash` text NOT NULL,
	`username` text NOT NULL,
	`deleted_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	PRIMARY KEY(`player_id`, `token_hash`)
);
--> statement-breakpoint
CREATE INDEX `idx_deleted_account_sessions_deleted` ON `deleted_account_sessions` (`deleted_at`);