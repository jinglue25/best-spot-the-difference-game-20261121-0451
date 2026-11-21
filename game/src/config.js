export const FIELD = { width: 1280, height: 720 };
export const PANEL = { width: 580, height: 500, y: 110, left: 40, right: 660 };
export const BUTTON = { x: 490, y: 524, width: 300, height: 58 };
export const STEP = 1 / 60;
export const SCORE = { find: 150, miss: 25, clear: 500, second: 2, mistake: 30 };
export const BEST_KEY = 'double-take.best.v1';
export const FONT = '"Trebuchet MS", sans-serif';
export const COLORS = { ink: '#203b49', muted: '#69808a', paper: '#f4f3eb', teal: '#167f78', coral: '#ef7859', gold: '#f9c65d' };
export function formatTime(seconds) {
  const n = Math.floor(seconds);
  return `${Math.floor(n / 60)}:${String(n % 60).padStart(2, '0')}`;
}
