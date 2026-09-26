import { spawnSync } from 'node:child_process';
import { join } from 'node:path';

const wrangler = join(process.cwd(), 'node_modules', 'wrangler', 'bin', 'wrangler.js');
const result = spawnSync(process.execPath, [
  wrangler,
  'd1', 'migrations', 'apply', 'yorunge-kasasi',
  '--local', '--config', 'wrangler.jsonc'
], {
  cwd: process.cwd(),
  env: { ...process.env, CI: 'true' },
  stdio: 'inherit'
});

if (result.error) {
  console.error('Yerel veritabanı başlatılamadı:', result.error.message);
  process.exit(1);
}

process.exit(result.status ?? 1);
