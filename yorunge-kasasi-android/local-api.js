(() => {
  'use strict';

  const storageKey = 'yorunge-mobile-state-v1';
  const planets = [
    { id: 'mercury', cost: 0 }, { id: 'mars', cost: 300 }, { id: 'venus', cost: 650 },
    { id: 'earth', cost: 1100 }, { id: 'neptune', cost: 1700 }, { id: 'uranus', cost: 2500 },
    { id: 'saturn', cost: 3600 }, { id: 'jupiter', cost: 5000 }
  ];
  const quests = [
    { id: 'launch', metric: 'games', goal: 3, reward: 45 },
    { id: 'precision', metric: 'perfect', goal: 20, reward: 70 },
    { id: 'score', metric: 'best_score', goal: 1200, reward: 90 }
  ];
  const nativeFetch = window.fetch.bind(window);

  function loadState() {
    try { return JSON.parse(localStorage.getItem(storageKey) || 'null'); }
    catch (_) { return null; }
  }

  let state = loadState();

  function saveState() {
    localStorage.setItem(storageKey, JSON.stringify(state));
  }

  function randomKey(bytes) {
    const values = new Uint8Array(bytes);
    crypto.getRandomValues(values);
    return [...values].map((value) => value.toString(16).padStart(2, '0')).join('');
  }

  function validPassword(password) {
    return typeof password === 'string' && password.length >= 8 && password.length <= 64
      && /\p{L}/u.test(password) && /\d/.test(password);
  }

  async function passwordHash(password) {
    const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(password));
    return [...new Uint8Array(digest)].map((value) => value.toString(16).padStart(2, '0')).join('');
  }

  function json(data, status = 200) {
    return Promise.resolve(new Response(JSON.stringify(data), {
      status,
      headers: { 'content-type': 'application/json', 'cache-control': 'no-store' }
    }));
  }

  function bodyOf(options) {
    try { return options?.body ? JSON.parse(options.body) : {}; }
    catch (_) { return {}; }
  }

  function dayKey(date = new Date()) {
    return date.toISOString().slice(0, 10);
  }

  function recentRuns() {
    return Array.isArray(state?.runs) ? state.runs : [];
  }

  function dailyQuests() {
    const today = dayKey();
    const runs = recentRuns().filter((run) => dayKey(new Date(run.createdAt)) === today);
    const metrics = {
      games: runs.length,
      perfect: runs.reduce((sum, run) => sum + Number(run.perfect || 0), 0),
      best_score: Math.max(0, ...runs.filter((run) => run.mode === 'classic').map((run) => Number(run.score || 0)))
    };
    const claimed = new Set(state?.dailyClaims?.[today] || []);
    return quests.map((quest) => {
      const progress = Math.min(quest.goal, Math.max(0, Number(metrics[quest.metric]) || 0));
      return { ...quest, progress, completed: progress >= quest.goal, claimed: claimed.has(quest.id) };
    });
  }

  function publicPlayer() {
    if (!state?.player) return null;
    const player = state.player;
    const meteorRuns = recentRuns().filter((run) => run.mode === 'meteor');
    const meteorBest = Math.max(0, ...meteorRuns.map((run) => Number(run.score || 0)));
    return {
      id: player.id,
      username: player.username,
      best_score: Number(player.best_score) || 0,
      total_score: Number(player.total_score) || 0,
      games_played: Number(player.classic_games) || 0,
      classic_games: Number(player.classic_games) || 0,
      meteor_games: meteorRuns.length,
      meteor_best: meteorBest,
      meteor_rank: meteorBest > 0 ? 1 : null,
      total_games: (Number(player.classic_games) || 0) + meteorRuns.length,
      perfect_hits: Number(player.perfect_hits) || 0,
      best_perfect_streak: Number(player.best_perfect_streak) || 0,
      total_play_ms: Number(player.total_play_ms) || 0,
      created_at: player.created_at,
      account_email: null,
      has_password: Boolean(player.password_hash),
      score_rank: 1,
      coins: Number(player.coins) || 0,
      selected_planet: player.selected_planet || 'mercury',
      owned_planets: Array.isArray(player.owned_planets) ? player.owned_planets : ['mercury'],
      daily_quests: dailyQuests(),
      daily_quest_day: dayKey()
    };
  }

  function createPlayer(data) {
    state = {
      player: {
        id: data.playerId,
        token: data.token,
        username: data.username,
        best_score: 0,
        total_score: 0,
        classic_games: 0,
        perfect_hits: 0,
        best_perfect_streak: 0,
        total_play_ms: 0,
        created_at: new Date().toISOString(),
        coins: 0,
        selected_planet: 'mercury',
        owned_planets: ['mercury']
      },
      runs: [],
      dailyClaims: {}
    };
    saveState();
  }

  function authenticated(data) {
    return Boolean(state?.player && data.playerId === state.player.id && data.token === state.player.token);
  }

  function register(data) {
    if (!state?.player) createPlayer(data);
    if (!authenticated(data) || String(data.username).toLocaleLowerCase('tr-TR') !== state.player.username.toLocaleLowerCase('tr-TR')) {
      return json({ error: 'Bu kullanıcı adı alınmış.' }, 409);
    }
    return json({ player: publicPlayer() }, 201);
  }

  async function auth(data) {
    const action = String(data.action || '');
    if (action === 'logout') return json({ signed_out: true });
    if (action === 'set_password') {
      if (!authenticated(data)) return json({ error: 'Oyuncu doğrulanamadı.' }, 401);
      if (!validPassword(data.password)) return json({ error: 'Şifre en az 8 karakter olmalı; bir harf ve bir sayı içermeli.' }, 400);
      state.player.password_hash = await passwordHash(data.password);
      saveState();
      return json({ player: publicPlayer(), password_updated: true });
    }
    const username = String(data.username || '').trim();
    if (!/^[A-Za-z0-9_]{3,16}$/.test(username)) return json({ error: 'Kullanıcı adı 3–16 karakter; yalnızca harf, sayı ve _ kullan.' }, 400);
    if (!validPassword(data.password)) return json({ error: 'Şifre en az 8 karakter olmalı; bir harf ve bir sayı içermeli.' }, 400);
    if (action === 'register') {
      if (state?.player) return json({ error: 'Bu kullanıcı adı alınmış. Giriş yapmayı dene.' }, 409);
      const credentials = { playerId: randomKey(16), token: randomKey(32) };
      createPlayer({ username, ...credentials });
      state.player.password_hash = await passwordHash(data.password);
      saveState();
      return json({ player: publicPlayer(), credentials }, 201);
    }
    if (action === 'login') {
      if (!state?.player?.password_hash) return json({ error: 'Bu eski hesapta şifre yok. Açık olan eski oturumdan şifre oluştur.' }, 409);
      if (state.player.username.toLocaleLowerCase('tr-TR') !== username.toLocaleLowerCase('tr-TR')
          || state.player.password_hash !== await passwordHash(data.password)) {
        return json({ error: 'Kullanıcı adı veya şifre hatalı.' }, 401);
      }
      return json({ player: publicPlayer(), credentials: { playerId: state.player.id, token: state.player.token } });
    }
    return json({ error: 'Geçersiz giriş isteği.' }, 400);
  }

  function submitScore(data) {
    if (!authenticated(data)) return json({ error: 'Oyuncu doğrulanamadı.' }, 401);
    if (recentRuns().some((run) => run.runId === data.runId)) {
      return json({ player: publicPlayer(), duplicate: true, coins_awarded: 0 });
    }
    const player = state.player;
    const mode = data.mode === 'meteor' ? 'meteor' : 'classic';
    const score = Math.max(0, Math.round(Number(data.score) || 0));
    const hits = Math.max(0, Math.round(Number(data.hits) || 0));
    const perfect = Math.max(0, Math.round(Number(data.perfect) || 0));
    const bestChain = Math.max(0, Math.round(Number(data.bestPerfectStreak) || 0));
    const durationMs = Math.max(800, Math.round(Number(data.durationMs) || 800));
    player.perfect_hits += perfect;
    player.best_perfect_streak = Math.max(player.best_perfect_streak, bestChain);
    player.total_play_ms += durationMs;
    if (mode === 'classic') {
      player.classic_games += 1;
      player.best_score = Math.max(player.best_score, score);
      player.total_score += score;
    }
    let coinsAwarded = 0;
    if (mode === 'meteor') {
      coinsAwarded = Math.min(35, Math.floor(score / 650));
      player.coins += coinsAwarded;
    }
    state.runs.push({ runId: data.runId, mode, score, hits, perfect, createdAt: new Date().toISOString() });
    if (state.runs.length > 5000) state.runs.splice(0, state.runs.length - 5000);
    saveState();
    return json({
      player: publicPlayer(),
      coins_awarded: coinsAwarded
    });
  }

  function shop(data) {
    if (!authenticated(data)) return json({ error: 'Oyuncu doğrulanamadı.' }, 401);
    const planet = planets.find((item) => item.id === data.planetId);
    if (!planet) return json({ error: 'Gezegen seçimi geçersiz.' }, 400);
    const player = state.player;
    const owned = player.owned_planets.includes(planet.id);
    if (data.action === 'purchase' && !owned) {
      if (player.coins < planet.cost) return json({ error: 'Yeterli jetonun yok.' }, 409);
      player.coins -= planet.cost;
      player.owned_planets.push(planet.id);
    } else if (data.action === 'select' && !owned) {
      return json({ error: 'Bu gezegen henüz satın alınmadı.' }, 403);
    }
    player.selected_planet = planet.id;
    saveState();
    return json({ player: publicPlayer() });
  }

  function progression(data) {
    if (!authenticated(data)) return json({ error: 'Oyuncu doğrulanamadı.' }, 401);
    if (data.action === 'claim_daily') {
      const quest = dailyQuests().find((item) => item.id === data.questId);
      if (!quest) return json({ error: 'Günlük görev bulunamadı.' }, 404);
      if (!quest.completed) return json({ error: 'Bu günlük görev henüz tamamlanmadı.' }, 409);
      const today = dayKey();
      state.dailyClaims[today] ||= [];
      let reward = 0;
      if (!state.dailyClaims[today].includes(quest.id)) {
        state.dailyClaims[today].push(quest.id);
        state.player.coins += quest.reward;
        reward = quest.reward;
      }
      saveState();
      return json({ player: publicPlayer(), reward });
    }
    return json({ error: 'Geçersiz ilerleme isteği.' }, 400);
  }

  window.fetch = function mobileFetch(input, options = {}) {
    const rawUrl = typeof input === 'string' ? input : input.url;
    const url = new URL(rawUrl, window.location.href);
    if (!url.pathname.startsWith('/api/')) return nativeFetch(input, options);
    const data = bodyOf(options);
    if (url.pathname === '/api/auth') return auth(data);
    if (url.pathname === '/api/register') return register(data);
    if (url.pathname === '/api/score') return submitScore(data);
    if (url.pathname === '/api/shop') return shop(data);
    if (url.pathname === '/api/progression') return progression(data);
    if (url.pathname === '/api/account-status') return json({ deleted: false, active: authenticated(data) });
    if (url.pathname === '/api/live-score') return json({ active: data.active !== false, score: Number(data.score) || 0 });
    if (url.pathname === '/api/leaderboard') {
      const player = publicPlayer();
      const row = player && (player.best_score > 0 || player.classic_games > 0)
        ? [{ username: player.username, best_score: player.best_score, games_played: player.classic_games }]
        : [];
      const meteorRow = player && (player.meteor_best > 0 || player.meteor_games > 0)
        ? [{ username: player.username, best_score: player.meteor_best, games_played: player.meteor_games }]
        : [];
      return json({ players: row, meteor_players: meteorRow, live_players: [], meteor_live_players: [] });
    }
    if (url.pathname === '/api/account' && String(options.method || 'GET').toUpperCase() === 'POST') {
      if (!authenticated(data)) return json({ error: 'Oyuncu doğrulanamadı.' }, 401);
      if (data.confirmation !== 'DELETE_ACCOUNT' || String(data.confirmUsername).toLocaleLowerCase('tr-TR') !== state.player.username.toLocaleLowerCase('tr-TR')) {
        return json({ error: 'Kullanıcı adı doğrulanamadı.' }, 422);
      }
      localStorage.removeItem(storageKey);
      state = null;
      return json({ deleted: true });
    }
    if (url.pathname === '/api/account') return json({ account: null, player: null });
    return json({ error: 'Geçersiz istek.' }, 404);
  };
})();
