import { describe, it, expect, beforeEach, vi } from 'vitest';
import { SaveManager } from '../js/save-manager.js';

// Mock localStorage
const localStorageMock = (() => {
    let store = {};
    return {
        getItem: vi.fn(key => store[key] || null),
        setItem: vi.fn((key, value) => { store[key] = value; }),
        removeItem: vi.fn(key => { delete store[key]; }),
        clear: () => { store = {}; }
    };
})();

Object.defineProperty(globalThis, 'localStorage', { value: localStorageMock });

describe('SaveManager', () => {
    beforeEach(() => {
        localStorageMock.clear();
        localStorageMock.getItem.mockClear();
        localStorageMock.setItem.mockClear();
        localStorageMock.removeItem.mockClear();
    });

    it('inicializa com defaults quando nao ha save', () => {
        const sm = new SaveManager();
        expect(sm.unlockedLevels).toBe(1);
        expect(sm.highScore).toBe(0);
        expect(sm.skin).toBe(0);
    });

    it('carrega dados salvos do localStorage', () => {
        localStorageMock.getItem.mockReturnValueOnce(
            JSON.stringify({ unlockedLevels: 3, highScore: 1500, skin: 2 })
        );
        const sm = new SaveManager();
        expect(sm.unlockedLevels).toBe(3);
        expect(sm.highScore).toBe(1500);
        expect(sm.skin).toBe(2);
    });

    it('valida dados corrompidos no load', () => {
        localStorageMock.getItem.mockReturnValueOnce(
            JSON.stringify({ unlockedLevels: -5, highScore: 'abc', skin: 99 })
        );
        const sm = new SaveManager();
        expect(sm.unlockedLevels).toBe(1); // corrigido para 1
        expect(sm.highScore).toBe(0); // campo invalido removido
        expect(sm.skin).toBe(0); // corrigido para 0
    });

    it('save persiste no localStorage', () => {
        const sm = new SaveManager();
        sm.unlockedLevels = 2;
        sm.highScore = 500;
        sm.skin = 1;
        sm.save();

        expect(localStorageMock.setItem).toHaveBeenCalledWith(
            'ceciGameSave',
            JSON.stringify({ unlockedLevels: 2, highScore: 500, skin: 1 })
        );
    });

    it('deleteSave limpa localStorage e reseta valores', () => {
        const sm = new SaveManager();
        sm.unlockedLevels = 4;
        sm.highScore = 9999;
        sm.deleteSave();

        expect(localStorageMock.removeItem).toHaveBeenCalled();
        expect(sm.unlockedLevels).toBe(1);
        expect(sm.highScore).toBe(0);
    });

    it('unlockNext desbloqueia proxima fase', () => {
        const sm = new SaveManager();
        expect(sm.unlockedLevels).toBe(1);
        sm.unlockNext(0, 4); // completou fase 0, total 4
        expect(sm.unlockedLevels).toBe(2);
    });

    it('unlockNext nao excede total de fases', () => {
        const sm = new SaveManager();
        sm.unlockedLevels = 3;
        sm.unlockNext(3, 4); // completou ultima fase
        expect(sm.unlockedLevels).toBe(4);
        sm.unlockNext(3, 4); // tentar desbloquear alem
        expect(sm.unlockedLevels).toBe(4);
    });

    it('unlockNext nao regride fases desbloqueadas', () => {
        const sm = new SaveManager();
        sm.unlockedLevels = 4;
        sm.unlockNext(0, 4); // completou fase 0 de novo
        expect(sm.unlockedLevels).toBe(4); // nao regrediu
    });

    it('updateHighScore atualiza quando score e maior', () => {
        const sm = new SaveManager();
        sm.updateHighScore(1000);
        expect(sm.highScore).toBe(1000);
        sm.updateHighScore(500);
        expect(sm.highScore).toBe(1000); // nao regrediu
    });

    it('lida com JSON invalido no localStorage', () => {
        localStorageMock.getItem.mockReturnValueOnce('not json');
        const sm = new SaveManager();
        expect(sm.unlockedLevels).toBe(1);
        expect(sm.highScore).toBe(0);
    });
});
