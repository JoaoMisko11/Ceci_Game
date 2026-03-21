import { describe, it, expect } from 'vitest';
import { Platform, createPlatform, checkAABB, resolveCollision } from '../js/platform.js';
import { MOVING_PLATFORM_SPEED, BREAKABLE_TIMER } from '../js/constants.js';

describe('Platform', () => {
    it('cria plataforma estatica', () => {
        const p = new Platform(0, 500, 200, 20);
        expect(p.type).toBe('static');
        expect(p.active).toBe(true);
    });

    it('plataforma movel oscila', () => {
        const p = new Platform(100, 300, 100, 20, '#4a90d9', 'moving');
        p.moveDistX = 200;
        const startX = p.x;

        // Simular varios frames
        for (let i = 0; i < 100; i++) {
            p.update(1 / 60);
        }
        expect(p.x).not.toBe(startX);
    });

    it('plataforma quebravel desativa apos timer', () => {
        const p = new Platform(0, 0, 100, 20, '#4a90d9', 'breakable');
        expect(p.active).toBe(true);

        p.startBreaking();
        expect(p.breaking).toBe(true);

        // Simular ate quebrar
        for (let i = 0; i < 60; i++) {
            p.update(1 / 60);
        }
        expect(p.active).toBe(false);
    });

    it('startBreaking nao faz nada em plataforma nao-quebravel', () => {
        const p = new Platform(0, 0, 100, 20);
        p.startBreaking();
        expect(p.breaking).toBe(false);
    });
});

describe('createPlatform', () => {
    it('cria plataforma a partir de dados JSON', () => {
        const data = { x: 100, y: 200, w: 150, h: 20, type: 'moving', moveDistX: 100 };
        const p = createPlatform(data);
        expect(p.x).toBe(100);
        expect(p.y).toBe(200);
        expect(p.type).toBe('moving');
        expect(p.moveDistX).toBe(100);
    });

    it('defaults para static quando type nao especificado', () => {
        const p = createPlatform({ x: 0, y: 0, w: 100, h: 20 });
        expect(p.type).toBe('static');
    });
});

describe('checkAABB', () => {
    it('detecta colisao entre retangulos sobrepostos', () => {
        const a = { x: 0, y: 0, w: 50, h: 50 };
        const b = { x: 30, y: 30, w: 50, h: 50 };
        expect(checkAABB(a, b)).toBe(true);
    });

    it('nao detecta colisao entre retangulos separados', () => {
        const a = { x: 0, y: 0, w: 50, h: 50 };
        const b = { x: 100, y: 100, w: 50, h: 50 };
        expect(checkAABB(a, b)).toBe(false);
    });

    it('ignora plataformas inativas', () => {
        const a = { x: 0, y: 0, w: 50, h: 50 };
        const b = { x: 0, y: 0, w: 50, h: 50, active: false };
        expect(checkAABB(a, b)).toBe(false);
    });

    it('detecta colisao nas bordas', () => {
        const a = { x: 0, y: 0, w: 50, h: 50 };
        const b = { x: 49, y: 49, w: 50, h: 50 };
        expect(checkAABB(a, b)).toBe(true);
    });

    it('nao detecta quando exatamente adjacentes', () => {
        const a = { x: 0, y: 0, w: 50, h: 50 };
        const b = { x: 50, y: 0, w: 50, h: 50 };
        expect(checkAABB(a, b)).toBe(false);
    });
});

describe('resolveCollision', () => {
    it('resolve colisao por cima (aterrissagem)', () => {
        const player = { x: 50, y: 78, width: 32, height: 48, vx: 0, vy: 100, onGround: false };
        const platform = new Platform(0, 100, 200, 20);

        const side = resolveCollision(player, platform);
        expect(side).toBe('top');
        expect(player.onGround).toBe(true);
        expect(player.vy).toBe(0);
        expect(player.y).toBe(100 - 48);
    });

    it('resolve colisao por baixo', () => {
        const player = { x: 50, y: 18, width: 32, height: 48, vx: 0, vy: -100, onGround: false };
        const platform = new Platform(0, 0, 200, 20);

        const side = resolveCollision(player, platform);
        expect(side).toBe('bottom');
        expect(player.vy).toBe(0);
    });

    it('ignora plataformas inativas', () => {
        const player = { x: 50, y: 80, width: 32, height: 48, vx: 0, vy: 0, onGround: false };
        const platform = new Platform(0, 100, 200, 20);
        platform.active = false;

        const side = resolveCollision(player, platform);
        expect(side).toBeNull();
    });
});
