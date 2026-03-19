let audioCtx = null;

function getAudioContext() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioCtx;
}

function playTone(frequency, duration, type = 'square', volume = 0.15) {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.value = frequency;
    gain.gain.value = volume;
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
}

export function playJumpSound() {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(200, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.1);
    gain.gain.value = 0.12;
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.15);
}

export function playCoinSound() {
    playTone(880, 0.08, 'square', 0.1);
    setTimeout(() => playTone(1200, 0.1, 'square', 0.1), 60);
}

export function playStarSound() {
    playTone(660, 0.08, 'square', 0.1);
    setTimeout(() => playTone(880, 0.08, 'square', 0.1), 60);
    setTimeout(() => playTone(1100, 0.12, 'square', 0.1), 120);
}

export function playDamageSound() {
    playTone(200, 0.15, 'sawtooth', 0.15);
    setTimeout(() => playTone(120, 0.2, 'sawtooth', 0.1), 100);
}

export function playEnemyKillSound() {
    playTone(400, 0.06, 'square', 0.1);
    setTimeout(() => playTone(600, 0.06, 'square', 0.1), 50);
    setTimeout(() => playTone(800, 0.1, 'square', 0.1), 100);
}

export function playPunchSound() {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.08);
    gain.gain.value = 0.15;
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.1);
}

export function playPunchHitSound() {
    playTone(300, 0.05, 'square', 0.12);
    setTimeout(() => playTone(500, 0.08, 'square', 0.1), 30);
}

export function playGameOverSound() {
    playTone(400, 0.2, 'square', 0.12);
    setTimeout(() => playTone(300, 0.2, 'square', 0.12), 200);
    setTimeout(() => playTone(200, 0.3, 'square', 0.12), 400);
    setTimeout(() => playTone(150, 0.5, 'sawtooth', 0.1), 600);
}

// Fanfarra epica de vitoria do boss
export function playBossVictorySound() {
    // Acorde triunfante ascendente
    playTone(523, 0.15, 'square', 0.1);  // C5
    setTimeout(() => playTone(659, 0.15, 'square', 0.1), 120);  // E5
    setTimeout(() => playTone(784, 0.15, 'square', 0.1), 240);  // G5
    setTimeout(() => playTone(1047, 0.3, 'square', 0.12), 360); // C6

    // Segunda onda — harmonia
    setTimeout(() => {
        playTone(784, 0.12, 'square', 0.08);
        playTone(988, 0.12, 'square', 0.08);
    }, 600);
    setTimeout(() => {
        playTone(1047, 0.12, 'square', 0.08);
        playTone(1318, 0.12, 'square', 0.08);
    }, 720);
    setTimeout(() => {
        playTone(1568, 0.5, 'square', 0.1);
        playTone(1047, 0.5, 'square', 0.08);
    }, 840);

    // Rufar final
    setTimeout(() => playTone(100, 0.08, 'sawtooth', 0.06), 1200);
    setTimeout(() => playTone(120, 0.08, 'sawtooth', 0.06), 1280);
    setTimeout(() => playTone(150, 0.08, 'sawtooth', 0.06), 1360);
    setTimeout(() => {
        playTone(1047, 0.6, 'square', 0.1);
        playTone(1318, 0.6, 'square', 0.08);
        playTone(1568, 0.6, 'square', 0.06);
    }, 1440);
}

// Som de fogo de artificio (estouro)
export function playFireworkSound() {
    const ctx = getAudioContext();
    const bufferSize = ctx.sampleRate * 0.15;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const gain = ctx.createGain();
    gain.gain.value = 0.06;
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
    const filter = ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 2000;
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    noise.start();
    noise.stop(ctx.currentTime + 0.15);

    // Tom agudo de brilho
    setTimeout(() => playTone(800 + Math.random() * 800, 0.1, 'sine', 0.04), 50);
}
