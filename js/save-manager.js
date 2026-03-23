const SAVE_PREFIX = 'ceciGameSlot_';
const OLD_SAVE_KEY = 'ceciGameSave';
const MAX_SLOTS = 3;

export { MAX_SLOTS };

export class SaveManager {
    constructor() {
        this.currentSlot = -1; // Nenhum slot selecionado
        this.unlockedLevels = 1;
        this.highScore = 0;
        this.skin = 0;
        this.migrateOldSave();
    }

    // Migra save antigo (formato unico) para slot 0
    migrateOldSave() {
        try {
            const raw = localStorage.getItem(OLD_SAVE_KEY);
            if (!raw) return;
            // So migra se slot 0 estiver vazio
            if (localStorage.getItem(SAVE_PREFIX + '0')) return;
            const data = JSON.parse(raw);
            if (typeof data !== 'object' || data === null) return;
            const migrated = {
                unlockedLevels: data.unlockedLevels || 1,
                highScore: data.highScore || 0,
                skin: data.skin !== undefined ? data.skin : 0,
                lastPlayed: new Date().toISOString()
            };
            localStorage.setItem(SAVE_PREFIX + '0', JSON.stringify(migrated));
            localStorage.removeItem(OLD_SAVE_KEY);
        } catch {
            // ignorar erros de migracao
        }
    }

    // Retorna array com info de todos os slots (null se vazio)
    listSlots() {
        const slots = [];
        for (let i = 0; i < MAX_SLOTS; i++) {
            slots.push(this.loadSlot(i));
        }
        return slots;
    }

    loadSlot(index) {
        try {
            const raw = localStorage.getItem(SAVE_PREFIX + index);
            if (!raw) return null;
            const data = JSON.parse(raw);
            if (typeof data !== 'object' || data === null) return null;
            // Validar tipos
            if (data.unlockedLevels !== undefined && (typeof data.unlockedLevels !== 'number' || data.unlockedLevels < 1)) {
                data.unlockedLevels = 1;
            }
            if (data.highScore !== undefined && (typeof data.highScore !== 'number' || data.highScore < 0)) {
                data.highScore = 0;
            }
            if (data.skin !== undefined && (typeof data.skin !== 'number' || data.skin < 0 || data.skin > 2)) {
                data.skin = 0;
            }
            return {
                unlockedLevels: data.unlockedLevels || 1,
                highScore: data.highScore || 0,
                skin: data.skin !== undefined ? data.skin : 0,
                lastPlayed: data.lastPlayed || null
            };
        } catch {
            return null;
        }
    }

    // Seleciona um slot existente e carrega seus dados
    selectSlot(index) {
        this.currentSlot = index;
        const data = this.loadSlot(index);
        if (data) {
            this.unlockedLevels = data.unlockedLevels;
            this.highScore = data.highScore;
            this.skin = data.skin;
        } else {
            // Slot novo
            this.unlockedLevels = 1;
            this.highScore = 0;
            this.skin = 0;
        }
    }

    // Cria novo jogo no slot indicado (limpa dados anteriores)
    newGame(index) {
        this.currentSlot = index;
        this.unlockedLevels = 1;
        this.highScore = 0;
        this.skin = 0;
        this.save();
    }

    save() {
        if (this.currentSlot < 0) return;
        const data = {
            unlockedLevels: this.unlockedLevels,
            highScore: this.highScore,
            skin: this.skin,
            lastPlayed: new Date().toISOString()
        };
        try {
            localStorage.setItem(SAVE_PREFIX + this.currentSlot, JSON.stringify(data));
        } catch {
            // localStorage indisponivel — ignorar
        }
    }

    deleteSlot(index) {
        try {
            localStorage.removeItem(SAVE_PREFIX + index);
        } catch {
            // ignorar
        }
        if (this.currentSlot === index) {
            this.currentSlot = -1;
            this.unlockedLevels = 1;
            this.highScore = 0;
            this.skin = 0;
        }
    }

    // Desbloquear proxima fase apos vitoria
    unlockNext(levelIndex, totalLevels) {
        const nextUnlock = levelIndex + 2;
        if (nextUnlock > this.unlockedLevels) {
            this.unlockedLevels = Math.min(nextUnlock, totalLevels);
        }
    }

    updateHighScore(score) {
        if (score > this.highScore) {
            this.highScore = score;
        }
    }
}
