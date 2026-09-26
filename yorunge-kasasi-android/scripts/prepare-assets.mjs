import { copyFile, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const project = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const game = resolve(project, '..', 'orbit-vault');
const output = resolve(project, 'app', 'src', 'main', 'assets', 'www');

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });

let html = await readFile(resolve(game, 'index.html'), 'utf8');
html = html
  .replace('href="/favicon.svg"', 'href="./favicon.svg"')
  .replace('href="/game.css"', 'href="./game.css"')
  .replace('<script src="/game.js" defer></script>', '<script src="./local-api.js"></script>\n  <script src="./game.js" defer></script>');

await writeFile(resolve(output, 'index.html'), html);
await copyFile(resolve(game, 'game.css'), resolve(output, 'game.css'));
await copyFile(resolve(game, 'game.js'), resolve(output, 'game.js'));
await copyFile(resolve(game, 'public', 'favicon.svg'), resolve(output, 'favicon.svg'));
await copyFile(resolve(project, 'local-api.js'), resolve(output, 'local-api.js'));
