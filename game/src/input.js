import { FIELD, PANEL, BUTTON } from './config.js';

export function createInput(canvas,world,audio) {
  function inside(x,y,b) { return x>=b.x && x<=b.x+b.width && y>=b.y && y<=b.y+b.height; }
  canvas.addEventListener('pointerdown',event=>{
    event.preventDefault(); audio.unlock(); canvas.focus();
    const bounds=canvas.getBoundingClientRect();
    const scale=Math.min(bounds.width/FIELD.width,bounds.height/FIELD.height);
    const x=(event.clientX-bounds.left-(bounds.width-FIELD.width*scale)/2)/scale;
    const y=(event.clientY-bounds.top-(bounds.height-FIELD.height*scale)/2)/scale;
    if(world.state.screen==='clear') { world.advance(); return; }
    if(world.state.screen!=='play') { if(inside(x,y,BUTTON)) world.advance(); return; }
    for(const [index,left] of [PANEL.left,PANEL.right].entries()) {
      if(inside(x,y,{x:left,y:PANEL.y,width:PANEL.width,height:PANEL.height})) {
        world.click(x-left,y-PANEL.y,index); return;
      }
    }
  });
  window.addEventListener('keydown',event=>{
    if(!['Enter','Space','KeyR'].includes(event.code)) return;
    event.preventDefault(); audio.unlock();
    if(event.repeat) return;
    if(event.code==='KeyR') world.restart(); else world.advance();
  });
  canvas.addEventListener('pointermove',event=>{
    const b=canvas.getBoundingClientRect(),s=Math.min(b.width/1280,b.height/720);
    const x=(event.clientX-b.left-(b.width-1280*s)/2)/s;
    const y=(event.clientY-b.top-(b.height-720*s)/2)/s;
    canvas.style.cursor=world.state.screen==='play' ? 'crosshair' : world.state.screen==='clear'||inside(x,y,BUTTON)?'pointer':'default';
  });
}
