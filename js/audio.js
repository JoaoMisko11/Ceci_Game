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
