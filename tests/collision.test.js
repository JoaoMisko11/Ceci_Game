import { describe, it, expect, vi } from 'vitest';
import {
    handlePunchCollisions, resetPunchFlags, handlePlatformCollisions,
    handleWaterCheck, handleItemCollisions, handlePowerUpCollisions,
    handleEnemyCollisions, checkFallDeath, checkVictory
} from '../js/collision.js';
import {
    SCORE_ENEMY_PUNCH, SCORE_BOSS_HIT, SCORE_BOSS_KILL, SCORE_ENEMY_STOMP,
    STOMP_BOUNCE, FALL_DEATH_MARGIN
} from '../js/constants.js';

// Mock audio para evitar erros de Web Audio API
vi.mock('../js/audio.js', () => ({
    playCoinSound: vi.fn(),
    playStarSound: vi.fn(),
    playDamageSound: vi.fn(),
    playEnemyKillSound: vi.fn(),
    playGameOverSound: vi.fn(),
    playPunchHitSound: vi.fn()
}));

function makePlayer(overrides = {}) {
    return {
        x: 100, y: 100, width: 32, height: 48,
        vx: 0, vy: 0, onGround: false,
        score: 0, lives: 3, lastDirection: 1,
        punching: false, punchTimer: 0,
        PUNCH_DURATION: 0.25, PUNCH_RANGE: 28, PUNCH_HEIGHT: 20,
        inWater: false,
        isAlive: true,
        isInvincible: false,
        invincibleTimer: 0,
        get punchHitbox() {
            if (!this.punching) return null;
            return { x: this.x + this.width, y: this.y + 14, w: 28, h: 20 };
        },
        takeDamage() {
            if (this.isInvincible) return;
            this.lives--;
            this.invincibleTimer = 1.5;
            this.isInvincible = true;
            this.isAlive = this.lives > 0;
        },
        applyPowerUp: vi.fn(),
        ...overrides
    };
}

function makeEnemy(overrides = {}) {
    return {
        x: 130, y: 100, w: 30, h: 30,
        alive: true, isBoss: false,
        _punchHit: false,
        kill: vi.fn(function () { this.alive = false; }),
        takeDamage: vi.fn(() => true),
        inkAttacks: [],
        ...overrides
    };
}

function makeParticles() {
    return {
        punchImpact: vi.fn(),
        enemyExplosion: vi.fn(),
        damageParticles: vi.fn(),
        coinSparkle: vi.fn(),
        starSparkle: vi.fn()
    };
}

describe('handlePunchCollisions', () => {
    it('soco mata inimigo normal e adiciona pontos', () => {
        const player = makePlayer({ punching: true, score: 0 });
        const enemy = makeEnemy();
        const particles = makeParticles();

        handlePunchCollisions(player, [enemy], particles);

        expect(enemy.kill).toHaveBeenCalled();
        expect(player.score).toBe(SCORE_ENEMY_PUNCH);
        expect(particles.punchImpact).toHaveBeenCalled();
        expect(particles.enemyExplosion).toHaveBeenCalled();
    });

    it('nao acerta inimigo ja atingido no mesmo soco', () => {
        const player = makePlayer({ punching: true });
        const enemy = makeEnemy({ _punchHit: true });
        const particles = makeParticles();

        handlePunchCollisions(player, [enemy], particles);

        expect(enemy.kill).not.toHaveBeenCalled();
    });

    it('nao faz nada sem punchHitbox', () => {
        const player = makePlayer({ punching: false });
        const enemy = makeEnemy();
        const particles = makeParticles();

        handlePunchCollisions(player, [enemy], particles);
        expect(enemy.kill).not.toHaveBeenCalled();
    });
});

describe('resetPunchFlags', () => {
    it('reseta flags quando jogador nao esta socando', () => {
        const player = makePlayer({ punching: false });
        const enemies = [makeEnemy({ _punchHit: true }), makeEnemy({ _punchHit: true })];

        resetPunchFlags(player, enemies);

        expect(enemies[0]._punchHit).toBe(false);
        expect(enemies[1]._punchHit).toBe(false);
    });

    it('nao reseta flags quando jogador esta socando', () => {
        const player = makePlayer({ punching: true });
        const enemies = [makeEnemy({ _punchHit: true })];

        resetPunchFlags(player, enemies);

        expect(enemies[0]._punchHit).toBe(true);
    });
});

describe('handleItemCollisions', () => {
    it('coleta item e adiciona pontos', () => {
        const player = makePlayer({ x: 95, y: 95 });
        const item = {
            x: 100, y: 100, w: 20, h: 20,
            type: 'coin', collected: false,
            collect: vi.fn(() => 10)
        };
        const particles = makeParticles();

        handleItemCollisions(player, [item], particles);

        expect(item.collect).toHaveBeenCalled();
        expect(player.score).toBe(10);
    });

    it('nao coleta item ja coletado', () => {
        const player = makePlayer({ x: 95, y: 95 });
        const item = {
            x: 100, y: 100, w: 20, h: 20,
            type: 'coin', collected: true,
            collect: vi.fn()
        };
        const particles = makeParticles();

        handleItemCollisions(player, [item], particles);
        expect(item.collect).not.toHaveBeenCalled();
    });
});

describe('handleEnemyCollisions', () => {
    it('stomp mata inimigo normal', () => {
        // Jogador caindo de cima, com pés tocando o topo do inimigo
        const player = makePlayer({ x: 115, y: 55, vy: 200 }); // y+height=103, enemy.y=100, overlap=3 < STOMP_THRESHOLD
        const enemy = makeEnemy({ x: 110, y: 100, w: 30, h: 30 });
        const particles = makeParticles();

        const result = handleEnemyCollisions(player, [enemy], particles);

        expect(enemy.kill).toHaveBeenCalled();
        expect(player.vy).toBe(STOMP_BOUNCE);
        expect(player.score).toBe(SCORE_ENEMY_STOMP);
        expect(result).toBeNull();
    });

    it('colisao lateral causa dano ao jogador', () => {
        const player = makePlayer({ x: 105, y: 100, vy: 0 });
        const enemy = makeEnemy({ x: 100, y: 100 });
        const particles = makeParticles();

        handleEnemyCollisions(player, [enemy], particles);

        expect(player.lives).toBe(2);
    });

    it('retorna gameOver quando jogador morre', () => {
        const player = makePlayer({ x: 105, y: 100, vy: 0, lives: 1 });
        const enemy = makeEnemy({ x: 100, y: 100 });
        const particles = makeParticles();

        const result = handleEnemyCollisions(player, [enemy], particles);
        expect(result).toBe('gameOver');
    });

    it('ignora inimigos mortos', () => {
        const player = makePlayer({ x: 105, y: 100 });
        const enemy = makeEnemy({ alive: false });
        const particles = makeParticles();

        handleEnemyCollisions(player, [enemy], particles);
        expect(player.lives).toBe(3); // sem dano
    });
});

describe('checkFallDeath', () => {
    it('retorna true quando jogador caiu do mapa', () => {
        // FALL_DEATH_MARGIN = 100, so y > levelHeight + 100
        expect(checkFallDeath({ y: 701 }, 600)).toBe(true);
        expect(checkFallDeath({ y: 800 }, 600)).toBe(true);
    });

    it('retorna false quando jogador esta dentro do mapa', () => {
        expect(checkFallDeath({ y: 500 }, 600)).toBe(false);
        expect(checkFallDeath({ y: 700 }, 600)).toBe(false); // y=700, limit=700, not >
    });
});

describe('checkVictory', () => {
    it('retorna won=true quando todos itens coletados e sem boss', () => {
        const level = {
            items: [{ collected: true }, { collected: true }],
            enemies: [{ isBoss: false }]
        };
        const { won, boss } = checkVictory(level);
        expect(won).toBe(true);
        expect(boss).toBeUndefined();
    });

    it('retorna won=false quando itens pendentes', () => {
        const level = {
            items: [{ collected: true }, { collected: false }],
            enemies: []
        };
        expect(checkVictory(level).won).toBe(false);
    });

    it('retorna won=false quando boss vivo', () => {
        const level = {
            items: [{ collected: true }],
            enemies: [{ isBoss: true, alive: true }]
        };
        expect(checkVictory(level).won).toBe(false);
    });

    it('retorna won=true quando boss morto e itens coletados', () => {
        const boss = { isBoss: true, alive: false };
        const level = {
            items: [{ collected: true }],
            enemies: [boss]
        };
        const result = checkVictory(level);
        expect(result.won).toBe(true);
        expect(result.boss).toBe(boss);
    });
});
