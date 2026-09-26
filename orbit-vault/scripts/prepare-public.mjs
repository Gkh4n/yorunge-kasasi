import { copyFileSync, mkdirSync } from 'node:fs';

mkdirSync('public', { recursive: true });
copyFileSync('index.html', 'public/game.html');
copyFileSync('game.css', 'public/game.css');
copyFileSync('game.js', 'public/game.js');
