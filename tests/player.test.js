import { describe, it, expect } from 'vitest';
import { Player } from '../js/player.js';
import {
    PLAYER_WIDTH, PLAYER_HEIGHT, PLAYER_LIVES, INVINCIBLE_DURATION,
    PUNCH_DURATION, PUNCH_COOLDOWN, PUNCH_RANGE, PUNCH_HEIGHT,
    GRAVITY, MOVE_SPEED, JUMP_FORCE, FRICTION,
    SPEED_BOOST_DURATION, DOUBLE_JUMP_DURATION, SPEED_BOOST_MULT
} from '../js/constants.js';

const noInput = { left: false, right: false, jumpPressed: false, punchPressed: false };

describe('Player', () => {
    it('inicializa com valores corretos', () => {
        const p = new Player(100, 200, 1);
        expect(p.x).toBe(100);
        expect(p.y).toBe(200);
        expect(p.width).toBe(PLAYER_WIDTH);
        expect(p.height).toBe(PLAYER_HEIGHT);
        expect(p.lives).toBe(PLAYER_LIVES);
        expect(p.skin).toBe(1);
        expect(p.score).toBe(0);
    });

    it('aplica gravidade a cada frame', () => {
        const p = new Player(0, 0);
        p.update(1 / 60, noInput);
        expect(p.vy).toBeGreaterThan(0);
    });

    it('move para a direita com input', () => {
        const p = new Player(0, 0);
        p.update(1 / 60, { ...noInput, right: true });
        expect(p.vx).toBe(MOVE_SPEED);
        expect(p.lastDirection).toBe(1);
    });

    it('move para a esquerda com input', () => {
        const p = new Player(100, 0);
        p.update(1 / 60, { ...noInput, left: true });
        expect(p.vx).toBe(-MOVE_SPEED);
        expect(p.lastDirection).toBe(-1);
    });

    it('aplica friccao quando sem input horizontal', () => {
        const p = new Player(0, 0);
        p.vx = 100;
        p.update(1 / 60, noInput);
        expect(p.vx).toBe(100 * FRICTION);
    });

    it('pula quando no chao', () => {
        const p = new Player(0, 0);
        p.onGround = true;
        p.update(1 / 60, { ...noInput, jumpPressed: true });
        expect(p.vy).toBeLessThan(0); // negativo = pra cima
        expect(p.onGround).toBe(false);
    });

    it('nao pula no ar sem pulo duplo', () => {
        const p = new Player(0, 0);
        p.onGround = false;
        p.vy = 50;
        const vyBefore = p.vy;
        p.update(1 / 60, { ...noInput, jumpPressed: true });
        // vy deve ter aumentado pela gravidade, nao diminuido pelo pulo
        expect(p.vy).toBeGreaterThan(0);
    });

    it('takeDamage reduz vidas e ativa invencibilidade', () => {
        const p = new Player(0, 0);
        p.takeDamage();
        expect(p.lives).toBe(PLAYER_LIVES - 1);
        expect(p.invincibleTimer).toBe(INVINCIBLE_DURATION);
        expect(p.isInvincible).toBe(true);
    });

    it('nao toma dano enquanto invencivel', () => {
        const p = new Player(0, 0);
        p.takeDamage();
        const livesAfterFirst = p.lives;
        p.takeDamage();
        expect(p.lives).toBe(livesAfterFirst); // nao mudou
    });

    it('isAlive retorna false com 0 vidas', () => {
        const p = new Player(0, 0);
        p.lives = 0;
        expect(p.isAlive).toBe(false);
    });

    it('soco ativa com input e gera hitbox', () => {
        const p = new Player(100, 100);
        p.lastDirection = 1;
        p.update(1 / 60, { ...noInput, punchPressed: true });
        expect(p.punching).toBe(true);
        expect(p.punchTimer).toBeGreaterThan(0);

        const hitbox = p.punchHitbox;
        expect(hitbox).not.toBeNull();
        expect(hitbox.w).toBe(PUNCH_RANGE);
        expect(hitbox.h).toBe(PUNCH_HEIGHT);
    });

    it('punchHitbox retorna null quando nao esta socando', () => {
        const p = new Player(0, 0);
        expect(p.punchHitbox).toBeNull();
    });

    it('soco tem cooldown', () => {
        const p = new Player(0, 0);
        // Primeiro soco
        p.update(1 / 60, { ...noInput, punchPressed: true });
        expect(p.punching).toBe(true);

        // Terminar o soco
        p.punchTimer = 0;
        p.update(1 / 60, noInput);
        expect(p.punching).toBe(false);

        // Tentar socar de novo — cooldown ainda ativo
        p.update(1 / 60, { ...noInput, punchPressed: true });
        expect(p.punching).toBe(false); // cooldown impede
    });

    it('applyPowerUp speed ativa boost', () => {
        const p = new Player(0, 0);
        p.applyPowerUp('speed');
        expect(p.speedBoost).toBe(true);
        expect(p.speedTimer).toBe(SPEED_BOOST_DURATION);
    });

    it('applyPowerUp doubleJump ativa pulo duplo', () => {
        const p = new Player(0, 0);
        p.applyPowerUp('doubleJump');
        expect(p.doubleJump).toBe(true);
        expect(p.doubleJumpTimer).toBe(DOUBLE_JUMP_DURATION);
    });

    it('speed boost expira com o tempo', () => {
        const p = new Player(0, 0);
        p.applyPowerUp('speed');
        // Simular passagem de tempo
        for (let i = 0; i < 500; i++) {
            p.update(1 / 60, noInput);
        }
        expect(p.speedBoost).toBe(false);
    });

    it('velocidade aumenta com speed boost', () => {
        const p = new Player(0, 0);
        p.applyPowerUp('speed');
        p.update(1 / 60, { ...noInput, right: true });
        expect(p.vx).toBe(MOVE_SPEED * SPEED_BOOST_MULT);
    });
});
