import { checkAABB, resolveCollision } from './platform.js';
import {
    SCORE_ENEMY_PUNCH, SCORE_BOSS_HIT, SCORE_BOSS_KILL, SCORE_ENEMY_STOMP,
    STOMP_THRESHOLD, STOMP_BOUNCE, FALL_DEATH_MARGIN
} from './constants.js';
import {
    playCoinSound, playStarSound, playDamageSound, playEnemyKillSound,
    playGameOverSound, playPunchHitSound
} from './audio.js';
import { SpatialGrid } from './spatial-grid.js';

// Grade espacial para plataformas — a maior colecao em cada nivel
const platformGrid = new SpatialGrid(128);

// Reconstroi a grade de plataformas (chamar quando plataformas mudam de posicao)
export function rebuildPlatformGrid(platforms) {
    platformGrid.clear();
    platformGrid.insertAll(platforms);
}

// Resultado da colisao — game.js usa para reagir (mudar estado, etc.)
// Retorna um objeto com flags: { gameOver, victory, bossVictory, boss }

export function handlePunchCollisions(player, enemies, particles) {
    const punchHit = player.punchHitbox;
    if (!punchHit) return;

    for (const enemy of enemies) {
        if (!enemy.alive || enemy._punchHit) continue;
        const enemyRect = { x: enemy.x, y: enemy.y, w: enemy.w, h: enemy.h };
        if (checkAABB(punchHit, enemyRect)) {
            enemy._punchHit = true;
            particles.punchImpact(
                punchHit.x + (player.lastDirection >= 0 ? punchHit.w : 0),
                punchHit.y + punchHit.h / 2
            );
            if (enemy.isBoss) {
                if (enemy.takeDamage()) {
                    playPunchHitSound();
                    if (!enemy.alive) {
                        particles.enemyExplosion(enemy.x, enemy.y, enemy.w, enemy.h);
                        player.score += SCORE_BOSS_KILL;
                        playEnemyKillSound();
                    } else {
                        player.score += SCORE_BOSS_HIT;
                    }
                }
            } else {
                particles.enemyExplosion(enemy.x, enemy.y, enemy.w, enemy.h);
                enemy.kill();
                player.score += SCORE_ENEMY_PUNCH;
                playPunchHitSound();
                playEnemyKillSound();
            }
        }
    }
}

export function resetPunchFlags(player, enemies) {
    if (!player.punching) {
        for (const enemy of enemies) {
            enemy._punchHit = false;
        }
    }
}

export function handlePlatformCollisions(player, platforms) {
    // Usa grade espacial para filtrar apenas plataformas proximas ao jogador
    const nearby = platformGrid.query(
        player.x - 1, player.y - 1,
        player.width + 2, player.height + 2
    );
    for (let i = 0; i < nearby.length; i++) {
        const p = nearby[i];
        if (checkAABB(
            { x: player.x, y: player.y, w: player.width, h: player.height },
            p
        )) {
            resolveCollision(player, p);
        }
    }
}

export function handleWaterCheck(player, waterZones) {
    const playerRect = { x: player.x, y: player.y, w: player.width, h: player.height };
    player.inWater = false;
    for (const water of waterZones) {
        if (water.contains(playerRect)) {
            player.inWater = true;
            break;
        }
    }
}

export function handleItemCollisions(player, items, particles) {
    const playerRect = { x: player.x, y: player.y, w: player.width, h: player.height };
    for (const item of items) {
        if (!item.collected && checkAABB(playerRect, item)) {
            player.score += item.collect();
            if (item.type === 'star') {
                playStarSound();
                particles.starSparkle(item.x, item.y);
            } else {
                playCoinSound();
                particles.coinSparkle(item.x, item.y);
            }
        }
    }
}

export function handlePowerUpCollisions(player, powerups, particles) {
    const playerRect = { x: player.x, y: player.y, w: player.width, h: player.height };
    for (const powerup of powerups) {
        if (!powerup.collected && checkAABB(playerRect, powerup)) {
            powerup.collect();
            player.applyPowerUp(powerup.type);
            playStarSound();
            particles.starSparkle(powerup.x, powerup.y);
        }
    }
}

// Retorna 'gameOver' se o jogador morreu, null caso contrario
export function handleEnemyCollisions(player, enemies, particles) {
    const playerRect = { x: player.x, y: player.y, w: player.width, h: player.height };

    for (const enemy of enemies) {
        if (!enemy.alive) continue;
        const enemyRect = { x: enemy.x, y: enemy.y, w: enemy.w, h: enemy.h };
        if (checkAABB(playerRect, enemyRect)) {
            if (player.vy > 0 && player.y + player.height - enemy.y < STOMP_THRESHOLD) {
                if (enemy.isBoss) {
                    if (enemy.takeDamage()) {
                        player.vy = STOMP_BOUNCE;
                        player.score += SCORE_BOSS_HIT;
                        playEnemyKillSound();
                        if (!enemy.alive) {
                            particles.enemyExplosion(enemy.x, enemy.y, enemy.w, enemy.h);
                            player.score += SCORE_BOSS_KILL;
                        }
                    } else {
                        player.vy = STOMP_BOUNCE;
                    }
                } else {
                    particles.enemyExplosion(enemy.x, enemy.y, enemy.w, enemy.h);
                    enemy.kill();
                    player.vy = STOMP_BOUNCE;
                    player.score += SCORE_ENEMY_STOMP;
                    playEnemyKillSound();
                }
            } else {
                player.takeDamage();
                if (!player.isAlive) {
                    particles.damageParticles(player.x, player.y, player.width, player.height);
                    playGameOverSound();
                    return 'gameOver';
                } else {
                    playDamageSound();
                    particles.damageParticles(player.x, player.y, player.width, player.height);
                }
            }
        }

        // Colisao com projeteis de tinta do boss
        if (enemy.isBoss && enemy.alive) {
            for (let i = enemy.inkAttacks.length - 1; i >= 0; i--) {
                const ink = enemy.inkAttacks[i];
                if (checkAABB(playerRect, ink)) {
                    enemy.inkAttacks.splice(i, 1);
                    player.takeDamage();
                    if (!player.isAlive) {
                        particles.damageParticles(player.x, player.y, player.width, player.height);
                        playGameOverSound();
                        return 'gameOver';
                    } else {
                        playDamageSound();
                        particles.damageParticles(player.x, player.y, player.width, player.height);
                    }
                }
            }
        }
    }

    return null;
}

// Checa se o jogador caiu do mapa
export function checkFallDeath(player, levelHeight) {
    return player.y > levelHeight + FALL_DEATH_MARGIN;
}

// Checa condicoes de vitoria
export function checkVictory(level) {
    const allCollected = level.items.length > 0 && level.items.every(i => i.collected);
    const boss = level.enemies.find(e => e.isBoss);
    const bossDefeated = !boss || !boss.alive;
    return { won: allCollected && bossDefeated, boss };
}
