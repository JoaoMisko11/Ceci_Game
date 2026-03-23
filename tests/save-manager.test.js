import { describe, it, expect, beforeEach, vi } from 'vitest';
import { SaveManager, MAX_SLOTS } from '../js/save-manager.js';

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

    it('inicializa com defaults (nenhum slot selecionado)', () => {
        const sm = new SaveManager();
        expect(sm.currentSlot).toBe(-1);
        expect(sm.unlockedLevels).toBe(1);
        expect(sm.highScore).toBe(0);
        expect(sm.skin).toBe(0);
    });

    it('MAX_SLOTS e 3', () => {
        expect(MAX_SLOTS).toBe(3);
    });

    it('listSlots retorna null para slots vazios', () => {
        const sm = new SaveManager();
        const slots = sm.listSlots();
        expect(slots).toHaveLength(3);
        expect(slots[0]).toBeNull();
        expect(slots[1]).toBeNull();
        expect(slots[2]).toBeNull();
    });

    it('selectSlot carrega dados existentes', () => {
        localStorageMock.setItem('ceciGameSlot_1',
            JSON.stringify({ unlockedLevels: 3, highScore: 1500, skin: 2, lastPlayed: '2026-01-01' })
        );
        localStorageMock.setItem.mockClear();

        const sm = new SaveManager();
        sm.selectSlot(1);

        expect(sm.currentSlot).toBe(1);
        expect(sm.unlockedLevels).toBe(3);
        expect(sm.highScore).toBe(1500);
        expect(sm.skin).toBe(2);
    });

    it('selectSlot com slot vazio usa defaults', () => {
        const sm = new SaveManager();
        sm.selectSlot(2);

        expect(sm.currentSlot).toBe(2);
        expect(sm.unlockedLevels).toBe(1);
        expect(sm.highScore).toBe(0);
        expect(sm.skin).toBe(0);
    });

    it('save persiste no slot correto', () => {
        const sm = new SaveManager();
        sm.selectSlot(0);
        sm.unlockedLevels = 2;
        sm.highScore = 500;
        sm.skin = 1;
        sm.save();

        expect(localStorageMock.setItem).toHaveBeenCalledWith(
            'ceciGameSlot_0',
            expect.stringContaining('"unlockedLevels":2')
        );
        expect(localStorageMock.setItem).toHaveBeenCalledWith(
            'ceciGameSlot_0',
            expect.stringContaining('"highScore":500')
        );
    });

    it('save nao faz nada sem slot selecionado', () => {
        const sm = new SaveManager();
        sm.save();
        // Nenhum setItem alem de eventuais migracoes
        expect(localStorageMock.setItem).not.toHaveBeenCalled();
    });

    it('newGame cria slot limpo', () => {
        const sm = new SaveManager();
        sm.newGame(1);

        expect(sm.currentSlot).toBe(1);
        expect(sm.unlockedLevels).toBe(1);
        expect(sm.highScore).toBe(0);
        expect(localStorageMock.setItem).toHaveBeenCalled();
    });

    it('deleteSlot remove do localStorage e reseta se era o slot atual', () => {
        const sm = new SaveManager();
        sm.selectSlot(0);
        sm.unlockedLevels = 4;
        sm.save();

        sm.deleteSlot(0);

        expect(localStorageMock.removeItem).toHaveBeenCalledWith('ceciGameSlot_0');
        expect(sm.currentSlot).toBe(-1);
        expect(sm.unlockedLevels).toBe(1);
    });

    it('deleteSlot de outro slot nao afeta slot atual', () => {
        const sm = new SaveManager();
        sm.selectSlot(0);
        sm.unlockedLevels = 3;

        sm.deleteSlot(2);

        expect(sm.currentSlot).toBe(0);
        expect(sm.unlockedLevels).toBe(3);
    });

    it('unlockNext desbloqueia proxima fase', () => {
        const sm = new SaveManager();
        expect(sm.unlockedLevels).toBe(1);
        sm.unlockNext(0, 4);
        expect(sm.unlockedLevels).toBe(2);
    });

    it('unlockNext nao excede total de fases', () => {
        const sm = new SaveManager();
        sm.unlockedLevels = 3;
        sm.unlockNext(3, 4);
        expect(sm.unlockedLevels).toBe(4);
        sm.unlockNext(3, 4);
        expect(sm.unlockedLevels).toBe(4);
    });

    it('unlockNext nao regride fases desbloqueadas', () => {
        const sm = new SaveManager();
        sm.unlockedLevels = 4;
        sm.unlockNext(0, 4);
        expect(sm.unlockedLevels).toBe(4);
    });

    it('updateHighScore atualiza quando score e maior', () => {
        const sm = new SaveManager();
        sm.updateHighScore(1000);
        expect(sm.highScore).toBe(1000);
        sm.updateHighScore(500);
        expect(sm.highScore).toBe(1000);
    });

    it('valida dados corrompidos no loadSlot', () => {
        localStorageMock.setItem('ceciGameSlot_0',
            JSON.stringify({ unlockedLevels: -5, highScore: 'abc', skin: 99 })
        );
        localStorageMock.setItem.mockClear();

        const sm = new SaveManager();
        sm.selectSlot(0);
        expect(sm.unlockedLevels).toBe(1);
        expect(sm.highScore).toBe(0);
        expect(sm.skin).toBe(0);
    });

    it('lida com JSON invalido no localStorage', () => {
        localStorageMock.setItem('ceciGameSlot_0', 'not json');
        localStorageMock.setItem.mockClear();

        const sm = new SaveManager();
        const slot = sm.loadSlot(0);
        expect(slot).toBeNull();
    });

    it('migra save antigo para slot 0', () => {
        localStorageMock.setItem('ceciGameSave',
            JSON.stringify({ unlockedLevels: 2, highScore: 800, skin: 1 })
        );
        localStorageMock.setItem.mockClear();
        localStorageMock.removeItem.mockClear();

        const sm = new SaveManager();

        // Deve ter migrado para slot 0
        const slot = sm.loadSlot(0);
        expect(slot).not.toBeNull();
        expect(slot.unlockedLevels).toBe(2);
        expect(slot.highScore).toBe(800);
        expect(slot.skin).toBe(1);

        // Deve ter removido o save antigo
        expect(localStorageMock.removeItem).toHaveBeenCalledWith('ceciGameSave');
    });

    it('nao migra se slot 0 ja tem dados', () => {
        localStorageMock.setItem('ceciGameSave',
            JSON.stringify({ unlockedLevels: 2, highScore: 800, skin: 1 })
        );
        localStorageMock.setItem('ceciGameSlot_0',
            JSON.stringify({ unlockedLevels: 4, highScore: 5000, skin: 0, lastPlayed: '2026-01-01' })
        );
        localStorageMock.setItem.mockClear();
        localStorageMock.removeItem.mockClear();

        const sm = new SaveManager();

        // Slot 0 mantem dados originais
        const slot = sm.loadSlot(0);
        expect(slot.unlockedLevels).toBe(4);
        expect(slot.highScore).toBe(5000);

        // Save antigo nao foi removido
        expect(localStorageMock.removeItem).not.toHaveBeenCalledWith('ceciGameSave');
    });

    it('listSlots mostra slots com dados', () => {
        localStorageMock.setItem('ceciGameSlot_0',
            JSON.stringify({ unlockedLevels: 2, highScore: 100, skin: 0, lastPlayed: '2026-01-01' })
        );
        localStorageMock.setItem('ceciGameSlot_2',
            JSON.stringify({ unlockedLevels: 4, highScore: 3000, skin: 2, lastPlayed: '2026-03-01' })
        );
        localStorageMock.setItem.mockClear();

        const sm = new SaveManager();
        const slots = sm.listSlots();

        expect(slots[0]).not.toBeNull();
        expect(slots[0].highScore).toBe(100);
        expect(slots[1]).toBeNull();
        expect(slots[2]).not.toBeNull();
        expect(slots[2].highScore).toBe(3000);
    });
});
