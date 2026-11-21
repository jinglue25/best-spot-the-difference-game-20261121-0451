import { SCORE, BEST_KEY, formatTime } from './config.js';
import { LEVELS } from './scenes.js';

export function createWorld(seed = 1) {
  let best = 0;
  try { best = Math.max(0, Number(localStorage.getItem(BEST_KEY)) || 0); } catch { /* Storage is optional. */ }
  const state = { seed, screen:'title', level:0, found:new Set(), score:0, best,
    elapsed:0, totalTime:0, mistakes:0, totalMistakes:0, bonus:0, flashes:[],
    message:'Two pictures. A handful of tiny changes. Take your time.', staged:false };
  const events = [];
  function emit(sound, message) { events.push(sound); state.message = message; }
  function loadLevel() {
    state.found = new Set(); state.elapsed = 0; state.mistakes = 0;
    state.flashes = []; state.bonus = 0; state.screen = 'play';
    state.message = `${LEVELS[state.level].name}. Find ${LEVELS[state.level].differences.length} differences. Click either picture.`;
  }
  function restart() {
    state.level = 0; state.score = 0; state.totalTime = 0; state.totalMistakes = 0;
    state.staged = false; events.length = 0; loadLevel();
  }
  function advance() {
    if(state.screen === 'title' || state.screen === 'end') restart();
    else if(state.screen === 'clear') {
      if(state.level < LEVELS.length-1) { state.level++; loadLevel(); }
      else {
        state.screen = 'end';
        state.best = Math.max(state.best,state.score);
        try { localStorage.setItem(BEST_KEY,String(state.best)); } catch { /* Private browsing can disable storage. */ }
        emit('win',`All 16 differences found. Score ${state.score}. Total time ${formatTime(state.totalTime)}. Best ${state.best}.`);
      }
    }
  }
  function click(x,y,panel) {
    if(state.screen !== 'play') return;
    const level = LEVELS[state.level];
    const match = level.differences.find(d => !state.found.has(d.id) && Math.hypot(x-d.x,y-d.y) <= d.r);
    if(match) {
      state.found.add(match.id); state.score += SCORE.find;
      emit('find',`${match.label}. ${level.differences.length-state.found.size} differences left.`);
      if(state.found.size === level.differences.length) {
        state.bonus = Math.max(0,SCORE.clear-Math.floor(state.elapsed)*SCORE.second-state.mistakes*SCORE.mistake);
        state.score += state.bonus; state.totalTime += state.elapsed;
        state.totalMistakes += state.mistakes; state.screen = 'clear';
        emit('clear',`Level clear! ${formatTime(state.elapsed)}, ${state.mistakes} mistakes. Bonus ${state.bonus}. Press Enter to continue.`);
      }
    } else {
      state.mistakes++; state.score = Math.max(0,state.score-SCORE.miss);
      state.flashes.push({x,y,panel,life:.65});
      emit('miss','Not quite. Look closely at the shapes, colours and little details.');
    }
  }
  function step(dt) {
    if(state.staged) return;
    if(state.screen === 'play') state.elapsed += dt;
    for(const flash of state.flashes) flash.life -= dt;
    state.flashes = state.flashes.filter(f => f.life > 0);
  }
  return {state,restart,advance,click,step,takeEvents:() => events.splice(0)};
}
