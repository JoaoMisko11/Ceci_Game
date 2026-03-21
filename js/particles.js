import { PARTICLE_GRAVITY } from './constants.js';

class Particle {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.vx = 0;
        this.vy = 0;
        this.life = 0;
        this.maxLife = 0;
        this.color = '#fff';
        this.size = 3;
    }

    init(x, y, vx, vy, life, color, size) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.life = life;
        this.maxLife = life;
        this.color = color;
        this.size = size;
    }

    get alive() {
        return this.life > 0;
    }

    get alpha() {
        return this.life / this.maxLife;
    }

    update(dt) {
        this.x += this.vx * dt;
        this.y += this.vy * dt;
        this.vy += PARTICLE_GRAVITY * dt; // gravidade leve
        this.life -= dt;
    }

    render(ctx) {
        if (!this.alive) return;
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.size, this.size);
        ctx.globalAlpha = 1;
    }
}

// Pool pre-alocado para evitar criacao/GC de particulas
const POOL_SIZE = 512;
const pool = new Array(POOL_SIZE);
let poolIndex = 0;

// Pre-alocar todas as particulas
for (let i = 0; i < POOL_SIZE; i++) {
    pool[i] = new Particle();
}

function acquireParticle(x, y, vx, vy, life, color, size) {
    // Procura uma particula morta no pool
    for (let i = 0; i < POOL_SIZE; i++) {
        const idx = (poolIndex + i) % POOL_SIZE;
        if (!pool[idx].alive) {
            pool[idx].init(x, y, vx, vy, life, color, size);
            poolIndex = (idx + 1) % POOL_SIZE;
            return pool[idx];
        }
    }
    // Pool cheio — recicla a mais antiga
    pool[poolIndex].init(x, y, vx, vy, life, color, size);
    const p = pool[poolIndex];
    poolIndex = (poolIndex + 1) % POOL_SIZE;
    return p;
}

export class ParticleSystem {
    constructor() {
        this.particles = [];
    }

    _add(x, y, vx, vy, life, color, size) {
        const p = acquireParticle(x, y, vx, vy, life, color, size);
        this.particles.push(p);
    }

    emit(x, y, count, config = {}) {
        const {
            color = '#fff',
            speedX = 100,
            speedY = 100,
            life = 0.5,
            size = 3,
            gravity = true
        } = config;

        for (let i = 0; i < count; i++) {
            const vx = (Math.random() - 0.5) * speedX * 2;
            const vy = -Math.random() * speedY;
            const pLife = life * (0.5 + Math.random() * 0.5);
            const pSize = size * (0.5 + Math.random() * 0.5);
            this._add(x, y, vx, vy, pLife, color, pSize);
        }
    }

    // Poeira ao pular
    jumpDust(x, y, width) {
        this.emit(x + width / 2, y, 6, {
            color: '#8b7355',
            speedX: 60,
            speedY: 40,
            life: 0.3,
            size: 3
        });
    }

    // Poeira ao aterrissar
    landDust(x, y, width) {
        this.emit(x + width / 2, y, 8, {
            color: '#8b7355',
            speedX: 80,
            speedY: 20,
            life: 0.25,
            size: 2
        });
    }

    // Brilho ao coletar moeda
    coinSparkle(x, y) {
        this.emit(x + 10, y + 10, 8, {
            color: '#f1c40f',
            speedX: 100,
            speedY: 80,
            life: 0.4,
            size: 3
        });
    }

    // Brilho ao coletar estrela
    starSparkle(x, y) {
        this.emit(x + 10, y + 10, 12, {
            color: '#e67e22',
            speedX: 120,
            speedY: 100,
            life: 0.5,
            size: 4
        });
    }

    // Explosao ao matar inimigo
    enemyExplosion(x, y, w, h) {
        this.emit(x + w / 2, y + h / 2, 15, {
            color: '#9b59b6',
            speedX: 150,
            speedY: 120,
            life: 0.5,
            size: 4
        });
    }

    // Impacto do soco
    punchImpact(x, y) {
        this.emit(x, y, 10, {
            color: '#f39c12',
            speedX: 140,
            speedY: 100,
            life: 0.3,
            size: 4
        });
    }

    // Particulas de dano
    damageParticles(x, y, width, height) {
        this.emit(x + width / 2, y + height / 2, 10, {
            color: '#e74c3c',
            speedX: 120,
            speedY: 100,
            life: 0.4,
            size: 3
        });
    }

    // Explosao massiva do boss
    bossExplosion(x, y, w, h) {
        const cx = x + w / 2;
        const cy = y + h / 2;
        const colors = ['#8e44ad', '#9b59b6', '#c0392b', '#e74c3c', '#f39c12', '#f1c40f', '#2ecc71'];
        for (let wave = 0; wave < 3; wave++) {
            for (let i = 0; i < 20; i++) {
                const color = colors[Math.floor(Math.random() * colors.length)];
                const angle = (Math.PI * 2 / 20) * i + wave * 0.3;
                const speed = 150 + wave * 80 + Math.random() * 100;
                const vx = Math.cos(angle) * speed;
                const vy = Math.sin(angle) * speed;
                const life = 1 + Math.random() * 1.5;
                const size = 3 + Math.random() * 5;
                this._add(cx, cy, vx, vy, life, color, size);
            }
        }
    }

    // Fogo de artificio — explode em posicao aleatoria
    firework(canvasWidth, canvasHeight, cameraX, cameraY) {
        const cx = cameraX + Math.random() * canvasWidth;
        const cy = cameraY + Math.random() * canvasHeight * 0.6;
        const colors = [
            ['#e74c3c', '#ff6b6b', '#ffaaaa'],
            ['#f1c40f', '#f9e547', '#fff3a0'],
            ['#2ecc71', '#58d68d', '#abebc6'],
            ['#3498db', '#5dade2', '#aed6f1'],
            ['#9b59b6', '#c39bd3', '#d7bde2'],
            ['#e67e22', '#f0b27a', '#fad7a0'],
            ['#1abc9c', '#76d7c4', '#a3e4d7']
        ];
        const palette = colors[Math.floor(Math.random() * colors.length)];
        const numParticles = 25 + Math.floor(Math.random() * 15);

        for (let i = 0; i < numParticles; i++) {
            const angle = (Math.PI * 2 / numParticles) * i + Math.random() * 0.3;
            const speed = 80 + Math.random() * 160;
            const vx = Math.cos(angle) * speed;
            const vy = Math.sin(angle) * speed;
            const color = palette[Math.floor(Math.random() * palette.length)];
            const life = 0.8 + Math.random() * 1.2;
            const size = 2 + Math.random() * 4;
            this._add(cx, cy, vx, vy, life, color, size);
        }

        // Sparkles centrais
        for (let i = 0; i < 8; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 20 + Math.random() * 40;
            this._add(
                cx, cy,
                Math.cos(angle) * speed,
                Math.sin(angle) * speed,
                0.5 + Math.random() * 0.5,
                '#fff',
                1 + Math.random() * 2
            );
        }
    }

    // Chuva de estrelas douradas (caem do topo)
    goldenRain(canvasWidth, cameraX, cameraY) {
        const x = cameraX + Math.random() * canvasWidth;
        const y = cameraY - 10;
        const colors = ['#f1c40f', '#f39c12', '#e67e22', '#fff3a0'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        const vx = (Math.random() - 0.5) * 40;
        const vy = 30 + Math.random() * 60;
        const life = 2 + Math.random() * 2;
        const size = 2 + Math.random() * 3;
        this._add(x, y, vx, vy, life, color, size);
    }

    update(dt) {
        // Atualiza e remove mortas sem splice (swap-and-pop)
        let writeIdx = 0;
        for (let i = 0; i < this.particles.length; i++) {
            const p = this.particles[i];
            p.update(dt);
            if (p.alive) {
                this.particles[writeIdx] = p;
                writeIdx++;
            }
        }
        this.particles.length = writeIdx;
    }

    render(ctx) {
        for (let i = 0; i < this.particles.length; i++) {
            this.particles[i].render(ctx);
        }
    }
}
