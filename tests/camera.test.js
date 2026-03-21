import { describe, it, expect } from 'vitest';
import { Camera } from '../js/camera.js';

describe('Camera', () => {
    it('inicializa com posicao zero', () => {
        const cam = new Camera(800, 600);
        expect(cam.x).toBe(0);
        expect(cam.y).toBe(0);
        expect(cam.viewWidth).toBe(800);
        expect(cam.viewHeight).toBe(600);
    });

    it('centraliza no jogador', () => {
        const cam = new Camera(800, 600);
        const target = { x: 1000, y: 200, width: 32, height: 48 };
        cam.follow(target, 3200, 1200);

        // Jogador deve ficar no centro da camera
        expect(cam.x).toBe(1000 + 16 - 400); // 616
        expect(cam.y).toBe(0); // -76 clamped to 0
    });

    it('nao permite camera sair dos limites esquerdo/superior', () => {
        const cam = new Camera(800, 600);
        const target = { x: 10, y: 10, width: 32, height: 48 };
        cam.follow(target, 3200, 1200);

        expect(cam.x).toBe(0);
        expect(cam.y).toBe(0);
    });

    it('nao permite camera sair dos limites direito/inferior', () => {
        const cam = new Camera(800, 600);
        const target = { x: 3100, y: 1100, width: 32, height: 48 };
        cam.follow(target, 3200, 1200);

        expect(cam.x).toBe(3200 - 800); // 2400
        expect(cam.y).toBe(1200 - 600); // 600
    });

    it('resize atualiza dimensoes da viewport', () => {
        const cam = new Camera(800, 600);
        cam.resize(1024, 768);
        expect(cam.viewWidth).toBe(1024);
        expect(cam.viewHeight).toBe(768);
    });
});
