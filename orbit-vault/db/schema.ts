import { sql } from 'drizzle-orm';
import { index, integer, primaryKey, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core';

export const players = sqliteTable('players', {
  id: text('id').primaryKey(),
  username: text('username').notNull().unique(),
  tokenHash: text('token_hash').notNull(),
  accountUserId: text('account_user_id'),
  accountEmail: text('account_email'),
  passwordSalt: text('password_salt'),
  passwordHash: text('password_hash'),
  isAdmin: integer('is_admin').notNull().default(0),
  bestScore: integer('best_score').notNull().default(0),
  totalScore: integer('total_score').notNull().default(0),
  xp: integer('xp').notNull().default(0),
  level: integer('level').notNull().default(1),
  gamesPlayed: integer('games_played').notNull().default(0),
  perfectHits: integer('perfect_hits').notNull().default(0),
  bestPerfectStreak: integer('best_perfect_streak').notNull().default(0),
  totalPlayMs: integer('total_play_ms').notNull().default(0),
  createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').notNull().default(sql`CURRENT_TIMESTAMP`)
}, (table) => [
  index('idx_players_score').on(table.bestScore),
  uniqueIndex('idx_players_account_user').on(table.accountUserId)
]);

export const playerSessions = sqliteTable('player_sessions', {
  tokenHash: text('token_hash').primaryKey(),
  playerId: text('player_id').notNull().references(() => players.id),
  createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
  lastUsedAt: text('last_used_at').notNull().default(sql`CURRENT_TIMESTAMP`)
}, (table) => [
  index('idx_player_sessions_player').on(table.playerId)
]);

export const authAttempts = sqliteTable('auth_attempts', {
  attemptKey: text('attempt_key').primaryKey(),
  failureCount: integer('failure_count').notNull().default(0),
  windowStartedAt: text('window_started_at').notNull().default(sql`CURRENT_TIMESTAMP`)
});

export const deletedAccountSessions = sqliteTable('deleted_account_sessions', {
  playerId: text('player_id').notNull(),
  tokenHash: text('token_hash').notNull(),
  username: text('username').notNull(),
  deletedAt: text('deleted_at').notNull().default(sql`CURRENT_TIMESTAMP`)
}, (table) => [
  primaryKey({ columns: [table.playerId, table.tokenHash] }),
  index('idx_deleted_account_sessions_deleted').on(table.deletedAt)
]);

export const runs = sqliteTable('runs', {
  runId: text('run_id').primaryKey(),
  playerId: text('player_id').notNull().references(() => players.id),
  mode: text('mode').notNull().default('classic'),
  adventureLevel: integer('adventure_level').notNull().default(0),
  bestPerfectStreak: integer('best_perfect_streak').notNull().default(0),
  score: integer('score').notNull(),
  hits: integer('hits').notNull(),
  perfect: integer('perfect').notNull(),
  durationMs: integer('duration_ms').notNull().default(0),
  planetId: text('planet_id').notNull().default('mercury'),
  adventureCompleted: integer('adventure_completed').notNull().default(0),
  createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`)
}, (table) => [
  index('idx_runs_created_at').on(table.createdAt),
  index('idx_runs_mode_player').on(table.mode, table.playerId),
  index('idx_runs_mode_created').on(table.mode, table.createdAt)
]);

export const liveScores = sqliteTable('live_scores', {
  playerId: text('player_id').primaryKey().references(() => players.id),
  score: integer('score').notNull().default(0),
  mode: text('mode').notNull().default('classic'),
  updatedAt: text('updated_at').notNull().default(sql`CURRENT_TIMESTAMP`)
}, (table) => [
  index('idx_live_scores_updated').on(table.updatedAt)
]);

export const adventureProgress = sqliteTable('adventure_progress', {
  playerId: text('player_id').primaryKey().references(() => players.id),
  unlockedLevel: integer('unlocked_level').notNull().default(1),
  highestCompleted: integer('highest_completed').notNull().default(0),
  updatedAt: text('updated_at').notNull().default(sql`CURRENT_TIMESTAMP`)
});

export const playerWallets = sqliteTable('player_wallets', {
  playerId: text('player_id').primaryKey().references(() => players.id),
  coins: integer('coins').notNull().default(0),
  selectedPlanet: text('selected_planet').notNull().default('mercury'),
  selectedTrail: text('selected_trail').notNull().default('mint'),
  updatedAt: text('updated_at').notNull().default(sql`CURRENT_TIMESTAMP`)
});

export const playerPlanets = sqliteTable('player_planets', {
  playerId: text('player_id').notNull().references(() => players.id),
  planetId: text('planet_id').notNull(),
  unlockedAt: text('unlocked_at').notNull().default(sql`CURRENT_TIMESTAMP`)
}, (table) => [
  primaryKey({ columns: [table.playerId, table.planetId] })
]);

export const planetMastery = sqliteTable('planet_mastery', {
  playerId: text('player_id').notNull().references(() => players.id),
  planetId: text('planet_id').notNull(),
  masteryXp: integer('mastery_xp').notNull().default(0),
  gamesPlayed: integer('games_played').notNull().default(0),
  perfectHits: integer('perfect_hits').notNull().default(0),
  updatedAt: text('updated_at').notNull().default(sql`CURRENT_TIMESTAMP`)
}, (table) => [
  primaryKey({ columns: [table.playerId, table.planetId] }),
  index('idx_planet_mastery_player').on(table.playerId)
]);

export const dailyClaims = sqliteTable('daily_claims', {
  playerId: text('player_id').notNull().references(() => players.id),
  questDay: text('quest_day').notNull(),
  questId: text('quest_id').notNull(),
  claimedAt: text('claimed_at').notNull().default(sql`CURRENT_TIMESTAMP`)
}, (table) => [
  primaryKey({ columns: [table.playerId, table.questDay, table.questId] }),
  index('idx_daily_claims_player_day').on(table.playerId, table.questDay)
]);
