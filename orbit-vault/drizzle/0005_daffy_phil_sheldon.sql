ALTER TABLE `live_scores` ADD `mode` text DEFAULT 'classic' NOT NULL;--> statement-breakpoint
ALTER TABLE `players` ADD `is_admin` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
INSERT INTO `players` (`id`, `username`, `token_hash`, `password_salt`, `password_hash`, `is_admin`)
VALUES ('fb06a22e77ae503a6ac56ac3b00f645c', 'gokhan', '1e223292a817a1c6654f4bb74f33883b4d5ca04285b4075566c0d28bc74ae7a3', '87132879a9454e6950541d8b93752623', 'fae27cac3b5caac0ffe04e98c5e168d85cb1714ba3ff9b4747b56d87ea1e8958', 1)
ON CONFLICT(`username`) DO UPDATE SET
  `password_salt` = excluded.`password_salt`,
  `password_hash` = excluded.`password_hash`,
  `is_admin` = 1,
  `updated_at` = CURRENT_TIMESTAMP;
