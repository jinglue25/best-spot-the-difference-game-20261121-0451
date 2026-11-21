import { createRandom } from './random.js';

// All coordinates are local to a 580 × 500 picture. Random decoration is reseeded
// for each painting so a changed object never shifts unrelated scenery.
const TAU = Math.PI * 2;
function ellipse(c, x, y, rx, ry, color) {
  c.fillStyle = color; c.beginPath(); c.ellipse(x, y, rx, ry, 0, 0, TAU); c.fill();
}
function rect(c, x, y, w, h, color) { c.fillStyle = color; c.fillRect(x, y, w, h); }
function poly(c, points, color) {
  c.fillStyle = color; c.beginPath(); points.forEach(([x,y],i) => i ? c.lineTo(x,y) : c.moveTo(x,y)); c.closePath(); c.fill();
}
function line(c, points, color, width = 3) {
  c.strokeStyle = color; c.lineWidth = width; c.lineCap = 'round'; c.lineJoin = 'round';
  c.beginPath(); points.forEach(([x,y],i) => i ? c.lineTo(x,y) : c.moveTo(x,y)); c.stroke();
}
function sky(c, top, bottom) {
  const g = c.createLinearGradient(0,0,0,500); g.addColorStop(0,top); g.addColorStop(1,bottom); rect(c,0,0,580,500,g);
}
function cloud(c,x,y,s=1) {
  ellipse(c,x,y,42*s,13*s,'#fff9e8'); ellipse(c,x-16*s,y-9*s,21*s,18*s,'#fff9e8'); ellipse(c,x+10*s,y-15*s,25*s,24*s,'#fff9e8');
}
function gull(c,x,y) { line(c,[[x-11,y+3],[x-5,y],[x,y+5],[x+5,y],[x+11,y+3]],'#3e6671',2.5); }
function boat(c,x,y,s,color,changed=false) {
  c.save(); c.translate(x,y); c.scale(s,s);
  ellipse(c,0,10,61,5,'#5eaeac'); poly(c,[[-54,0],[54,0],[35,19],[-35,19]],color);
  line(c,[[0,-94],[0,0]],'#47646a',4);
  poly(c,[[-5,-88],[-5,-8],[-49,-8]],'#fff4d6');
  poly(c,[[5,-78],[47,-8],[5,-8]],changed ? '#e97760' : '#f2bd56');
  line(c,[[-38,6],[37,6]],'#fff3d5',2); c.restore();
}
function harbour(c,d,seed) {
  sky(c,'#a6d8da','#e9eed7');
  ellipse(c,460,78,35,35,d.has('sun')?'#f29b70':'#f9d776');
  cloud(c,110,68,.85); cloud(c,314,107,.65); cloud(c,514,145,.55);
  poly(c,[[0,240],[80,201],[147,221],[212,183],[305,232],[401,208],[580,248]],'#94b9ae');
  poly(c,[[0,263],[106,238],[245,252],[352,230],[477,255],[580,243],[580,310],[0,310]],'#6fa499');
  rect(c,0,267,580,233,'#6dbbb9');
  const rng=createRandom(seed); for(let i=0;i<65;i++) {
    const x=rng()*580,y=280+rng()*220; line(c,[[x,y],[x+12+rng()*26,y]],i%3?'#a4d8ce':'#50a4a7',2);
  }
  poly(c,[[0,362],[94,339],[181,362],[209,405],[120,436],[0,430]],'#c9c3a2');
  poly(c,[[0,383],[103,367],[186,391],[119,409],[0,415]],'#8d9e85');
  // Lighthouse: the stripe is one contained difference.
  poly(c,[[67,170],[114,170],[126,362],[54,362]],'#fff6db');
  poly(c,[[62,260],[119,260],[122,296],[59,296]],d.has('stripe')?'#438e92':'#e67c63');
  rect(c,62,158,57,19,'#375765'); rect(c,67,125,47,34,'#f7cf70');
  rect(c,77,130,5,24,'#fff3c3'); rect(c,99,130,5,24,'#fff3c3');
  poly(c,[[56,126],[90,100],[124,126]],'#d76753');
  line(c,[[90,101],[90,91]],'#375765',3);
  rect(c,81,321,19,41,'#375765'); rect(c,81,204,17,24,'#548d94');
  boat(c,319,338,1,'#e77c60',d.has('sail'));
  boat(c,466,281,.57,'#3e7482');
  gull(c,223,150); gull(c,255,132); if(!d.has('gull')) gull(c,262,175);
  // The buoy's top and reflection remain at the same position in either version.
  ellipse(c,472,426,27,5,'#559f9f');
  poly(c,[[457,421],[463,391],[480,391],[487,421]],'#ef7d5e');
  rect(c,459,405,26,7,'#fff2d4'); line(c,[[472,391],[472,371]],'#3c6268',3);
  if(d.has('flag')) poly(c,[[474,372],[496,379],[474,386]],'#f9d776');
  poly(c,[[0,465],[96,449],[184,469],[285,454],[391,477],[580,457],[580,500],[0,500]],'#e9d7aa');
  for(let i=0;i<12;i++) ellipse(c,22+i*48,483+(i%3)*4,3,2,'#c6b687');
}
function flower(c,x,y,color) {
  line(c,[[x,y],[x,y+18]],'#51815b',2);
  for(let i=0;i<5;i++) ellipse(c,x+Math.cos(i*TAU/5)*6,y+Math.sin(i*TAU/5)*6,4,4,color);
  ellipse(c,x,y,3,3,'#f8d66e');
}
function butterfly(c,x,y,color) {
  ellipse(c,x-7,y-3,7,10,color); ellipse(c,x+7,y-3,7,10,color);
  ellipse(c,x-5,y+7,5,6,color); ellipse(c,x+5,y+7,5,6,color); line(c,[[x,y-6],[x,y+10]],'#45565c',2);
}
function garden(c,d,seed) {
  sky(c,'#b5dddc','#f6ecc9'); cloud(c,370,76,.8); cloud(c,531,120,.6);
  ellipse(c,465,59,28,28,'#f6d67d');
  ellipse(c,170,329,300,114,'#a6c18a'); ellipse(c,510,354,315,133,'#87b385');
  rect(c,0,343,580,157,'#92b77b');
  const rng=createRandom(seed+4); for(let i=0;i<65;i++) {
    const x=rng()*580,y=355+rng()*145; line(c,[[x,y+4],[x+2,y],[x+5,y+4]],'#7fa46c',1.5);
  }
  for(let x=0;x<580;x+=32) { rect(c,x,280,9,68,'#f8e9c9'); poly(c,[[x,280],[x+4.5,272],[x+9,280]],'#f8e9c9'); }
  rect(c,0,296,580,7,'#f8e9c9'); rect(c,0,324,580,7,'#f8e9c9');
  poly(c,[[109,350],[119,164],[152,164],[155,351]],'#997451');
  line(c,[[131,235],[88,179]],'#997451',15); line(c,[[140,206],[182,156]],'#997451',14);
  ellipse(c,130,152,100,92,'#568768'); ellipse(c,73,176,59,61,'#66966b'); ellipse(c,191,168,65,61,'#729e70'); ellipse(c,139,100,66,52,'#729e70');
  for(const [x,y] of [[75,156],[130,111],[184,169],[143,206]]) { ellipse(c,x,y,9,10,'#eb8661'); line(c,[[x,y-9],[x+2,y-14]],'#49664f',2); }
  if(!d.has('apple')) { ellipse(c,214,132,9,10,'#eb8661'); line(c,[[214,123],[216,118]],'#49664f',2); }
  // Blanket checker pattern is clipped to its slanted quadrilateral.
  c.save(); c.beginPath(); c.moveTo(218,350); c.lineTo(424,350); c.lineTo(481,458); c.lineTo(173,458); c.closePath(); c.clip();
  rect(c,170,348,315,115,'#fff0cc');
  for(let row=0;row<5;row++) for(let col=0;col<13;col++) if((row+col)%2===0) rect(c,170+col*25,348+row*25,25,25,d.has('blanket')?'#8aafa6':'#e89a88');
  c.restore();
  ellipse(c,318,391,29,10,'#fff6df'); ellipse(c,318,389,17,5,'#f2cc79');
  line(c,[[367,369],[367,340],[403,340],[403,369]],'#96744e',5);
  poly(c,[[358,360],[413,360],[406,396],[365,396]],'#bf945c');
  for(let x=370;x<410;x+=10) line(c,[[x,365],[x-3,391]],'#e0b577',2);
  if(d.has('basket')) ellipse(c,385,355,10,8,'#ea785b');
  // A resting cat, with a changed tail curl.
  ellipse(c,105,421,39,22,'#e9bb78'); ellipse(c,82,401,22,22,'#e9bb78');
  poly(c,[[62,392],[63,371],[79,383]],'#e9bb78'); poly(c,[[87,382],[102,372],[102,395]],'#e9bb78');
  line(c,[[70,401],[75,404],[80,401]],'#675d51',2); line(c,[[88,401],[93,404],[98,401]],'#675d51',2);
  ellipse(c,84,409,3,2,'#a86d60');
  c.strokeStyle='#d59b60'; c.lineWidth=10; c.beginPath(); c.arc(137,411,20,d.has('tail')?Math.PI:0,Math.PI*1.6); c.stroke();
  butterfly(c,351,181,d.has('butterfly')?'#87a9d0':'#efb95e'); butterfly(c,467,247,'#e89b8b');
  for(const [x,y,color] of [[42,345,'#fff3d3'],[514,401,'#f7d182'],[536,421,'#f4eacb'],[489,442,'#e89b8b'],[246,300,'#f8e7d7'],[280,474,'#f5db8b']]) flower(c,x,y,color);
}
function star(c,x,y,r,color) { const p=[]; for(let i=0;i<10;i++) { const a=i*Math.PI/5-Math.PI/2; p.push([x+Math.cos(a)*(i%2?r*.4:r),y+Math.sin(a)*(i%2?r*.4:r)]); } poly(c,p,color); }
function lantern(c,x,y,color) {
  line(c,[[x,y-30],[x,y-17]],'#a7aaa4',2); ellipse(c,x,y,13,18,color);
  line(c,[[x-6,y-15],[x+6,y-15]],'#714a50',3); line(c,[[x-6,y+16],[x+6,y+16]],'#714a50',3); line(c,[[x,y+18],[x,y+26]],'#efc777',2);
}
function stall(c,x,y,colors,label) {
  rect(c,x+9,y+44,8,126,'#b6856b'); rect(c,x+155,y+44,8,126,'#b6856b');
  rect(c,x+2,y+113,170,63,'#986f66'); rect(c,x+2,y+113,170,10,'#dbb686');
  poly(c,[[x+11,y],[x+161,y],[x+178,y+44],[x-6,y+44]],'#f2d7a1');
  for(let i=0;i<6;i++) {
    const xx=x-6+i*30; poly(c,[[x+11+i*25,y],[x+11+(i+1)*25,y],[xx+30,y+44],[xx,y+44]],colors[i%2]);
    ellipse(c,xx+15,y+44,15,10,colors[i%2]);
  }
  rect(c,x+44,y+140,87,24,'#e9c996'); c.fillStyle='#67565b'; c.font='bold 12px sans-serif'; c.textAlign='center'; c.fillText(label,x+87,y+157);
}
function market(c,d,seed) {
  sky(c,'#243b59','#6e7080');
  const rng=createRandom(seed+8); for(let i=0;i<47;i++) ellipse(c,rng()*580,rng()*212,1+rng(),1+rng(),'#d5d4b3');
  ellipse(c,474,69,29,29,'#ffe6a4'); ellipse(c,d.has('moon')?486:463,59,25,25,'#2c4260');
  if(d.has('star')) star(c,305,74,12,'#ffe2a0');
  poly(c,[[0,258],[0,188],[73,188],[73,154],[127,154],[127,233],[210,233],[210,175],[272,175],[272,243],[372,243],[372,165],[439,165],[439,222],[510,222],[510,177],[580,177],[580,330],[0,330]],'#3e5064');
  for(let i=0;i<13;i++) rect(c,22+i*45,244-(i%3)*16,8,14,'#c6ad86');
  rect(c,0,344,580,156,'#8a8580');
  for(let y=365;y<500;y+=30) { line(c,[[0,y],[580,y]],'#a49a8a',2); for(let x=(y%60?0:30);x<580;x+=75) line(c,[[x,y],[x-15,y+30]],'#a49a8a',2); }
  line(c,[[0,81],[110,126],[240,146],[385,128],[580,89]],'#e0c7a1',2);
  for(let i=0;i<11;i++) { const x=20+i*53,y=91+Math.sin(i/10*Math.PI)*48; if(!(d.has('bunting')&&i===4)) poly(c,[[x,y],[x+24,y+6],[x+8,y+28]],i%2?'#e6b45f':'#de8c7b'); }
  stall(c,22,258,['#dc8b7c','#f2d7a1'],'FRESH BAKES');
  stall(c,220,278,[d.has('awning')?'#83b3a0':'#8b9eb1','#f2d7a1'],'LITTLE FINDS');
  stall(c,416,249,['#dfb15f','#f2d7a1'],'FLOWER BAR');
  for(let i=0;i<4;i++) { ellipse(c,49+i*32,359,13,8,'#e4b675'); line(c,[[44+i*32,355],[50+i*32,360]],'#b48764',2); }
  for(let i=0;i<3;i++) { rect(c,249+i*40,369,22,20,'#c3d5c1'); ellipse(c,260+i*40,368,11,4,'#eedbab'); }
  for(let i=0;i<4;i++) { rect(c,440+i*30,341,15,19,'#dcb08b'); flower(c,447+i*30,330,i%2?'#e68f91':'#f3d680'); }
  line(c,[[0,166],[580,184]],'#aaa69a',2);
  lantern(c,63,195,'#efbd71'); lantern(c,276,204,d.has('lantern')?'#9cc7b2':'#eaa18b'); lantern(c,503,208,'#efbd71');
  rect(c,377,421,31,43,'#425666'); ellipse(c,392,421,16,5,'#6e8290');
  if(!d.has('sign')) { line(c,[[177,450],[194,396],[210,450]],'#503f49',5); rect(c,174,397,34,38,'#eacb95'); star(c,191,416,9,'#ce8265'); }
  ellipse(c,78,475,31,5,'#777977'); ellipse(c,489,476,39,5,'#777977');
}

export const LEVELS = [
  { name:'Harbour Morning', subtitle:'A little salt air. A closer look.', paint:harbour, differences:[
    {id:'sun',x:460,y:78,r:38,label:'The sun has a warmer glow'},
    {id:'stripe',x:91,y:278,r:34,label:'A new stripe on the lighthouse'},
    {id:'sail',x:343,y:296,r:34,label:'The sail changed colour'},
    {id:'gull',x:262,y:178,r:19,label:'One gull flew away'},
    {id:'flag',x:484,y:380,r:24,label:'A tiny flag on the buoy'},
  ]},
  { name:'Garden Picnic', subtitle:'Slow down. Stay a little.', paint:garden, differences:[
    {id:'apple',x:214,y:132,r:19,label:'An apple is missing'},
    {id:'blanket',x:322,y:421,r:48,label:'The picnic blanket changed colour'},
    {id:'basket',x:385,y:353,r:18,label:'An apple in the basket'},
    {id:'tail',x:137,y:411,r:29,label:'The cat curled its tail differently'},
    {id:'butterfly',x:351,y:181,r:23,label:'A butterfly changed colour'},
  ]},
  { name:'Night Market', subtitle:'Small wonders after sundown.', paint:market, differences:[
    {id:'moon',x:474,y:69,r:34,label:'The crescent moon turned around'},
    {id:'star',x:305,y:74,r:19,label:'A bright new star'},
    {id:'bunting',x:240,y:151,r:23,label:'A pennant is missing'},
    {id:'awning',x:306,y:300,r:37,label:'The middle awning changed colour'},
    {id:'lantern',x:276,y:204,r:24,label:'A lantern glows green'},
    {id:'sign',x:192,y:417,r:30,label:'The little pavement sign is gone'},
  ]},
];
