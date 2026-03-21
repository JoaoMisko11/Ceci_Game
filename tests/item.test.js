import { describe, it, expect } from 'vitest';
import { Item } from '../js/item.js';
import { PowerUp } from '../js/powerup.js';
import {
    ITEM_SIZE, SCORE_COIN, SCORE_STAR,
    POWERUP_SIZE
} from '../js/constants.js';

describe('Item', () => {
    it('cria moeda com dimensoes corretas', () => {
        const item = new Item(100, 200, 'coin');
        expect(item.w).toBe(ITEM_SIZE);
        expect(item.h).toBe(ITEM_SIZE);
        expect(item.type).toBe('coin');
        expect(item.collected).toBe(false);
    });

    it('flutua verticalmente', () => {
        const item = new Item(100, 200, 'coin');
        const startY = item.y;
        for (let i = 0; i < 30; i++) {
            item.update(1 / 60);
        }
        expect(item.y).not.toBe(startY);
    });

    it('nao atualiza quando coletado', () => {
        const item = new Item(100, 200, 'coin');
        item.collect();
        const y = item.y;
        item.update(1 / 60);
        expect(item.y).toBe(y);
    });

    it('collect retorna pontuacao de moeda', () => {
        const item = new Item(0, 0, 'coin');
        expect(item.collect()).toBe(SCORE_COIN);
        expect(item.collected).toBe(true);
    });

    it('collect retorna pontuacao de estrela', () => {
        const item = new Item(0, 0, 'star');
        expect(item.collect()).toBe(SCORE_STAR);
    });
});

describe('PowerUp', () => {
    it('cria power-up com dimensoes corretas', () => {
        const pu = new PowerUp(100, 200, 'speed');
        expect(pu.w).toBe(POWERUP_SIZE);
        expect(pu.h).toBe(POWERUP_SIZE);
        expect(pu.type).toBe('speed');
        expect(pu.collected).toBe(false);
    });

    it('flutua verticalmente', () => {
        const pu = new PowerUp(100, 200);
        const startY = pu.y;
        for (let i = 0; i < 30; i++) {
            pu.update(1 / 60);
        }
        expect(pu.y).not.toBe(startY);
    });

    it('collect marca como coletado', () => {
        const pu = new PowerUp(0, 0, 'doubleJump');
        pu.collect();
        expect(pu.collected).toBe(true);
    });

    it('nao atualiza quando coletado', () => {
        const pu = new PowerUp(100, 200);
        pu.collect();
        const y = pu.y;
        pu.update(1 / 60);
        expect(pu.y).toBe(y);
    });
});
