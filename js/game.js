import { Player } from './player.js';
import { Input } from './input.js';
import { Camera } from './camera.js';
import { Level } from './level.js';
import { drawPlayer, drawPunch, drawEnemy, drawItem, drawBackground, drawWater, drawBossHealthBar } from './renderer.js';
import { playJumpSound, playPunchSound, playBossVictorySound, playFireworkSound, playGameOverSound } from './audio.js';
import { ParticleSystem } from './particles.js';
import { TouchControls } from './touch.js';
import {
    PLAYER_LIVES, BOSS_WIDTH, BOSS_HEIGHT,
    BOSS_VICTORY_FIREWORK_FAST, BOSS_VICTORY_FIREWORK_SLOW, BOSS_VICTORY_FIREWORK_THRESHOLD
} from './constants.js';
import { SaveManager } from './save-manager.js';
import {
    handlePunchCollisions, resetPunchFlags, handlePlatformCollisions,
    handleWaterCheck, handleItemCollisions, handlePowerUpCollisions,
    handleEnemyCollisions, checkFallDeath, checkVictory, rebuildPlatformGrid
} from './collision.js';
import {
    renderTitle, renderHUD, renderGameOver, renderVictory,
    renderBossVictory, renderCharacterSelect, renderLevelSelect,
    renderSaveSelect
} from './menu-renderer.js';

const STATE = {
    TITLE: 'title',
    SAVE_SELECT: 'saveSelect',
    CHARACTER_SELECT: 'characterSelect',
    LEVEL_SELECT: 'levelSelect',
    PLAYING: 'playing',
    GAME_OVER: 'gameOver',
    VICTORY: 'victory',
    BOSS_VICTORY: 'bossVictory'
};

const LEVELS = [
    'assets/levels/level1.json',
    'assets/levels/level2.json',
    'assets/levels/level3.json',
    'assets/levels/level4.json'
];

export class Game {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.lastTime = 0;

        this.input = new Input();
        this.touchControls = new TouchControls(canvas);
        this.input.touch = this.touchControls;
        this.camera = new Camera(canvas.width, canvas.height);
        this.particles = new ParticleSystem();
        this.player = null;
        this.level = null;
        this.state = STATE.TITLE;
        this.titleTime = 0;
        this.currentLevelIndex = 0;
        this.selectedSkin = 0;
        this.selectTime = 0;

        // Seletor de fase
        this.selectedLevel = 0;
        this.levelSelectTime = 0;

        // Seletor de save
        this.selectedSlot = 0;
        this.saveSelectTime = 0;
        this.confirmingDelete = false;
        this.saveSlots = []; // Cache da lista de slots

        // Animacao de vitoria do boss
        this.bossVictoryTime = 0;
        this.bossVictoryFireworkTimer = 0;
        this.bossVictorySoundPlayed = false;

        // Save
        this.saveManager = new SaveManager();
    }

    // Getters de conveniencia para dados de save
    get unlockedLevels() { return this.saveManager.unlockedLevels; }
    get highScore() { return this.saveManager.highScore; }

    // Melhor recorde entre todos os slots (para tela de titulo)
    get bestHighScore() {
        const slots = this.saveManager.listSlots();
        let best = 0;
        for (const slot of slots) {
            if (slot && slot.highScore > best) best = slot.highScore;
        }
        return best;
    }

    async loadLevel(index) {
        this.currentLevelIndex = index;
        try {
            this.level = await Level.load(LEVELS[index]);
        } catch (err) {
            console.error('Erro ao carregar nivel:', err);
            this.state = STATE.LEVEL_SELECT;
            return;
        }
        const start = this.level.playerStart;

        // Manter pontuacao e vidas entre fases
        const prevScore = this.player ? this.player.score : 0;
        const prevLives = this.player ? this.player.lives : PLAYER_LIVES;

        this.player = new Player(start.x, start.y, this.selectedSkin);
        this.player.score = prevScore;
        this.player.lives = prevLives;

        this.particles = new ParticleSystem();
        this.state = STATE.PLAYING;
    }

    start() {
        this.lastTime = performance.now();
        requestAnimationFrame((timestamp) => this.gameLoop(timestamp));
    }

    gameLoop(timestamp) {
        const dt = (timestamp - this.lastTime) / 1000;
        this.lastTime = timestamp;

        this.update(dt);
        this.render();

        this.input.endFrame();
        this.touchControls.endFrame();
        requestAnimationFrame((timestamp) => this.gameLoop(timestamp));
    }

    update(dt) {
        if (this.state === STATE.TITLE) {
            this.titleTime += dt;
            return;
        }

        if (this.state === STATE.SAVE_SELECT) {
            this.saveSelectTime += dt;
            return;
        }

        if (this.state === STATE.CHARACTER_SELECT) {
            this.selectTime += dt;
            return;
        }

        if (this.state === STATE.LEVEL_SELECT) {
            this.levelSelectTime += dt;
            return;
        }

        if (this.state === STATE.BOSS_VICTORY) {
            this.updateBossVictory(dt);
            return;
        }

        if (this.state !== STATE.PLAYING) {
            this.particles.update(dt);
            return;
        }

        if (!this.level || !this.player) return;

        this.updatePlaying(dt);
    }

    updateBossVictory(dt) {
        this.bossVictoryTime += dt;
        this.particles.update(dt);

        if (!this.bossVictorySoundPlayed) {
            this.bossVictorySoundPlayed = true;
            playBossVictorySound();
        }

        // Fogos de artificio continuos
        this.bossVictoryFireworkTimer += dt;
        const fireworkInterval = this.bossVictoryTime < BOSS_VICTORY_FIREWORK_THRESHOLD
            ? BOSS_VICTORY_FIREWORK_FAST : BOSS_VICTORY_FIREWORK_SLOW;
        if (this.bossVictoryFireworkTimer >= fireworkInterval) {
            this.bossVictoryFireworkTimer = 0;
            this.particles.firework(this.canvas.width, this.canvas.height, this.camera.x, this.camera.y);
            playFireworkSound();
        }

        // Chuva de estrelas douradas
        if (this.bossVictoryTime > 1) {
            for (let i = 0; i < 3; i++) {
                this.particles.goldenRain(this.canvas.width, this.camera.x, this.camera.y);
            }
        }
    }

    updatePlaying(dt) {
        const wasOnGround = this.player.onGround;

        this.player.update(dt, this.input);
        this.level.update(dt);
        this.particles.update(dt);

        // Som do soco
        if (this.player.punching && this.player.punchTimer >= this.player.PUNCH_DURATION - dt) {
            playPunchSound();
        }

        // Reconstroi grade espacial (plataformas moveis podem mudar de posicao)
        rebuildPlatformGrid(this.level.platforms);

        // Colisoes
        handlePunchCollisions(this.player, this.level.enemies, this.particles);
        resetPunchFlags(this.player, this.level.enemies);

        // Som e particulas de pulo
        if (wasOnGround && !this.player.onGround && this.player.vy < 0) {
            playJumpSound();
            this.particles.jumpDust(this.player.x, this.player.y + this.player.height, this.player.width);
        }

        // Particulas de aterrissagem
        if (!wasOnGround && this.player.onGround) {
            this.particles.landDust(this.player.x, this.player.y + this.player.height, this.player.width);
        }

        handleWaterCheck(this.player, this.level.waterZones);
        handlePlatformCollisions(this.player, this.level.platforms);
        handleItemCollisions(this.player, this.level.items, this.particles);
        handlePowerUpCollisions(this.player, this.level.powerups, this.particles);

        const enemyResult = handleEnemyCollisions(this.player, this.level.enemies, this.particles);
        if (enemyResult === 'gameOver') {
            this.state = STATE.GAME_OVER;
        }

        // Checar vitoria
        const { won, boss } = checkVictory(this.level);
        if (won) {
            if (boss) {
                this.state = STATE.BOSS_VICTORY;
                this.bossVictoryTime = 0;
                this.bossVictoryFireworkTimer = 0;
                this.bossVictorySoundPlayed = false;
                this.particles.bossExplosion(
                    boss.x || this.player.x, boss.y || this.player.y,
                    boss.w || BOSS_WIDTH, boss.h || BOSS_HEIGHT
                );
            } else {
                this.state = STATE.VICTORY;
            }

            this.saveManager.unlockNext(this.currentLevelIndex, LEVELS.length);
            this.saveManager.updateHighScore(this.player.score);
            this.saveManager.save();
        }

        // Jogador caiu do mapa
        if (checkFallDeath(this.player, this.level.height)) {
            this.player.lives = 0;
            this.state = STATE.GAME_OVER;
            playGameOverSound();
        }

        // Limitar jogador aos limites do nivel
        if (this.player.x < 0) this.player.x = 0;
        if (this.player.x + this.player.width > this.level.width) {
            this.player.x = this.level.width - this.player.width;
        }

        this.camera.follow(this.player, this.level.width, this.level.height);
    }

    render() {
        const { ctx, canvas } = this;
        const isTouch = this.touchControls.active;

        if (this.state === STATE.TITLE) {
            renderTitle(ctx, canvas, this.titleTime, this.bestHighScore, isTouch);
            return;
        }

        if (this.state === STATE.SAVE_SELECT) {
            renderSaveSelect(ctx, canvas, this.saveSelectTime, this.selectedSlot,
                this.saveSlots, this.confirmingDelete, isTouch);
            return;
        }

        if (this.state === STATE.CHARACTER_SELECT) {
            renderCharacterSelect(ctx, canvas, this.selectTime, this.selectedSkin, isTouch);
            return;
        }

        if (this.state === STATE.LEVEL_SELECT) {
            renderLevelSelect(ctx, canvas, this.levelSelectTime, this.selectedLevel,
                this.unlockedLevels, LEVELS.length, this.highScore, isTouch);
            return;
        }

        if (!this.level || !this.player) {
            ctx.fillStyle = '#000';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            return;
        }

        drawBackground(ctx, this.camera, this.level.width, this.level.height, canvas.width, canvas.height);

        this.camera.applyTransform(ctx);

        for (const water of this.level.waterZones) {
            drawWater(ctx, water);
        }
        for (const platform of this.level.platforms) {
            platform.render(ctx);
        }
        for (const item of this.level.items) {
            drawItem(ctx, item);
        }
        for (const powerup of this.level.powerups) {
            powerup.render(ctx);
        }
        for (const enemy of this.level.enemies) {
            drawEnemy(ctx, enemy);
        }

        drawPlayer(ctx, this.player);
        drawPunch(ctx, this.player);
        this.particles.render(ctx);

        this.camera.resetTransform(ctx);

        renderHUD(ctx, canvas, this.player, this.level.name);

        // Barra de vida do boss (se houver)
        const activeBoss = this.level.enemies.find(e => e.isBoss && e.alive);
        if (activeBoss) {
            drawBossHealthBar(ctx, activeBoss, canvas.width);
        }

        this.touchControls.render(ctx);

        if (this.state === STATE.GAME_OVER) {
            renderGameOver(ctx, canvas, this.player.score, isTouch);
        } else if (this.state === STATE.BOSS_VICTORY) {
            renderBossVictory(ctx, canvas, this.bossVictoryTime, this.player.score, this.highScore, isTouch);
        } else if (this.state === STATE.VICTORY) {
            renderVictory(ctx, canvas, this.player.score, this.highScore,
                this.currentLevelIndex, LEVELS.length, isTouch);
        }
    }

    enterSaveSelect() {
        this.state = STATE.SAVE_SELECT;
        this.saveSelectTime = 0;
        this.confirmingDelete = false;
        this.saveSlots = this.saveManager.listSlots();
    }

    handleKey(code) {
        if (this.state === STATE.TITLE && code === 'Enter') {
            this.enterSaveSelect();
        } else if (this.state === STATE.SAVE_SELECT) {
            this.handleSaveSelectKey(code);
        } else if (this.state === STATE.CHARACTER_SELECT) {
            if (code === 'ArrowLeft' || code === 'KeyA') {
                this.selectedSkin = Math.max(0, this.selectedSkin - 1);
            } else if (code === 'ArrowRight' || code === 'KeyD') {
                this.selectedSkin = Math.min(2, this.selectedSkin + 1);
            } else if (code === 'Enter') {
                this.saveManager.skin = this.selectedSkin;
                this.saveManager.save();
                this.state = STATE.LEVEL_SELECT;
                this.levelSelectTime = 0;
                this.selectedLevel = 0;
            } else if (code === 'Escape') {
                this.enterSaveSelect();
            }
        } else if (this.state === STATE.LEVEL_SELECT) {
            if (code === 'ArrowLeft' || code === 'KeyA') {
                this.selectedLevel = Math.max(0, this.selectedLevel - 1);
            } else if (code === 'ArrowRight' || code === 'KeyD') {
                this.selectedLevel = Math.min(LEVELS.length - 1, this.selectedLevel + 1);
            } else if (code === 'Enter') {
                if (this.selectedLevel < this.unlockedLevels) {
                    this.player = null;
                    this.saveManager.skin = this.selectedSkin;
                    this.loadLevel(this.selectedLevel);
                    this.saveManager.save();
                }
            } else if (code === 'Escape') {
                this.enterSaveSelect();
            }
        } else if (this.state === STATE.BOSS_VICTORY && code === 'Enter' && this.bossVictoryTime > 9) {
            this.state = STATE.VICTORY;
        } else if (this.state === STATE.VICTORY && code === 'Enter') {
            const nextIndex = this.currentLevelIndex + 1;
            if (nextIndex < LEVELS.length) {
                this.loadLevel(nextIndex);
            }
        } else if (this.state === STATE.VICTORY && code === 'KeyR') {
            this.player = null;
            this.state = STATE.LEVEL_SELECT;
            this.levelSelectTime = 0;
        } else if (this.state === STATE.GAME_OVER && code === 'KeyR') {
            this.player = null;
            this.loadLevel(this.currentLevelIndex);
        } else if (this.state === STATE.GAME_OVER && code === 'Escape') {
            this.player = null;
            this.state = STATE.LEVEL_SELECT;
            this.levelSelectTime = 0;
        }
    }

    handleSaveSelectKey(code) {
        if (this.confirmingDelete) {
            if (code === 'Enter') {
                this.saveManager.deleteSlot(this.selectedSlot);
                this.saveSlots = this.saveManager.listSlots();
                this.confirmingDelete = false;
            } else if (code === 'Escape') {
                this.confirmingDelete = false;
            }
            return;
        }

        if (code === 'ArrowLeft' || code === 'KeyA') {
            this.selectedSlot = Math.max(0, this.selectedSlot - 1);
        } else if (code === 'ArrowRight' || code === 'KeyD') {
            this.selectedSlot = Math.min(2, this.selectedSlot + 1);
        } else if (code === 'Enter') {
            const slot = this.saveSlots[this.selectedSlot];
            if (slot) {
                // Continuar jogo existente
                this.saveManager.selectSlot(this.selectedSlot);
                this.selectedSkin = this.saveManager.skin;
                this.state = STATE.LEVEL_SELECT;
                this.levelSelectTime = 0;
                this.selectedLevel = 0;
            } else {
                // Novo jogo — ir para selecao de personagem
                this.saveManager.selectSlot(this.selectedSlot);
                this.selectedSkin = 0;
                this.state = STATE.CHARACTER_SELECT;
                this.selectTime = 0;
            }
        } else if ((code === 'Delete' || code === 'Backspace') && this.saveSlots[this.selectedSlot]) {
            this.confirmingDelete = true;
        } else if (code === 'Escape') {
            this.state = STATE.TITLE;
        }
    }

    handleSaveSelectTap(x, y, w, h) {
        const spacing = Math.min(260, (w - 80) / 3);
        const baseX = w / 2;
        const baseY = h / 2 - 10;

        for (let i = 0; i < 3; i++) {
            const px = baseX + (i - 1) * spacing;
            const cardW = 200;
            const cardH = 200;
            const cx = px - cardW / 2;
            const cy = baseY - cardH / 2;

            if (x >= cx && x <= cx + cardW && y >= cy && y <= cy + cardH) {
                const slot = this.saveSlots[i];
                if (slot) {
                    // Continuar jogo existente
                    this.saveManager.selectSlot(i);
                    this.selectedSkin = this.saveManager.skin;
                    this.state = STATE.LEVEL_SELECT;
                    this.levelSelectTime = 0;
                    this.selectedLevel = 0;
                } else {
                    // Novo jogo
                    this.saveManager.selectSlot(i);
                    this.selectedSkin = 0;
                    this.state = STATE.CHARACTER_SELECT;
                    this.selectTime = 0;
                }
                return;
            }
        }
    }

    handleTap(x, y) {
        const w = this.canvas.width;
        const h = this.canvas.height;

        if (this.state === STATE.TITLE) {
            this.enterSaveSelect();
            return;
        }

        if (this.state === STATE.SAVE_SELECT) {
            this.handleSaveSelectTap(x, y, w, h);
            return;
        }

        if (this.state === STATE.CHARACTER_SELECT) {
            const spacing = Math.min(220, w / 4);
            const baseX = w / 2;
            const baseY = h / 2 - 20;

            for (let i = 0; i < 3; i++) {
                const px = baseX + (i - 1) * spacing;
                const dist = Math.hypot(x - px, y - baseY);
                if (dist < 70) {
                    this.selectedSkin = i;
                    this.saveManager.skin = this.selectedSkin;
                    this.saveManager.save();
                    this.state = STATE.LEVEL_SELECT;
                    this.levelSelectTime = 0;
                    this.selectedLevel = 0;
                    return;
                }
            }
            return;
        }

        if (this.state === STATE.LEVEL_SELECT) {
            const spacing = Math.min(200, (w - 100) / LEVELS.length);
            const baseX = w / 2;
            const baseY = h / 2 - 30;

            for (let i = 0; i < LEVELS.length; i++) {
                const px = baseX + (i - Math.floor(LEVELS.length / 2)) * spacing;
                const cardW = 140;
                const cardH = 160;
                const cx = px - cardW / 2;
                const cy = baseY - cardH / 2;

                if (x >= cx && x <= cx + cardW && y >= cy && y <= cy + cardH) {
                    if (i < this.unlockedLevels) {
                        this.selectedLevel = i;
                        this.player = null;
                        this.saveManager.skin = this.selectedSkin;
                        this.loadLevel(i);
                        this.saveManager.save();
                    }
                    return;
                }
            }
            return;
        }

        if (this.state === STATE.GAME_OVER) {
            if (y < h * 0.6) {
                this.player = null;
                this.loadLevel(this.currentLevelIndex);
            } else {
                this.player = null;
                this.state = STATE.LEVEL_SELECT;
                this.levelSelectTime = 0;
            }
            return;
        }

        if (this.state === STATE.BOSS_VICTORY) {
            if (this.bossVictoryTime > 9) {
                this.state = STATE.VICTORY;
            }
            return;
        }

        if (this.state === STATE.VICTORY) {
            const hasNextLevel = this.currentLevelIndex + 1 < LEVELS.length;
            if (hasNextLevel && y < h * 0.6) {
                const nextIndex = this.currentLevelIndex + 1;
                this.loadLevel(nextIndex);
            } else {
                this.player = null;
                this.state = STATE.LEVEL_SELECT;
                this.levelSelectTime = 0;
            }
            return;
        }
    }

    resize() {
        this.camera.resize(this.canvas.width, this.canvas.height);
        this.touchControls.updateLayout();
    }

    destroy() {
        this.input.destroy();
        this.touchControls.destroy();
    }
}
