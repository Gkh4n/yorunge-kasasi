(() => {
  const $ = (id) => document.getElementById(id);
  const els = {
    objective: $('objective'), objectiveLabel: $('objectiveLabel'), score: $('score'), scoreLabel: $('scoreLabel'), combo: $('combo'), comboLabel: $('comboLabel'),
    stash: $('stash'), runner: $('runner'), gate: $('gate'), gateAlt: $('gateAlt'), gateBadge: $('gateBadge'), callout: $('callout'), flash: $('flash'),
    bankBtn: $('bankBtn'), bankHint: $('bankHint'), intro: $('intro'), result: $('result'),
    startBtn: $('startBtn'), againBtn: $('againBtn'), homeBtn: $('homeBtn'), gameCard: $('gameCard'),
    arenaTap: $('arenaTap'), meteorField: $('meteorField'), meteorCatcher: $('meteorCatcher'), meteorSteer: $('meteorSteer'), finalScore: $('finalScore'), finalHits: $('finalHits'), resultGrid: $('resultGrid'),
    finalPerfect: $('finalPerfect'), finalBest: $('finalBest'), resultNote: $('resultNote'),
    finalHitsLabel: $('finalHitsLabel'), finalPerfectLabel: $('finalPerfectLabel'), finalBestLabel: $('finalBestLabel'),
    resultRank: $('resultRank'), resultEyebrow: $('resultEyebrow'), profileForm: $('profileForm'),
    usernameInput: $('usernameInput'), passwordInput: $('passwordInput'), loginBtn: $('loginBtn'), registerBtn: $('registerBtn'), guestBtn: $('guestBtn'),
    profileError: $('profileError'), profileSummary: $('profileSummary'),
    profileAvatar: $('profileAvatar'), profileName: $('profileName'), profileGames: $('profileGames'),
    profileRank: $('profileRank'), leaderRows: $('leaderRows'), leagueStatus: $('leagueStatus'),
    leagueUpdated: $('leagueUpdated'), settingsBtn: $('settingsBtn'), adminBtn: $('adminBtn'),
    homePlanetsBtn: $('homePlanetsBtn'), homeMissionsBtn: $('homeMissionsBtn'), homeSettingsBtn: $('homeSettingsBtn'),
    settingsSheet: $('settingsSheet'), shopSheet: $('shopSheet'), shopBtn: $('shopBtn'), coinCount: $('coinCount'),
    shopCoins: $('shopCoins'), planetGrid: $('planetGrid'), shopStatus: $('shopStatus'),
    powerBtn: $('powerBtn'), powerName: $('powerName'), powerHint: $('powerHint'),
    pauseBtn: $('pauseBtn'), pauseOverlay: $('pauseOverlay'), resumeBtn: $('resumeBtn'), resumeCountdown: $('resumeCountdown'), resumeCountdownValue: $('resumeCountdownValue'),
    planetInfoSheet: $('planetInfoSheet'),
    planetInfoTitle: $('planetInfoTitle'), planetInfoVisual: $('planetInfoVisual'), planetInfoSummary: $('planetInfoSummary'),
    planetDiameter: $('planetDiameter'), planetYear: $('planetYear'), planetFeature: $('planetFeature'), planetSource: $('planetSource'),
    restartBtn: $('restartBtn'), pauseHomeBtn: $('pauseHomeBtn'),
    profileSheet: $('profileSheet'), profileSheetTitle: $('profileSheetTitle'), profileSheetAvatar: $('profileSheetAvatar'),
    profileSheetName: $('profileSheetName'), profileAccountStatus: $('profileAccountStatus'), profileSheetRank: $('profileSheetRank'),
    profileBestScore: $('profileBestScore'), profileTotalGames: $('profileTotalGames'), profilePlayTime: $('profilePlayTime'),
    profileBestChain: $('profileBestChain'), profileCreatedAt: $('profileCreatedAt'),
    deleteAccountBtn: $('deleteAccountBtn'), deleteAccountSheet: $('deleteAccountSheet'), deleteConfirmInput: $('deleteConfirmInput'),
    deleteConfirmPrompt: $('deleteConfirmPrompt'), deleteUnderstand: $('deleteUnderstand'), confirmDeleteBtn: $('confirmDeleteBtn'),
    deleteAccountStatus: $('deleteAccountStatus'), passwordAccountBtn: $('passwordAccountBtn'), logoutBtn: $('logoutBtn'),
    passwordSheet: $('passwordSheet'), passwordForm: $('passwordForm'), newPasswordInput: $('newPasswordInput'),
    confirmPasswordInput: $('confirmPasswordInput'), passwordStatus: $('passwordStatus'), passwordSaveBtn: $('passwordSaveBtn'),
    dailySummary: $('dailySummary'), progressionSheet: $('progressionSheet'), dailyQuestList: $('dailyQuestList'),
    progressionStatus: $('progressionStatus'),
    adminSheet: $('adminSheet'), adminActivePlayers: $('adminActivePlayers'), adminPlayedPlayers: $('adminPlayedPlayers'),
    adminRegisteredPlayers: $('adminRegisteredPlayers'), adminGamesToday: $('adminGamesToday'), adminSearch: $('adminSearch'),
    adminRefreshBtn: $('adminRefreshBtn'), adminUserList: $('adminUserList'), adminStatus: $('adminStatus'),
    adminDeleteSheet: $('adminDeleteSheet'), adminDeleteName: $('adminDeleteName'), adminDeleteDialogStatus: $('adminDeleteDialogStatus'),
    adminDeleteCloseBtn: $('adminDeleteCloseBtn'), adminDeleteCancelBtn: $('adminDeleteCancelBtn'), adminDeleteConfirmBtn: $('adminDeleteConfirmBtn'),
    accountRemovedSheet: $('accountRemovedSheet'), accountRemovedName: $('accountRemovedName'),
    removedCreateBtn: $('removedCreateBtn'), removedLoginBtn: $('removedLoginBtn'),
    tutorialSheet: $('tutorialSheet'), tutorialKicker: $('tutorialKicker'), tutorialTitle: $('tutorialTitle'), tutorialNote: $('tutorialNote'),
    tutorialIcon: $('tutorialIcon'), tutorialSteps: $('tutorialSteps'), tutorialLaterBtn: $('tutorialLaterBtn'), tutorialStartBtn: $('tutorialStartBtn')
  };

  const TAU = Math.PI * 2;
  const radius = 124;
  const runnerRadius = 11.5;
  const classicGateWidth = 46;
  const meteorGateWidth = 52;
  const messages = {
    tr: {
      title: 'Yörünge Kasası', brand: 'YÖRÜNGE KASASI', brand_mark: 'Y', description: 'Yörünge Kasası — refleks, meteor fırtınası ve skor rekabeti.',
      settings_open: 'Ayarları aç', pause_label: 'Oyunu durdur', resume_label: 'Oyuna devam et', game_label: 'Yörünge Kasası oyunu', profile_open: 'Profili aç', admin_open: 'Yönetim panelini aç', admin_close: 'Yönetim panelini kapat',
      speed: 'Hız', vault: 'Kasa', streak: 'Seri', lives: 'Kalan hak', arena_label: 'Yakalamak için oyun alanına dokun',
      tap_hint: 'Gezegen kapıdayken dokun', tap_zone_title: 'OYUN ALANINA DOKUN', tap_zone_detail: 'Gezegeni kapının içinde yakala', energy_at_risk: 'riskteki enerji', bank: 'KASALA', use_power: 'KULLAN', coins: 'JETON', username: 'Kullanıcı adı', password: 'Şifre',
      login: 'GİRİŞ YAP', create_account: 'KAYIT OL', guest_play: 'MİSAFİR OYNA', login_processing: 'Giriş yapılıyor…', register_processing: 'Hesap oluşturuluyor…', player: 'Oyuncu', ranking: 'SIRALAMA', mode_select: 'Oyun modu seçimi', classic: 'KLASİK',
      classic_detail: '3 hak · sınırsız', meteor: 'METEOR YAĞMURU', meteor_detail: 'Kapıyı kaydır · meteorları yakala', meteor_arena_label: 'Kapıyı sağa sola sürükleyerek meteorları yakala', meteor_steer: 'KAPIYI SAĞA SOLA SÜRÜKLE',
      leaderboard_label: 'Skor sıralaması', score_league: 'SKOR LİGİ', classic_short: 'KLASİK', meteor_short: 'METEOR', now: 'Şimdi', player_col: 'OYUNCU', game_col: 'OYUN',
      score_col: 'SKOR', scores_loading: 'Skorlar yükleniyor…', game_completed: 'Oyun tamamlandı', score_saving: 'Skorun kaydediliyor…',
      hit: 'İsabet', perfect: 'Kusursuz', record: 'Rekor', play_again: 'TEKRAR OYNA', home: 'ANA SAYFA',
      paused_title: 'Oyun duraklatıldı', paused_note: 'Hazır olduğunda kaldığın yerden devam et.', resume: 'DEVAM ET', restart: 'YENİDEN BAŞLAT', return_home: 'ANA SAYFAYA DÖN', countdown_label: 'Oyun başlıyor',
      tutorial_later: 'ŞİMDİ DEĞİL', tutorial_start: 'OYUNA BAŞLA',
      tutorial_classic_kicker: 'İLK YÖRÜNGE', tutorial_classic_title: 'Klasik nasıl oynanır?', tutorial_classic_note: 'Doğru anda dokun, riskini yönet ve rekorunu büyüt.',
      tutorial_classic_step_1: 'Gezegen kapının içine geldiğinde oyun alanına dokun.', tutorial_classic_step_2: 'Üç isabetten sonra enerjiyi kasalayarak puanını güvene al.', tutorial_classic_step_3: 'Üç kez kaçırırsan oyun biter; kusursuz yakalamalar hızı azaltır.',
      tutorial_meteor_kicker: 'İLK FIRTINA', tutorial_meteor_title: 'Meteor Yağmuru nasıl oynanır?', tutorial_meteor_note: 'Halkayı yönet, meteorları kaçırma ve mümkün olduğunca uzun dayan.',
      tutorial_meteor_step_1: 'Parmağını sağa sola sürükleyerek halkayı meteorların altına getir.', tutorial_meteor_step_2: 'Altın meteor daha çok puan, yeşil meteor kaybettiğin bir hakkı geri verir.', tutorial_meteor_step_3: 'Üç meteor kaçarsa oyun biter; hız zamanla artar fakat bir noktadan sonra yavaşlar.',
      settings: 'Ayarlar', settings_close: 'Ayarları kapat', theme: 'Tema', dark: 'Karanlık', light: 'Aydınlık', sound: 'Ses',
      on: 'Açık', off: 'Kapalı', language: 'Dil', planets: 'Gezegenler', missions: 'Görevler', game_menu: 'Oyun menüsü', missions_close: 'Görevleri kapat',
      missions_intro: 'Üç kısa hedefi tamamla, jetonlarını al ve yeni gezegenlerin kilidini aç.', planet_info: 'BİLGİ', shop_sort: 'jeton', shop_close: 'Mağazayı kapat',
      planet_info_close: 'Gezegen bilgisini kapat', real_planet: 'GERÇEK GEZEGEN', diameter: 'ÇAP', year_length: '1 YIL',
      signature_fact: 'ÖNE ÇIKAN', nasa_source: 'NASA’DA İNCELE ↗',
      player_profile: 'OYUNCU PROFİLİ', profile_close: 'Profili kapat', account_management: 'Hesap Yönetimi',
      account_management_note: 'Şifreni, oturumunu ve oyun verilerini yönet.', password_manage: 'ŞİFRE OLUŞTUR', password_change: 'ŞİFREYİ DEĞİŞTİR', sign_out: 'ÇIKIŞ YAP',
      password_manage_title: 'Şifre Oluştur veya Değiştir', password_manage_close: 'Şifre ekranını kapat', new_password: 'Yeni şifre', confirm_password: 'Şifreyi tekrar yaz',
      password_rule: 'En az 8 karakter, bir harf ve bir sayı.', save_password: 'ŞİFREYİ KAYDET', password_mismatch: 'Şifreler birbiriyle aynı değil.',
      password_saving: 'Şifre kaydediliyor…', password_saved: 'Şifren kaydedildi. Artık başka cihazlardan giriş yapabilirsin.', signed_out: 'Hesaptan çıkış yapıldı.',
      delete_account: 'HESABI SİL', permanent_action: 'KALICI İŞLEM',
      delete_account_title: 'Hesabı silmek istiyor musun?', delete_account_close: 'Hesap silme ekranını kapat',
      delete_account_warning: 'Profilin, skorların, ilerlemen, jetonların, gezegenlerin ve oyun geçmişin kalıcı olarak silinir. Bu işlem geri alınamaz.',
      delete_confirm_prompt: 'Onaylamak için {username} yaz.', delete_understand: 'Tüm oyun verilerimin kalıcı olarak silineceğini anlıyorum.',
      cancel: 'VAZGEÇ', confirm_delete: 'KALICI OLARAK SİL', deleting_account: 'Hesap siliniyor…', account_deleted: 'Hesabın ve tüm oyun verilerin silindi.',
      score_rank: 'SKOR SIRASI', best_score: 'EN İYİ SKOR', total_games: 'OYUN SAYISI', play_time: 'OYUN SÜRESİ', classic_games: 'KLASİK OYUN',
      meteor_games: 'METEOR OYUNU', meteor_record: 'METEOR REKORU', total_perfect: 'KUSURSUZ', best_perfect_chain: 'KUSURSUZ REKORU',
      daily_reset: 'Her gün yenilenir', member_since: 'OYUNCU OLDU', account_linked: 'Hesaba kaydedildi · {email}', account_password: 'Kullanıcı adı ve şifreyle korunuyor', account_legacy: 'Şifre oluşturulmamış eski hesap',
      account_conflict: 'Bu oyuncu başka bir hesaba bağlı.', admin_panel: 'Yönetim Paneli', admin_only: 'YALNIZCA YÖNETİCİ', active_now: 'ŞİMDİ AKTİF', played_ever: 'BUGÜNE KADAR OYNAYAN', registered_players: 'KAYITLI OYUNCU', games_today: 'BUGÜNKÜ OYUN', search_player: 'Oyuncu ara', refresh: 'YENİLE', admin_loading: 'Oyuncular yükleniyor…', admin_empty: 'Oyuncu bulunamadı.', admin_live: 'AKTİF', admin_user_meta: '{games} oyun · Rekor {score} · Son: {last}', admin_delete: 'SİL', admin_deleted: '{username} hesabı silindi.', admin_account: 'Yönetici hesabı · Liglerde görünmez', admin_result: 'Yönetici testi · Skor liglere yansımaz', admin_delete_close: 'Silme onayını kapat', admin_delete_kicker: 'OYUNCU HESABI', admin_delete_title_suffix: 'silinsin mi?', admin_delete_message: 'Bu oyuncunun skorları, gezegenleri, ilerlemesi ve tüm oyun geçmişi kalıcı olarak silinecek.', admin_delete_irreversible: 'Bu işlem geri alınamaz.', admin_delete_button: 'HESABI SİL', admin_deleting: 'Hesap siliniyor…', account_removed_kicker: 'HESAP BİLDİRİMİ', account_removed_title: 'Hesabınız silindi', account_removed_message: 'hesabı yönetici tarafından silindi. Bu hesaba ait oyun verilerine artık erişilemez.', create_new_account: 'YENİ HESAP AÇ', sign_in_other: 'BAŞKA HESABA GİR', account_removed_by_admin: 'Önceki hesabınız yönetici tarafından silindi.', create_account_hint: 'Yeni kullanıcı adı ve şifre belirleyerek hesap oluştur.', sign_in_other_hint: 'Başka bir hesabın kullanıcı adı ve şifresiyle giriş yap.',
      minute_short: '{minutes} dk', hour_minute_short: '{hours} sa {minutes} dk', less_than_minute: '1 dk’dan az',
      guest_status: 'Giriş yap, hesap oluştur veya misafir olarak oyna.', guest_name: 'Misafir', guest_profile_detail: 'Skor ligine dahil olmaz · Hesaba geçmek için dokun', guest_ready: 'Misafir modu · Skorların lige gönderilmez.', guest_result: 'Misafir oyunu · Skor ligine gönderilmedi', network_error: 'Bağlantı kurulamadı.', profile_loading: 'Bilgiler yükleniyor…',
      password_invalid: 'Şifre en az 8 karakter olmalı; bir harf ve bir sayı içermeli.', wrong_credentials: 'Kullanıcı adı veya şifre hatalı.',
      legacy_password_missing: 'Bu eski hesapta şifre yok. Açık olan eski oturumdan şifre oluştur.', too_many_attempts: 'Çok fazla hatalı deneme. 15 dakika sonra tekrar dene.',
      profile_meteor: '{games} Meteor oyunu · Rekor {record}', profile_classic: '{games} Klasik oyun · Rekor {record}',
      ready: 'Modunu seç ve başla.', start_meteor: 'METEOR YAĞMURUNU BAŞLAT', start_classic: 'KLASİĞİ BAŞLAT',
      first_score: 'İlk skoru sen oluştur.', rank_up: 'Yükseldi', rank_down: 'Geriledi', scores_unavailable: 'Skorlar şu anda alınamıyor.',
      username_invalid: '3–16 karakter; harf, sayı veya _ kullan.', username_inappropriate: 'Bu kullanıcı adı argo veya hakaret içeremez.', need_username: 'Önce bir kullanıcı adı seç.', selected: 'SEÇİLİ', use: 'KULLAN',
      coin_price: '{cost} JETON', planet_switching: 'Gezegen değiştiriliyor…', purchasing: 'Satın alınıyor…',
      planet_selected: '{planet} seçildi.', planet_purchased: '{planet} satın alındı ve seçildi.',
      not_enough_coins_detail: 'Yetersiz jeton. {planet} için {needed} jeton daha gerekiyor.',
      power_used: 'Bu oyundaki güç kullanıldı', power_classic_used: 'Her 3 kusursuzda otomatik devreye girer', power_ready: 'Hazır · maç başına 1 kullanım', power_classic_ready: 'Başlangıç gücü hazır · önce sen kullan', power_active: '{power} AKTİF',
      bank_secure: '{energy} enerjiyi güvene al', bank_more: 'Kasalamak için {count} isabet daha', empty_pass: 'BOŞ GEÇTİ · HIZLANDI',
      perfect_gain: 'KUSURSUZ +{gain}', golden_gain: 'ALTIN KAPI +{gain}', golden_guard: 'ALTIN KAPI · +1 KORUMA', good_gain: 'İYİ +{gain}',
      shield_speed: 'KALKAN KORUDU · HIZLANDI', shield: 'KALKAN KORUDU', lost_energy: 'KAÇTI · {lost} YANDI',
      missed_speed: 'KAÇTI · HIZLANDI', missed: 'KAÇTI', banked: 'KASADA +{total}', direction_changed: 'YÖRÜNGE TERSİNE DÖNDÜ',
      classic_result_rank: 'Klasik ligi #{rank} · {games} oyun', meteor_result_rank: 'Meteor ligi #{rank} · {games} oyun', meteor_reward: '+{reward} jeton · hayatta kalma ödülü',
      classic_completed: 'Klasik oyun tamamlandı', meteor_completed: 'Meteor koşusu tamamlandı', personal_best: 'Yeni kişisel rekor!', lives_out: 'Üç hakkın tükendi.',
      gate_drift: 'HAREKETLİ', gate_pulse: 'NABIZ', gate_twin: 'ÇİFT KAPI', gate_blink: 'GÖLGE', gate_gold: 'ALTIN', gate_hazard: 'METEOR', storm_level: 'FIRTINA', meteor_score: 'SKOR', meteor_caught: 'METEOR +{gain}', meteor_gold: 'ALTIN METEOR +{gain}', meteor_life: '+1 HAK · +{gain}', meteor_blue: 'MAVİ METEOR +{gain}', meteor_missed: 'METEOR KAÇTI',
      quest_launch: 'Yörüngeye Çık', quest_launch_detail: 'Bugün {goal} oyun oyna', quest_precision: 'Keskin Nişancı', quest_precision_detail: 'Bugün {goal} kusursuz yakala', quest_score: 'Skor Avı', quest_score_detail: 'Klasikte {goal} skora ulaş',
      claim: 'AL', claimed: 'ALINDI', in_progress: '{progress}/{goal}', quest_rewarded: '+{reward} jeton hesabına eklendi', quest_locked: 'Görev henüz tamamlanmadı.',
      planet_mercury: 'Merkür', power_mercury: 'Odak', detail_mercury: 'Mevcut kapıyı %30 genişletir.',
      planet_mars: 'Mars', power_mars: 'Toz Kalkanı', detail_mars: 'Bir hatalı dokunuşu engeller.',
      planet_venus: 'Venüs', power_venus: 'Atmosfer', detail_venus: 'Sonraki 3 kapıyı %30 genişletir.',
      planet_earth: 'Dünya', power_earth: 'Denge', detail_earth: 'Yörüngeyi 6 sn %20 yavaşlatır.',
      planet_neptune: 'Neptün', power_neptune: 'Derin Soğuk', detail_neptune: 'Yörüngeyi 6 sn %35 yavaşlatır.',
      planet_uranus: 'Uranüs', power_uranus: 'Eksen Kayması', detail_uranus: 'Sonraki 2 isabeti kusursuz sayar.',
      planet_saturn: 'Satürn', power_saturn: 'Halka Kalkanı', detail_saturn: 'İki hatalı dokunuşu engeller.',
      planet_jupiter: 'Jüpiter', power_jupiter: 'Büyük Fırtına', detail_jupiter: '7 sn yavaşlatır, 3 kapıyı açar ve 1 hata korur.'
    },
    en: {
      title: 'Orbit Vault', brand: 'ORBIT VAULT', brand_mark: 'O', description: 'Orbit Vault — reflexes, meteor storms, and score competition.',
      settings_open: 'Open settings', pause_label: 'Pause game', resume_label: 'Resume game', game_label: 'Orbit Vault game', profile_open: 'Open profile', admin_open: 'Open admin panel', admin_close: 'Close admin panel',
      speed: 'Speed', vault: 'Vault', streak: 'Streak', lives: 'Lives remaining', arena_label: 'Tap the game area to catch',
      tap_hint: 'Tap when the planet reaches the gate', tap_zone_title: 'TAP THE PLAY AREA', tap_zone_detail: 'Catch the planet inside the gate', energy_at_risk: 'energy at risk', bank: 'BANK', use_power: 'USE', coins: 'COINS', username: 'Username', password: 'Password',
      login: 'SIGN IN', create_account: 'CREATE ACCOUNT', guest_play: 'PLAY AS GUEST', login_processing: 'Signing in…', register_processing: 'Creating account…', player: 'Player', ranking: 'RANK', mode_select: 'Game mode selection', classic: 'CLASSIC',
      classic_detail: '3 lives · endless', meteor: 'METEOR STORM', meteor_detail: 'Slide the gate · catch meteors', meteor_arena_label: 'Slide the gate left and right to catch meteors', meteor_steer: 'DRAG THE GATE LEFT AND RIGHT',
      leaderboard_label: 'Score leaderboard', score_league: 'SCORE LEAGUE', classic_short: 'CLASSIC', meteor_short: 'METEOR', now: 'Now', player_col: 'PLAYER', game_col: 'GAMES',
      score_col: 'SCORE', scores_loading: 'Loading scores…', game_completed: 'Game complete', score_saving: 'Saving your score…',
      hit: 'Hits', perfect: 'Perfect', record: 'Record', play_again: 'PLAY AGAIN', home: 'HOME',
      paused_title: 'Game paused', paused_note: 'Resume from the same point when you are ready.', resume: 'RESUME', restart: 'RESTART', return_home: 'RETURN HOME', countdown_label: 'Game starting',
      tutorial_later: 'NOT NOW', tutorial_start: 'START GAME',
      tutorial_classic_kicker: 'FIRST ORBIT', tutorial_classic_title: 'How does Classic work?', tutorial_classic_note: 'Tap at the right moment, manage your risk, and build your record.',
      tutorial_classic_step_1: 'Tap the play area when the planet moves inside the gate.', tutorial_classic_step_2: 'After three hits, bank the energy to secure your score.', tutorial_classic_step_3: 'Three misses end the run; perfect catches reduce the speed.',
      tutorial_meteor_kicker: 'FIRST STORM', tutorial_meteor_title: 'How does Meteor Storm work?', tutorial_meteor_note: 'Control the ring, catch the meteors, and survive as long as possible.',
      tutorial_meteor_step_1: 'Drag left and right to place the ring beneath falling meteors.', tutorial_meteor_step_2: 'Gold gives more points; green restores one lost life.', tutorial_meteor_step_3: 'Three misses end the run; speed rises but its growth slows later.',
      settings: 'Settings', settings_close: 'Close settings', theme: 'Theme', dark: 'Dark', light: 'Light', sound: 'Sound',
      on: 'On', off: 'Off', language: 'Language', planets: 'Planets', missions: 'Missions', game_menu: 'Game menu', missions_close: 'Close missions',
      missions_intro: 'Complete three short goals, collect your coins, and unlock new planets.', planet_info: 'INFO', shop_sort: 'coins', shop_close: 'Close planet shop',
      planet_info_close: 'Close planet information', real_planet: 'REAL PLANET', diameter: 'DIAMETER', year_length: '1 YEAR',
      signature_fact: 'HIGHLIGHT', nasa_source: 'EXPLORE ON NASA ↗',
      player_profile: 'PLAYER PROFILE', profile_close: 'Close profile', account_management: 'Account Management',
      account_management_note: 'Manage your password, session, and game data.', password_manage: 'CREATE PASSWORD', password_change: 'CHANGE PASSWORD', sign_out: 'SIGN OUT',
      password_manage_title: 'Create or Change Password', password_manage_close: 'Close password screen', new_password: 'New password', confirm_password: 'Repeat password',
      password_rule: 'At least 8 characters with one letter and one number.', save_password: 'SAVE PASSWORD', password_mismatch: 'Passwords do not match.',
      password_saving: 'Saving password…', password_saved: 'Password saved. You can now sign in on another device.', signed_out: 'You have signed out.',
      delete_account: 'DELETE ACCOUNT', permanent_action: 'PERMANENT ACTION',
      delete_account_title: 'Delete your account?', delete_account_close: 'Close account deletion',
      delete_account_warning: 'Your profile, scores, progress, coins, planets, and game history will be permanently deleted. This cannot be undone.',
      delete_confirm_prompt: 'Type {username} to confirm.', delete_understand: 'I understand that all my game data will be permanently deleted.',
      cancel: 'CANCEL', confirm_delete: 'DELETE PERMANENTLY', deleting_account: 'Deleting account…', account_deleted: 'Your account and all game data have been deleted.',
      score_rank: 'SCORE RANK', best_score: 'BEST SCORE', total_games: 'TOTAL GAMES', play_time: 'PLAY TIME', classic_games: 'CLASSIC GAMES',
      meteor_games: 'METEOR GAMES', meteor_record: 'METEOR RECORD', total_perfect: 'PERFECT HITS', best_perfect_chain: 'PERFECT RECORD',
      daily_reset: 'Refreshes every day', member_since: 'JOINED', account_linked: 'Saved to account · {email}', account_password: 'Protected by username and password', account_legacy: 'Legacy account without a password',
      account_conflict: 'This player is linked to another account.', admin_panel: 'Admin Panel', admin_only: 'ADMIN ONLY', active_now: 'ACTIVE NOW', played_ever: 'PLAYED TO DATE', registered_players: 'REGISTERED PLAYERS', games_today: 'GAMES TODAY', search_player: 'Search players', refresh: 'REFRESH', admin_loading: 'Loading players…', admin_empty: 'No players found.', admin_live: 'ACTIVE', admin_user_meta: '{games} games · Best {score} · Last: {last}', admin_delete: 'DELETE', admin_deleted: '{username} was deleted.', admin_account: 'Administrator account · Hidden from leagues', admin_result: 'Admin test · Score is hidden from leagues', admin_delete_close: 'Close deletion confirmation', admin_delete_kicker: 'PLAYER ACCOUNT', admin_delete_title_suffix: 'will be deleted?', admin_delete_message: 'This player’s scores, planets, progress, and complete game history will be permanently deleted.', admin_delete_irreversible: 'This action cannot be undone.', admin_delete_button: 'DELETE ACCOUNT', admin_deleting: 'Deleting account…', account_removed_kicker: 'ACCOUNT NOTICE', account_removed_title: 'Your account was deleted', account_removed_message: 'was deleted by an administrator. This account’s game data is no longer available.', create_new_account: 'CREATE NEW ACCOUNT', sign_in_other: 'SIGN IN TO ANOTHER ACCOUNT', account_removed_by_admin: 'Your previous account was deleted by an administrator.', create_account_hint: 'Choose a new username and password to create an account.', sign_in_other_hint: 'Sign in with another account’s username and password.',
      minute_short: '{minutes} min', hour_minute_short: '{hours} hr {minutes} min', less_than_minute: 'Under 1 min',
      guest_status: 'Sign in, create an account, or play as a guest.', guest_name: 'Guest', guest_profile_detail: 'Not ranked · Tap to switch to an account', guest_ready: 'Guest mode · Scores are not submitted to leagues.', guest_result: 'Guest game · Score was not submitted to the league', network_error: 'Connection failed.', profile_loading: 'Loading player data…',
      password_invalid: 'Password must be at least 8 characters and include one letter and one number.', wrong_credentials: 'Incorrect username or password.',
      legacy_password_missing: 'This legacy account has no password. Create one from an existing signed-in session.', too_many_attempts: 'Too many failed attempts. Try again in 15 minutes.',
      profile_meteor: '{games} Meteor games · Record {record}', profile_classic: '{games} Classic games · Record {record}',
      ready: 'Choose a mode and start.', start_meteor: 'START METEOR STORM', start_classic: 'START CLASSIC',
      first_score: 'Be the first to set a score.', rank_up: 'Moved up', rank_down: 'Moved down', scores_unavailable: 'Scores are unavailable right now.',
      username_invalid: 'Use 3–16 letters, numbers, or _ characters.', username_inappropriate: 'This username cannot contain slang or abusive language.', need_username: 'Choose a username first.', selected: 'SELECTED', use: 'USE',
      coin_price: '{cost} COINS', planet_switching: 'Switching planet…', purchasing: 'Purchasing…',
      planet_selected: '{planet} selected.', planet_purchased: '{planet} purchased and selected.',
      not_enough_coins_detail: 'Not enough coins. You need {needed} more for {planet}.',
      power_used: 'Power used for this game', power_classic_used: 'Auto-activates every 3 perfects', power_ready: 'Ready · one use per game', power_classic_ready: 'Starting power ready · use it first', power_active: '{power} ACTIVE',
      bank_secure: 'Secure {energy} energy', bank_more: '{count} more hits to bank', empty_pass: 'MISSED GATE · SPEED UP',
      perfect_gain: 'PERFECT +{gain}', golden_gain: 'GOLD GATE +{gain}', golden_guard: 'GOLD GATE · +1 SHIELD', good_gain: 'GOOD +{gain}',
      shield_speed: 'SHIELD SAVED YOU · SPEED UP', shield: 'SHIELD SAVED YOU', lost_energy: 'MISSED · {lost} LOST',
      missed_speed: 'MISSED · SPEED UP', missed: 'MISSED', banked: 'BANKED +{total}', direction_changed: 'ORBIT REVERSED',
      classic_result_rank: 'Classic league #{rank} · {games} games', meteor_result_rank: 'Meteor league #{rank} · {games} games', meteor_reward: '+{reward} coins · survival reward',
      classic_completed: 'Classic game complete', meteor_completed: 'Meteor run complete', personal_best: 'New personal record!', lives_out: 'All three lives are gone.',
      gate_drift: 'MOVING', gate_pulse: 'PULSE', gate_twin: 'TWIN GATE', gate_blink: 'SHADOW', gate_gold: 'GOLD', gate_hazard: 'METEOR', storm_level: 'STORM', meteor_score: 'SCORE', meteor_caught: 'METEOR +{gain}', meteor_gold: 'GOLD METEOR +{gain}', meteor_life: '+1 LIFE · +{gain}', meteor_blue: 'BLUE METEOR +{gain}', meteor_missed: 'METEOR MISSED',
      quest_launch: 'Enter Orbit', quest_launch_detail: 'Play {goal} games today', quest_precision: 'Sharpshooter', quest_precision_detail: 'Land {goal} perfect catches today', quest_score: 'Score Hunt', quest_score_detail: 'Reach {goal} in Classic',
      claim: 'CLAIM', claimed: 'CLAIMED', in_progress: '{progress}/{goal}', quest_rewarded: '+{reward} coins added', quest_locked: 'Mission is not complete yet.',
      planet_mercury: 'Mercury', power_mercury: 'Focus', detail_mercury: 'Widens the current gate by 30%.',
      planet_mars: 'Mars', power_mars: 'Dust Shield', detail_mars: 'Blocks one mistimed tap.',
      planet_venus: 'Venus', power_venus: 'Atmosphere', detail_venus: 'Widens the next 3 gates by 30%.',
      planet_earth: 'Earth', power_earth: 'Balance', detail_earth: 'Slows the orbit by 20% for 6 sec.',
      planet_neptune: 'Neptune', power_neptune: 'Deep Freeze', detail_neptune: 'Slows the orbit by 35% for 6 sec.',
      planet_uranus: 'Uranus', power_uranus: 'Axis Shift', detail_uranus: 'Makes the next 2 catches perfect.',
      planet_saturn: 'Saturn', power_saturn: 'Ring Shield', detail_saturn: 'Blocks two mistimed taps.',
      planet_jupiter: 'Jupiter', power_jupiter: 'Great Storm', detail_jupiter: 'Slows for 7 sec, widens 3 gates, and blocks 1 miss.'
    }
  };
  const planets = [
    { id: 'mercury', cost: 0, size: 27, color: '#9b948c', accent: '#eee5d8', shadow: 'rgba(190,180,168,.72)', type: 'wide', amount: 1 },
    { id: 'mars', cost: 300, size: 30, color: '#c95635', accent: '#ffd2b6', shadow: 'rgba(220,89,53,.78)', type: 'shield', amount: 1 },
    { id: 'venus', cost: 650, size: 33, color: '#dca84f', accent: '#fff0bd', shadow: 'rgba(231,177,85,.78)', type: 'wide', amount: 3 },
    { id: 'earth', cost: 1100, size: 35, color: '#2d8fd5', accent: '#c8fff1', shadow: 'rgba(45,143,213,.82)', type: 'slow', factor: .8, duration: 6000 },
    { id: 'neptune', cost: 1700, size: 38, color: '#3457dd', accent: '#cbd8ff', shadow: 'rgba(52,87,221,.82)', type: 'slow', factor: .65, duration: 6000 },
    { id: 'uranus', cost: 2500, size: 41, color: '#72d8dc', accent: '#e2ffff', shadow: 'rgba(114,216,220,.82)', type: 'perfect', amount: 2 },
    { id: 'saturn', cost: 3600, size: 44, color: '#d9bd76', accent: '#fff3ca', shadow: 'rgba(217,189,118,.8)', type: 'shield', amount: 2 },
    { id: 'jupiter', cost: 5000, size: 48, color: '#d78a5f', accent: '#ffe3bf', shadow: 'rgba(215,138,95,.85)', type: 'storm', factor: .72, duration: 7000, amount: 3 }
  ];
  const planetFacts = {
    mercury: {
      diameter: { tr: 'Yaklaşık 4.880 km', en: 'About 4,880 km' },
      year: { tr: '88 Dünya günü', en: '88 Earth days' },
      feature: { tr: 'En küçük ve Güneş’e en yakın gezegen', en: 'The smallest and closest planet to the Sun' },
      summary: {
        tr: 'Merkür kayalık ve yoğun kraterli bir dünyadır. Neredeyse atmosfersiz olduğu için gündüzleri yaklaşık 430 °C’ye ulaşırken geceleri −180 °C’ye kadar soğuyabilir. Güneş çevresindeki turunu yalnızca 88 Dünya gününde tamamlar ve bilinen bir uydusu yoktur.',
        en: 'Mercury is a rocky world covered in impact craters. With almost no atmosphere, temperatures can rise to about 430°C by day and fall to −180°C at night. It circles the Sun in only 88 Earth days and has no known moon.'
      },
      source: 'https://science.nasa.gov/mercury/facts/'
    },
    mars: {
      diameter: { tr: 'Yaklaşık 6.780 km', en: 'About 6,780 km' },
      year: { tr: '687 Dünya günü', en: '687 Earth days' },
      feature: { tr: 'Paslanan demir mineralleri yüzeyi kırmızı gösterir', en: 'Oxidized iron minerals make its surface look red' },
      summary: {
        tr: 'Mars, Dünya’nın yaklaşık yarısı büyüklüğünde kayalık bir gezegendir. Toprağındaki demir minerallerinin oksitlenmesi ona kırmızı görünümünü verir. Bir Mars günü 24,6 saat sürer; Phobos ve Deimos adlı iki küçük uydusu vardır.',
        en: 'Mars is a rocky planet about half the size of Earth. Oxidized iron minerals in its soil give it a red appearance. A Martian day lasts 24.6 hours, and it has two small moons named Phobos and Deimos.'
      },
      source: 'https://science.nasa.gov/mars/facts/'
    },
    venus: {
      diameter: { tr: 'Yaklaşık 12.104 km', en: 'About 12,104 km' },
      year: { tr: '225 Dünya günü', en: '225 Earth days' },
      feature: { tr: 'Güneş Sistemi’nin en sıcak gezegen yüzeyi', en: 'The hottest planetary surface in the solar system' },
      summary: {
        tr: 'Venüs boyutça Dünya’ya yakındır fakat kalın karbondioksit atmosferi ısıyı hapseder. Bu nedenle Merkür’den bile daha sıcak bir yüzeye sahiptir. Kendi ekseninde çoğu gezegenin ters yönünde döner ve Venüs’te bir gün, bir yıldan daha uzundur.',
        en: 'Venus is close to Earth in size, but its thick carbon-dioxide atmosphere traps heat. Its surface is even hotter than Mercury’s. It rotates opposite to most planets, and one day on Venus is longer than one Venusian year.'
      },
      source: 'https://science.nasa.gov/venus/venus-facts/'
    },
    earth: {
      diameter: { tr: '12.756 km (ekvator)', en: '12,756 km (equator)' },
      year: { tr: '365,25 gün', en: '365.25 days' },
      feature: { tr: 'Yüzeyinde sıvı su ve yaşam bilinen tek gezegen', en: 'The only known planet with surface liquid water and life' },
      summary: {
        tr: 'Dünya kayalık gezegenlerin en büyüğüdür ve yüzeyinde kalıcı sıvı su bulunduğu bilinen tek gezegendir. Atmosferi ve uygun sıcaklık aralığı canlı yaşamını destekler. Eksen eğikliği mevsimleri oluşturur; Ay ise gezegenimizin yalpalamasını dengeler.',
        en: 'Earth is the largest terrestrial planet and the only known planet with lasting liquid water on its surface. Its atmosphere and suitable temperature range support life. Its axial tilt creates the seasons, while the Moon helps stabilize Earth’s wobble.'
      },
      source: 'https://science.nasa.gov/earth/facts/'
    },
    neptune: {
      diameter: { tr: '49.528 km (ekvator)', en: '49,528 km (equator)' },
      year: { tr: 'Yaklaşık 165 Dünya yılı', en: 'About 165 Earth years' },
      feature: { tr: 'Güneş’e en uzak büyük gezegen', en: 'The farthest major planet from the Sun' },
      summary: {
        tr: 'Neptün karanlık ve çok soğuk bir buz devidir. Güneş’e yaklaşık 4,5 milyar kilometre uzaktadır; güneş ışığının oraya ulaşması yaklaşık dört saat sürer. Bir günü yaklaşık 16 saat, bir yılı ise 165 Dünya yılıdır.',
        en: 'Neptune is a dark and extremely cold ice giant. It is about 4.5 billion kilometers from the Sun, so sunlight takes roughly four hours to reach it. Its day lasts about 16 hours, while its year lasts 165 Earth years.'
      },
      source: 'https://science.nasa.gov/neptune/neptune-facts/'
    },
    uranus: {
      diameter: { tr: '51.118 km (ekvator)', en: '51,118 km (equator)' },
      year: { tr: 'Yaklaşık 84 Dünya yılı', en: 'About 84 Earth years' },
      feature: { tr: '97,77° eğimle neredeyse yan dönerek döner', en: 'It rotates nearly on its side at a 97.77° tilt' },
      summary: {
        tr: 'Uranüs bir buz devidir ve neredeyse yan yatmış biçimde döner. 97,77 derecelik eksen eğimi, kutuplarında yaklaşık 21 yıl süren karanlık kışlar oluşturabilir. Venüs gibi çoğu gezegenin ters yönünde döner ve 28 bilinen uyduya sahiptir.',
        en: 'Uranus is an ice giant that rotates almost on its side. Its 97.77-degree tilt can create dark winters lasting about 21 years at its poles. Like Venus, it spins opposite to most planets and has 28 known moons.'
      },
      source: 'https://science.nasa.gov/uranus/facts/'
    },
    saturn: {
      diameter: { tr: 'Yaklaşık 120.500 km', en: 'About 120,500 km' },
      year: { tr: 'Yaklaşık 29,4 Dünya yılı', en: 'About 29.4 Earth years' },
      feature: { tr: 'Halkaları milyarlarca buz ve kaya parçasından oluşur', en: 'Its rings contain billions of pieces of ice and rock' },
      summary: {
        tr: 'Satürn bir gaz devidir ve Güneş Sistemi’nin ikinci büyük gezegenidir. Belirgin halkaları milyarlarca buz, kaya ve toz parçasından oluşur. Bir günü yalnızca 10,7 saat sürerken Güneş çevresindeki bir turu 29,4 Dünya yılı alır.',
        en: 'Saturn is a gas giant and the solar system’s second-largest planet. Its distinctive rings contain billions of pieces of ice, rock, and dust. A day lasts only 10.7 hours, while one orbit around the Sun takes 29.4 Earth years.'
      },
      source: 'https://science.nasa.gov/saturn/facts/'
    },
    jupiter: {
      diameter: { tr: 'Yaklaşık 139.822 km', en: 'About 139,822 km' },
      year: { tr: 'Yaklaşık 12 Dünya yılı', en: 'About 12 Earth years' },
      feature: { tr: 'Güneş Sistemi’nin en büyük gezegeni', en: 'The largest planet in the solar system' },
      summary: {
        tr: 'Jüpiter Güneş Sistemi’nin en büyük gezegeni olan dev bir gaz dünyasıdır. Dünya’dan yaklaşık 11 kat daha geniştir. 9,9 saatlik dönüşüyle gezegenler arasındaki en kısa güne sahiptir; Büyük Kırmızı Leke ise yüzyıllardır gözlenen dev bir fırtınadır.',
        en: 'Jupiter is the solar system’s largest planet and a giant gas world. It is about 11 times wider than Earth. Its 9.9-hour rotation gives it the shortest planetary day, while the Great Red Spot is a vast storm observed for centuries.'
      },
      source: 'https://science.nasa.gov/jupiter/jupiter-facts/'
    }
  };

  let state = {};
  let raf = 0;
  let resumeTimer = 0;
  let audio = null;
  let best = Number(localStorage.getItem('yorunge-best') || 0);
  let meteorBest = Number(localStorage.getItem('yorunge-meteor-best') || 0);
  let selectedMode = 'classic';
  let currentPlayer = null;
  let ownedPlanets = ['mercury'];
  let selectedPlanet = 'mercury';
  let coins = 0;
  let leagueLoading = false;
  let liveSyncing = false;
  let adminLoading = false;
  let adminSearchTimer = 0;
  let adminData = null;
  let pendingAdminDelete = null;
  let accountStatusChecking = false;
  let progressionBusy = false;
  let selectedInfoPlanet = null;
  let accountIdentity = null;
  let guestMode = false;
  let previousLeaguePositions = new Map();
  let leagueView = 'classic';
  let tutorialMode = 'classic';
  let leagueData = { players: [], meteor_players: [], live_players: [], meteor_live_players: [] };
  let profile = (() => {
    try { return JSON.parse(localStorage.getItem('yorunge-profile-v2') || 'null'); }
    catch (_) { return null; }
  })();
  let settings = (() => {
    try {
      const saved = JSON.parse(localStorage.getItem('yorunge-settings-v4') || '{}');
      return {
        theme: saved.theme === 'light' ? 'light' : 'dark',
        sound: saved.sound === 'off' ? 'off' : 'on',
        language: saved.language === 'en' ? 'en' : 'tr'
      };
    } catch (_) { return { theme: 'dark', sound: 'on', language: 'tr' }; }
  })();
  let muted = settings.sound === 'off';

  function t(key, values = {}) {
    let value = messages[settings.language]?.[key] ?? messages.tr[key] ?? key;
    Object.entries(values).forEach(([name, replacement]) => {
      value = value.replaceAll(`{${name}}`, String(replacement));
    });
    return value;
  }

  function locale() { return settings.language === 'en' ? 'en-US' : 'tr-TR'; }
  function formatNumber(value) { return Number(value || 0).toLocaleString(locale()); }
  function formatDuration(milliseconds) {
    const totalMinutes = Math.floor(Math.max(0, Number(milliseconds) || 0) / 60000);
    if (totalMinutes < 1) return t('less_than_minute');
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return hours ? t('hour_minute_short', { hours: formatNumber(hours), minutes: formatNumber(minutes) }) : t('minute_short', { minutes: formatNumber(minutes) });
  }
  function formatDate(value) {
    if (!value) return '—';
    const date = new Date(String(value).includes('T') ? String(value) : `${String(value).replace(' ', 'T')}Z`);
    return Number.isNaN(date.getTime()) ? '—' : new Intl.DateTimeFormat(locale(), { day: 'numeric', month: 'long', year: 'numeric' }).format(date);
  }
  function planetName(planet) { return t(`planet_${planet.id}`); }
  function planetPower(planet) { return t(`power_${planet.id}`); }
  function planetDetail(planet) { return t(`detail_${planet.id}`); }

  const apiErrorKeys = {
    'Bağlantı kurulamadı.': 'network_error',
    'Geçersiz istek.': 'network_error',
    'Kullanıcı adı 3–16 karakter; yalnızca harf, sayı ve _ kullan.': 'username_invalid',
    'Kullanıcı adı argo veya hakaret içeremez.': 'username_inappropriate',
    'Bu oyuncu başka bir hesaba bağlı.': 'account_conflict',
    'Bu kullanıcı adı alınmış.': 'username_taken',
    'Bu kullanıcı adı alınmış. Giriş yapmayı dene.': 'username_taken',
    'Şifre en az 8 karakter olmalı; bir harf ve bir sayı içermeli.': 'password_invalid',
    'Kullanıcı adı veya şifre hatalı.': 'wrong_credentials',
    'Bu eski hesapta şifre yok. Açık olan eski oturumdan şifre oluştur.': 'legacy_password_missing',
    'Çok fazla hatalı deneme. 15 dakika sonra tekrar dene.': 'too_many_attempts',
    'Geçersiz giriş isteği.': 'network_error',
    'Geçersiz skor verisi.': 'score_invalid',
    'Skor doğrulanamadı.': 'score_invalid',
    'Oyuncu doğrulanamadı.': 'player_invalid',
    'Geçersiz canlı skor verisi.': 'live_invalid',
    'Canlı skor doğrulanamadı.': 'live_invalid',
    'Geçersiz mağaza isteği.': 'shop_invalid',
    'Gezegen seçimi geçersiz.': 'shop_invalid',
    'Yeterli jetonun yok.': 'not_enough_coins',
    'Bu gezegen henüz satın alınmadı.': 'planet_locked',
    'Geçersiz hesap silme isteği.': 'delete_invalid',
    'Kullanıcı adı doğrulanamadı.': 'delete_username_mismatch',
    'Geçersiz ilerleme isteği.': 'progression_invalid',
    'Günlük görev bulunamadı.': 'quest_missing',
    'Bu günlük görev henüz tamamlanmadı.': 'quest_locked'
  };
  Object.assign(messages.en, {
    username_taken: 'This username is already taken.', score_invalid: 'The score could not be verified.',
    player_invalid: 'Player verification failed.',
    live_invalid: 'The live score could not be verified.', shop_invalid: 'The planet selection is invalid.',
    not_enough_coins: 'You do not have enough coins.', planet_locked: 'This planet has not been purchased yet.',
    delete_invalid: 'The account deletion request is invalid.', delete_username_mismatch: 'The username did not match.',
    progression_invalid: 'The progression request is invalid.', quest_missing: 'Daily mission not found.'
  });

  const prohibitedUsernameParts = ['amina', 'aminak', 'orospu', 'siktir', 'sikik', 'siker', 'sikeyim', 'sokarim', 'yarrak', 'pezevenk', 'kahpe', 'ibne', 'gavat', 'gotveren', 'gerizekali', 'dangalak', 'salak', 'aptal', 'fuck', 'shit', 'bitch', 'asshole', 'cunt', 'pussy', 'bastard'];
  const prohibitedUsernameExact = new Set(['amk', 'aq', 'oc', 'pic', 'mal']);

  function usernameHasAbuse(username) {
    const normalized = username.toLocaleLowerCase('tr-TR')
      .replaceAll('_', '')
      .replaceAll('0', 'o')
      .replaceAll('1', 'i')
      .replaceAll('3', 'e')
      .replaceAll('4', 'a')
      .replaceAll('5', 's')
      .replaceAll('7', 't');
    return prohibitedUsernameExact.has(normalized) || prohibitedUsernameParts.some((part) => normalized.includes(part));
  }

  function translateApiError(message) {
    if (settings.language === 'tr') return message;
    const key = apiErrorKeys[message];
    return key ? t(key) : message;
  }

  function randomKey(bytes = 20) {
    const values = new Uint8Array(bytes);
    crypto.getRandomValues(values);
    return [...values].map((value) => value.toString(16).padStart(2, '0')).join('');
  }

  async function api(path, options = {}) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 7000);
    try {
      const response = await fetch(path, {
        ...options,
        signal: controller.signal,
        headers: { 'content-type': 'application/json', ...(options.headers || {}) }
      });
      const raw = await response.text();
      let data = {};
      try {
        data = raw ? JSON.parse(raw) : {};
      } catch (_) {
        throw new Error(t('network_error'));
      }
      if (!response.ok) {
        const apiError = new Error(translateApiError(data.error || t('network_error')));
        apiError.data = data;
        apiError.status = response.status;
        throw apiError;
      }
      return data;
    } catch (error) {
      if (error?.name === 'AbortError' || error instanceof TypeError || error instanceof SyntaxError) {
        throw new Error(t('network_error'));
      }
      throw error;
    } finally { clearTimeout(timeout); }
  }

  function applySettings() {
    muted = settings.sound === 'off';
    document.body.dataset.theme = settings.theme;
    document.querySelector('meta[name="theme-color"]').content = settings.theme === 'light' ? '#edf5f0' : '#07100e';
    document.querySelectorAll('[data-theme-choice]').forEach((button) => button.classList.toggle('active', button.dataset.themeChoice === settings.theme));
    document.querySelectorAll('[data-sound-choice]').forEach((button) => button.classList.toggle('active', button.dataset.soundChoice === settings.sound));
    document.querySelectorAll('[data-language-choice]').forEach((button) => button.classList.toggle('active', button.dataset.languageChoice === settings.language));
    applyLanguage();
    localStorage.setItem('yorunge-settings-v4', JSON.stringify(settings));
  }

  function applyLanguage() {
    document.documentElement.lang = settings.language;
    document.title = t('title');
    document.querySelector('meta[name="description"]').content = t('description');
    document.querySelectorAll('[data-i18n]').forEach((element) => { element.textContent = t(element.dataset.i18n); });
    document.querySelectorAll('[data-i18n-placeholder]').forEach((element) => { element.placeholder = t(element.dataset.i18nPlaceholder); });
    document.querySelectorAll('[data-i18n-aria]').forEach((element) => { element.setAttribute('aria-label', t(element.dataset.i18nAria)); });
    renderPlanetShop();
    renderProgression();
    if (selectedInfoPlanet) renderPlanetInfo(selectedInfoPlanet);
    renderPlayerProfile();
    updateModeUi();
    if (!els.tutorialSheet.classList.contains('hidden')) renderModeTutorial();
    renderPowerButton();
    updateDeleteConfirmation();
    if (state.mode) {
      renderHud();
      setPauseUi();
      if (state.finalScore !== undefined && !els.result.classList.contains('hidden')) renderResultSummary();
    }
    if (guestMode) renderGuestProfile();
    else if (currentPlayer) {
      refreshProfileSummary();
      els.passwordAccountBtn.textContent = t(currentPlayer.has_password ? 'password_change' : 'password_manage');
    }
    if (adminData) renderAdminDashboard(adminData);
    if (guestMode) els.leagueStatus.textContent = t('guest_ready');
    else if (profile) els.leagueStatus.textContent = t('ready');
    if (state.gateType && state.gateType !== 'normal') els.gateBadge.textContent = t(`gate_${state.gateType}`);
    renderLeagueView();
  }

  function applyPlanet(planetId) {
    const planet = planets.find((item) => item.id === planetId) || planets[0];
    document.documentElement.style.setProperty('--planet-color', planet.color);
    document.documentElement.style.setProperty('--planet-accent', planet.accent);
    document.documentElement.style.setProperty('--planet-shadow', planet.shadow);
    els.powerName.textContent = `${planetName(planet).toLocaleUpperCase(locale())} · ${planetPower(planet).toLocaleUpperCase(locale())}`;
    els.powerHint.textContent = planetDetail(planet);
  }

  function refreshProfileSummary() {
    if (!currentPlayer) return;
    const classicGames = Number(currentPlayer.classic_games ?? currentPlayer.games_played) || 0;
    const meteorGames = Number(currentPlayer.meteor_games) || 0;
    els.profileGames.textContent = selectedMode === 'meteor'
      ? t('profile_meteor', { games: formatNumber(meteorGames), record: formatNumber(currentPlayer.meteor_best) })
      : t('profile_classic', { games: formatNumber(classicGames), record: formatNumber(currentPlayer.best_score) });
  }

  function renderPlayerProfile() {
    if (!currentPlayer || !profile) return;
    const classicGames = Number(currentPlayer.classic_games ?? currentPlayer.games_played) || 0;
    const meteorGames = Number(currentPlayer.meteor_games) || 0;
    const email = currentPlayer.account_email || accountIdentity?.email || '';
    els.profileSheetTitle.textContent = profile.username;
    els.profileSheetName.textContent = profile.username;
    els.profileSheetAvatar.textContent = profile.username.slice(0, 1).toUpperCase();
    els.profileSheetRank.textContent = `#${currentPlayer.score_rank || '–'}`;
    els.profileAccountStatus.textContent = currentPlayer.is_admin ? t('admin_account') : email
      ? t('account_linked', { email })
      : t(currentPlayer.has_password ? 'account_password' : 'account_legacy');
    els.profileBestScore.textContent = formatNumber(currentPlayer.best_score);
    els.profileTotalGames.textContent = formatNumber(classicGames + meteorGames);
    els.profilePlayTime.textContent = formatDuration(currentPlayer.total_play_ms);
    els.profileBestChain.textContent = formatNumber(currentPlayer.best_perfect_streak);
    els.profileCreatedAt.textContent = formatDate(currentPlayer.created_at);
  }

  function showProfile(player) {
    if (!profile) return;
    guestMode = false;
    if (player) {
      currentPlayer = player;
      best = Math.max(0, Number(player.best_score) || 0);
      meteorBest = Math.max(0, Number(player.meteor_best) || 0);
      localStorage.setItem('yorunge-best', String(best));
      localStorage.setItem('yorunge-meteor-best', String(meteorBest));
      coins = Math.max(0, Number(player.coins) || 0);
      ownedPlanets = Array.isArray(player.owned_planets) && player.owned_planets.length ? player.owned_planets : ['mercury'];
      selectedPlanet = ownedPlanets.includes(player.selected_planet) ? player.selected_planet : 'mercury';
      if (player.account_email) accountIdentity = { id: player.account_user_id || '', email: player.account_email };
      applyPlanet(selectedPlanet);
      renderPlanetShop();
      renderPlayerProfile();
      renderProgression();
    }
    els.profileForm.classList.add('hidden');
    els.profileSummary.classList.remove('hidden');
    els.profileSummary.disabled = !player;
    els.startBtn.disabled = false;
    els.profileName.textContent = profile.username;
    els.profileAvatar.textContent = profile.username.slice(0, 1).toUpperCase();
    els.profileGames.textContent = player ? '' : t('profile_loading');
    if (player) refreshProfileSummary();
    els.profileRank.textContent = player ? `#${player.score_rank || '–'}` : '#–';
    els.coinCount.textContent = formatNumber(coins);
    els.shopCoins.textContent = formatNumber(coins);
    els.deleteAccountBtn.disabled = !player || state.playing || Boolean(player?.is_admin);
    els.deleteAccountBtn.classList.toggle('hidden', Boolean(player?.is_admin));
    els.adminBtn.classList.toggle('hidden', !player?.is_admin);
    els.passwordAccountBtn.disabled = !player || state.playing;
    els.logoutBtn.disabled = !player || state.playing;
    els.passwordAccountBtn.textContent = t(player?.has_password ? 'password_change' : 'password_manage');
    els.homeMissionsBtn.disabled = !player;
    els.homePlanetsBtn.disabled = !player;
    els.shopBtn.disabled = false;
    els.leagueStatus.textContent = t('ready');
  }

  function renderGuestProfile() {
    els.profileName.textContent = t('guest_name');
    els.profileAvatar.textContent = settings.language === 'en' ? 'G' : 'M';
    els.profileGames.textContent = t('guest_profile_detail');
    els.profileRank.textContent = '#–';
    els.profileSummary.setAttribute('aria-label', t('guest_profile_detail'));
    els.coinCount.textContent = '0';
    els.leagueStatus.textContent = t('guest_ready');
  }

  function enterGuestMode() {
    guestMode = true;
    profile = null;
    currentPlayer = null;
    best = 0;
    meteorBest = 0;
    coins = 0;
    selectedPlanet = 'mercury';
    ownedPlanets = ['mercury'];
    els.profileError.classList.remove('is-status');
    els.profileError.textContent = '';
    els.profileForm.classList.add('hidden');
    els.profileSummary.classList.remove('hidden');
    els.profileSummary.disabled = false;
    els.startBtn.disabled = false;
    els.shopBtn.disabled = true;
    els.homeMissionsBtn.disabled = true;
    els.homePlanetsBtn.disabled = true;
    els.deleteAccountBtn.disabled = true;
    els.passwordAccountBtn.disabled = true;
    els.logoutBtn.disabled = true;
    els.adminBtn.classList.add('hidden');
    applyPlanet(selectedPlanet);
    renderGuestProfile();
    renderPlanetShop();
    updateModeUi();
  }

  function leaveGuestMode() {
    if (!guestMode || state.playing) return;
    guestMode = false;
    best = Number(localStorage.getItem('yorunge-best') || 0);
    meteorBest = Number(localStorage.getItem('yorunge-meteor-best') || 0);
    els.profileForm.classList.remove('hidden');
    els.profileSummary.classList.add('hidden');
    els.profileSummary.disabled = true;
    els.profileSummary.setAttribute('aria-label', t('profile_open'));
    els.startBtn.disabled = true;
    els.shopBtn.disabled = false;
    els.leagueStatus.textContent = t('guest_status');
    setTimeout(() => els.usernameInput.focus(), 0);
  }

  function updateModeUi() {
    document.querySelectorAll('.mode-card').forEach((button) => {
      const active = button.dataset.mode === selectedMode;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    els.startBtn.textContent = selectedMode === 'meteor' ? t('start_meteor') : t('start_classic');
    refreshProfileSummary();
  }

  function selectMode(mode) {
    selectedMode = mode === 'meteor' ? 'meteor' : 'classic';
    leagueView = selectedMode;
    previousLeaguePositions = new Map();
    updateModeUi();
    renderLeagueView();
  }

  function tutorialStorageKey(mode = selectedMode) {
    const playerKey = profile?.playerId || 'device';
    return `yorunge-tutorial-${mode === 'meteor' ? 'meteor' : 'classic'}-v1-${playerKey}`;
  }

  function renderModeTutorial() {
    const mode = tutorialMode === 'meteor' ? 'meteor' : 'classic';
    els.tutorialKicker.textContent = t(`tutorial_${mode}_kicker`);
    els.tutorialTitle.textContent = t(`tutorial_${mode}_title`);
    els.tutorialNote.textContent = t(`tutorial_${mode}_note`);
    els.tutorialIcon.textContent = mode === 'meteor' ? '◆' : '●';
    els.tutorialSteps.replaceChildren();
    for (let index = 1; index <= 3; index += 1) {
      const row = document.createElement('div');
      row.className = 'tutorial-step';
      const number = document.createElement('b');
      number.textContent = String(index);
      const text = document.createElement('span');
      text.textContent = t(`tutorial_${mode}_step_${index}`);
      row.append(number, text);
      els.tutorialSteps.append(row);
    }
  }

  function requestStartGame() {
    if (!profile && !guestMode) {
      els.usernameInput.focus();
      return;
    }
    tutorialMode = selectedMode === 'meteor' ? 'meteor' : 'classic';
    const alreadyPlayed = tutorialMode === 'meteor'
      ? Number(currentPlayer?.meteor_games) > 0
      : Number(currentPlayer?.classic_games) > 0;
    if (alreadyPlayed || localStorage.getItem(tutorialStorageKey(tutorialMode)) === '1') {
      startGame();
      return;
    }
    renderModeTutorial();
    openSheet(els.tutorialSheet);
  }

  function startFromTutorial() {
    localStorage.setItem(tutorialStorageKey(tutorialMode), '1');
    closeSheet(els.tutorialSheet);
    startGame();
  }

  function leaderEmpty(message) {
    const empty = document.createElement('div');
    empty.className = 'leader-empty';
    empty.textContent = message;
    els.leaderRows.replaceChildren(empty);
  }

  function renderLeaders(players, livePlayers = []) {
    const recordBreakers = livePlayers.filter((player) => Number(player.score) > Number(player.best_score));
    const liveNames = new Set(recordBreakers.map((player) => String(player.username).toLocaleLowerCase(locale())));
    const merged = [
      ...recordBreakers.map((player) => ({ ...player, display_score: Number(player.score) || 0, is_live: true })),
      ...players
        .filter((player) => !liveNames.has(String(player.username).toLocaleLowerCase(locale())))
        .map((player) => ({ ...player, display_score: Number(player.best_score) || 0, is_live: false }))
    ].sort((a, b) => b.display_score - a.display_score).slice(0, 8);
    els.leaderRows.replaceChildren();
    if (!merged.length) {
      previousLeaguePositions = new Map();
      return leaderEmpty(t('first_score'));
    }
    merged.forEach((player, index) => {
      const row = document.createElement('div');
      row.className = `leader-row${profile && player.username.toLowerCase() === profile.username.toLowerCase() ? ' me' : ''}`;
      const position = document.createElement('span');
      position.className = `leader-pos${index < 3 ? ' medal' : ''}`;
      position.textContent = `#${index + 1}`;
      const playerKey = String(player.username).toLocaleLowerCase(locale());
      const previousPosition = previousLeaguePositions.get(playerKey);
      if (previousPosition && previousPosition !== index + 1) {
        const movedUp = previousPosition > index + 1;
        const movement = document.createElement('i');
        movement.className = `rank-move ${movedUp ? 'up' : 'down'}`;
        movement.textContent = movedUp ? '↑' : '↓';
        movement.title = t(movedUp ? 'rank_up' : 'rank_down');
        movement.setAttribute('aria-label', movement.title);
        position.append(movement);
      }
      const name = document.createElement('span');
      name.className = 'leader-name';
      name.textContent = player.username;
      const games = document.createElement('span');
      games.className = 'leader-games';
      games.textContent = formatNumber(player.games_played);
      const score = document.createElement('span');
      score.className = 'leader-score';
      score.textContent = formatNumber(player.display_score);
      row.append(position, name, games, score);
      els.leaderRows.append(row);
    });
    previousLeaguePositions = new Map(merged.map((player, index) => [String(player.username).toLocaleLowerCase(locale()), index + 1]));
  }

  function renderLeagueView() {
    document.querySelectorAll('[data-league-view]').forEach((button) => {
      button.classList.toggle('active', button.dataset.leagueView === leagueView);
    });
    const players = leagueView === 'meteor' ? leagueData.meteor_players || [] : leagueData.players || [];
    const livePlayers = leagueView === 'meteor' ? leagueData.meteor_live_players || [] : leagueData.live_players || [];
    renderLeaders(players, livePlayers);
  }

  async function loadLeaderboard(showLoading = false) {
    if (leagueLoading) return;
    leagueLoading = true;
    if (showLoading) leaderEmpty(t('scores_loading'));
    try {
      const data = await api('/api/leaderboard', { headers: {} });
      leagueData = data;
      renderLeagueView();
      els.leagueUpdated.textContent = new Intl.DateTimeFormat(locale(), { hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(new Date());
    } catch (_) {
      if (showLoading) leaderEmpty(t('scores_unavailable'));
    } finally { leagueLoading = false; }
  }

  function renderAdminDashboard(data) {
    adminData = data;
    const stats = data?.stats || {};
    els.adminActivePlayers.textContent = formatNumber(stats.active_players);
    els.adminPlayedPlayers.textContent = formatNumber(stats.played_players);
    els.adminRegisteredPlayers.textContent = formatNumber(stats.registered_players);
    els.adminGamesToday.textContent = formatNumber(stats.games_today);
    els.adminUserList.replaceChildren();
    const users = Array.isArray(data?.users) ? data.users : [];
    if (!users.length) {
      const empty = document.createElement('div');
      empty.className = 'admin-empty';
      empty.textContent = t('admin_empty');
      els.adminUserList.append(empty);
      return;
    }
    users.forEach((user) => {
      const row = document.createElement('div');
      row.className = `admin-user${user.currently_active ? ' active' : ''}`;
      const copy = document.createElement('div');
      copy.className = 'admin-user-copy';
      const name = document.createElement('b');
      name.textContent = user.username;
      if (user.currently_active) {
        const active = document.createElement('i');
        active.textContent = t('admin_live');
        name.append(active);
      }
      const meta = document.createElement('span');
      meta.textContent = t('admin_user_meta', {
        games: formatNumber(user.total_games),
        score: formatNumber(user.best_score),
        last: formatDate(user.last_played_at || user.created_at)
      });
      copy.append(name, meta);
      const remove = document.createElement('button');
      remove.type = 'button';
      remove.className = 'admin-delete-user';
      remove.textContent = t('admin_delete');
      remove.addEventListener('click', () => openAdminDeleteDialog(user, remove));
      row.append(copy, remove);
      els.adminUserList.append(row);
    });
  }

  async function loadAdminDashboard() {
    if (!currentPlayer?.is_admin || !profile || adminLoading) return;
    adminLoading = true;
    els.adminRefreshBtn.disabled = true;
    els.adminStatus.classList.remove('error');
    try {
      const data = await api('/api/admin', {
        method: 'POST',
        body: JSON.stringify({ ...profile, action: 'dashboard', query: els.adminSearch.value.trim() })
      });
      renderAdminDashboard(data);
      els.adminStatus.textContent = '';
    } catch (error) {
      els.adminStatus.classList.add('error');
      els.adminStatus.textContent = error.message;
    } finally {
      adminLoading = false;
      els.adminRefreshBtn.disabled = false;
    }
  }

  function openAdminDeleteDialog(user, button) {
    if (!currentPlayer?.is_admin || !profile) return;
    pendingAdminDelete = { user, button };
    els.adminDeleteName.textContent = user.username;
    els.adminDeleteDialogStatus.textContent = '';
    els.adminDeleteConfirmBtn.disabled = false;
    openSheet(els.adminDeleteSheet);
  }

  function closeAdminDeleteDialog() {
    closeSheet(els.adminDeleteSheet);
    pendingAdminDelete = null;
    els.adminDeleteDialogStatus.textContent = '';
    els.adminDeleteConfirmBtn.disabled = false;
  }

  async function deletePlayerFromAdmin() {
    if (!currentPlayer?.is_admin || !profile || !pendingAdminDelete) return;
    const { user, button } = pendingAdminDelete;
    els.adminDeleteConfirmBtn.disabled = true;
    els.adminDeleteDialogStatus.textContent = t('admin_deleting');
    els.adminStatus.classList.remove('error');
    try {
      const data = await api('/api/admin', {
        method: 'POST', body: JSON.stringify({ ...profile, action: 'delete_player', targetPlayerId: user.id })
      });
      closeAdminDeleteDialog();
      renderAdminDashboard(data);
      els.adminStatus.textContent = t('admin_deleted', { username: data.deleted_username });
      loadLeaderboard();
    } catch (error) {
      button.disabled = false;
      els.adminDeleteConfirmBtn.disabled = false;
      els.adminDeleteDialogStatus.textContent = error.message;
    }
  }

  function adoptPlayer(player, token = '') {
    guestMode = false;
    const savedToken = token || (profile?.playerId === player.id ? profile.token : '');
    profile = { username: player.username, playerId: player.id, token: savedToken };
    localStorage.setItem('yorunge-profile-v2', JSON.stringify(profile));
    showProfile(player);
  }

  async function restoreAccountProfile() {
    try {
      const data = await api('/api/account', { headers: {} });
      accountIdentity = data.account || null;
      if (data.player && !guestMode) adoptPlayer(data.player);
    } catch (_) {
      // Hesap başlığı kullanılamazsa cihaz anahtarıyla kayıt akışı devam eder.
    }
  }

  async function syncProfile() {
    if (!profile) return;
    showProfile();
    try {
      const data = await api('/api/register', { method: 'POST', body: JSON.stringify(profile) });
      if (data.player.id !== profile.playerId) adoptPlayer(data.player);
      else showProfile(data.player);
    } catch (error) {
      if (error.data?.account_deleted) showAccountRemovedNotice(error.data.username || profile?.username);
      else els.leagueStatus.textContent = error.message;
    }
  }

  function showAccountRemovedNotice(username) {
    const removedName = username || profile?.username || t('player');
    cancelAnimationFrame(raf);
    cancelResumeCountdown();
    state.playing = false;
    state.manualPaused = false;
    document.body.classList.remove('is-playing');
    els.pauseOverlay.classList.add('hidden');
    els.pauseBtn.classList.add('hidden');
    document.querySelectorAll('.sheet-backdrop:not(.account-removed-backdrop)').forEach((sheet) => sheet.classList.add('hidden'));
    resetDeletedAccount('account_removed_by_admin');
    els.accountRemovedName.textContent = removedName;
    els.accountRemovedSheet.classList.remove('hidden');
  }

  async function checkAccountStatus() {
    if (!profile || accountStatusChecking || !els.accountRemovedSheet.classList.contains('hidden')) return;
    const checkingProfile = { ...profile };
    accountStatusChecking = true;
    try {
      const data = await api('/api/account-status', {
        method: 'POST', body: JSON.stringify(checkingProfile)
      });
      if (profile?.playerId === checkingProfile.playerId && data.deleted) {
        showAccountRemovedNotice(data.username || checkingProfile.username);
      }
    } catch (_) {
      // Durum sorgusu ağ sorunlarında oyunu kesintiye uğratmaz.
    } finally { accountStatusChecking = false; }
  }

  function continueAfterAccountRemoval(statusKey) {
    els.accountRemovedSheet.classList.add('hidden');
    els.profileError.textContent = t(statusKey);
    setTimeout(() => els.usernameInput.focus(), 0);
  }

  function validClientPassword(password) {
    return password.length >= 8 && password.length <= 64 && /\p{L}/u.test(password) && /\d/.test(password);
  }

  async function authenticateWithPassword(action, event) {
    event?.preventDefault();
    const authAction = action === 'register' ? 'register' : 'login';
    const activeButton = authAction === 'register' ? els.registerBtn : els.loginBtn;
    const username = els.usernameInput.value.trim();
    const password = els.passwordInput.value;
    els.profileError.classList.remove('is-status');
    els.profileError.textContent = '';
    if (!/^[A-Za-z0-9_]{3,16}$/.test(username)) {
      els.profileError.textContent = t('username_invalid');
      return;
    }
    if (usernameHasAbuse(username)) {
      els.profileError.textContent = t('username_inappropriate');
      return;
    }
    if (!validClientPassword(password)) {
      els.profileError.textContent = t('password_invalid');
      return;
    }
    els.loginBtn.disabled = true;
    els.registerBtn.disabled = true;
    els.guestBtn.disabled = true;
    els.profileForm.setAttribute('aria-busy', 'true');
    activeButton.textContent = t(`${authAction}_processing`);
    els.profileError.classList.add('is-status');
    els.profileError.textContent = t(`${authAction}_processing`);
    try {
      const data = await api('/api/auth', { method: 'POST', body: JSON.stringify({ action: authAction, username, password }) });
      if (!data.credentials?.token) throw new Error(t('network_error'));
      adoptPlayer(data.player, data.credentials.token);
      els.passwordInput.value = '';
      els.profileError.textContent = '';
      await loadLeaderboard();
    } catch (error) {
      els.profileError.classList.remove('is-status');
      els.profileError.textContent = error.message;
    }
    finally {
      els.loginBtn.disabled = false;
      els.registerBtn.disabled = false;
      els.guestBtn.disabled = false;
      els.profileForm.removeAttribute('aria-busy');
      els.loginBtn.textContent = t('login');
      els.registerBtn.textContent = t('create_account');
      if (!els.profileError.textContent) els.profileError.classList.remove('is-status');
    }
  }

  function openPasswordDialog() {
    if (!profile || !currentPlayer || state.playing) return;
    closeSheet(els.settingsSheet);
    els.newPasswordInput.value = '';
    els.confirmPasswordInput.value = '';
    els.passwordStatus.textContent = '';
    els.passwordStatus.classList.remove('error');
    openSheet(els.passwordSheet);
    setTimeout(() => els.newPasswordInput.focus(), 0);
  }

  async function savePassword(event) {
    event.preventDefault();
    if (!profile || !currentPlayer) return;
    const password = els.newPasswordInput.value;
    if (!validClientPassword(password)) {
      els.passwordStatus.classList.add('error');
      els.passwordStatus.textContent = t('password_invalid');
      return;
    }
    if (password !== els.confirmPasswordInput.value) {
      els.passwordStatus.classList.add('error');
      els.passwordStatus.textContent = t('password_mismatch');
      return;
    }
    els.passwordSaveBtn.disabled = true;
    els.passwordStatus.classList.remove('error');
    els.passwordStatus.textContent = t('password_saving');
    try {
      const data = await api('/api/auth', {
        method: 'POST', body: JSON.stringify({ action: 'set_password', ...profile, password })
      });
      adoptPlayer(data.player);
      els.passwordStatus.textContent = t('password_saved');
      els.newPasswordInput.value = '';
      els.confirmPasswordInput.value = '';
    } catch (error) {
      els.passwordStatus.classList.add('error');
      els.passwordStatus.textContent = error.message;
    } finally { els.passwordSaveBtn.disabled = false; }
  }

  async function signOut() {
    if (!profile || state.playing) return;
    const signedInProfile = { ...profile };
    els.logoutBtn.disabled = true;
    try {
      await api('/api/auth', {
        method: 'POST', body: JSON.stringify({ action: 'logout', ...signedInProfile })
      });
    } catch (_) {
      // Yerel çıkış her durumda tamamlanır; ulaşılamayan oturum sunucuda süreksiz bir anahtar olarak kalır.
    }
    closeSheet(els.settingsSheet);
    resetDeletedAccount('signed_out');
    loadLeaderboard(true);
  }

  function updateDeleteConfirmation() {
    const expected = profile?.username || '';
    els.deleteConfirmPrompt.textContent = t('delete_confirm_prompt', { username: expected || t('username') });
    const nameMatches = expected && els.deleteConfirmInput.value.trim().toLocaleLowerCase('tr-TR') === expected.toLocaleLowerCase('tr-TR');
    els.confirmDeleteBtn.disabled = !nameMatches || !els.deleteUnderstand.checked;
  }

  function openDeleteAccountDialog() {
    if (!profile || !currentPlayer || state.playing) return;
    closeSheet(els.settingsSheet);
    els.deleteConfirmInput.value = '';
    els.deleteUnderstand.checked = false;
    els.deleteAccountStatus.textContent = '';
    els.deleteAccountStatus.classList.remove('error');
    updateDeleteConfirmation();
    openSheet(els.deleteAccountSheet);
    setTimeout(() => els.deleteConfirmInput.focus(), 0);
  }

  function resetDeletedAccount(statusKey = 'account_deleted') {
    localStorage.removeItem('yorunge-profile-v2');
    localStorage.removeItem('yorunge-best');
    profile = null;
    currentPlayer = null;
    guestMode = false;
    best = 0;
    coins = 0;
    selectedMode = 'classic';
    selectedPlanet = 'mercury';
    ownedPlanets = ['mercury'];
    previousLeaguePositions = new Map();
    leagueData = { players: [], meteor_players: [], live_players: [], meteor_live_players: [] };
    els.profileForm.classList.remove('hidden');
    els.profileSummary.classList.add('hidden');
    els.profileSummary.disabled = true;
    els.usernameInput.value = '';
    els.passwordInput.value = '';
    els.profileError.textContent = t(statusKey);
    els.profileError.classList.remove('is-status');
    els.startBtn.disabled = true;
    els.shopBtn.disabled = false;
    els.homeMissionsBtn.disabled = true;
    els.homePlanetsBtn.disabled = true;
    els.deleteAccountBtn.disabled = true;
    els.deleteAccountBtn.classList.remove('hidden');
    els.adminBtn.classList.add('hidden');
    adminData = null;
    closeSheet(els.adminSheet);
    els.passwordAccountBtn.disabled = true;
    els.logoutBtn.disabled = true;
    els.leagueStatus.textContent = t('guest_status');
    els.result.classList.add('hidden');
    els.intro.classList.remove('hidden');
    applyPlanet(selectedPlanet);
    resetState();
    renderPlanetShop();
    updateModeUi();
    renderHud();
  }

  async function confirmAccountDeletion() {
    updateDeleteConfirmation();
    if (els.confirmDeleteBtn.disabled || !profile) return;
    const deletingProfile = { ...profile };
    els.confirmDeleteBtn.disabled = true;
    els.deleteConfirmInput.disabled = true;
    els.deleteUnderstand.disabled = true;
    els.deleteAccountStatus.classList.remove('error');
    els.deleteAccountStatus.textContent = t('deleting_account');
    let deletionConfirmed = false;
    let deletionError = null;
    try {
      await api('/api/account', {
        method: 'POST',
        body: JSON.stringify({
          playerId: deletingProfile.playerId,
          token: deletingProfile.token,
          confirmation: 'DELETE_ACCOUNT',
          confirmUsername: els.deleteConfirmInput.value.trim()
        })
      });
      deletionConfirmed = true;
    } catch (error) {
      deletionError = error;
      try {
        const accountState = await api('/api/account', { headers: {} });
        deletionConfirmed = !accountState.player;
      } catch (_) {
        // Sonuç doğrulanamazsa kullanıcıya ilk hatayı göster.
      }
    }
    if (deletionConfirmed) {
      closeSheet(els.deleteAccountSheet);
      resetDeletedAccount();
      loadLeaderboard(true);
    } else {
      els.deleteAccountStatus.classList.add('error');
      els.deleteAccountStatus.textContent = deletionError?.message || t('network_error');
    }
    els.deleteConfirmInput.disabled = false;
    els.deleteUnderstand.disabled = false;
    updateDeleteConfirmation();
  }

  function renderPlanetInfo(planet) {
    const facts = planetFacts[planet.id];
    if (!facts) return;
    const language = settings.language;
    els.planetInfoTitle.textContent = planetName(planet);
    els.planetInfoVisual.style.setProperty('--planet-card-color', planet.color);
    els.planetInfoVisual.style.setProperty('--planet-card-accent', planet.accent);
    els.planetInfoSummary.textContent = facts.summary[language];
    els.planetDiameter.textContent = facts.diameter[language];
    els.planetYear.textContent = facts.year[language];
    els.planetFeature.textContent = facts.feature[language];
    els.planetSource.href = facts.source;
  }

  function openPlanetInfo(planet) {
    selectedInfoPlanet = planet;
    renderPlanetInfo(planet);
    openSheet(els.planetInfoSheet);
  }

  function renderPlanetShop() {
    els.planetGrid.replaceChildren();
    planets.forEach((planet) => {
      const owned = ownedPlanets.includes(planet.id);
      const selected = selectedPlanet === planet.id;
      const card = document.createElement('article');
      card.className = 'planet-card-wrap';
      const button = document.createElement('button');
      button.type = 'button';
      const unaffordable = !owned && coins < planet.cost;
      button.className = `planet-card${selected ? ' selected' : ''}${unaffordable ? ' unaffordable' : ''}`;
      button.disabled = !profile;
      button.style.setProperty('--planet-card-color', planet.color);
      button.style.setProperty('--planet-card-accent', planet.accent);
      button.style.setProperty('--planet-size', `${planet.size}px`);
      const preview = document.createElement('span');
      preview.className = 'planet-preview';
      const copy = document.createElement('span');
      copy.className = 'planet-copy';
      const title = document.createElement('b');
      title.textContent = planetName(planet);
      const detail = document.createElement('span');
      detail.textContent = selected ? t('selected') : owned ? t('use') : t('coin_price', { cost: formatNumber(planet.cost) });
      const ability = document.createElement('small');
      ability.textContent = `${planetPower(planet)} · ${planetDetail(planet)}`;
      copy.append(title, detail, ability);
      button.append(preview, copy);
      button.addEventListener('click', () => changePlanet(planet, owned));
      const info = document.createElement('button');
      info.type = 'button';
      info.className = 'planet-info-btn';
      info.textContent = t('planet_info');
      info.setAttribute('aria-label', `${planetName(planet)} · ${t('real_planet')}`);
      info.addEventListener('click', () => openPlanetInfo(planet));
      card.append(button, info);
      els.planetGrid.append(card);
    });
    els.coinCount.textContent = formatNumber(coins);
    els.shopCoins.textContent = formatNumber(coins);
  }

  async function changePlanet(planet, owned) {
    if (!profile) {
      els.shopStatus.textContent = t('need_username');
      els.shopStatus.classList.add('error');
      return;
    }
    if (planet.id === selectedPlanet) return;
    if (!owned && coins < planet.cost) {
      els.shopStatus.textContent = t('not_enough_coins_detail', {
        planet: planetName(planet),
        needed: formatNumber(planet.cost - coins)
      });
      els.shopStatus.classList.add('error');
      beep(170, .1, 'sawtooth', .02);
      return;
    }
    els.shopStatus.classList.remove('error');
    els.shopStatus.textContent = owned ? t('planet_switching') : t('purchasing');
    try {
      const data = await api('/api/shop', {
        method: 'POST',
        body: JSON.stringify({ playerId: profile.playerId, token: profile.token, action: owned ? 'select' : 'purchase', planetId: planet.id })
      });
      showProfile(data.player);
      els.shopStatus.textContent = owned
        ? t('planet_selected', { planet: planetName(planet) })
        : t('planet_purchased', { planet: planetName(planet) });
      beep(620, .08, 'triangle');
    } catch (error) {
      els.shopStatus.classList.add('error');
      els.shopStatus.textContent = error.message;
    }
  }

  function renderProgression() {
    const quests = Array.isArray(currentPlayer?.daily_quests) ? currentPlayer.daily_quests : [];
    const completedQuests = quests.filter((quest) => quest.completed).length;
    els.dailySummary.textContent = `${completedQuests}/${quests.length || 3}`;

    els.dailyQuestList.replaceChildren();
    quests.forEach((quest) => {
      const row = document.createElement('div');
      row.className = 'quest-row';
      const copy = document.createElement('div');
      copy.className = 'quest-copy';
      const title = document.createElement('b');
      title.textContent = t(`quest_${quest.id}`);
      const detail = document.createElement('span');
      detail.textContent = t(`quest_${quest.id}_detail`, { goal: formatNumber(quest.goal) });
      const progress = document.createElement('div');
      progress.className = 'quest-progress';
      const fill = document.createElement('i');
      fill.style.width = `${Math.min(100, (Number(quest.progress) / Number(quest.goal)) * 100)}%`;
      progress.append(fill);
      copy.append(title, detail, progress);
      const claim = document.createElement('button');
      claim.type = 'button';
      claim.disabled = progressionBusy || !quest.completed || quest.claimed;
      claim.textContent = quest.claimed ? t('claimed') : quest.completed ? `${t('claim')} · ${quest.reward}◉` : t('in_progress', { progress: formatNumber(quest.progress), goal: formatNumber(quest.goal) });
      claim.addEventListener('click', () => claimDailyQuest(quest.id));
      row.append(copy, claim);
      els.dailyQuestList.append(row);
    });
  }

  async function claimDailyQuest(questId) {
    if (!profile || progressionBusy) return;
    progressionBusy = true;
    els.progressionStatus.classList.remove('error');
    els.progressionStatus.textContent = '';
    renderProgression();
    try {
      const data = await api('/api/progression', {
        method: 'POST',
        body: JSON.stringify({ playerId: profile.playerId, token: profile.token, action: 'claim_daily', questId })
      });
      showProfile(data.player);
      els.progressionStatus.textContent = t('quest_rewarded', { reward: formatNumber(data.reward) });
      beep(680, .09, 'triangle');
    } catch (error) {
      els.progressionStatus.classList.add('error');
      els.progressionStatus.textContent = error.message;
    } finally {
      progressionBusy = false;
      renderProgression();
    }
  }

  function openSheet(sheet) {
    if (state.resumeCounting) {
      cancelResumeCountdown();
      setPauseUi();
    }
    sheet.classList.remove('hidden');
    if (state.playing) {
      if (!state.manualPaused && !state.pausedBySheet) beginClockPause();
      state.pausedBySheet = true;
      syncLiveScore(false);
    }
  }

  function closeSheet(sheet) {
    sheet.classList.add('hidden');
    const anotherSheetOpen = document.querySelector('.sheet-backdrop:not(.hidden)');
    if (state.playing && state.pausedBySheet && !anotherSheetOpen) {
      state.pausedBySheet = false;
      if (!state.manualPaused) {
        syncLiveScore(true);
        resumeClock();
      }
    }
  }

  function handleBackAction() {
    if (!els.accountRemovedSheet.classList.contains('hidden')) return true;
    if (!els.adminDeleteSheet.classList.contains('hidden')) {
      closeAdminDeleteDialog();
      return true;
    }
    const openSheets = [...document.querySelectorAll('.sheet-backdrop:not(.hidden)')];
    if (openSheets.length) {
      closeSheet(openSheets[openSheets.length - 1]);
      return true;
    }
    if (!els.result.classList.contains('hidden')) {
      els.homeBtn.click();
      return true;
    }
    if (state.playing) {
      togglePause();
      return true;
    }
    return false;
  }

  window.yorungeHandleBack = handleBackAction;

  function beginClockPause() {
    cancelAnimationFrame(raf);
    state.pauseStartedAt = performance.now();
  }

  function resumeClock() {
    const now = performance.now();
    if (state.pauseStartedAt && state.slowUntil > state.pauseStartedAt) {
      state.slowUntil += now - state.pauseStartedAt;
    }
    state.pauseStartedAt = 0;
    state.lastAt = now;
    raf = requestAnimationFrame(frame);
  }

  function setPauseUi() {
    const paused = Boolean(state.manualPaused);
    const counting = Boolean(state.resumeCounting);
    els.pauseOverlay.classList.toggle('hidden', !paused || counting);
    els.pauseBtn.disabled = counting;
    els.pauseBtn.textContent = counting ? '…' : paused ? '▶' : 'Ⅱ';
    els.pauseBtn.setAttribute('aria-label', t(paused ? 'resume_label' : 'pause_label'));
  }

  function cancelResumeCountdown() {
    clearInterval(resumeTimer);
    resumeTimer = 0;
    state.resumeCounting = false;
    els.resumeCountdown.classList.add('hidden');
    els.pauseBtn.disabled = false;
  }

  function startResumeCountdown() {
    if (!state.playing || !state.manualPaused || state.pausedBySheet || state.resumeCounting) return;
    state.resumeCounting = true;
    els.pauseOverlay.classList.add('hidden');
    els.resumeCountdown.classList.remove('hidden');
    els.pauseBtn.disabled = true;
    els.pauseBtn.textContent = '…';
    let remaining = 3;
    const showCount = () => {
      els.resumeCountdownValue.textContent = String(remaining);
      els.resumeCountdownValue.style.animation = 'none';
      void els.resumeCountdownValue.offsetWidth;
      els.resumeCountdownValue.style.animation = '';
      beep(360 + (3 - remaining) * 120, .07, 'sine', .018);
    };
    showCount();
    clearInterval(resumeTimer);
    resumeTimer = setInterval(() => {
      remaining -= 1;
      if (remaining > 0) {
        showCount();
        return;
      }
      cancelResumeCountdown();
      state.manualPaused = false;
      syncLiveScore(true);
      resumeClock();
      setPauseUi();
      beep(720, .08, 'triangle', .022);
      setTimeout(() => els.pauseBtn.focus(), 0);
    }, 700);
  }

  function togglePause() {
    if (!state.playing || state.pausedBySheet) return;
    if (state.resumeCounting) {
      cancelResumeCountdown();
      setPauseUi();
      return;
    }
    if (state.manualPaused) return startResumeCountdown();
    state.manualPaused = true;
    beginClockPause();
    syncLiveScore(false);
    setPauseUi();
    setTimeout(() => els.resumeBtn.focus(), 0);
  }

  function abandonRun(returnHome = false) {
    if (!state.playing) return;
    state.playing = false;
    state.manualPaused = false;
    state.pausedBySheet = false;
    cancelResumeCountdown();
    els.deleteAccountBtn.disabled = !currentPlayer || Boolean(currentPlayer?.is_admin);
    els.passwordAccountBtn.disabled = !currentPlayer;
    els.logoutBtn.disabled = !currentPlayer;
    cancelAnimationFrame(raf);
    syncLiveScore(false);
    els.pauseOverlay.classList.add('hidden');
    els.pauseBtn.classList.add('hidden');
    if (returnHome) {
      document.body.classList.remove('is-playing');
      els.result.classList.add('hidden');
      els.intro.classList.remove('hidden');
      updateModeUi();
      loadLeaderboard();
    } else {
      startGame();
    }
  }

  function standardGateWidth(mode = state.mode) {
    return mode === 'meteor' ? meteorGateWidth : classicGateWidth;
  }

  function poweredGateWidth(mode = state.mode) {
    return Math.round(standardGateWidth(mode) * 1.3);
  }

  function resetState() {
    const baseSpeed = selectedMode === 'meteor' ? 1.34 : 1.5;
    state = {
      playing: false, pausedBySheet: false, pausedByVisibility: false, manualPaused: false, resumeCounting: false, pauseStartedAt: 0, lastAt: 0, elapsedMs: 0, angle: -Math.PI / 2,
      gateAngle: Math.PI * .12, gateBaseAngle: Math.PI * .12, gateAltAngle: 0, gateSpawnMs: 0, gateType: 'normal', speed: baseSpeed, baseSpeed, speedBoost: 0, accelerationFactor: 1, classicSpeedRelief: 0,
      gateWindow: .31, score: 0, stash: 0, streak: 0, hits: 0, perfect: 0,
      perfectChain: 0, bestPerfectChain: 0, perfectPowerChain: 0, lives: 3, locked: false, runId: '',
      mode: selectedMode, completed: false, stormLevel: 1,
      meteorDrops: [], nextMeteorSpawn: 0, catcherX: 0, fieldWidth: 0, fieldHeight: 0,
      powerUsed: false, powerActivatedOnce: false, wideGates: 0, currentGateBoosted: false, shieldCharges: 0,
      forcedPerfect: 0, slowUntil: 0, slowFactor: 1, direction: 1,
      gatePixelWidth: selectedMode === 'meteor' ? meteorGateWidth : classicGateWidth,
      gateBasePixelWidth: selectedMode === 'meteor' ? meteorGateWidth : classicGateWidth,
      nextDirectionChange: selectedMode === 'meteor' ? 7800 + Math.random() * 4200 : Infinity
    };
    els.gate.style.width = `${state.gatePixelWidth}px`;
    els.gateAlt.style.width = `${state.gatePixelWidth}px`;
    els.gateAlt.classList.add('hidden');
    els.gameCard.classList.remove('gate-special');
    renderPowerButton();
    setPauseUi();
  }

  function clearMeteorField() {
    if (!els.meteorField) return;
    els.meteorField.querySelectorAll('.meteor-drop').forEach((drop) => drop.remove());
    els.meteorField.classList.remove('active');
  }

  function positionMeteorCatcher(x) {
    if (!els.meteorField || !els.meteorCatcher) return;
    const width = els.meteorField.clientWidth || state.fieldWidth || 320;
    const catcherHalfWidth = Math.max(48, (els.meteorCatcher.offsetWidth || 102) / 2);
    state.fieldWidth = width;
    state.catcherX = Math.max(catcherHalfWidth, Math.min(width - catcherHalfWidth, Number(x) || width / 2));
    els.meteorCatcher.style.left = `${state.catcherX}px`;
  }

  function initializeMeteorField() {
    clearMeteorField();
    const rect = els.meteorField.getBoundingClientRect();
    state.fieldWidth = Math.max(260, rect.width || els.meteorField.clientWidth || 320);
    state.fieldHeight = Math.max(260, rect.height || els.meteorField.clientHeight || 360);
    state.nextMeteorSpawn = 260;
    positionMeteorCatcher(state.fieldWidth / 2);
    els.callout.textContent = t('meteor_steer');
  }

  function steerMeteorGate(event) {
    if (!state.playing || state.mode !== 'meteor' || state.manualPaused || state.pausedBySheet || state.pausedByVisibility) return;
    const rect = els.meteorField.getBoundingClientRect();
    positionMeteorCatcher(event.clientX - rect.left);
    els.meteorField.classList.add('active');
    event.preventDefault();
  }

  function meteorMultiplier() { return 1 + Math.min(state.streak, 20) * .08; }

  function spawnMeteor() {
    const width = els.meteorField.clientWidth || state.fieldWidth;
    const height = els.meteorField.clientHeight || state.fieldHeight;
    if (!width || !height) return;
    state.fieldWidth = width;
    state.fieldHeight = height;
    const roll = Math.random();
    const type = roll < .065 && state.lives < 3 ? 'life' : roll < .18 ? 'blue' : roll < .30 ? 'gold' : 'normal';
    const size = type === 'gold' ? 29 : type === 'life' || type === 'blue' ? 27 : 25 + Math.random() * 4;
    const x = size + Math.random() * Math.max(1, width - size * 2);
    const element = document.createElement('span');
    element.className = `meteor-drop${type === 'normal' ? '' : ` ${type}`}`;
    element.style.setProperty('--meteor-size', `${size}px`);
    els.meteorField.append(element);
    state.meteorDrops.push({
      element, type, size, x, y: -size, captureChecked: false, captured: false, captureOffset: Infinity,
      captureElapsed: 0, captureY: 0,
      velocity: 146 + Math.min(68, Math.max(0, state.stormLevel - 1) * 7) + Math.random() * 26
    });
  }

  function removeMeteor(drop) {
    drop.element.remove();
    const index = state.meteorDrops.indexOf(drop);
    if (index >= 0) state.meteorDrops.splice(index, 1);
  }

  function catchMeteor(drop, removeAfterCatch = true) {
    state.hits += 1;
    state.streak += 1;
    const centered = drop.captureOffset <= 18;
    if (centered) {
      state.perfect += 1;
      state.perfectChain += 1;
      state.bestPerfectChain = Math.max(state.bestPerfectChain, state.perfectChain);
    } else state.perfectChain = 0;
    const base = drop.type === 'gold' ? 300 : drop.type === 'life' ? 160 : drop.type === 'blue' ? 180 : 100;
    const gain = base;
    state.score += gain;
    state.stormLevel = 1 + Math.floor(state.hits / 10);
    if (drop.type === 'life') state.lives = Math.min(3, state.lives + 1);
    const messageKey = drop.type === 'gold' ? 'meteor_gold' : drop.type === 'life' ? 'meteor_life' : drop.type === 'blue' ? 'meteor_blue' : 'meteor_caught';
    say(t(messageKey, { gain }), drop.type === 'normal' ? 'good' : 'perfect');
    pulse(drop.type === 'gold' ? '#ffe56e' : drop.type === 'life' ? '#57e6ad' : drop.type === 'blue' ? '#73d6ff' : '#ff9d57');
    beep(drop.type === 'gold' ? 760 : drop.type === 'life' ? 640 : drop.type === 'blue' ? 570 : 510, .07, 'triangle');
    if (navigator.vibrate) navigator.vibrate(centered ? 15 : 8);
    if (removeAfterCatch) removeMeteor(drop);
  }

  function missMeteor(drop) {
    state.streak = 0;
    state.perfectChain = 0;
    state.lives -= 1;
    say(t('meteor_missed'), 'miss');
    pulse('#ff6474');
    beep(145, .14, 'sawtooth', .025);
    if (navigator.vibrate) navigator.vibrate([30, 20, 30]);
    removeMeteor(drop);
  }

  function meteorFrame(dt) {
    const width = els.meteorField.clientWidth || state.fieldWidth;
    const height = els.meteorField.clientHeight || state.fieldHeight;
    const previousWidth = state.fieldWidth || width;
    const previousHeight = state.fieldHeight || height;
    if (Math.abs(previousWidth - width) > 1 || Math.abs(previousHeight - height) > 1) {
      const widthRatio = width / Math.max(1, previousWidth);
      const heightRatio = height / Math.max(1, previousHeight);
      state.meteorDrops.forEach((drop) => {
        drop.x = Math.max(drop.size, Math.min(width - drop.size, drop.x * widthRatio));
        drop.y *= heightRatio;
      });
      state.catcherX *= widthRatio;
    }
    state.fieldWidth = width;
    state.fieldHeight = height;
    positionMeteorCatcher(state.catcherX || width / 2);
    const hitPressure = Math.min(.82, state.hits * .015);
    const timePressure = Math.min(.55, state.elapsedMs / 120000);
    const rawSpeedRatio = 1 + hitPressure + timePressure;
    const speedRatio = rawSpeedRatio <= 1.9 ? rawSpeedRatio : 1.9 + (rawSpeedRatio - 1.9) * .18;
    state.speed = state.baseSpeed * speedRatio;
    const spawnInterval = Math.max(340, 820 - state.stormLevel * 46 - Math.min(170, state.elapsedMs / 520));
    if (state.elapsedMs >= state.nextMeteorSpawn) {
      spawnMeteor();
      state.nextMeteorSpawn = state.elapsedMs + spawnInterval;
    }
    const catcherTop = els.meteorCatcher.offsetTop;
    const catcherHeight = els.meteorCatcher.offsetHeight || 24;
    const captureLine = catcherTop + catcherHeight * .48;
    const catcherHalfWidth = (els.meteorCatcher.offsetWidth || 102) / 2;
    for (const drop of [...state.meteorDrops]) {
      if (state.lives <= 0) break;
      if (drop.captured) {
        drop.captureElapsed += dt;
        const captureProgress = Math.min(1, drop.captureElapsed / .14);
        const scale = 1 - captureProgress * .68;
        const renderY = drop.captureY + captureProgress * catcherHeight * .58;
        drop.element.style.opacity = String(1 - captureProgress);
        drop.element.style.filter = `brightness(${1 + captureProgress * .75})`;
        drop.element.style.transform = `translate3d(${drop.x - drop.size / 2}px, ${renderY - drop.size / 2}px, 0) rotate(${renderY * .62}deg) scale(${scale})`;
        if (captureProgress >= 1) removeMeteor(drop);
        continue;
      }
      drop.y += drop.velocity * speedRatio * dt;
      if (!drop.captureChecked && drop.y >= captureLine) {
        drop.captureChecked = true;
        drop.captureOffset = Math.abs(drop.x - state.catcherX);
        drop.captured = drop.captureOffset <= catcherHalfWidth - drop.size * .2;
        if (drop.captured) {
          drop.captureElapsed = 0;
          drop.captureY = drop.y;
          drop.element.classList.add('captured');
          catchMeteor(drop, false);
          continue;
        }
      }
      drop.element.style.transform = `translate3d(${drop.x - drop.size / 2}px, ${drop.y - drop.size / 2}px, 0) rotate(${drop.y * .45}deg)`;
      if (drop.captureChecked && drop.y - drop.size / 2 > height) missMeteor(drop);
    }
  }

  function place(element, angle, distance, tangent = false) {
    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance;
    const rotation = tangent ? angle * 180 / Math.PI + 90 : 0;
    element.style.transform = `translate(-50%,-50%) translate(${x}px,${y}px) rotate(${rotation}deg)`;
  }

  function angularDistance(a, b) { return Math.abs(Math.atan2(Math.sin(a - b), Math.cos(a - b))); }
  function directedDistance(angle, target, direction) {
    return direction > 0 ? (target - angle + TAU) % TAU : (angle - target + TAU) % TAU;
  }

  function scheduleDirectionChange() {
    const interval = Math.max(4300, 9500 - state.stormLevel * 210) + Math.random() * 3600;
    state.nextDirectionChange = state.elapsedMs + interval;
  }

  function chooseGateType() {
    if (state.hits === 0) return 'normal';
    const difficulty = state.mode === 'meteor' ? state.stormLevel : 1 + Math.floor(state.hits / 3);
    const pool = ['normal', 'normal', 'normal', 'drift', 'gold'];
    if (difficulty >= 2) pool.push('pulse');
    if (difficulty >= 3) pool.push('twin');
    if (difficulty >= 4) pool.push('blink');
    if (state.mode === 'meteor' && difficulty >= 2) pool.push('hazard');
    if (state.mode === 'meteor' && difficulty >= 5) pool.push('hazard');
    return pool[Math.floor(Math.random() * pool.length)];
  }

  function updateGatePresentation() {
    const phase = Math.max(0, state.elapsedMs - state.gateSpawnMs);
    state.gateAngle = state.gateBaseAngle;
    state.gatePixelWidth = state.gateBasePixelWidth;
    if (state.gateType === 'drift') {
      state.gateAngle = (state.gateBaseAngle + Math.sin(phase / 540) * .13 + TAU) % TAU;
    } else if (state.gateType === 'pulse') {
      state.gatePixelWidth = Math.max(34, state.gateBasePixelWidth * (.78 + (.5 + .5 * Math.sin(phase / 230)) * .28));
    }
    const blinkDimmed = state.gateType === 'blink' && Math.sin(phase / 150) < -.05;
    els.gate.classList.toggle('dimmed', blinkDimmed);
    els.gate.style.width = `${state.gatePixelWidth}px`;
    place(els.gate, state.gateAngle, radius, true);
    if (state.gateType === 'twin') {
      els.gateAlt.style.width = `${state.gatePixelWidth}px`;
      place(els.gateAlt, state.gateAltAngle, radius, true);
    }
  }

  function newGate() {
    let next;
    do next = Math.random() * TAU; while (angularDistance(next, state.angle) < .75);
    state.gateBaseAngle = next;
    state.gateAngle = next;
    state.gateAltAngle = (next - state.direction * (.58 + Math.random() * .28) + TAU) % TAU;
    state.gateSpawnMs = state.elapsedMs;
    state.gateType = chooseGateType();
    state.currentGateBoosted = state.wideGates > 0;
    state.gateWindow = state.currentGateBoosted ? .403 : .31;
    state.gateBasePixelWidth = state.currentGateBoosted ? poweredGateWidth() : standardGateWidth();
    state.gatePixelWidth = state.gateBasePixelWidth;
    els.gate.className = `gate${state.gateType === 'gold' ? ' gold' : ''}${state.gateType === 'pulse' ? ' pulse-gate' : ''}${state.gateType === 'hazard' ? ' hazard' : ''}`;
    els.gateAlt.className = `gate gate-alt${state.gateType === 'twin' ? '' : ' hidden'}`;
    els.gameCard.classList.toggle('gate-special', state.gateType !== 'normal');
    els.gateBadge.textContent = state.gateType === 'normal' ? '' : t(`gate_${state.gateType}`);
    updateGatePresentation();
  }

  function advanceGate() {
    if (state.currentGateBoosted && state.wideGates > 0) state.wideGates -= 1;
    newGate();
  }

  function renderPowerButton() {
    const planet = planets.find((item) => item.id === selectedPlanet) || planets[0];
    els.powerName.textContent = `${planetName(planet).toLocaleUpperCase(locale())} · ${planetPower(planet).toLocaleUpperCase(locale())}`;
    if (!state.playing) {
      els.powerBtn.disabled = true;
      els.powerHint.textContent = planetDetail(planet);
      return;
    }
    els.powerBtn.disabled = state.powerUsed;
    els.powerHint.textContent = state.powerUsed
      ? t(state.mode === 'classic' ? 'power_classic_used' : 'power_used')
      : t(state.mode === 'classic' ? 'power_classic_ready' : 'power_ready');
  }

  function activatePower(automatic = false) {
    if (!state.playing || (automatic && !state.powerActivatedOnce) || (!automatic && state.powerUsed) || state.pausedBySheet || state.manualPaused) return;
    const planet = planets.find((item) => item.id === selectedPlanet) || planets[0];
    if (!automatic) {
      state.powerActivatedOnce = true;
      state.perfectPowerChain = 0;
    }
    state.powerUsed = true;
    if (planet.type === 'wide' || planet.type === 'storm') {
      state.wideGates = planet.amount;
      state.currentGateBoosted = true;
      state.gateWindow = .403;
      state.gateBasePixelWidth = poweredGateWidth();
      state.gatePixelWidth = state.gateBasePixelWidth;
      updateGatePresentation();
    }
    if (planet.type === 'shield') state.shieldCharges = planet.amount;
    if (planet.type === 'perfect') state.forcedPerfect = planet.amount;
    if (planet.type === 'slow' || planet.type === 'storm') {
      state.slowFactor = planet.factor;
      state.slowUntil = performance.now() + planet.duration;
    }
    if (planet.type === 'storm') state.shieldCharges = 1;
    say(t('power_active', { power: planetPower(planet).toLocaleUpperCase(locale()) }), 'perfect');
    pulse(planet.color);
    beep(610, .09, 'triangle');
    renderPowerButton();
  }

  function beep(frequency, duration = .055, type = 'sine', volume = .035) {
    if (muted) return;
    try {
      audio ||= new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audio.createOscillator();
      const gain = audio.createGain();
      oscillator.type = type;
      oscillator.frequency.value = frequency;
      gain.gain.setValueAtTime(volume, audio.currentTime);
      gain.gain.exponentialRampToValueAtTime(.0001, audio.currentTime + duration);
      oscillator.connect(gain).connect(audio.destination);
      oscillator.start();
      oscillator.stop(audio.currentTime + duration);
    } catch (_) {}
  }

  function pulse(color) {
    els.flash.style.setProperty('--flash', color);
    els.flash.classList.remove('pop');
    void els.flash.offsetWidth;
    els.flash.classList.add('pop');
  }

  function say(text, type = '') {
    els.callout.textContent = text;
    els.callout.className = `callout ${type}`;
    clearTimeout(say.timer);
    say.timer = setTimeout(() => {
      if (!state.playing) return;
      els.callout.textContent = t(state.mode === 'meteor' ? 'meteor_steer' : 'tap_hint');
      els.callout.className = 'callout';
    }, 760);
  }

  function multiplier() { return 1 + Math.min(state.streak, 12) * .18; }

  function renderHud() {
    els.objectiveLabel.textContent = t('speed');
    els.objective.textContent = `×${(state.speed / state.baseSpeed).toFixed(2)}`;
    els.scoreLabel.textContent = t(state.mode === 'meteor' ? 'meteor_score' : 'vault');
    els.comboLabel.textContent = t('streak');
    els.score.textContent = formatNumber(Math.round(state.score));
    els.stash.textContent = formatNumber(Math.round(state.stash));
    els.combo.textContent = state.mode === 'meteor' ? `×${meteorMultiplier().toFixed(2)}` : `×${multiplier().toFixed(2)}`;
    document.querySelectorAll('.life').forEach((dot, index) => dot.classList.toggle('lost', index >= state.lives));
    const canBank = state.mode === 'classic' && state.playing && state.streak >= 3 && state.stash > 0;
    els.bankBtn.disabled = !canBank;
    els.bankHint.textContent = canBank
      ? t('bank_secure', { energy: formatNumber(Math.round(state.stash)) })
      : t('bank_more', { count: Math.max(0, 3 - state.streak) });
  }

  function classicCurveSpeed() {
    const rawSpeed = state.baseSpeed
      + Math.log1p(state.elapsedMs / 7000) * .94 * state.accelerationFactor
      + state.speedBoost;
    const softCap = state.baseSpeed * 2.5;
    return rawSpeed <= softCap ? rawSpeed : softCap + (rawSpeed - softCap) * .05;
  }

  function applyClassicPerfectSlowdown() {
    const curveSpeed = classicCurveSpeed();
    const currentSpeed = Math.max(state.baseSpeed, curveSpeed - state.classicSpeedRelief);
    const reducedSpeed = Math.max(state.baseSpeed, currentSpeed - .5);
    state.classicSpeedRelief = Math.min(.72, Math.max(0, curveSpeed - reducedSpeed));
    state.speed = reducedSpeed;
  }

  function emptyPass() {
    if (state.mode === 'meteor') {
      if (state.gateType === 'hazard') {
        const gain = 80 + state.stormLevel * 15;
        state.hits += 1;
        state.streak += 1;
        state.score += gain;
        state.speedBoost += .015;
        state.stormLevel = 1 + Math.floor(state.hits / 7);
        say(t('hazard_dodged', { gain }), 'perfect');
        pulse('#57e6ad');
        beep(560, .07, 'triangle');
        advanceGate();
      } else {
        meteorFailure('meteor_gate_missed');
      }
      renderHud();
      return;
    }
    state.accelerationFactor += .1;
    state.speedBoost += .06;
    state.perfectChain = 0;
    state.perfectPowerChain = 0;
    say(t('empty_pass'), 'miss');
    beep(205, .06, 'sawtooth', .018);
    renderHud();
  }

  function frame(now) {
    if (!state.playing || state.pausedBySheet || state.pausedByVisibility || state.manualPaused) return;
    const dt = Math.min(.035, (now - state.lastAt) / 1000 || 0);
    state.lastAt = now;
    state.elapsedMs += dt * 1000;
    if (state.mode === 'meteor') {
      meteorFrame(dt);
      renderHud();
      if (state.lives <= 0) return endGame();
      raf = requestAnimationFrame(frame);
      return;
    }
    if (state.mode === 'meteor' && state.elapsedMs >= state.nextDirectionChange) {
      state.direction *= -1;
      els.gameCard.classList.toggle('reverse', state.direction < 0);
      scheduleDirectionChange();
      say(t('direction_changed'), 'miss');
      beep(260, .08, 'square', .02);
    }
    if (state.mode === 'classic' && state.classicSpeedRelief > 0) {
      state.classicSpeedRelief = Math.max(0, state.classicSpeedRelief - .42 * dt);
    }
    const classicSpeed = Math.max(state.baseSpeed, classicCurveSpeed() - state.classicSpeedRelief);
    const meteorSpeed = Math.min(4.15, state.baseSpeed + Math.log1p(state.elapsedMs / 8500) * .68 + state.speedBoost);
    const naturalSpeed = state.mode === 'meteor' ? meteorSpeed : classicSpeed;
    const powerSlow = now < state.slowUntil ? state.slowFactor : 1;
    state.speed = naturalSpeed * powerSlow;
    updateGatePresentation();
    const before = directedDistance(state.angle, state.gateAngle, state.direction);
    state.angle = (state.angle + state.direction * state.speed * dt + TAU) % TAU;
    updateGatePresentation();
    const after = directedDistance(state.angle, state.gateAngle, state.direction);
    if (after > before) emptyPass();
    place(els.runner, state.angle, radius);
    renderHud();
    if (state.lives <= 0) return endGame();
    raf = requestAnimationFrame(frame);
  }

  function catchPlanet() {
    if (!state.playing || state.mode === 'meteor' || state.locked || state.pausedBySheet || state.manualPaused) return;
    state.locked = true;
    setTimeout(() => { if (!state.completed) state.locked = false; }, 105);
    const mainDistance = angularDistance(state.angle, state.gateAngle) * radius;
    const altDistance = state.gateType === 'twin' ? angularDistance(state.angle, state.gateAltAngle) * radius : Infinity;
    const centerDistance = Math.min(mainDistance, altDistance);
    const gateHalfWidth = state.gatePixelWidth / 2;
    const circleTouchesGate = centerDistance <= gateHalfWidth + runnerRadius;
    if (state.mode === 'meteor' && state.gateType === 'hazard') {
      meteorFailure('hazard_hit');
      renderHud();
      return;
    }
    const validCatch = circleTouchesGate;
    if (validCatch) {
      const forcedPerfect = state.forcedPerfect > 0;
      const perfectTolerance = Math.max(8, gateHalfWidth - runnerRadius);
      const circleCenteredInGate = centerDistance <= perfectTolerance;
      const perfect = forcedPerfect || circleCenteredInGate;
      if (forcedPerfect) state.forcedPerfect -= 1;
      state.streak += 1;
      state.hits += 1;
      if (perfect) {
        state.perfect += 1;
        state.perfectChain += 1;
        state.bestPerfectChain = Math.max(state.bestPerfectChain, state.perfectChain);
        if (state.mode === 'classic') applyClassicPerfectSlowdown();
      } else state.perfectChain = 0;
      if (state.mode === 'classic') {
        state.perfectPowerChain = state.powerActivatedOnce && perfect ? state.perfectPowerChain + 1 : 0;
      }
      const reactivatePower = state.mode === 'classic' && state.powerActivatedOnce && state.perfectPowerChain >= 3;
      if (reactivatePower) {
        state.perfectPowerChain = 0;
        state.powerUsed = false;
      }
      const goldenGate = state.gateType === 'gold';
      const gain = Math.round((perfect ? 120 : 72) * multiplier() * (goldenGate ? 2 : 1));
      if (state.mode === 'classic') state.stash += gain;
      else {
        state.score += gain;
        state.speedBoost += perfect ? .028 : .018;
        state.stormLevel = 1 + Math.floor(state.hits / 7);
      }
      if (goldenGate && state.mode === 'meteor') state.shieldCharges = Math.min(2, state.shieldCharges + 1);
      const catchMessage = goldenGate
        ? state.mode === 'classic' ? t('golden_gain', { gain }) : `${t('golden_gain', { gain })} · ${t('golden_guard')}`
        : perfect
        ? t('perfect_gain', { gain })
        : t('good_gain', { gain });
      say(catchMessage, perfect ? 'perfect' : 'good');
      pulse(perfect ? '#aaf56f' : '#ffe19a');
      beep(perfect ? 720 : 510, .07, 'triangle');
      if (navigator.vibrate) navigator.vibrate(perfect ? 16 : 9);
      advanceGate();
      if (reactivatePower) activatePower(true);
    } else {
      const lost = state.mode === 'classic' ? Math.round(state.stash) : 0;
      state.stash = 0;
      state.streak = 0;
      if (state.mode === 'classic') state.perfectChain = 0;
      state.perfectPowerChain = 0;
      const accelerated = false;
      if (state.shieldCharges > 0) {
        state.shieldCharges -= 1;
        say(t(accelerated ? 'shield_speed' : 'shield'), 'good');
        pulse('#78d7ff');
        beep(390, .09, 'triangle');
        advanceGate();
        renderHud();
        return;
      }
      state.lives -= 1;
      say(lost ? t('lost_energy', { lost: formatNumber(lost) }) : t(accelerated ? 'missed_speed' : 'missed'), 'miss');
      pulse('#ff6474');
      beep(145, .16, 'sawtooth', .025);
      els.gameCard.classList.remove('shake');
      void els.gameCard.offsetWidth;
      els.gameCard.classList.add('shake');
      if (navigator.vibrate) navigator.vibrate([35, 25, 35]);
      if (state.lives <= 0) setTimeout(endGame, 240);
      else advanceGate();
    }
    renderHud();
  }

  function meteorFailure(messageKey) {
    state.streak = 0;
    state.perfectChain = 0;
    state.perfectPowerChain = 0;
    state.speedBoost += .035;
    if (state.shieldCharges > 0) {
      state.shieldCharges -= 1;
      say(t('shield'), 'good');
      pulse('#78d7ff');
      beep(390, .09, 'triangle');
      advanceGate();
      return;
    }
    state.lives -= 1;
    say(t(messageKey), 'miss');
    pulse('#ff6474');
    beep(145, .16, 'sawtooth', .025);
    els.gameCard.classList.remove('shake');
    void els.gameCard.offsetWidth;
    els.gameCard.classList.add('shake');
    if (navigator.vibrate) navigator.vibrate([35, 25, 35]);
    if (state.lives > 0) advanceGate();
  }

  function bank() {
    if (!state.playing || state.mode !== 'classic' || state.streak < 3 || !state.stash) return;
    const bonus = Math.round(state.stash * Math.min(.35, state.streak * .025));
    const total = Math.round(state.stash + bonus);
    state.score += total;
    state.stash = 0;
    state.streak = 0;
    say(t('banked', { total: formatNumber(total) }), 'perfect');
    pulse('#57e6ad');
    beep(420, .06);
    setTimeout(() => beep(620, .08), 55);
    renderHud();
  }

  async function syncLiveScore(active = true) {
    if (!profile || (active && (!state.playing || state.manualPaused || state.pausedBySheet || state.pausedByVisibility))) return;
    if (liveSyncing) {
      if (!active) setTimeout(() => syncLiveScore(false), 250);
      return;
    }
    liveSyncing = true;
    try {
      await api('/api/live-score', {
        method: 'POST',
        body: JSON.stringify({
          playerId: profile.playerId,
          token: profile.token,
          active,
          score: active ? Math.round(state.score) : 0,
          mode: state.mode || selectedMode
        })
      });
    } catch (_) {
      // Canlı yayın isteği oyunun kendisini kesintiye uğratmaz.
    } finally { liveSyncing = false; }
  }

  function startGame() {
    if (!profile && !guestMode) {
      els.usernameInput.focus();
      return;
    }
    cancelAnimationFrame(raf);
    cancelResumeCountdown();
    resetState();
    state.playing = true;
    document.body.classList.add('is-playing');
    els.deleteAccountBtn.disabled = true;
    els.passwordAccountBtn.disabled = true;
    els.logoutBtn.disabled = true;
    state.runId = randomKey(16);
    state.lastAt = performance.now();
    els.gameCard.classList.toggle('meteor', state.mode === 'meteor');
    els.gameCard.classList.remove('reverse');
    els.intro.classList.add('hidden');
    els.result.classList.add('hidden');
    els.pauseOverlay.classList.add('hidden');
    els.pauseBtn.classList.remove('hidden');
    if (state.mode === 'meteor') initializeMeteorField();
    else {
      newGate();
      place(els.runner, state.angle, radius);
    }
    renderHud();
    renderPowerButton();
    setPauseUi();
    syncLiveScore(true);
    beep(330, .05);
    setTimeout(() => beep(520, .08), 70);
    raf = requestAnimationFrame(frame);
  }

  async function submitRun(final, snapshot) {
    if (guestMode) {
      els.resultRank.textContent = t('guest_result');
      els.againBtn.disabled = false;
      return;
    }
    if (!profile) return;
    try {
      const data = await api('/api/score', {
        method: 'POST',
        body: JSON.stringify({
          playerId: profile.playerId,
          token: profile.token,
          runId: snapshot.runId,
          score: final,
          hits: snapshot.hits,
          perfect: snapshot.perfect,
          bestPerfectStreak: snapshot.bestPerfectStreak,
          durationMs: snapshot.durationMs,
          mode: snapshot.mode
        })
      });
      const player = data.player;
      state.resultData = { data, snapshot };
      renderResultServer();
      showProfile(player);
      loadLeaderboard();
    } catch (error) {
      state.resultError = error.message;
      els.resultRank.textContent = error.message;
      els.againBtn.disabled = false;
    }
    finally { syncLiveScore(false); }
  }

  function renderResultServer() {
    if (state.resultError) {
      els.resultRank.textContent = state.resultError;
      return;
    }
    if (!state.resultData) return;
    const { data, snapshot } = state.resultData;
    const player = data.player;
    const reward = Number(data.coins_awarded) || 0;
    const resultText = currentPlayer?.is_admin
      ? t('admin_result')
      : snapshot.mode === 'meteor'
        ? `${t('meteor_result_rank', { rank: player.meteor_rank || '–', games: formatNumber(player.meteor_games) })}${reward ? ` · ${t('meteor_reward', { reward: formatNumber(reward) })}` : ''}`
        : t('classic_result_rank', { rank: player.score_rank || '–', games: formatNumber(player.classic_games) });
    els.resultRank.textContent = resultText;
    els.againBtn.textContent = t('play_again');
    els.againBtn.disabled = false;
  }

  function renderResultSummary() {
    const final = Number(state.finalScore) || 0;
    els.resultGrid.classList.remove('hidden');
    els.finalScore.textContent = formatNumber(final);
    els.finalHits.textContent = state.hits;
    els.finalHitsLabel.textContent = t('hit');
    els.finalPerfect.textContent = state.perfect;
    els.finalPerfectLabel.textContent = t('perfect');
    els.finalBest.textContent = formatNumber(state.mode === 'meteor' ? meteorBest : best);
    els.finalBestLabel.textContent = t('record');
    els.resultEyebrow.textContent = t(state.mode === 'meteor' ? 'meteor_completed' : 'classic_completed');
    els.resultNote.textContent = state.wasRecord ? t('personal_best') : t('lives_out');
    els.resultRank.textContent = guestMode ? t('guest_result') : t('score_saving');
    els.againBtn.textContent = t('play_again');
    els.againBtn.disabled = false;
    if (!guestMode) renderResultServer();
  }

  function continueFromResult() {
    startGame();
  }

  function endGame() {
    if (!state.playing) return;
    state.playing = false;
    els.deleteAccountBtn.disabled = !currentPlayer || Boolean(currentPlayer?.is_admin);
    els.passwordAccountBtn.disabled = !currentPlayer;
    els.logoutBtn.disabled = !currentPlayer;
    state.manualPaused = false;
    cancelResumeCountdown();
    cancelAnimationFrame(raf);
    els.pauseOverlay.classList.add('hidden');
    els.pauseBtn.classList.add('hidden');
    renderPowerButton();
    const final = Math.round(state.score);
    const snapshot = {
      runId: state.runId,
      hits: state.hits,
      perfect: state.perfect,
      bestPerfectStreak: state.bestPerfectChain,
      durationMs: Math.max(800, Math.min(86400000, Math.round(state.elapsedMs))),
      mode: state.mode
    };
    const oldBest = state.mode === 'meteor' ? meteorBest : best;
    if (state.mode === 'meteor' && final > meteorBest) {
      meteorBest = final;
      if (!guestMode) localStorage.setItem('yorunge-meteor-best', String(meteorBest));
    } else if (state.mode === 'classic' && final > best) {
      best = final;
      if (!guestMode) localStorage.setItem('yorunge-best', String(best));
    }
    state.finalScore = final;
    state.wasRecord = final > oldBest;
    state.resultData = null;
    state.resultError = '';
    renderResultSummary();
    setTimeout(() => els.result.classList.remove('hidden'), 250);
    submitRun(final, snapshot);
    beep(250, .1, 'triangle');
  }

  els.profileForm.addEventListener('submit', (event) => {
    const action = event.submitter?.dataset.authAction === 'register' ? 'register' : 'login';
    authenticateWithPassword(action, event);
  });
  els.guestBtn.addEventListener('click', enterGuestMode);
  els.startBtn.addEventListener('click', requestStartGame);
  els.tutorialLaterBtn.addEventListener('click', () => closeSheet(els.tutorialSheet));
  els.tutorialStartBtn.addEventListener('click', startFromTutorial);
  els.homeMissionsBtn.addEventListener('click', () => {
    if (!currentPlayer) return;
    els.progressionStatus.textContent = '';
    els.progressionStatus.classList.remove('error');
    renderProgression();
    openSheet(els.progressionSheet);
  });
  document.querySelectorAll('[data-league-view]').forEach((button) => button.addEventListener('click', () => {
    leagueView = ['classic', 'meteor'].includes(button.dataset.leagueView) ? button.dataset.leagueView : 'classic';
    previousLeaguePositions = new Map();
    renderLeagueView();
  }));
  els.againBtn.addEventListener('click', continueFromResult);
  els.homeBtn.addEventListener('click', () => {
    document.body.classList.remove('is-playing');
    els.result.classList.add('hidden');
    els.intro.classList.remove('hidden');
    updateModeUi();
    loadLeaderboard();
  });
  document.querySelectorAll('.mode-card').forEach((button) => button.addEventListener('click', () => selectMode(button.dataset.mode)));
  document.addEventListener('pointerdown', (event) => {
    if (!state.playing || state.manualPaused || state.pausedBySheet || state.pausedByVisibility) return;
    if (state.mode === 'meteor') return;
    if (event.button !== undefined && event.button !== 0) return;
    if (event.target.closest('button, input, label, a, .sheet-backdrop, .overlay:not(.hidden), .power-control, .controls')) return;
    event.preventDefault();
    catchPlanet();
  });
  els.meteorField.addEventListener('pointerdown', (event) => {
    if (event.button !== undefined && event.button !== 0) return;
    els.meteorField.setPointerCapture?.(event.pointerId);
    steerMeteorGate(event);
  });
  els.meteorField.addEventListener('pointermove', (event) => {
    if (event.buttons === 0 && event.pointerType !== 'touch') return;
    steerMeteorGate(event);
  });
  els.bankBtn.addEventListener('pointerdown', (event) => { event.preventDefault(); bank(); });
  els.powerBtn.addEventListener('pointerdown', (event) => { event.preventDefault(); activatePower(); });
  els.pauseBtn.addEventListener('click', togglePause);
  els.resumeBtn.addEventListener('click', togglePause);
  els.restartBtn.addEventListener('click', () => abandonRun(false));
  els.pauseHomeBtn.addEventListener('click', () => abandonRun(true));
  els.profileSummary.addEventListener('click', () => {
    if (guestMode) {
      leaveGuestMode();
      return;
    }
    if (!currentPlayer) return;
    renderPlayerProfile();
    openSheet(els.profileSheet);
  });
  els.settingsBtn.addEventListener('click', () => {
    els.deleteAccountBtn.disabled = !currentPlayer || state.playing || Boolean(currentPlayer?.is_admin);
    els.passwordAccountBtn.disabled = !currentPlayer || state.playing;
    els.logoutBtn.disabled = !currentPlayer || state.playing;
    if (currentPlayer) els.passwordAccountBtn.textContent = t(currentPlayer.has_password ? 'password_change' : 'password_manage');
    openSheet(els.settingsSheet);
  });
  els.homeSettingsBtn.addEventListener('click', () => els.settingsBtn.click());
  els.adminBtn.addEventListener('click', () => {
    if (!currentPlayer?.is_admin) return;
    openSheet(els.adminSheet);
    loadAdminDashboard();
  });
  els.adminRefreshBtn.addEventListener('click', loadAdminDashboard);
  els.adminSearch.addEventListener('input', () => {
    clearTimeout(adminSearchTimer);
    adminSearchTimer = setTimeout(loadAdminDashboard, 280);
  });
  els.adminDeleteCloseBtn.addEventListener('click', closeAdminDeleteDialog);
  els.adminDeleteCancelBtn.addEventListener('click', closeAdminDeleteDialog);
  els.adminDeleteConfirmBtn.addEventListener('click', deletePlayerFromAdmin);
  els.removedCreateBtn.addEventListener('click', () => continueAfterAccountRemoval('create_account_hint'));
  els.removedLoginBtn.addEventListener('click', () => continueAfterAccountRemoval('sign_in_other_hint'));
  els.passwordAccountBtn.addEventListener('click', openPasswordDialog);
  els.passwordForm.addEventListener('submit', savePassword);
  els.logoutBtn.addEventListener('click', signOut);
  els.deleteAccountBtn.addEventListener('click', openDeleteAccountDialog);
  els.deleteConfirmInput.addEventListener('input', updateDeleteConfirmation);
  els.deleteUnderstand.addEventListener('change', updateDeleteConfirmation);
  els.confirmDeleteBtn.addEventListener('click', confirmAccountDeletion);
  els.shopBtn.addEventListener('click', () => {
    els.shopStatus.textContent = profile ? '' : t('need_username');
    els.shopStatus.classList.toggle('error', !profile);
    renderPlanetShop();
    openSheet(els.shopSheet);
  });
  els.homePlanetsBtn.addEventListener('click', () => els.shopBtn.click());
  document.querySelectorAll('[data-close]').forEach((button) => button.addEventListener('click', () => closeSheet($(button.dataset.close))));
  document.querySelectorAll('[data-theme-choice]').forEach((button) => button.addEventListener('click', () => {
    settings.theme = button.dataset.themeChoice;
    applySettings();
  }));
  document.querySelectorAll('[data-sound-choice]').forEach((button) => button.addEventListener('click', () => {
    settings.sound = button.dataset.soundChoice;
    applySettings();
    if (!muted) beep(520, .06);
  }));
  document.querySelectorAll('[data-language-choice]').forEach((button) => button.addEventListener('click', () => {
    settings.language = button.dataset.languageChoice === 'en' ? 'en' : 'tr';
    applySettings();
  }));
  document.querySelectorAll('.sheet-backdrop').forEach((backdrop) => backdrop.addEventListener('pointerdown', (event) => {
    if (event.target !== backdrop) return;
    if (backdrop === els.accountRemovedSheet) return;
    if (backdrop === els.adminDeleteSheet) closeAdminDeleteDialog();
    else closeSheet(backdrop);
  }));
  document.addEventListener('keydown', (event) => {
    if (state.playing && state.mode === 'meteor' && (event.code === 'ArrowLeft' || event.code === 'KeyA' || event.code === 'ArrowRight' || event.code === 'KeyD')) {
      event.preventDefault();
      positionMeteorCatcher(state.catcherX + (event.code === 'ArrowLeft' || event.code === 'KeyA' ? -34 : 34));
      return;
    }
    if ((event.code === 'Space' || event.code === 'Enter') && state.playing) {
      event.preventDefault();
      catchPlanet();
    }
    if (event.code === 'KeyB' && state.playing) bank();
    if (event.code === 'Escape') {
      handleBackAction();
    }
  });
  document.addEventListener('visibilitychange', () => {
    if (!state.playing) return;
    if (document.hidden) {
      if (state.resumeCounting) {
        cancelResumeCountdown();
        setPauseUi();
      }
      if (!state.pausedBySheet && !state.manualPaused) beginClockPause();
      state.pausedByVisibility = true;
      syncLiveScore(false);
    } else if (state.pausedByVisibility) {
      state.pausedByVisibility = false;
      if (!state.pausedBySheet && !state.manualPaused) {
        syncLiveScore(true);
        resumeClock();
      }
    }
  });

  applySettings();
  applyPlanet(selectedPlanet);
  resetState();
  place(els.runner, state.angle, radius);
  place(els.gate, state.gateAngle, radius, true);
  renderPlanetShop();
  updateModeUi();
  renderHud();
  if (profile) syncProfile();
  else restoreAccountProfile();
  loadLeaderboard(true);
  setInterval(() => syncLiveScore(true), 2500);
  setInterval(() => loadLeaderboard(), 3000);
  setInterval(() => checkAccountStatus(), 5000);
  setInterval(() => {
    if (!els.adminSheet.classList.contains('hidden')) loadAdminDashboard();
  }, 4000);
})();
