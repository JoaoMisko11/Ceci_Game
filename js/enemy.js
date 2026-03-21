import {
    ENEMY_SIZE, WALKER_SPEED, FLYER_SPEED, SWIMMER_SPEED,
    FLYER_FLOAT_FREQ, FLYER_FLOAT_AMP, SWIMMER_FLOAT_FREQ, SWIMMER_FLOAT_AMP,
    BOSS_WIDTH, BOSS_HEIGHT, BOSS_SPEED, BOSS_LIVES, BOSS_HIT_TIMER,
    BOSS_PHASE2_THRESHOLD, BOSS_PHASE3_THRESHOLD, BOSS_PHASE_SPEED_MULT,
    BOSS_FLOAT_BASE_FREQ, BOSS_FLOAT_PHASE_FREQ, BOSS_FLOAT_BASE_AMP, BOSS_FLOAT_PHASE_AMP,
    BOSS_INK_INTERVALS, BOSS_INK_BASE_SPEED, BOSS_INK_PHASE_SPEED,
    BOSS_INK_LIFETIME, BOSS_INK_SIZE
} from './constants.js';

const ENEMY_SPEEDS = {
    walker: WALKER_SPEED,
    flyer: FLYER_SPEED,
    swimmer: SWIMMER_SPEED,
    octopus: BOSS_SPEED
};

export class Enemy {
    constructor(x, y, patrolDistance = 100, type = 'walker') {
        this.x = x;
        this.y = y;
        this.w = type === 'octopus' ? BOSS_WIDTH : ENEMY_SIZE;
        this.h = type === 'octopus' ? BOSS_HEIGHT : ENEMY_SIZE;
        this.alive = true;
        this.type = type;

        // Patrulha
        this.startX = x;
        this.startY = y;
        this.patrolDistance = patrolDistance;
        this.speed = ENEMY_SPEEDS[type] || WALKER_SPEED;
        this.direction = 1;

        // Voador
        this.floatTime = Math.random() * Math.PI * 2;

        // Nadador
        this.swimTime = Math.random() * Math.PI * 2;

        // Boss (octopus)
        this.lives = type === 'octopus' ? BOSS_LIVES : 1;
        this.maxLives = this.lives;
        this.isBoss = type === 'octopus';
        this.bossPhase = 1; // muda comportamento conforme perde vida
        this.hitTimer = 0; // flash ao levar dano
        this.tentacleTime = 0; // animacao dos tentaculos
        this.inkCooldown = 0; // cooldown do ataque de tinta
        this.inkAttacks = []; // projeteis de tinta ativos
    }

    update(dt) {
        if (!this.alive) return;

        // Boss octopus tem comportamento especial
        if (this.type === 'octopus') {
            this.updateBoss(dt);
            return;
        }

        this.x += this.speed * this.direction * dt;

        if (this.x > this.startX + this.patrolDistance) {
            this.x = this.startX + this.patrolDistance;
            this.direction = -1;
        } else if (this.x < this.startX) {
            this.x = this.startX;
            this.direction = 1;
        }

        // Voador flutua verticalmente
        if (this.type === 'flyer') {
            this.floatTime += dt * FLYER_FLOAT_FREQ;
            this.y = this.startY + Math.sin(this.floatTime) * FLYER_FLOAT_AMP;
        }

        // Nadador oscila verticalmente (simulando nado)
        if (this.type === 'swimmer') {
            this.swimTime += dt * SWIMMER_FLOAT_FREQ;
            this.y = this.startY + Math.sin(this.swimTime) * SWIMMER_FLOAT_AMP;
        }
    }

    updateBoss(dt) {
        this.tentacleTime += dt;
        if (this.hitTimer > 0) this.hitTimer -= dt;

        // Fase do boss baseada nas vidas restantes
        const lifeRatio = this.lives / this.maxLives;
        if (lifeRatio <= BOSS_PHASE3_THRESHOLD) {
            this.bossPhase = 3; // rapido e agressivo
        } else if (lifeRatio <= BOSS_PHASE2_THRESHOLD) {
            this.bossPhase = 2; // mais rapido
        }

        // Velocidade aumenta por fase
        const phaseSpeed = this.speed * (1 + (this.bossPhase - 1) * BOSS_PHASE_SPEED_MULT);
        this.x += phaseSpeed * this.direction * dt;

        if (this.x > this.startX + this.patrolDistance) {
            this.x = this.startX + this.patrolDistance;
            this.direction = -1;
        } else if (this.x < this.startX) {
            this.x = this.startX;
            this.direction = 1;
        }

        // Flutuacao vertical do polvo
        this.swimTime += dt * (BOSS_FLOAT_BASE_FREQ + this.bossPhase * BOSS_FLOAT_PHASE_FREQ);
        this.y = this.startY + Math.sin(this.swimTime) * (BOSS_FLOAT_BASE_AMP + this.bossPhase * BOSS_FLOAT_PHASE_AMP);

        // Ataque de tinta
        this.inkCooldown -= dt;
        const inkInterval = BOSS_INK_INTERVALS[this.bossPhase - 1];
        if (this.inkCooldown <= 0) {
            this.inkCooldown = inkInterval;
            this.spawnInk();
        }

        // Atualizar projeteis de tinta
        for (let i = this.inkAttacks.length - 1; i >= 0; i--) {
            const ink = this.inkAttacks[i];
            ink.x += ink.vx * dt;
            ink.y += ink.vy * dt;
            ink.life -= dt;
            if (ink.life <= 0) {
                this.inkAttacks.splice(i, 1);
            }
        }
    }

    spawnInk() {
        const cx = this.x + this.w / 2;
        const cy = this.y + this.h / 2;
        // Dispara tinta em varias direcoes conforme a fase
        const numInks = this.bossPhase;
        for (let i = 0; i < numInks; i++) {
            const angle = (Math.PI / (numInks + 1)) * (i + 1) + (this.direction > 0 ? Math.PI : 0);
            const speed = BOSS_INK_BASE_SPEED + this.bossPhase * BOSS_INK_PHASE_SPEED;
            this.inkAttacks.push({
                x: cx,
                y: cy,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                life: BOSS_INK_LIFETIME,
                w: BOSS_INK_SIZE,
                h: BOSS_INK_SIZE
            });
        }
    }

    takeDamage() {
        if (!this.isBoss || this.hitTimer > 0) return false;
        this.lives--;
        this.hitTimer = BOSS_HIT_TIMER;
        if (this.lives <= 0) {
            this.kill();
        }
        return true;
    }

    kill() {
        this.alive = false;
    }
}
