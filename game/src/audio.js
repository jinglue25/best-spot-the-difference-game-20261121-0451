// A deliberately small synth: sound is optional, and never blocks a gesture.
export function createAudio() {
  let context=null;
  function unlock() {
    try {
      const Audio=window.AudioContext || window.webkitAudioContext;
      if(!Audio) return;
      if(!context) context=new Audio();
      if(context.state==='suspended') context.resume().catch(()=>{});
    } catch { context=null; }
  }
  function tone(frequency,delay,duration,type='sine',volume=.065) {
    if(!context || context.state!=='running') return;
    const time=context.currentTime+delay;
    const oscillator=context.createOscillator(),gain=context.createGain();
    oscillator.type=type; oscillator.frequency.setValueAtTime(frequency,time);
    gain.gain.setValueAtTime(0,time); gain.gain.linearRampToValueAtTime(volume,time+.012);
    gain.gain.exponentialRampToValueAtTime(.0001,time+duration);
    oscillator.connect(gain); gain.connect(context.destination);
    oscillator.start(time); oscillator.stop(time+duration+.03);
    oscillator.onended=()=>{oscillator.disconnect();gain.disconnect();};
  }
  function play(name) {
    try {
      if(name==='find') { tone(587,0,.19); tone(880,.1,.3,'triangle'); }
      if(name==='miss') tone(105,0,.18,'square',.025);
      if(name==='clear') [523,659,784,1047].forEach((n,i)=>tone(n,i*.11,.4,'triangle'));
      if(name==='win') [523,659,784,1047,784,1047,1319].forEach((n,i)=>tone(n,i*.15,.55,'triangle'));
    } catch { /* Browsers without usable audio still get the full game. */ }
  }
  return {unlock,play};
}
