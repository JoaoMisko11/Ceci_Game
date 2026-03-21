const SAVE_KEY = 'ceciGameSave';

export class SaveManager {
    constructor() {
        this.data = this.load();
        this.unlockedLevels = this.data.unlockedLevels || 1;
        this.highScore = this.data.highScore || 0;
        this.skin = this.data.skin !== undefined ? this.data.skin : 0;
    }

    load() {
        try {
            const raw = localStorage.getItem(SAVE_KEY);
            if (!raw) return {};
            const data = JSON.parse(raw);
            // Validar tipos dos campos esperados
            if (typeof data !== 'object' || data === null) return {};
            if (data.unlockedLevels !== undefined && (typeof data.unlockedLevels !== 'number' || data.unlockedLevels < 1)) {
                data.unlockedLevels = 1;
            }
            if (data.highScore !== undefined && (typeof data.highScore !== 'number' || data.highScore < 0)) {
                data.highScore = 0;
            }
            if (data.skin !== undefined && (typeof data.skin !== 'number' || data.skin < 0 || data.skin > 2)) {
                data.skin = 0;
            }
            return data;
        } catch {
            return {};
        }
    }

    save() {
        const data = {
            unlockedLevels: this.unlockedLevels,
            highScore: this.highScore,
            skin: this.skin
        };
        try {
            localStorage.setItem(SAVE_KEY, JSON.stringify(data));
        } catch {
            // localStorage indisponivel — ignorar
        }
    }

    deleteSave() {
        try {
            localStorage.removeItem(SAVE_KEY);
        } catch {
            // ignorar
        }
        this.unlockedLevels = 1;
        this.highScore = 0;
    }

    // Desbloquear proxima fase apos vitoria
    // unlockedLevels e 1-based (1 = so fase 0 desbloqueada)
    // levelIndex e 0-based, entao +2 converte para 1-based da proxima fase
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
