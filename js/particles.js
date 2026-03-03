class Particle {
    constructor(x, y, vx, vy, life, color, size) {
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
        this.vy += 300 * dt; // gravidade leve
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

export class ParticleSystem {
    constructor() {
        this.particles = [];
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
            this.particles.push(new Particle(x, y, vx, vy, pLife, color, pSize));
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

    update(dt) {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            this.particles[i].update(dt);
            if (!this.particles[i].alive) {
                this.particles.splice(i, 1);
            }
        }
    }

    render(ctx) {
        for (const p of this.particles) {
            p.render(ctx);
        }
    }
}
