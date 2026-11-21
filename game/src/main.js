import { STEP } from './config.js';
import { createWorld } from './world.js';
import { createRenderer } from './render.js';
import { createInput } from './input.js';
import { createAudio } from './audio.js';
import { stageShot } from './shots.js';

const params=new URLSearchParams(window.location.search);
const requestedSeed=Number.parseInt(params.get('seed') ?? '',10);
const seed=Number.isFinite(requestedSeed)?requestedSeed:Math.floor(Math.random()*4294967296);
const canvas=document.getElementById('game'),status=document.getElementById('status');
const world=createWorld(seed),renderer=createRenderer(canvas),audio=createAudio();
function resize() {
  const dpr=window.devicePixelRatio || 1;
  canvas.width=Math.round(window.innerWidth*dpr);
  canvas.height=Math.round(window.innerHeight*dpr);
  renderer.draw(world.state);
}
window.addEventListener('resize',resize);
if(params.has('shot')) stageShot(params.get('shot'),world);
else createInput(canvas,world,audio);
resize();
let previous=performance.now(),accumulator=0,lastMessage='',paints=0;
function frame(now) {
  const dt=document.hidden?0:Math.min(.25,(now-previous)/1000); previous=now;
  accumulator+=dt;
  while(accumulator>=STEP) { world.step(STEP); accumulator-=STEP; }
  for(const sound of world.takeEvents()) audio.play(sound);
  if(lastMessage!==world.state.message) { lastMessage=world.state.message; status.textContent=lastMessage; }
  renderer.draw(world.state);
  if(params.has('shot') && ++paints>=2) { window.__shotReady=true; return; }
  requestAnimationFrame(frame);
}
document.addEventListener('visibilitychange',()=>{previous=performance.now();accumulator=0;});
requestAnimationFrame(frame);
