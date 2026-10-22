function bpmToInterval(bpm) {
  return (60 / bpm) * 1000;
}

if (typeof document !== 'undefined') {
  let audioCtx = null, timer = null, isPlaying = false;
  let tapTimes = [];

  function beep() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain); gain.connect(audioCtx.destination);
    osc.frequency.setValueAtTime(1000, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.5, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);
    osc.start(); osc.stop(audioCtx.currentTime + 0.06);
    const circle = document.getElementById('pulseCircle');
    circle.classList.add('flash');
    setTimeout(() => circle.classList.remove('flash'), 60);
  }

  document.addEventListener('DOMContentLoaded', () => {
    const slider = document.getElementById('bpmSlider');
    const display = document.getElementById('bpmDisplay');
    const toggle = document.getElementById('toggleBtn');
    const tap = document.getElementById('tapBtn');

    function restart() {
      if (timer) clearInterval(timer);
      if (isPlaying) timer = setInterval(beep, bpmToInterval(parseInt(slider.value)));
    }

    slider.addEventListener('input', () => {
      display.textContent = slider.value;
      if (isPlaying) restart();
    });

    toggle.addEventListener('click', () => {
      isPlaying = !isPlaying;
      toggle.textContent = isPlaying ? 'Stop' : 'Start';
      restart();
    });

    tap.addEventListener('click', () => {
      const now = performance.now();
      tapTimes.push(now);
      if (tapTimes.length > 4) tapTimes.shift();
      if (tapTimes.length >= 2) {
        const diffs = [];
        for (let i = 1; i < tapTimes.length; i++) diffs.push(tapTimes[i] - tapTimes[i-1]);
        const avg = diffs.reduce((a,b) => a+b, 0) / diffs.length;
        const calcBpm = Math.round(60000 / avg);
        if (calcBpm >= 40 && calcBpm <= 240) {
          slider.value = calcBpm; display.textContent = calcBpm;
          if (isPlaying) restart();
        }
      }
    });
  });
}
if (typeof module !== 'undefined') module.exports = { bpmToInterval };
