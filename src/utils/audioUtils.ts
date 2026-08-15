// Web Audio and Sound Synthesis for Canine Acoustic Tools

let audioCtx: AudioContext | null = null;
let activeOscillator: OscillatorNode | null = null;
let activeGainNode: GainNode | null = null;
let heartbeatInterval: number | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Plays a continuous tone at a specified frequency (e.g. 432Hz calming or 16000Hz ultrasonic whistle)
 */
export function startTone(frequencyHz: number, volume: number = 0.25, type: OscillatorType = 'sine'): void {
  stopAllAudio();
  const ctx = getAudioContext();

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(frequencyHz, ctx.currentTime);

  gain.gain.setValueAtTime(0.01, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(Math.min(volume, 0.8), ctx.currentTime + 0.1);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start();
  activeOscillator = osc;
  activeGainNode = gain;
}

/**
 * Plays a pulsed ultrasonic whistle burst (e.g. for recall training or alert redirect)
 */
export function playWhistleBurst(frequencyHz: number = 16500, pulses: number = 2): void {
  stopAllAudio();
  const ctx = getAudioContext();

  let delay = 0;
  for (let i = 0; i < pulses; i++) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(frequencyHz, ctx.currentTime + delay);

    gain.gain.setValueAtTime(0.01, ctx.currentTime + delay);
    gain.gain.exponentialRampToValueAtTime(0.3, ctx.currentTime + delay + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 0.35);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime + delay);
    osc.stop(ctx.currentTime + delay + 0.4);

    delay += 0.45;
  }
}

/**
 * Plays a simulated maternal heartbeat sound for soothing separation anxiety
 */
export function startHeartbeat(bpm: number = 60, volume: number = 0.4): void {
  stopAllAudio();
  const ctx = getAudioContext();

  const intervalMs = (60 / bpm) * 1000;

  const playBeat = () => {
    // Lub
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(75, ctx.currentTime);
    osc1.frequency.exponentialRampToValueAtTime(45, ctx.currentTime + 0.12);
    gain1.gain.setValueAtTime(volume * 0.8, ctx.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(ctx.currentTime);
    osc1.stop(ctx.currentTime + 0.15);

    // Dub
    setTimeout(() => {
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(90, ctx.currentTime);
      osc2.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.1);
      gain2.gain.setValueAtTime(volume * 0.5, ctx.currentTime);
      gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(ctx.currentTime);
      osc2.stop(ctx.currentTime + 0.12);
    }, 180);
  };

  playBeat();
  heartbeatInterval = window.setInterval(playBeat, intervalMs);
}

/**
 * Stops all currently playing acoustic tones & loops
 */
export function stopAllAudio(): void {
  if (activeGainNode && audioCtx) {
    try {
      activeGainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.05);
      setTimeout(() => {
        if (activeOscillator) {
          activeOscillator.stop();
          activeOscillator.disconnect();
          activeOscillator = null;
        }
      }, 60);
    } catch {
      // Ignored
    }
  }
  if (heartbeatInterval !== null) {
    clearInterval(heartbeatInterval);
    heartbeatInterval = null;
  }
}

/**
 * Canine Persona Speech Synthesis with pitch adaptation
 */
export function speakWithBrowserPersona(text: string, personaId: string, onEnd?: () => void): void {
  if (!('speechSynthesis' in window)) {
    if (onEnd) onEnd();
    return;
  }

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);

  switch (personaId) {
    case 'golden_goof':
      utterance.pitch = 1.35;
      utterance.rate = 1.15;
      break;
    case 'bulldog_lord':
      utterance.pitch = 0.75;
      utterance.rate = 0.88;
      break;
    case 'shepherd_guardian':
      utterance.pitch = 0.95;
      utterance.rate = 1.05;
      break;
    case 'frenchie_sassy':
      utterance.pitch = 1.45;
      utterance.rate = 1.25;
      break;
    case 'husky_dramatic':
      utterance.pitch = 1.2;
      utterance.rate = 1.0;
      break;
    case 'whisperer_calm':
      utterance.pitch = 0.9;
      utterance.rate = 0.85;
      break;
    default:
      utterance.pitch = 1.0;
      utterance.rate = 1.0;
  }

  if (onEnd) {
    utterance.onend = onEnd;
    utterance.onerror = onEnd;
  }

  window.speechSynthesis.speak(utterance);
}
