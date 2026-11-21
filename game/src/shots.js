import { LEVELS } from './scenes.js';

// Staged screens are frozen and never read or write a persistent best score.
export function stageShot(name,world) {
  const s=world.state;
  world.restart();
  s.staged=true; s.best=3290;
  if(name==='play') {
    s.found=new Set(LEVELS[0].differences.slice(0,2).map(d=>d.id));
    s.elapsed=42; s.score=300;
    s.message='Nicely spotted. Three more little surprises are hiding in the harbour.';
  } else if(name==='end') {
    s.level=2; s.screen='end'; s.found=new Set(LEVELS[2].differences.map(d=>d.id));
    s.score=3290; s.elapsed=67; s.totalTime=183; s.mistakes=1; s.totalMistakes=3;
    s.message='All 16 differences found. What else might you notice today?';
  } else {
    s.screen='title'; s.message='Two pictures. A handful of tiny changes. Take your time.';
  }
  world.takeEvents();
}
