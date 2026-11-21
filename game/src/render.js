import { FIELD, PANEL, BUTTON, FONT, COLORS, formatTime } from './config.js';
import { LEVELS } from './scenes.js';

export function createRenderer(canvas) {
  const c = canvas.getContext('2d');
  const cache = new Map();
  function text(value,x,y,size=16,color=COLORS.ink,align='left',bold=false) {
    c.font = `${bold?'bold ':''}${size}px ${FONT}`; c.fillStyle=color;
    c.textAlign=align; c.textBaseline='middle'; c.fillText(value,x,y);
  }
  function box(x,y,w,h,r,fill,stroke) {
    c.beginPath(); c.roundRect(x,y,w,h,r); c.fillStyle=fill; c.fill();
    if(stroke) { c.strokeStyle=stroke; c.lineWidth=1; c.stroke(); }
  }
  function line(x,y,x2,y2,color,width=1) { c.strokeStyle=color; c.lineWidth=width; c.beginPath(); c.moveTo(x,y); c.lineTo(x2,y2); c.stroke(); }
  function picture(state,changed) {
    const key=`${state.seed}:${state.level}:${changed}`;
    if(!cache.has(key)) {
      const surface=document.createElement('canvas'); surface.width=580; surface.height=500;
      const level=LEVELS[state.level];
      level.paint(surface.getContext('2d'),new Set(changed?level.differences.map(d=>d.id):[]),state.seed);
      cache.set(key,surface);
    }
    return cache.get(key);
  }
  function ring(x,y,r,index) {
    c.beginPath(); c.arc(x,y,r+3,0,Math.PI*2); c.strokeStyle='#fff9e8'; c.lineWidth=6; c.stroke();
    c.strokeStyle=COLORS.teal; c.lineWidth=3; c.stroke();
    box(x+r-8,y-r-13,22,22,11,COLORS.teal);
    text(String(index),x+r+3,y-r-1,12,'#fff','center',true);
  }
  function panels(state) {
    for(const [index,x] of [PANEL.left,PANEL.right].entries()) {
      box(x-3,107,586,506,12,'#d5ddd3');
      c.save(); c.beginPath(); c.roundRect(x,110,580,500,9); c.clip();
      c.drawImage(picture(state,index===1),x,110);
      let number=0; for(const id of state.found) {
        const d=LEVELS[state.level].differences.find(item=>item.id===id);
        if(d) ring(x+d.x,110+d.y,d.r,++number);
      }
      for(const f of state.flashes) if(f.panel===index) {
        c.globalAlpha=Math.min(1,f.life*3); const xx=x+f.x,yy=110+f.y;
        line(xx-9,yy-9,xx+9,yy+9,'#fff',7); line(xx+9,yy-9,xx-9,yy+9,'#fff',7);
        line(xx-9,yy-9,xx+9,yy+9,'#c74846',4); line(xx+9,yy-9,xx-9,yy+9,'#c74846',4);
      }
      c.restore();
    }
  }
  function hud(state) {
    c.fillStyle='#fffdf6'; c.fillRect(0,0,1280,64);
    text('double take',40,31,27,COLORS.ink,'left',true);
    line(222,18,222,47,'#d7ddd5');
    text(LEVELS[state.level].name,244,31,19,COLORS.ink,'left',true);
    text(`Differences left: ${LEVELS[state.level].differences.length-state.found.size}`,536,24,18,COLORS.teal,'left',true);
    text(`FOUND ${state.found.size} / ${LEVELS[state.level].differences.length}`,536,47,11,COLORS.muted,'left',true);
    text(`TIME  ${formatTime(state.elapsed)}`,789,31,16);
    text(`MISSES  ${state.mistakes}`,930,31,16);
    box(1080,13,160,38,19,COLORS.ink); text(`SCORE  ${String(state.score).padStart(4,'0')}`,1160,32,16,'#fff7df','center',true);
    text('THE ORIGINAL',40,88,12,COLORS.muted,'left',true);
    text('SPOT THE CHANGES',660,88,12,COLORS.muted,'left',true);
    text(`${state.level+1} / 3   •   ${LEVELS[state.level].subtitle}`,620,88,13,COLORS.muted,'right');
    const count=LEVELS[state.level].differences.length;
    for(let i=0;i<count;i++) box(1110+i*22,82,12,12,6,i<state.found.size?COLORS.teal:'#d6ded5');
    text(`FOUND  ${state.found.size} / ${count}`,1240,636,14,COLORS.teal,'right',true);
    text('A SMALL EXERCISE IN NOTICING',40,637,12,COLORS.muted,'left',true);
    line(40,659,1240,659,'#d5dcd3');
    c.save(); c.beginPath(); c.rect(40,670,1060,33); c.clip();
    text(state.message,40,687,16); c.restore();
    text('R  RESTART',1240,687,12,COLORS.muted,'right',true);
  }
  function button(label) {
    box(BUTTON.x,BUTTON.y+4,BUTTON.width,BUTTON.height,16,'#0c5d59');
    box(BUTTON.x,BUTTON.y,BUTTON.width,BUTTON.height,16,COLORS.teal);
    text(label,640,BUTTON.y+29,20,'#fffdf1','center',true);
  }
  function badge(label,y) { box(533,y-14,214,28,14,'#e4ebe1'); text(label,640,y,12,COLORS.teal,'center',true); }
  function overlay(state) {
    c.fillStyle='rgba(27,52,61,0.69)'; c.fillRect(0,64,1280,656);
    c.save(); c.shadowColor='#102d3c55'; c.shadowBlur=35; c.shadowOffsetY=12;
    box(305,119,670,510,26,'#fffaf0'); c.restore();
    // Original binocular emblem, drawn entirely with paths.
    if(state.screen==='title') {
      badge('THE ART OF LOOKING CLOSER',161);
      for(const x of [612,668]) {
        box(x-18,198,36,24,8,COLORS.teal); box(x-24,213,48,43,13,COLORS.ink);
        c.beginPath(); c.arc(x,238,16,0,Math.PI*2); c.fillStyle='#a7d4ce'; c.fill();
        line(x-7,233,x+4,225,'#f7f7db',3);
      }
      line(629,226,651,226,COLORS.ink,12);
      text('Double Take',640,304,64,COLORS.ink,'center',true);
      text('Same place. A few little surprises.',640,357,22,COLORS.muted,'center');
      text('Explore three illustrated worlds and find all 16 differences.',640,410,18,COLORS.ink,'center');
      text('Click a changed detail in either picture to mark both.',640,442,18,COLORS.ink,'center');
      text('Look carefully • +150 per find • −25 per miss',640,478,15,COLORS.muted,'center');
      button('Let’s look closer');
      text('ENTER / SPACE TO START',640,606,12,COLORS.muted,'center',true);
    } else if(state.screen==='clear') {
      badge(`CHAPTER ${state.level+1} COMPLETE`,170);
      text('Beautifully spotted.',640,243,43,COLORS.ink,'center',true);
      text(LEVELS[state.level].name,640,293,22,COLORS.muted,'center');
      metrics([['TIME',formatTime(state.elapsed)],['MISTAKES',state.mistakes],['BONUS',`+${state.bonus}`]],377);
      text(`All ${state.found.size} little changes, found.`,640,469,19,COLORS.teal,'center');
      button(state.level===2?'See your results':'Next little adventure');
      text('CLICK ANYWHERE / PRESS ENTER TO CONTINUE',640,606,12,COLORS.muted,'center',true);
    } else {
      badge('ALL THREE WORLDS EXPLORED',170);
      text('You have an eye for it.',640,233,42,COLORS.ink,'center',true);
      text('16 differences. One lovely little journey.',640,278,19,COLORS.muted,'center');
      text(String(state.score),640,347,66,COLORS.teal,'center',true);
      text('TOTAL SCORE',640,393,12,COLORS.muted,'center',true);
      metrics([['TOTAL TIME',formatTime(state.totalTime)],['MISTAKES',state.totalMistakes],['PERSONAL BEST',state.best]],454);
      button('Play again');
      text('ENTER / SPACE TO PLAY AGAIN',640,606,12,COLORS.muted,'center',true);
    }
  }
  function metrics(items,y) {
    items.forEach(([label,value],i)=>{
      const x=442+i*198;
      text(label,x,y-17,12,COLORS.muted,'center',true);
      text(String(value),x,y+19,28,COLORS.ink,'center',true);
      if(i<2) line(x+99,y-24,x+99,y+32,'#e1e2d6');
    });
  }
  function draw(state) {
    const scale=Math.min(canvas.width/FIELD.width,canvas.height/FIELD.height);
    c.setTransform(1,0,0,1,0,0); c.fillStyle=COLORS.ink; c.fillRect(0,0,canvas.width,canvas.height);
    c.setTransform(scale,0,0,scale,(canvas.width-1280*scale)/2,(canvas.height-720*scale)/2);
    c.fillStyle=COLORS.paper; c.fillRect(0,0,1280,720);
    panels(state); hud(state); if(state.screen!=='play') overlay(state);
  }
  return {draw};
}
