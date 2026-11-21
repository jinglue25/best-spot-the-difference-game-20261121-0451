// Package Double Take's offline game and the coordinator's screenshots for judging.
// Node's standard library handles the copy; the supplied dossier builder checks caps.
import { cpSync, existsSync, mkdirSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-game.ts';

const source = fileURLToPath(new URL('.', import.meta.url));
const destination = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
mkdirSync(destination, { recursive: true });
cpSync(join(source, 'game'), join(destination, 'game'), { recursive: true });
mkdirSync(join(destination, 'screenshots'), { recursive: true });
if (existsSync(join(source, 'screenshots'))) {
  cpSync(join(source, 'screenshots'), join(destination, 'screenshots'), { recursive: true });
}
writeFileSync(join(destination, 'dossier.json'), buildDossier(destination, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  game_max_files: 993,
  game_max_bytes: 50331648,
  game_path_max_bytes: 1000,
}));
const screenshotCount = readdirSync(join(destination, 'screenshots'), { withFileTypes: true })
  .filter(entry => entry.isFile()).length;
console.log(`Double Take packaged with ${screenshotCount} screenshot files.`);
