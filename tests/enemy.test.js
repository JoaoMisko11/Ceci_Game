import { describe, it, expect } from 'vitest';
import { Enemy } from '../js/enemy.js';
import {
    ENEMY_SIZE, WALKER_SPEED, FLYER_SPEED, SWIMMER_SPEED,
    BOSS_WIDTH, BOSS_HEIGHT, BOSS_LIVES, BOSS_SPEED, BOSS_HIT_TIMER,
    BOSS_INK_SIZE, BOSS_INK_LIFETIME
} from '../js/constants.js';

describe('Enemy', () => {
    it('cria walker com valores corretos', () => {
        const e = new Enemy(100, 200, 150, 'walker');
        expect(e.w).toBe(ENEMY_SIZE);
        expect(e.h).toBe(ENEMY_SIZE);
        expect(e.speed).toBe(WALKER_SPEED);
        expect(e.alive).toBe(true);
        expect(e.isBoss).toBe(false);
    });

    it('cria flyer com velocidade correta', () => {
        const e = new Enemy(0, 0, 100, 'flyer');
        expect(e.speed).toBe(FLYER_SPEED);
    });

    it('cria swimmer com velocidade correta', () => {
        const e = new Enemy(0, 0, 100, 'swimmer');
        expect(e.speed).toBe(SWIMMER_SPEED);
    });

    it('walker patrulha e inverte direcao', () => {
        const e = new Enemy(100, 200, 50, 'walker');
        // Andar para frente ate o limite
        for (let i = 0; i < 100; i++) {
            e.update(1 / 60);
        }
        // Deve ter invertido a direcao em algum momento
        expect(e.x).toBeLessThanOrEqual(e.startX + e.patrolDistance);
        expect(e.x).toBeGreaterThanOrEqual(e.startX);
    });

    it('flyer flutua verticalmente', () => {
        const e = new Enemy(100, 200, 50, 'flyer');
        const startY = e.y;
        for (let i = 0; i < 30; i++) {
            e.update(1 / 60);
        }
        expect(e.y).not.toBe(startY);
    });

    it('kill desativa o inimigo', () => {
        const e = new Enemy(0, 0);
        e.kill();
        expect(e.alive).toBe(false);
    });

    it('inimigo morto nao atualiza', () => {
        const e = new Enemy(100, 200, 100, 'walker');
        e.kill();
        const x = e.x;
        e.update(1 / 60);
        expect(e.x).toBe(x); // nao moveu
    });
});

describe('Boss (Octopus)', () => {
    it('cria boss com dimensoes e vidas corretas', () => {
        const b = new Enemy(100, 100, 200, 'octopus');
        expect(b.w).toBe(BOSS_WIDTH);
        expect(b.h).toBe(BOSS_HEIGHT);
        expect(b.lives).toBe(BOSS_LIVES);
        expect(b.isBoss).toBe(true);
        expect(b.speed).toBe(BOSS_SPEED);
    });

    it('takeDamage reduz vidas do boss', () => {
        const b = new Enemy(0, 0, 200, 'octopus');
        const result = b.takeDamage();
        expect(result).toBe(true);
        expect(b.lives).toBe(BOSS_LIVES - 1);
        expect(b.hitTimer).toBe(BOSS_HIT_TIMER);
    });

    it('takeDamage falha durante invencibilidade', () => {
        const b = new Enemy(0, 0, 200, 'octopus');
        b.takeDamage();
        const livesAfter = b.lives;
        const result = b.takeDamage();
        expect(result).toBe(false);
        expect(b.lives).toBe(livesAfter);
    });

    it('boss morre quando vidas chegam a zero', () => {
        const b = new Enemy(0, 0, 200, 'octopus');
        for (let i = 0; i < BOSS_LIVES; i++) {
            b.hitTimer = 0; // resetar invencibilidade
            b.takeDamage();
        }
        expect(b.alive).toBe(false);
    });

    it('boss muda de fase conforme perde vidas', () => {
        const b = new Enemy(0, 0, 200, 'octopus');
        expect(b.bossPhase).toBe(1);

        // Tirar vidas ate fase 2 (<=70% = 3.5 vidas => 2 vidas restantes)
        b.hitTimer = 0; b.takeDamage(); // 4 vidas
        b.hitTimer = 0; b.takeDamage(); // 3 vidas
        b.update(1 / 60);
        expect(b.bossPhase).toBe(2);

        // Tirar mais vidas ate fase 3 (<=40% = 2 vidas => 1 vida restante)
        b.hitTimer = 0; b.takeDamage(); // 2 vidas
        b.update(1 / 60);
        expect(b.bossPhase).toBe(3);
    });

    it('boss dispara tinta', () => {
        const b = new Enemy(100, 100, 200, 'octopus');
        b.inkCooldown = 0;
        b.update(1 / 60);
        expect(b.inkAttacks.length).toBeGreaterThan(0);

        const ink = b.inkAttacks[0];
        expect(ink.w).toBe(BOSS_INK_SIZE);
        expect(ink.life).toBeCloseTo(BOSS_INK_LIFETIME, 0); // life decreases slightly during update
    });

    it('projeteis de tinta expiram', () => {
        const b = new Enemy(100, 100, 200, 'octopus');
        b.inkCooldown = 0;
        b.update(1 / 60);

        // Expirar todos os projeteis
        for (const ink of b.inkAttacks) {
            ink.life = 0;
        }
        b.inkCooldown = 999; // evitar novos disparos
        b.update(1 / 60);
        expect(b.inkAttacks.length).toBe(0);
    });

    it('takeDamage retorna false para inimigo nao-boss', () => {
        const e = new Enemy(0, 0, 100, 'walker');
        const result = e.takeDamage();
        expect(result).toBe(false);
    });
});
