import { Player } from './player.js';
import { Input } from './input.js';
import { checkAABB, resolveCollision } from './platform.js';
import { Camera } from './camera.js';
import { Level } from './level.js';
import { drawPlayer, drawPunch, drawEnemy, drawItem, drawBackground, drawPlayerPreview, drawWater, SKINS } from './renderer.js';
import { playJumpSound, playCoinSound, playStarSound, playDamageSound, playEnemyKillSound, playGameOverSound, playPunchSound, playPunchHitSound } from './audio.js';
import { ParticleSystem } from './particles.js';

const STATE = {
    TITLE: 'title',
    CHARACTER_SELECT: 'characterSelect',
    PLAYING: 'playing',
    GAME_OVER: 'gameOver',
    VICTORY: 'victory'
};

const LEVELS = [
    'assets/levels/level1.json',
    'assets/levels/level2.json',
    'assets/levels/level3.json'
];

export class Game {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.lastTime = 0;

        this.input = new Input();
        this.camera = new Camera(canvas.width, canvas.height);
        this.particles = new ParticleSystem();
        this.player = null;
        this.level = null;
        this.state = STATE.TITLE;
        this.titleTime = 0;
        this.currentLevelIndex = 0;
        this.selectedSkin = 0;
        this.selectTime = 0;
    }

    async loadLevel(index) {
        this.currentLevelIndex = index;
        this.level = await Level.load(LEVELS[index]);
        const start = this.level.playerStart;

        // Manter pontuacao e vidas entre fases
        const prevScore = this.player ? this.player.score : 0;
        const prevLives = this.player ? this.player.lives : 3;

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
        requestAnimationFrame((timestamp) => this.gameLoop(timestamp));
    }

    update(dt) {
        if (this.state === STATE.TITLE) {
            this.titleTime += dt;
            return;
        }

        if (this.state === STATE.CHARACTER_SELECT) {
            this.selectTime += dt;
            return;
        }

        if (this.state !== STATE.PLAYING) {
            this.particles.update(dt);
            return;
        }

        if (!this.level || !this.player) return;

        const wasOnGround = this.player.onGround;

        this.player.update(dt, this.input);
        this.level.update(dt);
        this.particles.update(dt);

        // Som do soco
        if (this.player.punching && this.player.punchTimer === this.player.PUNCH_DURATION) {
            playPunchSound();
        }

        // Colisao do soco com inimigos
        const punchHit = this.player.punchHitbox;
        if (punchHit) {
            for (const enemy of this.level.enemies) {
                if (!enemy.alive || enemy._punchHit) continue;
                const enemyRect = { x: enemy.x, y: enemy.y, w: enemy.w, h: enemy.h };
                if (checkAABB(punchHit, enemyRect)) {
                    enemy._punchHit = true; // evitar hit multiplo no mesmo soco
                    this.particles.punchImpact(
                        punchHit.x + (this.player.lastDirection >= 0 ? punchHit.w : 0),
                        punchHit.y + punchHit.h / 2
                    );
                    this.particles.enemyExplosion(enemy.x, enemy.y, enemy.w, enemy.h);
                    enemy.kill();
                    this.player.score += 150;
                    playPunchHitSound();
                    playEnemyKillSound();
                }
            }
        }
        // Resetar flag de punch hit quando o soco termina
        if (!this.player.punching) {
            for (const enemy of this.level.enemies) {
                enemy._punchHit = false;
            }
        }

        // Som e particulas de pulo
        if (wasOnGround && !this.player.onGround && this.player.vy < 0) {
            playJumpSound();
            this.particles.jumpDust(this.player.x, this.player.y + this.player.height, this.player.width);
        }

        // Particulas de aterrissagem
        if (!wasOnGround && this.player.onGround) {
            this.particles.landDust(this.player.x, this.player.y + this.player.height, this.player.width);
        }

        // Verificar se jogador esta na agua
        const playerRect = { x: this.player.x, y: this.player.y, w: this.player.width, h: this.player.height };
        this.player.inWater = false;
        for (const water of this.level.waterZones) {
            if (water.contains(playerRect)) {
                this.player.inWater = true;
                break;
            }
        }

        // Colisao com plataformas
        for (const platform of this.level.platforms) {
            if (checkAABB(
                { x: this.player.x, y: this.player.y, w: this.player.width, h: this.player.height },
                platform
            )) {
                resolveCollision(this.player, platform);
            }
        }

        // Colisao com itens
        for (const item of this.level.items) {
            if (!item.collected && checkAABB(playerRect, item)) {
                this.player.score += item.collect();
                if (item.type === 'star') {
                    playStarSound();
                    this.particles.starSparkle(item.x, item.y);
                } else {
                    playCoinSound();
                    this.particles.coinSparkle(item.x, item.y);
                }
            }
        }

        // Colisao com power-ups
        for (const powerup of this.level.powerups) {
            if (!powerup.collected && checkAABB(playerRect, powerup)) {
                powerup.collect();
                this.player.applyPowerUp(powerup.type);
                playStarSound();
                this.particles.starSparkle(powerup.x, powerup.y);
            }
        }

        // Colisao com inimigos
        for (const enemy of this.level.enemies) {
            if (!enemy.alive) continue;
            const enemyRect = { x: enemy.x, y: enemy.y, w: enemy.w, h: enemy.h };
            if (checkAABB(playerRect, enemyRect)) {
                if (this.player.vy > 0 && this.player.y + this.player.height - enemy.y < 20) {
                    this.particles.enemyExplosion(enemy.x, enemy.y, enemy.w, enemy.h);
                    enemy.kill();
                    this.player.vy = -300;
                    this.player.score += 100;
                    playEnemyKillSound();
                } else {
                    this.player.takeDamage();
                    if (!this.player.isAlive) {
                        this.state = STATE.GAME_OVER;
                        this.particles.damageParticles(this.player.x, this.player.y, this.player.width, this.player.height);
                        playGameOverSound();
                    } else {
                        playDamageSound();
                        this.particles.damageParticles(this.player.x, this.player.y, this.player.width, this.player.height);
                    }
                }
            }
        }

        // Checar vitoria — todos os itens coletados
        const allCollected = this.level.items.length > 0 && this.level.items.every(i => i.collected);
        if (allCollected) {
            this.state = STATE.VICTORY;
        }

        // Jogador caiu do mapa
        if (this.player.y > this.level.height + 100) {
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

        if (this.state === STATE.TITLE) {
            this.renderTitle();
            return;
        }

        if (this.state === STATE.CHARACTER_SELECT) {
            this.renderCharacterSelect();
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

        this.renderHUD();

        if (this.state === STATE.GAME_OVER) {
            this.renderGameOver();
        } else if (this.state === STATE.VICTORY) {
            this.renderVictory();
        }
    }

    renderTitle() {
        const { ctx, canvas } = this;
        const w = canvas.width;
        const h = canvas.height;

        const gradient = ctx.createLinearGradient(0, 0, 0, h);
        gradient.addColorStop(0, '#0f0c29');
        gradient.addColorStop(0.5, '#302b63');
        gradient.addColorStop(1, '#24243e');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, w, h);

        const float = Math.sin(this.titleTime * 2) * 8;

        ctx.fillStyle = '#e74c3c';
        ctx.font = 'bold 64px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('CECI GAME', w / 2, h / 2 - 60 + float);

        ctx.fillStyle = '#3498db';
        ctx.font = '24px monospace';
        ctx.fillText('Aventura de Plataforma', w / 2, h / 2 - 10 + float);

        if (Math.floor(this.titleTime * 2) % 2 === 0) {
            ctx.fillStyle = '#fff';
            ctx.font = '20px monospace';
            ctx.fillText('Pressione ENTER para jogar', w / 2, h / 2 + 60);
        }

        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.font = '14px monospace';
        ctx.fillText('Setas/WASD = Mover  |  Espaco = Pular  |  X/Z = Soco', w / 2, h - 40);
    }

    renderHUD() {
        const { ctx } = this;
        ctx.font = 'bold 18px monospace';
        ctx.textAlign = 'left';

        for (let i = 0; i < this.player.lives; i++) {
            ctx.fillStyle = '#e74c3c';
            ctx.fillText('\u2665', 20 + i * 25, 30);
        }

        ctx.fillStyle = '#f1c40f';
        ctx.fillText(`${this.player.score}`, 20, 55);

        // Power-up ativo
        let powerupY = 75;
        if (this.player.speedBoost) {
            ctx.fillStyle = '#2ecc71';
            ctx.font = '14px monospace';
            ctx.fillText(`Velocidade: ${Math.ceil(this.player.speedTimer)}s`, 20, powerupY);
            powerupY += 18;
        }
        if (this.player.doubleJump) {
            ctx.fillStyle = '#3498db';
            ctx.font = '14px monospace';
            ctx.fillText(`Pulo Duplo: ${Math.ceil(this.player.doubleJumpTimer)}s`, 20, powerupY);
        }

        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.font = '14px monospace';
        ctx.textAlign = 'right';
        ctx.fillText(this.level.name, this.canvas.width - 20, 30);
    }

    renderGameOver() {
        const { ctx, canvas } = this;
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#e74c3c';
        ctx.font = 'bold 48px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 20);

        ctx.fillStyle = '#fff';
        ctx.font = '20px monospace';
        ctx.fillText(`Pontuacao: ${this.player.score}`, canvas.width / 2, canvas.height / 2 + 30);
        ctx.fillText('Pressione R para reiniciar', canvas.width / 2, canvas.height / 2 + 65);
    }

    renderVictory() {
        const { ctx, canvas } = this;
        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#2ecc71';
        ctx.font = 'bold 48px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('FASE COMPLETA!', canvas.width / 2, canvas.height / 2 - 20);

        ctx.fillStyle = '#f1c40f';
        ctx.font = '24px monospace';
        ctx.fillText(`Pontuacao: ${this.player.score}`, canvas.width / 2, canvas.height / 2 + 30);

        const hasNextLevel = this.currentLevelIndex + 1 < LEVELS.length;
        ctx.fillStyle = '#fff';
        ctx.font = '20px monospace';
        if (hasNextLevel) {
            ctx.fillText('Pressione ENTER para proxima fase', canvas.width / 2, canvas.height / 2 + 70);
        } else {
            ctx.fillText('Parabens! Voce completou o jogo!', canvas.width / 2, canvas.height / 2 + 70);
            ctx.fillText('Pressione R para jogar novamente', canvas.width / 2, canvas.height / 2 + 100);
        }
    }

    renderCharacterSelect() {
        const { ctx, canvas } = this;
        const w = canvas.width;
        const h = canvas.height;

        // Fundo gradiente
        const gradient = ctx.createLinearGradient(0, 0, 0, h);
        gradient.addColorStop(0, '#0f0c29');
        gradient.addColorStop(0.5, '#302b63');
        gradient.addColorStop(1, '#24243e');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, w, h);

        // Titulo
        ctx.fillStyle = '#f1c40f';
        ctx.font = 'bold 36px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('ESCOLHA SEU PERSONAGEM', w / 2, 80);

        // Desenhar os 3 personagens
        const spacing = Math.min(220, w / 4);
        const baseX = w / 2;
        const baseY = h / 2 - 20;

        for (let i = 0; i < 3; i++) {
            const px = baseX + (i - 1) * spacing;
            const py = baseY;
            const isSelected = i === this.selectedSkin;

            // Glow/destaque no selecionado
            if (isSelected) {
                const bounce = Math.sin(this.selectTime * 3) * 4;
                // Glow amarelo
                ctx.fillStyle = 'rgba(241, 196, 15, 0.15)';
                ctx.beginPath();
                ctx.arc(px, py + bounce, 70, 0, Math.PI * 2);
                ctx.fill();

                // Borda
                ctx.strokeStyle = '#f1c40f';
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.arc(px, py + bounce, 68, 0, Math.PI * 2);
                ctx.stroke();

                // Desenhar personagem com bounce
                drawPlayerPreview(ctx, px, py - 10 + bounce, i, 3);
            } else {
                // Personagem sem destaque (mais escuro)
                ctx.globalAlpha = 0.5;
                drawPlayerPreview(ctx, px, py - 10, i, 2.5);
                ctx.globalAlpha = 1;
            }

            // Nome do personagem
            ctx.fillStyle = isSelected ? '#f1c40f' : 'rgba(255,255,255,0.5)';
            ctx.font = isSelected ? 'bold 20px monospace' : '16px monospace';
            ctx.textAlign = 'center';
            ctx.fillText(SKINS[i].name, px, py + 80);

            // Descricao
            ctx.fillStyle = isSelected ? '#fff' : 'rgba(255,255,255,0.3)';
            ctx.font = '14px monospace';
            ctx.fillText(SKINS[i].desc, px, py + 102);
        }

        // Setas indicadoras
        ctx.fillStyle = '#f1c40f';
        ctx.font = 'bold 30px monospace';
        ctx.textAlign = 'center';
        // Seta esquerda
        if (this.selectedSkin > 0) {
            ctx.fillText('<', baseX - 1.5 * spacing - 10, baseY);
        }
        // Seta direita
        if (this.selectedSkin < 2) {
            ctx.fillText('>', baseX + 1.5 * spacing + 10, baseY);
        }

        // Instrucoes
        if (Math.floor(this.selectTime * 2) % 2 === 0) {
            ctx.fillStyle = '#fff';
            ctx.font = '20px monospace';
            ctx.fillText('Pressione ENTER para confirmar', w / 2, h - 80);
        }

        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.font = '14px monospace';
        ctx.fillText('Setas <- -> para escolher', w / 2, h - 40);
    }

    handleKey(code) {
        if (this.state === STATE.TITLE && code === 'Enter') {
            this.state = STATE.CHARACTER_SELECT;
            this.selectTime = 0;
        } else if (this.state === STATE.CHARACTER_SELECT) {
            if (code === 'ArrowLeft' || code === 'KeyA') {
                this.selectedSkin = Math.max(0, this.selectedSkin - 1);
            } else if (code === 'ArrowRight' || code === 'KeyD') {
                this.selectedSkin = Math.min(2, this.selectedSkin + 1);
            } else if (code === 'Enter') {
                this.loadLevel(0);
            } else if (code === 'Escape') {
                this.state = STATE.TITLE;
            }
        } else if (this.state === STATE.VICTORY && code === 'Enter') {
            const nextIndex = this.currentLevelIndex + 1;
            if (nextIndex < LEVELS.length) {
                this.loadLevel(nextIndex);
            }
        } else if (this.state === STATE.VICTORY && code === 'KeyR') {
            this.player = null;
            this.loadLevel(0);
        } else if (this.state === STATE.GAME_OVER && code === 'KeyR') {
            this.player = null;
            this.loadLevel(0);
        }
    }

    resize() {
        this.camera.resize(this.canvas.width, this.canvas.height);
    }
}
