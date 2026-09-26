import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readdirSync, readFileSync } from 'node:fs';
import { DatabaseSync } from 'node:sqlite';
import {
  accountProfile, accountStatus, adminPanel, ADVENTURE_REWARDS, ADVENTURE_TARGETS, adventureReward, adventureTarget,
  deleteAccount, leaderboard, liveScore, passwordAuth, progression, register, shop, submitScore
} from '../lib/league.ts';

class D1Statement {
  constructor(database, sql, values = []) {
    this.database = database;
    this.sql = sql;
    this.values = values;
  }

  bind(...values) { return new D1Statement(this.database, this.sql, values); }
  async first() { return this.database.prepare(this.sql).get(...this.values); }
  async all() { return { results: this.database.prepare(this.sql).all(...this.values) }; }
  async run() {
    const result = this.database.prepare(this.sql).run(...this.values);
    return { meta: { changes: Number(result.changes) } };
  }
}

class TestD1 {
  constructor() { this.database = new DatabaseSync(':memory:'); }
  prepare(sql) { return new D1Statement(this.database, sql); }
  async batch(statements) { return Promise.all(statements.map((statement) => statement.run())); }
}

const db = new TestD1();
db.database.exec('PRAGMA foreign_keys = ON');
const migrationDirectory = new URL('../drizzle/', import.meta.url);
readdirSync(migrationDirectory).filter((name) => /^\d+.*\.sql$/.test(name)).sort().forEach((name) => {
  const migration = readFileSync(new URL(name, migrationDirectory), 'utf8');
  migration.split('--> statement-breakpoint').map((statement) => statement.trim()).filter(Boolean)
    .forEach((statement) => db.database.exec(statement));
});

const identity = {
  username: 'TestPilot',
  playerId: '0123456789abcdef',
  token: '0123456789abcdef0123456789abcdef'
};

assert.equal(ADVENTURE_TARGETS.length, 24);
assert.equal(ADVENTURE_REWARDS.length, 24);
assert.equal(ADVENTURE_REWARDS[0], 30);
assert.equal(ADVENTURE_TARGETS[12], 94);
assert.equal(adventureTarget(25) > ADVENTURE_TARGETS[23], true);
assert.equal(adventureReward(25) > ADVENTURE_REWARDS[23], true);

const post = (url, body, headers = {}) => new Request(url, {
  method: 'POST',
  headers: { 'content-type': 'application/json', ...headers },
  body: JSON.stringify(body)
});

const deleteRequest = (url, body, headers = {}) => new Request(url, {
  method: 'DELETE',
  headers: { 'content-type': 'application/json', ...headers },
  body: JSON.stringify(body)
});

const adminRow = db.database.prepare(`SELECT id FROM players WHERE is_admin = 1`).get();
assert.equal(typeof adminRow?.id, 'string');
const adminIdentity = {
  playerId: adminRow.id,
  token: 'adminsessiontoken0000000000000001'
};
db.database.prepare(`INSERT INTO player_sessions (token_hash, player_id) VALUES (?, ?)`)
  .run(createHash('sha256').update(adminIdentity.token).digest('hex'), adminIdentity.playerId);

const rejectedName = await register(post('https://game.test/api/register', {
  username: 'amk', playerId: 'fedcba9876543210', token: 'fedcba9876543210fedcba9876543210'
}), db);
assert.equal(rejectedName.status, 400);
assert.equal((await rejectedName.json()).error, 'Kullanıcı adı argo veya hakaret içeremez.');

const passwordRegistered = await passwordAuth(post('https://game.test/api/auth', {
  action: 'register', username: 'AuthPilot', password: 'Orbit1234'
}), db);
assert.equal(passwordRegistered.status, 201);
const passwordRegisteredData = await passwordRegistered.json();
assert.equal(passwordRegisteredData.player.has_password, true);
assert.equal(typeof passwordRegisteredData.credentials.token, 'string');
const passwordLogin = await passwordAuth(post('https://game.test/api/auth', {
  action: 'login', username: 'authpilot', password: 'Orbit1234'
}), db);
assert.equal(passwordLogin.status, 200);
const passwordLoginData = await passwordLogin.json();
assert.notEqual(passwordLoginData.credentials.token, passwordRegisteredData.credentials.token);
const wrongPassword = await passwordAuth(post('https://game.test/api/auth', {
  action: 'login', username: 'AuthPilot', password: 'Wrong1234'
}), db);
assert.equal(wrongPassword.status, 401);
const passwordLogout = await passwordAuth(post('https://game.test/api/auth', {
  action: 'logout', ...passwordLoginData.credentials
}), db);
assert.equal(passwordLogout.status, 200);

const accountHeaders = {
  'oai-authenticated-user-id': 'account-user-test-1',
  'oai-authenticated-user-email': 'pilot@example.com'
};
const registered = await register(post('https://game.test/api/register', identity, accountHeaders), db);
assert.equal(registered.status, 201);
const registeredData = await registered.json();
assert.equal(registeredData.player.unlocked_level, 1);
assert.equal(registeredData.player.selected_planet, 'mercury');
assert.equal(registeredData.player.selected_trail, 'mint');
assert.equal(registeredData.player.total_mastery_xp, 0);
assert.deepEqual(registeredData.player.owned_planets, ['mercury']);
assert.equal(registeredData.player.account_email, 'pilot@example.com');

const adminPlanet = await shop(post('https://game.test/api/shop', {
  ...adminIdentity, action: 'select', planetId: 'jupiter'
}), db);
assert.equal(adminPlanet.status, 200);
const adminPlayerData = (await adminPlanet.json()).player;
assert.equal(adminPlayerData.is_admin, true);
assert.equal(adminPlayerData.unlocked_level, 1000000);
assert.equal(adminPlayerData.coins, 999999);
assert.equal(adminPlayerData.owned_planets.length, 8);
assert.equal(adminPlayerData.score_rank, null);

const normalAdminAttempt = await adminPanel(post('https://game.test/api/admin', {
  ...identity, action: 'dashboard'
}), db);
assert.equal(normalAdminAttempt.status, 403);

const adminUnlockedAdventure = await submitScore(post('https://game.test/api/score', {
  ...adminIdentity, runId: 'adminlevel009999', score: 0, hits: 0, perfect: 0,
  bestPerfectStreak: 0, durationMs: 1200, mode: 'adventure', adventureLevel: 9999
}), db);
assert.equal(adminUnlockedAdventure.status, 200);

const restored = await accountProfile(new Request('https://game.test/api/account', { headers: accountHeaders }), db);
assert.equal(restored.status, 200);
const restoredData = await restored.json();
assert.equal(restoredData.player.id, identity.playerId);
assert.equal(restoredData.player.username, identity.username);

const locked = await submitScore(post('https://game.test/api/score', {
  ...identity, runId: 'lockedlevel000001', score: 0, hits: 0, perfect: 0,
  bestPerfectStreak: 0, durationMs: 1200, mode: 'adventure', adventureLevel: 2
}), db);
assert.equal(locked.status, 403);

const insufficientProgress = await submitScore(post('https://game.test/api/score', {
  ...identity, runId: 'partialprogress01', score: 0, hits: 4, perfect: 2,
  bestPerfectStreak: 2, durationMs: 8000, mode: 'adventure', adventureLevel: 1
}), db);
assert.equal(insufficientProgress.status, 200);
assert.equal((await insufficientProgress.json()).adventure_completed, false);

const levelOne = await submitScore(post('https://game.test/api/score', {
  ...identity, runId: 'adventurelevel01', score: 0, hits: 4, perfect: 3,
  bestPerfectStreak: 2, durationMs: 8000, mode: 'adventure', adventureLevel: 1
}), db);
assert.equal(levelOne.status, 200);
const levelOneData = await levelOne.json();
assert.equal(levelOneData.adventure_completed, true);
assert.equal(levelOneData.player.unlocked_level, 2);
assert.equal(levelOneData.player.highest_completed, 1);
assert.equal(levelOneData.coins_awarded, 30);
assert.equal(levelOneData.player.coins, 30);

for (let replay = 1; replay <= 9; replay += 1) {
  const response = await submitScore(post('https://game.test/api/score', {
    ...identity, runId: `replaylevel${String(replay).padStart(6, '0')}`, score: 0, hits: 3, perfect: 3,
    bestPerfectStreak: 3, durationMs: 8000, mode: 'adventure', adventureLevel: 1
  }), db);
  assert.equal(response.status, 200);
}

const purchase = await shop(post('https://game.test/api/shop', {
  ...identity, action: 'purchase', planetId: 'mars'
}), db);
assert.equal(purchase.status, 200);
const purchaseData = await purchase.json();
assert.equal(purchaseData.player.coins, 0);
assert.equal(purchaseData.player.selected_planet, 'mars');
assert.equal(purchaseData.player.owned_planets.includes('mars'), true);
assert.equal(purchaseData.player.adventure_games, 11);
assert.equal(purchaseData.player.classic_games, 0);

let levelTwelveData;
for (let level = 2; level <= 12; level += 1) {
  const target = ADVENTURE_TARGETS[level - 1];
  const response = await submitScore(post('https://game.test/api/score', {
    ...identity, runId: `unlocklevel${String(level).padStart(6, '0')}`, score: 0, hits: target, perfect: target,
    bestPerfectStreak: target, durationMs: 300000, mode: 'adventure', adventureLevel: level
  }), db);
  assert.equal(response.status, 200);
  levelTwelveData = await response.json();
}
assert.equal(levelTwelveData.player.highest_completed, 12);
assert.equal(levelTwelveData.player.unlocked_level, 13);

db.database.prepare('UPDATE adventure_progress SET unlocked_level = 25 WHERE player_id = ?').run(identity.playerId);
const levelTwentyFiveTarget = adventureTarget(25);
const levelTwentyFive = await submitScore(post('https://game.test/api/score', {
  ...identity, runId: 'dynamiclevel000025', score: 0, hits: levelTwentyFiveTarget, perfect: levelTwentyFiveTarget,
  bestPerfectStreak: levelTwentyFiveTarget, durationMs: 600000, mode: 'adventure', adventureLevel: 25
}), db);
assert.equal(levelTwentyFive.status, 200);
const levelTwentyFiveData = await levelTwentyFive.json();
assert.equal(levelTwentyFiveData.adventure_completed, true);
assert.equal(levelTwentyFiveData.player.unlocked_level, 26);
assert.equal(levelTwentyFiveData.coins_awarded, adventureReward(25));

const longClassic = await submitScore(post('https://game.test/api/score', {
  ...identity, runId: 'longclassic00001', score: 1440, hits: 12, perfect: 6,
  bestPerfectStreak: 4, durationMs: 180000, mode: 'classic', adventureLevel: 0
}), db);
assert.equal(longClassic.status, 200);
const longClassicData = await longClassic.json();
assert.equal(longClassicData.player.best_score, 1440);
assert.equal(longClassicData.player.total_play_ms >= 180000, true);
assert.equal(longClassicData.player.best_perfect_streak >= 4, true);
assert.equal(longClassicData.player.daily_quests.every((quest) => quest.completed), true);
assert.equal(longClassicData.player.total_mastery_xp >= 500, true);

const meteorRun = await submitScore(post('https://game.test/api/score', {
  ...identity, runId: 'meteorrun0000001', score: 2600, hits: 10, perfect: 5,
  bestPerfectStreak: 3, durationMs: 90000, mode: 'meteor', adventureLevel: 0
}), db);
assert.equal(meteorRun.status, 200);
const meteorRunData = await meteorRun.json();
assert.equal(meteorRunData.player.meteor_best, 2600);
assert.equal(meteorRunData.player.meteor_games, 1);
assert.equal(meteorRunData.player.meteor_rank, 1);
assert.equal(meteorRunData.coins_awarded, 4);
assert.equal(meteorRunData.mastery_earned, 0);

const lowerMeteorRun = await submitScore(post('https://game.test/api/score', {
  ...identity, runId: 'meteorrun0000002', score: 1900, hits: 8, perfect: 3,
  bestPerfectStreak: 2, durationMs: 75000, mode: 'meteor', adventureLevel: 0
}), db);
assert.equal(lowerMeteorRun.status, 200);
const lowerMeteorData = await lowerMeteorRun.json();
assert.equal(lowerMeteorData.player.meteor_best, 2600);
assert.equal(lowerMeteorData.player.meteor_games, 2);

const meteorBelowRecord = await liveScore(post('https://game.test/api/live-score', {
  ...identity, active: true, score: 2500, mode: 'meteor'
}), db);
assert.equal(meteorBelowRecord.status, 200);
const meteorUnchangedLeague = await leaderboard(new Request('https://game.test/api/leaderboard'), db);
assert.equal((await meteorUnchangedLeague.json()).meteor_live_players.length, 0);

const meteorRecordLive = await liveScore(post('https://game.test/api/live-score', {
  ...identity, active: true, score: 3000, mode: 'meteor'
}), db);
assert.equal(meteorRecordLive.status, 200);
const meteorLiveLeague = await leaderboard(new Request('https://game.test/api/leaderboard'), db);
const meteorLiveLeagueData = await meteorLiveLeague.json();
assert.equal(meteorLiveLeagueData.meteor_players[0].best_score, 2600);
assert.equal(meteorLiveLeagueData.meteor_players[0].games_played, 2);
assert.equal(meteorLiveLeagueData.meteor_live_players[0].score, 3000);

const selectVoidTrail = await progression(post('https://game.test/api/progression', {
  ...identity, action: 'select_trail', trailId: 'void'
}), db);
assert.equal(selectVoidTrail.status, 200);
assert.equal((await selectVoidTrail.json()).player.selected_trail, 'void');

const claimLaunch = await progression(post('https://game.test/api/progression', {
  ...identity, action: 'claim_daily', questId: 'launch'
}), db);
assert.equal(claimLaunch.status, 200);
assert.equal((await claimLaunch.json()).reward, 45);
const duplicateClaim = await progression(post('https://game.test/api/progression', {
  ...identity, action: 'claim_daily', questId: 'launch'
}), db);
assert.equal(duplicateClaim.status, 200);
assert.equal((await duplicateClaim.json()).reward, 0);

const belowRecordLive = await liveScore(post('https://game.test/api/live-score', {
  ...identity, active: true, score: 777
}), db);
assert.equal(belowRecordLive.status, 200);
const unchangedScoreLeague = await leaderboard(new Request('https://game.test/api/leaderboard?metric=score'), db);
assert.equal((await unchangedScoreLeague.json()).live_players.length, 0);

const live = await liveScore(post('https://game.test/api/live-score', {
  ...identity, active: true, score: 1500
}), db);
assert.equal(live.status, 200);

const adminClassic = await submitScore(post('https://game.test/api/score', {
  ...adminIdentity, runId: 'adminclassic0001', score: 4000, hits: 10, perfect: 5,
  bestPerfectStreak: 3, durationMs: 120000, mode: 'classic', adventureLevel: 0
}), db);
assert.equal(adminClassic.status, 200);
const adminLive = await liveScore(post('https://game.test/api/live-score', {
  ...adminIdentity, active: true, score: 4000, mode: 'classic'
}), db);
assert.equal(adminLive.status, 200);

const scoreLeague = await leaderboard(new Request('https://game.test/api/leaderboard?metric=score'), db);
const scoreLeagueData = await scoreLeague.json();
assert.equal(scoreLeagueData.players[0].username, identity.username);
assert.equal(scoreLeagueData.players[0].best_score, 1440);
assert.equal(scoreLeagueData.players[0].games_played, 1);
assert.equal(scoreLeagueData.live_players[0].score, 1500);
assert.equal(scoreLeagueData.live_players[0].best_score, 1440);
assert.equal(scoreLeagueData.weekly_players[0].username, identity.username);
assert.equal(scoreLeagueData.weekly_players[0].best_score, 1440);
assert.equal(scoreLeagueData.meteor_players[0].best_score, 2600);
assert.equal(scoreLeagueData.meteor_players[0].games_played, 2);
assert.equal(scoreLeagueData.players.some((player) => player.username.toLowerCase() === 'gokhan'), false);
assert.equal(scoreLeagueData.live_players.some((player) => player.username.toLowerCase() === 'gokhan'), false);
assert.equal(scoreLeagueData.weekly_players.some((player) => player.username.toLowerCase() === 'gokhan'), false);
assert.match(scoreLeagueData.week_ends_at, /^\d{4}-\d{2}-\d{2}T/);

const dashboard = await adminPanel(post('https://game.test/api/admin', {
  ...adminIdentity, action: 'dashboard'
}), db);
assert.equal(dashboard.status, 200);
const dashboardData = await dashboard.json();
assert.equal(dashboardData.stats.active_players, 1);
assert.equal(dashboardData.stats.played_players >= 1, true);
assert.equal(dashboardData.users.some((player) => player.username.toLowerCase() === 'gokhan'), false);

const disposableIdentity = {
  username: 'DeleteMe', playerId: 'deleteplayer00001', token: 'deleteplayer00001deleteplayer00001'
};
assert.equal((await register(post('https://game.test/api/register', disposableIdentity), db)).status, 201);
const adminDeleted = await adminPanel(post('https://game.test/api/admin', {
  ...adminIdentity, action: 'delete_player', targetPlayerId: disposableIdentity.playerId
}), db);
assert.equal(adminDeleted.status, 200);
assert.equal(db.database.prepare('SELECT COUNT(*) AS count FROM players WHERE id = ?').get(disposableIdentity.playerId).count, 0);
const deletedStatus = await accountStatus(post('https://game.test/api/account-status', disposableIdentity), db);
assert.equal(deletedStatus.status, 200);
assert.deepEqual(await deletedStatus.json(), { deleted: true, username: disposableIdentity.username });
const deletedRegister = await register(post('https://game.test/api/register', disposableIdentity), db);
assert.equal(deletedRegister.status, 410);
assert.equal((await deletedRegister.json()).account_deleted, true);

const protectedAdminDelete = await deleteAccount(deleteRequest('https://game.test/api/account', {
  ...adminIdentity, confirmation: 'DELETE_ACCOUNT', confirmUsername: 'gokhan'
}), db);
assert.equal(protectedAdminDelete.status, 403);

const stopLive = await liveScore(post('https://game.test/api/live-score', {
  ...identity, active: false, score: 0
}), db);
assert.equal(stopLive.status, 200);
const afterStop = await leaderboard(new Request('https://game.test/api/leaderboard'), db);
assert.equal((await afterStop.json()).live_players.length, 0);

const unauthenticatedDelete = await deleteAccount(deleteRequest('https://game.test/api/account', {
  ...identity, token: 'ffffffffffffffffffffffffffffffff', confirmation: 'DELETE_ACCOUNT', confirmUsername: identity.username
}), db);
assert.equal(unauthenticatedDelete.status, 401);

const wrongAccountDelete = await deleteAccount(deleteRequest('https://game.test/api/account', {
  ...identity, confirmation: 'DELETE_ACCOUNT', confirmUsername: identity.username
}, { 'oai-authenticated-user-id': 'another-account' }), db);
assert.equal(wrongAccountDelete.status, 401);

const mismatchedDelete = await deleteAccount(deleteRequest('https://game.test/api/account', {
  ...identity, confirmation: 'DELETE_ACCOUNT', confirmUsername: 'WrongPilot'
}, accountHeaders), db);
assert.equal(mismatchedDelete.status, 422);

const deleted = await deleteAccount(deleteRequest('https://game.test/api/account', {
  ...identity, confirmation: 'DELETE_ACCOUNT', confirmUsername: identity.username
}, accountHeaders), db);
assert.equal(deleted.status, 200);
assert.deepEqual(await deleted.json(), { deleted: true });

const afterDelete = await accountProfile(new Request('https://game.test/api/account', { headers: accountHeaders }), db);
assert.equal(afterDelete.status, 200);
assert.equal((await afterDelete.json()).player, null);
for (const table of ['players', 'runs', 'live_scores', 'adventure_progress', 'player_wallets', 'player_planets', 'daily_claims', 'planet_mastery', 'player_sessions', 'deleted_account_sessions']) {
  const row = db.database.prepare(`SELECT COUNT(*) AS count FROM ${table} WHERE ${table === 'players' ? 'id' : 'player_id'} = ?`).get(identity.playerId);
  assert.equal(row.count, 0, `${table} should be cleared after account deletion`);
}

const legacyIdentity = {
  username: 'LegacyPilot', playerId: 'legacyplayer00001', token: 'legacyplayer00001legacyplayer00001'
};
assert.equal((await register(post('https://game.test/api/register', legacyIdentity), db)).status, 201);
const emailOnlyHeaders = { 'oai-authenticated-user-email': 'legacy@example.com' };
const linkedLegacy = await register(post('https://game.test/api/register', legacyIdentity, emailOnlyHeaders), db);
assert.equal(linkedLegacy.status, 200);
assert.equal((await linkedLegacy.json()).player.account_email, 'legacy@example.com');
const legacyPasswordMissing = await passwordAuth(post('https://game.test/api/auth', {
  action: 'login', username: legacyIdentity.username, password: 'Legacy1234'
}), db);
assert.equal(legacyPasswordMissing.status, 409);
const legacyPasswordSet = await passwordAuth(post('https://game.test/api/auth', {
  action: 'set_password', ...legacyIdentity, password: 'Legacy1234'
}), db);
assert.equal(legacyPasswordSet.status, 200);
assert.equal((await legacyPasswordSet.json()).player.has_password, true);
const legacyPasswordLogin = await passwordAuth(post('https://game.test/api/auth', {
  action: 'login', username: legacyIdentity.username, password: 'Legacy1234'
}), db);
assert.equal(legacyPasswordLogin.status, 200);
const restoredLegacy = await accountProfile(new Request('https://game.test/api/account', { headers: emailOnlyHeaders }), db);
assert.equal((await restoredLegacy.json()).player.username, legacyIdentity.username);
const legacyDeleted = await deleteAccount(deleteRequest('https://game.test/api/account', {
  ...legacyIdentity, token: '', confirmation: 'DELETE_ACCOUNT', confirmUsername: legacyIdentity.username
}, emailOnlyHeaders), db);
assert.equal(legacyDeleted.status, 200);

console.log('league-flow: ok');
