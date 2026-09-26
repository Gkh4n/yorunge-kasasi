type PlayerRecord = {
  id: string;
  username: string;
  best_score: number;
  total_score: number;
  games_played: number;
  perfect_hits: number;
  best_perfect_streak: number;
  total_play_ms: number;
  account_user_id: string | null;
  account_email: string | null;
  created_at: string;
  token_hash: string;
  password_salt?: string | null;
  password_hash?: string | null;
  is_admin: number;
};

type AuthenticatedAccount = {
  id: string;
  email: string;
  emailId: string;
};

type AdventureProgress = {
  unlocked_level: number;
  highest_completed: number;
};

type Wallet = {
  coins: number;
  selected_planet: string;
  selected_trail: string;
};

type MasteryRecord = {
  planet_id: string;
  mastery_xp: number;
  games_played: number;
  perfect_hits: number;
};

type DailyMetric = 'games' | 'perfect' | 'hits' | 'best_score';

type DailyQuest = {
  id: string;
  metric: DailyMetric;
  goal: number;
  reward: number;
};

export const GALAXY_SIZE = 12;
export const ADVENTURE_TARGETS = [3, 5, 8, 12, 17, 23, 30, 38, 47, 57, 68, 80,
  94, 109, 125, 142, 160, 179, 199, 220, 242, 265, 289, 315] as const;
export const ADVENTURE_REWARDS = [30, 45, 65, 85, 115, 150, 190, 235, 290, 350, 420, 500,
  600, 720, 850, 1000, 1175, 1375, 1600, 1850, 2150, 2500, 2900, 3400] as const;
export const MAX_ADVENTURE_LEVEL = 1_000_000;

export function adventureTarget(level: number) {
  if (level <= ADVENTURE_TARGETS.length) return ADVENTURE_TARGETS[level - 1];
  const extra = level - ADVENTURE_TARGETS.length;
  return Math.min(5000, Math.round(315 + extra * 22 + Math.pow(extra, 1.12) * 3));
}

export function adventureReward(level: number) {
  if (level <= ADVENTURE_REWARDS.length) return ADVENTURE_REWARDS[level - 1];
  const extra = level - ADVENTURE_REWARDS.length;
  return Math.min(10000, Math.round(3400 + extra * 155 + Math.sqrt(extra) * 90));
}

export const TRAILS = [
  { id: 'mint', masteryXp: 0 },
  { id: 'solar', masteryXp: 40 },
  { id: 'plasma', masteryXp: 120 },
  { id: 'ice', masteryXp: 250 },
  { id: 'void', masteryXp: 500 }
] as const;

export const DAILY_QUESTS: readonly DailyQuest[] = [
  { id: 'launch', metric: 'games', goal: 3, reward: 45 },
  { id: 'precision', metric: 'perfect', goal: 20, reward: 70 },
  { id: 'score', metric: 'best_score', goal: 1200, reward: 90 }
] as const;
export const PLANETS = [
  { id: 'mercury', cost: 0 },
  { id: 'mars', cost: 300 },
  { id: 'venus', cost: 650 },
  { id: 'earth', cost: 1100 },
  { id: 'neptune', cost: 1700 },
  { id: 'uranus', cost: 2500 },
  { id: 'saturn', cost: 3600 },
  { id: 'jupiter', cost: 5000 }
] as const;

const LEGACY_PLANETS = [
  ['lime', 'mercury'],
  ['ember', 'mars'],
  ['ocean', 'venus'],
  ['violet', 'earth'],
  ['solar', 'neptune'],
  ['frost', 'uranus']
] as const;

const PROHIBITED_USERNAME_PARTS = ['amina', 'aminak', 'orospu', 'siktir', 'sikik', 'siker', 'sikeyim', 'sokarim', 'yarrak', 'pezevenk', 'kahpe', 'ibne', 'gavat', 'gotveren', 'gerizekali', 'dangalak', 'salak', 'aptal', 'fuck', 'shit', 'bitch', 'asshole', 'cunt', 'pussy', 'bastard'];
const PROHIBITED_USERNAME_EXACT = new Set(['amk', 'aq', 'oc', 'pic', 'mal']);

const reply = (data: unknown, status = 200) => Response.json(data, {
  status,
  headers: { 'cache-control': 'no-store', 'x-content-type-options': 'nosniff' }
});

async function tokenHash(token: string) {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(token));
  return [...new Uint8Array(digest)].map((value) => value.toString(16).padStart(2, '0')).join('');
}

function randomHex(bytes: number) {
  const values = new Uint8Array(bytes);
  crypto.getRandomValues(values);
  return [...values].map((value) => value.toString(16).padStart(2, '0')).join('');
}

function validPassword(value: unknown): value is string {
  return typeof value === 'string' && value.length >= 8 && value.length <= 64
    && /\p{L}/u.test(value) && /\d/.test(value);
}

async function derivePasswordHash(password: string, salt: string) {
  const key = await crypto.subtle.importKey(
    'raw', new TextEncoder().encode(password), { name: 'PBKDF2' }, false, ['deriveBits']
  );
  const bits = await crypto.subtle.deriveBits({
    name: 'PBKDF2', hash: 'SHA-256', salt: new TextEncoder().encode(salt), iterations: 100000
  }, key, 256);
  return [...new Uint8Array(bits)].map((value) => value.toString(16).padStart(2, '0')).join('');
}

function hashesMatch(left: string, right: string) {
  if (left.length !== right.length) return false;
  let mismatch = 0;
  for (let index = 0; index < left.length; index += 1) mismatch |= left.charCodeAt(index) ^ right.charCodeAt(index);
  return mismatch === 0;
}

async function createSession(db: D1Database, playerId: string) {
  const token = randomHex(32);
  const hash = await tokenHash(token);
  await db.prepare(`INSERT INTO player_sessions (token_hash, player_id) VALUES (?, ?)`)
    .bind(hash, playerId).run();
  return { playerId, token };
}

async function deletedAccountForToken(db: D1Database, playerId: unknown, token: unknown) {
  if (!validIdentity(playerId, 16, 64) || !validIdentity(token, 24, 96)) return null;
  const hash = await tokenHash(token);
  return db.prepare(`SELECT username, deleted_at FROM deleted_account_sessions
    WHERE player_id = ? AND token_hash = ? AND deleted_at >= datetime('now', '-30 days')`)
    .bind(playerId, hash).first<{ username: string; deleted_at: string }>();
}

async function loginAttemptKey(request: Request, username: string) {
  const address = request.headers.get('cf-connecting-ip')?.trim() || 'unknown';
  return tokenHash(`${username.toLocaleLowerCase('tr-TR')}|${address}`);
}

async function recordLoginFailure(db: D1Database, attemptKey: string) {
  await db.prepare(`INSERT INTO auth_attempts (attempt_key, failure_count, window_started_at)
    VALUES (?, 1, CURRENT_TIMESTAMP)
    ON CONFLICT(attempt_key) DO UPDATE SET
      failure_count = CASE WHEN window_started_at < datetime('now', '-15 minutes') THEN 1 ELSE failure_count + 1 END,
      window_started_at = CASE WHEN window_started_at < datetime('now', '-15 minutes') THEN CURRENT_TIMESTAMP ELSE window_started_at END`)
    .bind(attemptKey).run();
}

function validIdentity(value: unknown, min: number, max: number): value is string {
  return typeof value === 'string' && value.length >= min && value.length <= max && /^[A-Za-z0-9_]+$/.test(value);
}

function usernameHasAbuse(username: string) {
  const normalized = username.toLocaleLowerCase('tr-TR')
    .replaceAll('_', '')
    .replaceAll('0', 'o')
    .replaceAll('1', 'i')
    .replaceAll('3', 'e')
    .replaceAll('4', 'a')
    .replaceAll('5', 's')
    .replaceAll('7', 't');
  return PROHIBITED_USERNAME_EXACT.has(normalized) || PROHIBITED_USERNAME_PARTS.some((part) => normalized.includes(part));
}

function authenticatedAccount(request: Request): AuthenticatedAccount | null {
  const headerId = request.headers.get('oai-authenticated-user-id')?.trim() || '';
  const email = request.headers.get('oai-authenticated-user-email')?.trim() || '';
  const emailId = email ? `email:${email.toLocaleLowerCase('en-US')}` : '';
  const id = headerId || emailId;
  return id ? { id, email, emailId } : null;
}

function accountMatches(account: AuthenticatedAccount, accountUserId: string | null) {
  return Boolean(accountUserId && (accountUserId === account.id || accountUserId === account.emailId));
}

async function readBody(request: Request): Promise<Record<string, unknown>> {
  const size = Number(request.headers.get('content-length') || 0);
  if (size > 4096) throw new Error('PAYLOAD_TOO_LARGE');
  return request.json() as Promise<Record<string, unknown>>;
}

function sqlTimestamp(date: Date) {
  return date.toISOString().slice(0, 19).replace('T', ' ');
}

function currentDayWindow(now = new Date()) {
  const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const end = new Date(start.getTime() + 86400000);
  return { key: start.toISOString().slice(0, 10), start: sqlTimestamp(start), end: sqlTimestamp(end) };
}

function currentWeekWindow(now = new Date()) {
  const dayStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const mondayOffset = (dayStart.getUTCDay() + 6) % 7;
  const start = new Date(dayStart.getTime() - mondayOffset * 86400000);
  const end = new Date(start.getTime() + 7 * 86400000);
  return { start: sqlTimestamp(start), end: sqlTimestamp(end), endsAt: end.toISOString() };
}

function masteryLevel(xp: number) {
  return Math.max(1, Math.floor(Math.sqrt(Math.max(0, xp) / 18)) + 1);
}

function weeklyTier(score: number) {
  if (score >= 20000) return 'galactic';
  if (score >= 10000) return 'platinum';
  if (score >= 5000) return 'gold';
  if (score >= 2000) return 'silver';
  return 'bronze';
}

async function masteryState(db: D1Database, playerId: string) {
  const rows = await db.prepare(`SELECT planet_id, mastery_xp, games_played, perfect_hits
    FROM planet_mastery WHERE player_id = ? ORDER BY mastery_xp DESC, planet_id ASC`)
    .bind(playerId).all<MasteryRecord>();
  const mastery = rows.results.map((row) => ({ ...row, mastery_level: masteryLevel(Number(row.mastery_xp) || 0) }));
  const totalXp = mastery.reduce((sum, row) => sum + (Number(row.mastery_xp) || 0), 0);
  return {
    mastery,
    totalXp,
    unlockedTrails: TRAILS.filter((trail) => totalXp >= trail.masteryXp).map((trail) => trail.id)
  };
}

async function dailyQuestState(db: D1Database, playerId: string) {
  const day = currentDayWindow();
  const stats = await db.prepare(`SELECT COUNT(*) AS games,
    COALESCE(SUM(perfect), 0) AS perfect,
    COALESCE(SUM(hits), 0) AS hits,
    COALESCE(MAX(CASE WHEN mode = 'classic' THEN score ELSE 0 END), 0) AS best_score
    FROM runs WHERE player_id = ? AND created_at >= ? AND created_at < ?`)
    .bind(playerId, day.start, day.end).first<Record<DailyMetric, number>>();
  const claims = await db.prepare(`SELECT quest_id FROM daily_claims WHERE player_id = ? AND quest_day = ?`)
    .bind(playerId, day.key).all<{ quest_id: string }>();
  const claimed = new Set(claims.results.map((row) => row.quest_id));
  return {
    day: day.key,
    quests: DAILY_QUESTS.map((quest) => {
      const progress = Math.min(quest.goal, Math.max(0, Number(stats?.[quest.metric]) || 0));
      return { ...quest, progress, completed: progress >= quest.goal, claimed: claimed.has(quest.id) };
    })
  };
}

async function weeklyPlayerState(db: D1Database, playerId: string) {
  const week = currentWeekWindow();
  const stats = await db.prepare(`SELECT COALESCE(MAX(score), 0) AS score, COUNT(*) AS games
    FROM runs WHERE player_id = ? AND mode = 'classic' AND created_at >= ? AND created_at < ?`)
    .bind(playerId, week.start, week.end).first<{ score: number; games: number }>();
  const score = Number(stats?.score) || 0;
  const rank = score > 0
    ? await db.prepare(`SELECT COUNT(*) + 1 AS rank FROM (
        SELECT r.player_id, MAX(r.score) AS best_score FROM runs r
        JOIN players p ON p.id = r.player_id
        WHERE r.mode = 'classic' AND p.is_admin = 0 AND r.created_at >= ? AND r.created_at < ?
        GROUP BY r.player_id HAVING best_score > ?
      )`).bind(week.start, week.end, score).first<{ rank: number }>()
    : null;
  return {
    score,
    games: Number(stats?.games) || 0,
    rank: rank?.rank ?? null,
    tier: weeklyTier(score),
    ends_at: week.endsAt
  };
}

async function ensurePlayerAssets(db: D1Database, playerId: string) {
  const statements = [
    db.prepare(`INSERT OR IGNORE INTO player_wallets (player_id, coins, selected_planet)
      VALUES (?, 0, 'mercury')`).bind(playerId),
    ...LEGACY_PLANETS.map(([legacyId, planetId]) => db.prepare(`INSERT OR IGNORE INTO player_planets
      (player_id, planet_id, unlocked_at) SELECT player_id, ?, unlocked_at FROM player_planets
      WHERE player_id = ? AND planet_id = ?`).bind(planetId, playerId, legacyId)),
    ...LEGACY_PLANETS.map(([legacyId]) => db.prepare(`DELETE FROM player_planets
      WHERE player_id = ? AND planet_id = ?`).bind(playerId, legacyId)),
    db.prepare(`UPDATE player_wallets SET selected_planet = CASE selected_planet
      WHEN 'lime' THEN 'mercury' WHEN 'ember' THEN 'mars' WHEN 'ocean' THEN 'venus'
      WHEN 'violet' THEN 'earth' WHEN 'solar' THEN 'neptune' WHEN 'frost' THEN 'uranus'
      ELSE selected_planet END WHERE player_id = ?`).bind(playerId),
    db.prepare(`UPDATE player_wallets SET selected_trail = 'mint'
      WHERE player_id = ? AND selected_trail NOT IN ('mint', 'solar', 'plasma', 'ice', 'void')`).bind(playerId),
    db.prepare(`INSERT OR IGNORE INTO player_planets (player_id, planet_id)
      VALUES (?, 'mercury')`).bind(playerId),
    db.prepare(`INSERT OR IGNORE INTO planet_mastery (player_id, planet_id)
      VALUES (?, 'mercury')`).bind(playerId)
  ];
  await db.batch(statements);
}

async function authenticate(request: Request, db: D1Database, playerId: unknown, token: unknown) {
  const account = authenticatedAccount(request);
  if (account) {
    const linked = await db.prepare(`SELECT id, username, best_score, total_score, games_played,
      perfect_hits, best_perfect_streak, total_play_ms, account_user_id, account_email, created_at, token_hash, is_admin
      FROM players WHERE account_user_id = ? OR (? != '' AND account_user_id = ?)`)
      .bind(account.id, account.emailId, account.emailId).first<PlayerRecord>();
    if (linked && (typeof playerId !== 'string' || linked.id === playerId)) return linked;
  }
  if (!validIdentity(playerId, 16, 64) || !validIdentity(token, 24, 96)) return null;
  const hash = await tokenHash(token);
  const player = await db.prepare(`SELECT p.id, p.username, p.best_score, p.total_score, p.games_played,
    p.perfect_hits, p.best_perfect_streak, p.total_play_ms, p.account_user_id, p.account_email,
    p.created_at, p.token_hash, p.is_admin FROM player_sessions s JOIN players p ON p.id = s.player_id
    WHERE s.token_hash = ? AND p.id = ?`).bind(hash, playerId).first<PlayerRecord>();
  if (!player) return null;
  await db.prepare(`UPDATE player_sessions SET last_used_at = CURRENT_TIMESTAMP WHERE token_hash = ?`)
    .bind(hash).run();
  return player;
}

async function playerPublic(db: D1Database, id: string) {
  await ensurePlayerAssets(db, id);
  await db.prepare(`UPDATE adventure_progress SET unlocked_level = 13, updated_at = CURRENT_TIMESTAMP
    WHERE player_id = ? AND highest_completed >= 12 AND unlocked_level < 13`).bind(id).run();
  const player = await db.prepare(`SELECT id, username, best_score, total_score, games_played,
    perfect_hits, best_perfect_streak, total_play_ms, account_email, created_at, password_hash, is_admin
    FROM players WHERE id = ?`).bind(id).first<Omit<PlayerRecord, 'token_hash' | 'account_user_id'>>();
  if (!player) return null;
  const { password_hash: passwordHashValue, ...safePlayer } = player;
  const isAdmin = Boolean(player.is_admin);
  const scoreRank = isAdmin ? null : await db.prepare('SELECT COUNT(*) + 1 AS rank FROM players WHERE is_admin = 0 AND best_score > ?')
    .bind(player.best_score).first<{ rank: number }>();
  const progress = await db.prepare(`SELECT unlocked_level, highest_completed FROM adventure_progress
    WHERE player_id = ?`).bind(id).first<AdventureProgress>();
  const wallet = await db.prepare(`SELECT coins, selected_planet, selected_trail FROM player_wallets
    WHERE player_id = ?`).bind(id).first<Wallet>();
  const owned = await db.prepare(`SELECT planet_id FROM player_planets WHERE player_id = ?
    ORDER BY unlocked_at ASC`).bind(id).all<{ planet_id: string }>();
  const modeStats = await db.prepare(`SELECT
    SUM(CASE WHEN mode = 'classic' THEN 1 ELSE 0 END) AS classic_games,
    SUM(CASE WHEN mode = 'adventure' THEN 1 ELSE 0 END) AS adventure_games,
    SUM(CASE WHEN mode = 'meteor' THEN 1 ELSE 0 END) AS meteor_games,
    MAX(CASE WHEN mode = 'meteor' THEN score ELSE 0 END) AS meteor_best
    FROM runs WHERE player_id = ?`).bind(id).first<{ classic_games: number | null; adventure_games: number | null; meteor_games: number | null; meteor_best: number | null }>();
  const classicGames = Number(modeStats?.classic_games) || 0;
  const adventureGames = Number(modeStats?.adventure_games) || 0;
  const meteorGames = Number(modeStats?.meteor_games) || 0;
  const meteorBest = Number(modeStats?.meteor_best) || 0;
  const meteorRank = isAdmin || meteorBest <= 0 ? null : await db.prepare(`SELECT COUNT(*) + 1 AS rank FROM (
    SELECT r.player_id, MAX(r.score) AS best_score FROM runs r JOIN players p ON p.id = r.player_id
    WHERE r.mode = 'meteor' AND p.is_admin = 0 GROUP BY r.player_id
  ) WHERE best_score > ?`).bind(meteorBest).first<{ rank: number }>();
  const [mastery, daily, weekly] = await Promise.all([
    masteryState(db, id),
    dailyQuestState(db, id),
    weeklyPlayerState(db, id)
  ]);
  const unlockedTrails = isAdmin ? TRAILS.map((trail) => trail.id) : mastery.unlockedTrails;
  const selectedTrail = unlockedTrails.includes(wallet?.selected_trail || '')
    ? wallet?.selected_trail || 'mint'
    : 'mint';
  return {
    ...safePlayer,
    is_admin: isAdmin,
    has_password: Boolean(passwordHashValue),
    games_played: classicGames,
    classic_games: classicGames,
    adventure_games: adventureGames,
    meteor_games: meteorGames,
    meteor_best: meteorBest,
    meteor_rank: meteorRank?.rank ?? null,
    total_games: classicGames + adventureGames + meteorGames,
    score_rank: scoreRank?.rank ?? null,
    unlocked_level: isAdmin ? MAX_ADVENTURE_LEVEL : progress?.unlocked_level ?? 1,
    highest_completed: progress?.highest_completed ?? 0,
    coins: isAdmin ? 999999 : wallet?.coins ?? 0,
    selected_planet: wallet?.selected_planet ?? 'mercury',
    owned_planets: isAdmin ? PLANETS.map((planet) => planet.id) : owned.results.map((row) => row.planet_id),
    selected_trail: selectedTrail,
    unlocked_trails: unlockedTrails,
    total_mastery_xp: mastery.totalXp,
    planet_mastery: mastery.mastery,
    daily_quests: daily.quests,
    daily_quest_day: daily.day,
    weekly: isAdmin ? { ...weekly, rank: null } : weekly
  };
}

export async function register(request: Request, db: D1Database) {
  let body: Record<string, unknown>;
  try { body = await readBody(request); } catch { return reply({ error: 'Geçersiz istek.' }, 400); }
  const account = authenticatedAccount(request);
  if (account) {
    const linked = await db.prepare(`SELECT id FROM players
      WHERE account_user_id = ? OR (? != '' AND account_user_id = ?)`)
      .bind(account.id, account.emailId, account.emailId).first<{ id: string }>();
    if (linked) {
      await db.prepare(`UPDATE players SET account_user_id = ?, account_email = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?`).bind(account.id, account.email || null, linked.id).run();
      return reply({ player: await playerPublic(db, linked.id), restored: true });
    }
  }
  const username = typeof body.username === 'string' ? body.username.trim() : '';
  if (!validIdentity(username, 3, 16) || !validIdentity(body.playerId, 16, 64) || !validIdentity(body.token, 24, 96)) {
    return reply({ error: 'Kullanıcı adı 3–16 karakter; yalnızca harf, sayı ve _ kullan.' }, 400);
  }
  const deletedAccount = await deletedAccountForToken(db, body.playerId, body.token);
  if (deletedAccount) return reply({
    error: 'Bu hesap yönetici tarafından silindi.', account_deleted: true, username: deletedAccount.username
  }, 410);
  if (usernameHasAbuse(username)) return reply({ error: 'Kullanıcı adı argo veya hakaret içeremez.' }, 400);
  const existing = await db.prepare('SELECT id, account_user_id FROM players WHERE username = ? COLLATE NOCASE OR id = ?')
    .bind(username, body.playerId).first<{ id: string; account_user_id: string | null }>();
  if (existing) {
    if (existing.id !== body.playerId || !await authenticate(request, db, body.playerId, body.token)) {
      return reply({ error: 'Bu kullanıcı adı alınmış.' }, 409);
    }
    if (account && existing.account_user_id && !accountMatches(account, existing.account_user_id)) {
      return reply({ error: 'Bu oyuncu başka bir hesaba bağlı.' }, 409);
    }
    if (account) {
      await db.prepare(`UPDATE players SET account_user_id = ?, account_email = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?`).bind(account.id, account.email || null, existing.id).run();
    }
    return reply({ player: await playerPublic(db, body.playerId) });
  }
  const hash = await tokenHash(body.token);
  await db.prepare(`INSERT INTO players (id, username, token_hash, account_user_id, account_email)
    VALUES (?, ?, ?, ?, ?)`).bind(body.playerId, username, hash, account?.id || null, account?.email || null).run();
  await db.prepare(`INSERT INTO player_sessions (token_hash, player_id) VALUES (?, ?)`)
    .bind(hash, body.playerId).run();
  return reply({ player: await playerPublic(db, body.playerId) }, 201);
}

export async function passwordAuth(request: Request, db: D1Database) {
  let body: Record<string, unknown>;
  try { body = await readBody(request); } catch { return reply({ error: 'Geçersiz giriş isteği.' }, 400); }
  const action = typeof body.action === 'string' ? body.action : '';

  if (action === 'set_password') {
    if (!validPassword(body.password)) {
      return reply({ error: 'Şifre en az 8 karakter olmalı; bir harf ve bir sayı içermeli.' }, 400);
    }
    const player = await authenticate(request, db, body.playerId, body.token);
    if (!player) return reply({ error: 'Oyuncu doğrulanamadı.' }, 401);
    const salt = randomHex(16);
    const hash = await derivePasswordHash(body.password, salt);
    await db.prepare(`UPDATE players SET password_salt = ?, password_hash = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?`).bind(salt, hash, player.id).run();
    return reply({ player: await playerPublic(db, player.id), password_updated: true });
  }

  if (action === 'logout') {
    if (!validIdentity(body.playerId, 16, 64) || !validIdentity(body.token, 24, 96)) {
      return reply({ signed_out: true });
    }
    await db.prepare(`DELETE FROM player_sessions WHERE token_hash = ? AND player_id = ?`)
      .bind(await tokenHash(body.token), body.playerId).run();
    return reply({ signed_out: true });
  }

  const username = typeof body.username === 'string' ? body.username.trim() : '';
  if (!validIdentity(username, 3, 16)) {
    return reply({ error: 'Kullanıcı adı 3–16 karakter; yalnızca harf, sayı ve _ kullan.' }, 400);
  }
  if (!validPassword(body.password)) {
    return reply({ error: 'Şifre en az 8 karakter olmalı; bir harf ve bir sayı içermeli.' }, 400);
  }
  if (usernameHasAbuse(username)) return reply({ error: 'Kullanıcı adı argo veya hakaret içeremez.' }, 400);

  if (action === 'register') {
    const existing = await db.prepare(`SELECT id FROM players WHERE username = ? COLLATE NOCASE`)
      .bind(username).first<{ id: string }>();
    if (existing) return reply({ error: 'Bu kullanıcı adı alınmış. Giriş yapmayı dene.' }, 409);
    const playerId = randomHex(16);
    const passwordSalt = randomHex(16);
    const passwordHashValue = await derivePasswordHash(body.password, passwordSalt);
    const session = { playerId, token: randomHex(32) };
    const sessionHash = await tokenHash(session.token);
    const account = authenticatedAccount(request);
    try {
      await db.batch([
        db.prepare(`INSERT INTO players (id, username, token_hash, account_user_id, account_email, password_salt, password_hash)
          VALUES (?, ?, ?, ?, ?, ?, ?)`).bind(playerId, username, sessionHash, account?.id || null,
          account?.email || null, passwordSalt, passwordHashValue),
        db.prepare(`INSERT INTO player_sessions (token_hash, player_id) VALUES (?, ?)`)
          .bind(sessionHash, playerId)
      ]);
    } catch {
      return reply({ error: 'Bu kullanıcı adı alınmış. Giriş yapmayı dene.' }, 409);
    }
    return reply({ player: await playerPublic(db, playerId), credentials: session }, 201);
  }

  if (action === 'login') {
    const attemptKey = await loginAttemptKey(request, username);
    const attempt = await db.prepare(`SELECT failure_count,
      window_started_at >= datetime('now', '-15 minutes') AS active FROM auth_attempts WHERE attempt_key = ?`)
      .bind(attemptKey).first<{ failure_count: number; active: number }>();
    if (attempt?.active && Number(attempt.failure_count) >= 8) {
      return reply({ error: 'Çok fazla hatalı deneme. 15 dakika sonra tekrar dene.' }, 429);
    }
    const player = await db.prepare(`SELECT id, password_salt, password_hash FROM players
      WHERE username = ? COLLATE NOCASE`).bind(username)
      .first<{ id: string; password_salt: string | null; password_hash: string | null }>();
    if (player && !player.password_hash) {
      return reply({ error: 'Bu eski hesapta şifre yok. Açık olan eski oturumdan şifre oluştur.' }, 409);
    }
    const candidateHash = player?.password_salt
      ? await derivePasswordHash(body.password, player.password_salt)
      : await derivePasswordHash(body.password, 'missing-account');
    if (!player?.password_hash || !hashesMatch(candidateHash, player.password_hash)) {
      await recordLoginFailure(db, attemptKey);
      return reply({ error: 'Kullanıcı adı veya şifre hatalı.' }, 401);
    }
    await db.prepare(`DELETE FROM auth_attempts WHERE attempt_key = ?`).bind(attemptKey).run();
    const session = await createSession(db, player.id);
    return reply({ player: await playerPublic(db, player.id), credentials: session });
  }

  return reply({ error: 'Geçersiz giriş isteği.' }, 400);
}

export async function accountProfile(request: Request, db: D1Database) {
  const account = authenticatedAccount(request);
  if (!account) return reply({ error: 'Oturum bilgisi alınamadı.' }, 401);
  const linked = await db.prepare(`SELECT id FROM players
    WHERE account_user_id = ? OR (? != '' AND account_user_id = ?)`)
    .bind(account.id, account.emailId, account.emailId).first<{ id: string }>();
  if (!linked) return reply({ account: { email: account.email }, player: null });
  await db.prepare(`UPDATE players SET account_user_id = ?, account_email = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?`).bind(account.id, account.email || null, linked.id).run();
  return reply({ account: { email: account.email }, player: await playerPublic(db, linked.id) });
}

async function deletePlayerData(db: D1Database, playerId: string) {
  await db.batch([
    db.prepare('DELETE FROM live_scores WHERE player_id = ?').bind(playerId),
    db.prepare('DELETE FROM player_sessions WHERE player_id = ?').bind(playerId),
    db.prepare('DELETE FROM daily_claims WHERE player_id = ?').bind(playerId),
    db.prepare('DELETE FROM planet_mastery WHERE player_id = ?').bind(playerId),
    db.prepare('DELETE FROM player_planets WHERE player_id = ?').bind(playerId),
    db.prepare('DELETE FROM player_wallets WHERE player_id = ?').bind(playerId),
    db.prepare('DELETE FROM adventure_progress WHERE player_id = ?').bind(playerId),
    db.prepare('DELETE FROM runs WHERE player_id = ?').bind(playerId),
    db.prepare('DELETE FROM players WHERE id = ?').bind(playerId)
  ]);
}

async function recordAdminDeletion(db: D1Database, player: { id: string; username: string; token_hash: string }) {
  const sessions = await db.prepare('SELECT token_hash FROM player_sessions WHERE player_id = ?')
    .bind(player.id).all<{ token_hash: string }>();
  const hashes = [...new Set([player.token_hash, ...sessions.results.map((session) => session.token_hash)].filter(Boolean))];
  await db.batch([
    db.prepare(`DELETE FROM deleted_account_sessions WHERE deleted_at < datetime('now', '-30 days')`),
    db.prepare('DELETE FROM deleted_account_sessions WHERE player_id = ?').bind(player.id),
    ...hashes.map((hash) => db.prepare(`INSERT INTO deleted_account_sessions
      (player_id, token_hash, username) VALUES (?, ?, ?)`).bind(player.id, hash, player.username))
  ]);
}

export async function accountStatus(request: Request, db: D1Database) {
  let body: Record<string, unknown>;
  try { body = await readBody(request); } catch { return reply({ error: 'Geçersiz hesap durumu isteği.' }, 400); }
  const deletedAccount = await deletedAccountForToken(db, body.playerId, body.token);
  if (deletedAccount) return reply({ deleted: true, username: deletedAccount.username });
  const player = await authenticate(request, db, body.playerId, body.token);
  return reply({ deleted: false, active: Boolean(player) });
}

export async function deleteAccount(request: Request, db: D1Database) {
  let body: Record<string, unknown>;
  try { body = await readBody(request); } catch { return reply({ error: 'Geçersiz hesap silme isteği.' }, 400); }
  if (body.confirmation !== 'DELETE_ACCOUNT' || typeof body.confirmUsername !== 'string') {
    return reply({ error: 'Geçersiz hesap silme isteği.' }, 400);
  }
  const player = await authenticate(request, db, body.playerId, body.token);
  if (!player) return reply({ error: 'Oyuncu doğrulanamadı.' }, 401);
  if (player.is_admin) return reply({ error: 'Yönetici hesabı oyun içinden silinemez.' }, 403);
  const account = authenticatedAccount(request);
  if (account && player.account_user_id && !accountMatches(account, player.account_user_id)) {
    return reply({ error: 'Oyuncu doğrulanamadı.' }, 401);
  }
  if (body.confirmUsername.trim().toLocaleLowerCase('tr-TR') !== player.username.toLocaleLowerCase('tr-TR')) {
    return reply({ error: 'Kullanıcı adı doğrulanamadı.' }, 422);
  }
  await deletePlayerData(db, player.id);
  return reply({ deleted: true });
}

async function adminDashboard(db: D1Database, query = '') {
  const search = `%${query.slice(0, 16)}%`;
  const [stats, users] = await Promise.all([
    db.prepare(`SELECT
      (SELECT COUNT(*) FROM live_scores l JOIN players p ON p.id = l.player_id
        WHERE p.is_admin = 0 AND l.updated_at >= datetime('now', '-12 seconds')) AS active_players,
      (SELECT COUNT(*) FROM players WHERE is_admin = 0) AS registered_players,
      (SELECT COUNT(DISTINCT r.player_id) FROM runs r JOIN players p ON p.id = r.player_id
        WHERE p.is_admin = 0) AS played_players,
      (SELECT COUNT(*) FROM runs r JOIN players p ON p.id = r.player_id
        WHERE p.is_admin = 0 AND r.created_at >= date('now')) AS games_today`).first(),
    db.prepare(`SELECT p.id, p.username, p.best_score, p.created_at,
      SUM(CASE WHEN r.mode = 'classic' THEN 1 ELSE 0 END) AS classic_games,
      SUM(CASE WHEN r.mode = 'adventure' THEN 1 ELSE 0 END) AS adventure_games,
      COUNT(r.run_id) AS total_games, MAX(r.created_at) AS last_played_at,
      CASE WHEN EXISTS (SELECT 1 FROM live_scores l WHERE l.player_id = p.id
        AND l.updated_at >= datetime('now', '-12 seconds')) THEN 1 ELSE 0 END AS currently_active
      FROM players p LEFT JOIN runs r ON r.player_id = p.id
      WHERE p.is_admin = 0 AND p.username LIKE ? COLLATE NOCASE
      GROUP BY p.id, p.username, p.best_score, p.created_at
      ORDER BY currently_active DESC, COALESCE(last_played_at, p.created_at) DESC LIMIT 100`)
      .bind(search).all()
  ]);
  return { stats: stats || {}, users: users.results };
}

export async function adminPanel(request: Request, db: D1Database) {
  let body: Record<string, unknown>;
  try { body = await readBody(request); } catch { return reply({ error: 'Geçersiz yönetim isteği.' }, 400); }
  const admin = await authenticate(request, db, body.playerId, body.token);
  if (!admin?.is_admin) return reply({ error: 'Yönetici yetkisi gerekli.' }, 403);
  const action = typeof body.action === 'string' ? body.action : 'dashboard';
  if (action === 'delete_player') {
    const targetId = typeof body.targetPlayerId === 'string' ? body.targetPlayerId : '';
    if (!validIdentity(targetId, 16, 64)) return reply({ error: 'Oyuncu seçimi geçersiz.' }, 400);
    const target = await db.prepare('SELECT id, username, token_hash, is_admin FROM players WHERE id = ?')
      .bind(targetId).first<{ id: string; username: string; token_hash: string; is_admin: number }>();
    if (!target) return reply({ error: 'Oyuncu bulunamadı.' }, 404);
    if (target.is_admin) return reply({ error: 'Yönetici hesabı silinemez.' }, 403);
    await recordAdminDeletion(db, target);
    await deletePlayerData(db, target.id);
    return reply({ deleted: true, deleted_username: target.username, ...(await adminDashboard(db)) });
  }
  if (action !== 'dashboard') return reply({ error: 'Geçersiz yönetim işlemi.' }, 400);
  const query = typeof body.query === 'string' ? body.query.trim() : '';
  return reply(await adminDashboard(db, query));
}

export async function submitScore(request: Request, db: D1Database) {
  let body: Record<string, unknown>;
  try { body = await readBody(request); } catch { return reply({ error: 'Geçersiz skor verisi.' }, 400); }
  const score = Number(body.score);
  const hits = Number(body.hits);
  const perfect = Number(body.perfect);
  const bestPerfectStreak = Number(body.bestPerfectStreak);
  const durationMs = Number(body.durationMs);
  const mode = body.mode === 'adventure' ? 'adventure' : body.mode === 'classic' ? 'classic' : body.mode === 'meteor' ? 'meteor' : '';
  const adventureLevel = mode === 'adventure' ? Number(body.adventureLevel) : 0;
  if (!validIdentity(body.runId, 16, 64) || !mode
      || !Number.isInteger(score) || score < 0
      || !Number.isInteger(hits) || hits < 0 || hits > 100000
      || !Number.isInteger(perfect) || perfect < 0 || perfect > hits
      || !Number.isInteger(bestPerfectStreak) || bestPerfectStreak < 0 || bestPerfectStreak > perfect
      || !Number.isInteger(durationMs) || durationMs < 800 || durationMs > 86400000
      || (mode === 'adventure' && (!Number.isInteger(adventureLevel) || adventureLevel < 1 || adventureLevel > MAX_ADVENTURE_LEVEL))
      || (mode === 'adventure' && score !== 0)
      || score > hits * (mode === 'meteor' ? 1800 : 560)) return reply({ error: 'Skor doğrulanamadı.' }, 422);

  const player = await authenticate(request, db, body.playerId, body.token);
  if (!player) return reply({ error: 'Oyuncu doğrulanamadı.' }, 401);
  await ensurePlayerAssets(db, player.id);

  const progress = await db.prepare(`SELECT unlocked_level, highest_completed FROM adventure_progress
    WHERE player_id = ?`).bind(player.id).first<AdventureProgress>();
  const unlockedLevel = player.is_admin ? MAX_ADVENTURE_LEVEL : progress?.unlocked_level ?? 1;
  if (mode === 'adventure' && adventureLevel > unlockedLevel) return reply({ error: 'Bu macera bölümü henüz kilitli.' }, 403);

  const wallet = await db.prepare(`SELECT selected_planet FROM player_wallets WHERE player_id = ?`)
    .bind(player.id).first<{ selected_planet: string }>();
  const planetId = PLANETS.some((planet) => planet.id === wallet?.selected_planet) ? wallet?.selected_planet || 'mercury' : 'mercury';
  const target = mode === 'adventure' ? adventureTarget(adventureLevel) : 0;
  const perfectProgress = mode === 'adventure' ? perfect : bestPerfectStreak;
  const adventureCompleted = mode === 'adventure' && perfectProgress >= target;
  const inserted = await db.prepare(`INSERT OR IGNORE INTO runs
    (run_id, player_id, mode, adventure_level, best_perfect_streak, score, hits, perfect, duration_ms, planet_id, adventure_completed)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).bind(body.runId, player.id, mode, adventureLevel,
      perfectProgress, score, hits, perfect, durationMs, planetId, adventureCompleted ? 1 : 0).run();
  if (!inserted.meta.changes) return reply({ player: await playerPublic(db, player.id), duplicate: true, coins_awarded: 0 });

  if (mode === 'classic') {
    await db.prepare(`UPDATE players SET best_score = MAX(best_score, ?), total_score = total_score + ?,
      games_played = games_played + 1, perfect_hits = perfect_hits + ?,
      best_perfect_streak = MAX(best_perfect_streak, ?), total_play_ms = total_play_ms + ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?`).bind(score, score, perfect, bestPerfectStreak, durationMs, player.id).run();
  } else {
    await db.prepare(`UPDATE players SET perfect_hits = perfect_hits + ?,
      best_perfect_streak = MAX(best_perfect_streak, ?), total_play_ms = total_play_ms + ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?`).bind(perfect, perfectProgress, durationMs, player.id).run();
  }

  const masteryEarned = mode === 'meteor' ? 0 : Math.max(1, Math.min(5000,
    perfect * 2 + Math.floor(hits / 3) + (mode === 'classic' ? Math.floor(score / 500) : adventureCompleted ? 10 : 0)));
  if (masteryEarned > 0) {
    await db.prepare(`INSERT INTO planet_mastery (player_id, planet_id, mastery_xp, games_played, perfect_hits)
      VALUES (?, ?, ?, 1, ?) ON CONFLICT(player_id, planet_id) DO UPDATE SET
      mastery_xp = mastery_xp + excluded.mastery_xp,
      games_played = games_played + 1,
      perfect_hits = perfect_hits + excluded.perfect_hits,
      updated_at = CURRENT_TIMESTAMP`).bind(player.id, planetId, masteryEarned, perfect).run();
  }

  let coinsAwarded = 0;
  if (adventureCompleted) {
    const nextUnlocked = Math.min(MAX_ADVENTURE_LEVEL, adventureLevel + 1);
    coinsAwarded = adventureReward(adventureLevel);
    await db.batch([
      db.prepare(`INSERT INTO adventure_progress (player_id, unlocked_level, highest_completed)
        VALUES (?, ?, ?) ON CONFLICT(player_id) DO UPDATE SET
        unlocked_level = MAX(unlocked_level, excluded.unlocked_level),
        highest_completed = MAX(highest_completed, excluded.highest_completed),
        updated_at = CURRENT_TIMESTAMP`).bind(player.id, nextUnlocked, adventureLevel),
      db.prepare(`UPDATE player_wallets SET coins = coins + ?, updated_at = CURRENT_TIMESTAMP
        WHERE player_id = ?`).bind(coinsAwarded, player.id)
    ]);
  } else if (mode === 'meteor') {
    coinsAwarded = Math.min(35, Math.floor(score / 650));
    if (coinsAwarded > 0) {
      await db.prepare(`UPDATE player_wallets SET coins = coins + ?, updated_at = CURRENT_TIMESTAMP
        WHERE player_id = ?`).bind(coinsAwarded, player.id).run();
    }
  }

  return reply({
    player: await playerPublic(db, player.id),
    adventure_completed: adventureCompleted,
    completed_level: adventureCompleted ? adventureLevel : null,
    coins_awarded: coinsAwarded,
    mastery_earned: masteryEarned
  });
}

export async function leaderboard(_request: Request, db: D1Database) {
  const week = currentWeekWindow();
  const players = await db.prepare(`SELECT p.username, p.best_score, COUNT(r.run_id) AS games_played
    FROM players p LEFT JOIN runs r ON r.player_id = p.id AND r.mode = 'classic'
    WHERE p.is_admin = 0
    GROUP BY p.id, p.username, p.best_score, p.updated_at
    HAVING p.best_score > 0 OR games_played > 0
    ORDER BY p.best_score DESC, p.updated_at ASC LIMIT 20`).all();
  const livePlayers = await db.prepare(`SELECT p.username, p.best_score, l.score,
    (SELECT COUNT(*) FROM runs r WHERE r.player_id = p.id AND r.mode = 'classic') AS games_played,
    l.updated_at FROM live_scores l JOIN players p ON p.id = l.player_id
    WHERE p.is_admin = 0 AND l.mode = 'classic' AND l.updated_at >= datetime('now', '-25 seconds')
      AND l.score > p.best_score
    ORDER BY l.score DESC, l.updated_at DESC LIMIT 20`).all();
  const weeklyPlayers = await db.prepare(`SELECT p.username, MAX(r.score) AS best_score, COUNT(r.run_id) AS games_played
    FROM runs r JOIN players p ON p.id = r.player_id
    WHERE r.mode = 'classic' AND p.is_admin = 0 AND r.created_at >= ? AND r.created_at < ?
    GROUP BY p.id, p.username
    ORDER BY best_score DESC, MIN(r.created_at) ASC LIMIT 20`)
    .bind(week.start, week.end).all();
  const meteorPlayers = await db.prepare(`SELECT p.username, MAX(r.score) AS best_score, COUNT(r.run_id) AS games_played
    FROM runs r JOIN players p ON p.id = r.player_id
    WHERE r.mode = 'meteor' AND p.is_admin = 0
    GROUP BY p.id, p.username
    ORDER BY best_score DESC, MIN(r.created_at) ASC LIMIT 20`).all();
  const meteorLivePlayers = await db.prepare(`SELECT p.username,
    COALESCE((SELECT MAX(r.score) FROM runs r WHERE r.player_id = p.id AND r.mode = 'meteor'), 0) AS best_score,
    l.score, (SELECT COUNT(*) FROM runs r WHERE r.player_id = p.id AND r.mode = 'meteor') AS games_played,
    l.updated_at FROM live_scores l JOIN players p ON p.id = l.player_id
    WHERE p.is_admin = 0 AND l.mode = 'meteor' AND l.updated_at >= datetime('now', '-25 seconds')
      AND l.score > COALESCE((SELECT MAX(r.score) FROM runs r WHERE r.player_id = p.id AND r.mode = 'meteor'), 0)
    ORDER BY l.score DESC, l.updated_at DESC LIMIT 20`).all();
  return reply({
    players: players.results,
    meteor_players: meteorPlayers.results,
    weekly_players: weeklyPlayers.results,
    live_players: livePlayers.results,
    meteor_live_players: meteorLivePlayers.results,
    week_ends_at: week.endsAt
  });
}

export async function liveScore(request: Request, db: D1Database) {
  let body: Record<string, unknown>;
  try { body = await readBody(request); } catch { return reply({ error: 'Geçersiz canlı skor verisi.' }, 400); }
  const player = await authenticate(request, db, body.playerId, body.token);
  if (!player) return reply({ error: 'Oyuncu doğrulanamadı.' }, 401);
  if (body.active === false) {
    await db.prepare('DELETE FROM live_scores WHERE player_id = ?').bind(player.id).run();
    return reply({ active: false });
  }
  const score = Number(body.score);
  const mode = body.mode === 'meteor' ? 'meteor' : 'classic';
  if (!Number.isInteger(score) || score < 0 || score > 50000000) {
    return reply({ error: 'Canlı skor doğrulanamadı.' }, 422);
  }
  await db.batch([
    db.prepare(`INSERT INTO live_scores (player_id, score, mode, updated_at) VALUES (?, ?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(player_id) DO UPDATE SET score = excluded.score, mode = excluded.mode, updated_at = CURRENT_TIMESTAMP`)
      .bind(player.id, score, mode),
    db.prepare(`DELETE FROM live_scores WHERE updated_at < datetime('now', '-2 minutes')`)
  ]);
  return reply({ active: true, score });
}

export async function shop(request: Request, db: D1Database) {
  let body: Record<string, unknown>;
  try { body = await readBody(request); } catch { return reply({ error: 'Geçersiz mağaza isteği.' }, 400); }
  const player = await authenticate(request, db, body.playerId, body.token);
  if (!player) return reply({ error: 'Oyuncu doğrulanamadı.' }, 401);
  const action = body.action === 'purchase' ? 'purchase' : body.action === 'select' ? 'select' : '';
  const planetId = typeof body.planetId === 'string' ? body.planetId : '';
  const planet = PLANETS.find((item) => item.id === planetId);
  if (!action || !planet) return reply({ error: 'Gezegen seçimi geçersiz.' }, 400);
  await ensurePlayerAssets(db, player.id);
  const owned = await db.prepare(`SELECT 1 AS owned FROM player_planets
    WHERE player_id = ? AND planet_id = ?`).bind(player.id, planet.id).first<{ owned: number }>();

  if (player.is_admin && !owned) {
    await db.prepare(`INSERT OR IGNORE INTO player_planets (player_id, planet_id)
      VALUES (?, ?)`).bind(player.id, planet.id).run();
  }

  if (!player.is_admin && action === 'purchase' && !owned) {
    const paid = await db.prepare(`UPDATE player_wallets SET coins = coins - ?, updated_at = CURRENT_TIMESTAMP
      WHERE player_id = ? AND coins >= ?`).bind(planet.cost, player.id, planet.cost).run();
    if (!paid.meta.changes) return reply({ error: 'Yeterli jetonun yok.' }, 409);
    await db.prepare(`INSERT OR IGNORE INTO player_planets (player_id, planet_id)
      VALUES (?, ?)`).bind(player.id, planet.id).run();
  } else if (!player.is_admin && action === 'select' && !owned) {
    return reply({ error: 'Bu gezegen henüz satın alınmadı.' }, 403);
  }

  await db.prepare(`UPDATE player_wallets SET selected_planet = ?, updated_at = CURRENT_TIMESTAMP
    WHERE player_id = ?`).bind(planet.id, player.id).run();
  return reply({ player: await playerPublic(db, player.id) });
}

export async function progression(request: Request, db: D1Database) {
  let body: Record<string, unknown>;
  try { body = await readBody(request); } catch { return reply({ error: 'Geçersiz ilerleme isteği.' }, 400); }
  const player = await authenticate(request, db, body.playerId, body.token);
  if (!player) return reply({ error: 'Oyuncu doğrulanamadı.' }, 401);
  await ensurePlayerAssets(db, player.id);

  if (body.action === 'claim_daily') {
    const questId = typeof body.questId === 'string' ? body.questId : '';
    const daily = await dailyQuestState(db, player.id);
    const quest = daily.quests.find((item) => item.id === questId);
    if (!quest) return reply({ error: 'Günlük görev bulunamadı.' }, 404);
    if (!quest.completed) return reply({ error: 'Bu günlük görev henüz tamamlanmadı.' }, 409);
    const inserted = await db.prepare(`INSERT OR IGNORE INTO daily_claims (player_id, quest_day, quest_id)
      VALUES (?, ?, ?)`).bind(player.id, daily.day, quest.id).run();
    if (inserted.meta.changes) {
      await db.prepare(`UPDATE player_wallets SET coins = coins + ?, updated_at = CURRENT_TIMESTAMP
        WHERE player_id = ?`).bind(quest.reward, player.id).run();
    }
    return reply({ player: await playerPublic(db, player.id), reward: inserted.meta.changes ? quest.reward : 0 });
  }

  if (body.action === 'select_trail') {
    const trailId = typeof body.trailId === 'string' ? body.trailId : '';
    const mastery = await masteryState(db, player.id);
    if (!TRAILS.some((trail) => trail.id === trailId)) return reply({ error: 'Yörünge izi geçersiz.' }, 400);
    if (!player.is_admin && !mastery.unlockedTrails.includes(trailId)) return reply({ error: 'Bu yörünge izi henüz açılmadı.' }, 403);
    await db.prepare(`UPDATE player_wallets SET selected_trail = ?, updated_at = CURRENT_TIMESTAMP
      WHERE player_id = ?`).bind(trailId, player.id).run();
    return reply({ player: await playerPublic(db, player.id) });
  }

  return reply({ error: 'Geçersiz ilerleme isteği.' }, 400);
}
