import { drawPlayerPreview, SKINS } from './renderer.js';
import { MAX_SLOTS } from './save-manager.js';

const LEVEL_NAMES = [
    'Fase 1 - Inicio',
    'Fase 2 - Desafio',
    'Fase 3 - Profundezas',
    'Fase 4 - Oceano Profundo'
];

export { LEVEL_NAMES };

function drawGradientBg(ctx, w, h) {
    const gradient = ctx.createLinearGradient(0, 0, 0, h);
    gradient.addColorStop(0, '#0f0c29');
    gradient.addColorStop(0.5, '#302b63');
    gradient.addColorStop(1, '#24243e');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, w, h);
}

function drawStarShape(ctx, cx, cy, points, outerR, innerR) {
    ctx.beginPath();
    for (let i = 0; i < points * 2; i++) {
        const r = i % 2 === 0 ? outerR : innerR;
        const angle = (Math.PI / points) * i - Math.PI / 2;
        if (i === 0) {
            ctx.moveTo(cx + Math.cos(angle) * r, cy + Math.sin(angle) * r);
        } else {
            ctx.lineTo(cx + Math.cos(angle) * r, cy + Math.sin(angle) * r);
        }
    }
    ctx.closePath();
    ctx.fill();
}

export function renderTitle(ctx, canvas, titleTime, highScore, isTouch) {
    const w = canvas.width;
    const h = canvas.height;

    drawGradientBg(ctx, w, h);

    const float = Math.sin(titleTime * 2) * 8;

    ctx.fillStyle = '#e74c3c';
    ctx.font = 'bold 64px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('CECI GAME', w / 2, h / 2 - 60 + float);

    ctx.fillStyle = '#3498db';
    ctx.font = '24px monospace';
    ctx.fillText('Aventura de Plataforma', w / 2, h / 2 - 10 + float);

    if (Math.floor(titleTime * 2) % 2 === 0) {
        ctx.fillStyle = '#fff';
        ctx.font = '20px monospace';
        const touchMsg = isTouch ? 'Toque para jogar' : 'Pressione ENTER para jogar';
        ctx.fillText(touchMsg, w / 2, h / 2 + 60);
    }

    if (highScore > 0) {
        ctx.fillStyle = '#f1c40f';
        ctx.font = '16px monospace';
        ctx.fillText(`Recorde: ${highScore}`, w / 2, h / 2 + 100);
    }

    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.font = '14px monospace';
    if (isTouch) {
        ctx.fillText('Joystick = Mover  |  Botoes = Pular / Socar', w / 2, h - 40);
    } else {
        ctx.fillText('Setas/WASD = Mover  |  Espaco = Pular  |  X/Z = Soco', w / 2, h - 40);
    }
}

export function renderHUD(ctx, canvas, player, levelName) {
    ctx.font = 'bold 18px monospace';
    ctx.textAlign = 'left';

    for (let i = 0; i < player.lives; i++) {
        ctx.fillStyle = '#e74c3c';
        ctx.fillText('\u2665', 20 + i * 25, 30);
    }

    ctx.fillStyle = '#f1c40f';
    ctx.fillText(`${player.score}`, 20, 55);

    let powerupY = 75;
    if (player.speedBoost) {
        ctx.fillStyle = '#2ecc71';
        ctx.font = '14px monospace';
        ctx.fillText(`Velocidade: ${Math.ceil(player.speedTimer)}s`, 20, powerupY);
        powerupY += 18;
    }
    if (player.doubleJump) {
        ctx.fillStyle = '#3498db';
        ctx.font = '14px monospace';
        ctx.fillText(`Pulo Duplo: ${Math.ceil(player.doubleJumpTimer)}s`, 20, powerupY);
    }

    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.font = '14px monospace';
    ctx.textAlign = 'right';
    ctx.fillText(levelName, canvas.width - 20, 30);
}

export function renderGameOver(ctx, canvas, playerScore, isTouch) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#e74c3c';
    ctx.font = 'bold 48px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 20);

    ctx.fillStyle = '#fff';
    ctx.font = '20px monospace';
    ctx.fillText(`Pontuacao: ${playerScore}`, canvas.width / 2, canvas.height / 2 + 30);
    if (isTouch) {
        ctx.fillText('Toque acima = Tentar novamente', canvas.width / 2, canvas.height / 2 + 65);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.font = '16px monospace';
        ctx.fillText('Toque abaixo = Selecao de fases', canvas.width / 2, canvas.height / 2 + 95);
    } else {
        ctx.fillText('R = Tentar novamente', canvas.width / 2, canvas.height / 2 + 65);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.font = '16px monospace';
        ctx.fillText('ESC = Selecao de fases', canvas.width / 2, canvas.height / 2 + 95);
    }
}

export function renderVictory(ctx, canvas, playerScore, highScore, currentLevelIndex, totalLevels, isTouch) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#2ecc71';
    ctx.font = 'bold 48px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('FASE COMPLETA!', canvas.width / 2, canvas.height / 2 - 20);

    ctx.fillStyle = '#f1c40f';
    ctx.font = '24px monospace';
    ctx.fillText(`Pontuacao: ${playerScore}`, canvas.width / 2, canvas.height / 2 + 30);

    if (playerScore >= highScore && highScore > 0) {
        ctx.fillStyle = '#e74c3c';
        ctx.font = 'bold 18px monospace';
        ctx.fillText('NOVO RECORDE!', canvas.width / 2, canvas.height / 2 + 55);
    }

    const hasNextLevel = currentLevelIndex + 1 < totalLevels;
    ctx.fillStyle = '#fff';
    ctx.font = '20px monospace';
    if (hasNextLevel) {
        const nextMsg = isTouch ? 'Toque acima = Proxima fase' : 'ENTER = Proxima fase';
        ctx.fillText(nextMsg, canvas.width / 2, canvas.height / 2 + 80);
    } else {
        ctx.fillText('Parabens! Voce completou o jogo!', canvas.width / 2, canvas.height / 2 + 80);
    }
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.font = '16px monospace';
    const selectMsg = isTouch ? 'Toque abaixo = Selecao de fases' : 'R = Selecao de fases';
    ctx.fillText(selectMsg, canvas.width / 2, canvas.height / 2 + 110);

    ctx.fillStyle = 'rgba(46, 204, 113, 0.6)';
    ctx.font = '12px monospace';
    ctx.fillText('Progresso salvo automaticamente', canvas.width / 2, canvas.height / 2 + 140);
}

export function renderBossVictory(ctx, canvas, bossVictoryTime, playerScore, highScore, isTouch) {
    const w = canvas.width;
    const h = canvas.height;
    const t = bossVictoryTime;

    // Overlay escurecendo progressivamente
    const overlayAlpha = Math.min(0.85, t * 0.2);
    ctx.fillStyle = `rgba(0, 0, 0, ${overlayAlpha})`;
    ctx.fillRect(0, 0, w, h);

    // Flash branco inicial (0-1s)
    if (t < 1) {
        const flashAlpha = (1 - t) * 0.8;
        ctx.fillStyle = `rgba(255, 255, 255, ${flashAlpha})`;
        ctx.fillRect(0, 0, w, h);
    }

    // Raios de luz radiais (1-6s)
    if (t > 1 && t < 7) {
        const rayAlpha = Math.min(0.15, (t - 1) * 0.05) * (t < 6 ? 1 : (7 - t));
        ctx.save();
        ctx.translate(w / 2, h / 2);
        const numRays = 16;
        for (let i = 0; i < numRays; i++) {
            const angle = (Math.PI * 2 / numRays) * i + t * 0.2;
            ctx.fillStyle = `rgba(241, 196, 15, ${rayAlpha})`;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            const rayLen = Math.max(w, h);
            ctx.lineTo(Math.cos(angle - 0.05) * rayLen, Math.sin(angle - 0.05) * rayLen);
            ctx.lineTo(Math.cos(angle + 0.05) * rayLen, Math.sin(angle + 0.05) * rayLen);
            ctx.closePath();
            ctx.fill();
        }
        ctx.restore();
    }

    // Circulos de onda expandindo (1.5-5s)
    if (t > 1.5 && t < 5) {
        for (let ring = 0; ring < 3; ring++) {
            const ringT = t - 1.5 - ring * 0.5;
            if (ringT > 0 && ringT < 2) {
                const radius = ringT * 300;
                const ringAlpha = (1 - ringT / 2) * 0.3;
                ctx.strokeStyle = `rgba(241, 196, 15, ${ringAlpha})`;
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.arc(w / 2, h / 2, radius, 0, Math.PI * 2);
                ctx.stroke();
            }
        }
    }

    // Titulo "BOSS DERROTADO!" (aparece em 2s, com scale-in)
    if (t > 2) {
        const titleT = Math.min(1, (t - 2) * 1.5);
        const scale = 0.3 + titleT * 0.7 + Math.sin(t * 2) * 0.02;
        const titleAlpha = titleT;

        ctx.save();
        ctx.translate(w / 2, h / 2 - 100);
        ctx.scale(scale, scale);
        ctx.globalAlpha = titleAlpha;

        ctx.fillStyle = '#000';
        ctx.font = 'bold 52px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('BOSS DERROTADO!', 2, 2);

        const pulse = Math.sin(t * 4) * 0.1 + 0.9;
        ctx.fillStyle = `rgb(${Math.floor(241 * pulse)}, ${Math.floor(196 * pulse)}, ${Math.floor(15 * pulse)})`;
        ctx.fillText('BOSS DERROTADO!', 0, 0);

        ctx.globalAlpha = 1;
        ctx.restore();
    }

    // Subtitulo (3.5s)
    if (t > 3.5) {
        const subAlpha = Math.min(1, (t - 3.5) * 2);
        ctx.globalAlpha = subAlpha;
        ctx.fillStyle = '#e74c3c';
        ctx.font = 'bold 20px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('Polvo Gigante eliminado!', w / 2, h / 2 - 50);
        ctx.globalAlpha = 1;
    }

    // Mensagem principal (5s, letra por letra)
    if (t > 5) {
        const msg = 'O Mundo Ceci foi Salvo!';
        const msgT = t - 5;
        const visibleChars = Math.min(msg.length, Math.floor(msgT * 12));
        const visibleMsg = msg.substring(0, visibleChars);

        const glowAlpha = Math.min(0.3, msgT * 0.1);
        ctx.fillStyle = `rgba(46, 204, 113, ${glowAlpha})`;
        ctx.beginPath();
        ctx.ellipse(w / 2, h / 2 + 20, 280, 40, 0, 0, Math.PI * 2);
        ctx.fill();

        const float = Math.sin(t * 1.5) * 5;
        ctx.fillStyle = '#2ecc71';
        ctx.font = 'bold 40px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(visibleMsg, w / 2, h / 2 + 25 + float);

        if (visibleChars >= msg.length) {
            const completeT = msgT - msg.length / 12;
            if (completeT > 0 && completeT < 1) {
                const burstAlpha = (1 - completeT) * 0.4;
                ctx.fillStyle = `rgba(46, 204, 113, ${burstAlpha})`;
                ctx.beginPath();
                ctx.ellipse(w / 2, h / 2 + 20, 300 + completeT * 200, 50 + completeT * 100, 0, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }

    // Pontuacao (7s)
    if (t > 7) {
        const scoreAlpha = Math.min(1, (t - 7) * 2);
        ctx.globalAlpha = scoreAlpha;

        ctx.fillStyle = '#f1c40f';
        ctx.font = 'bold 24px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(`Pontuacao Final: ${playerScore}`, w / 2, h / 2 + 85);

        if (playerScore >= highScore && highScore > 0) {
            ctx.fillStyle = '#e74c3c';
            ctx.font = 'bold 16px monospace';
            ctx.fillText('NOVO RECORDE!', w / 2, h / 2 + 110);
        }

        ctx.globalAlpha = 1;
    }

    // Estrelas decorativas girando (3s+)
    if (t > 3) {
        ctx.save();
        const numStars = 8;
        const starOrbitRadius = 180 + Math.sin(t) * 20;
        for (let i = 0; i < numStars; i++) {
            const angle = (Math.PI * 2 / numStars) * i + t * 0.5;
            const sx = w / 2 + Math.cos(angle) * starOrbitRadius;
            const sy = h / 2 + Math.sin(angle) * starOrbitRadius * 0.4;
            const starSize = 6 + Math.sin(t * 3 + i) * 2;
            ctx.fillStyle = `rgba(241, 196, 15, ${0.4 + Math.sin(t * 2 + i) * 0.3})`;
            drawStarShape(ctx, sx, sy, 5, starSize, starSize * 0.4);
        }
        ctx.restore();
    }

    // Instrucoes (9s)
    if (t > 9) {
        const instrAlpha = Math.min(1, (t - 9) * 1.5);
        if (Math.floor(t * 2) % 2 === 0) {
            ctx.globalAlpha = instrAlpha;
            ctx.fillStyle = '#fff';
            ctx.font = '18px monospace';
            ctx.textAlign = 'center';
            const msg = isTouch ? 'Toque para continuar' : 'Pressione ENTER para continuar';
            ctx.fillText(msg, w / 2, h / 2 + 160);
            ctx.globalAlpha = 1;
        }

        ctx.fillStyle = 'rgba(46, 204, 113, 0.5)';
        ctx.font = '12px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('Progresso salvo automaticamente', w / 2, h / 2 + 190);
    }
}

export function renderSaveSelect(ctx, canvas, saveSelectTime, selectedSlot, slots, confirmingDelete, isTouch) {
    const w = canvas.width;
    const h = canvas.height;

    drawGradientBg(ctx, w, h);

    ctx.fillStyle = '#f1c40f';
    ctx.font = 'bold 36px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('SAVES', w / 2, 70);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.font = '16px monospace';
    ctx.fillText('Escolha um save para continuar ou comece um novo jogo', w / 2, 105);

    const spacing = Math.min(260, (w - 80) / MAX_SLOTS);
    const baseX = w / 2;
    const baseY = h / 2 - 10;

    for (let i = 0; i < MAX_SLOTS; i++) {
        const px = baseX + (i - 1) * spacing;
        const py = baseY;
        const isSelected = i === selectedSlot;
        const slot = slots[i];

        const cardW = 200;
        const cardH = 200;
        const cx = px - cardW / 2;
        const cy = py - cardH / 2;

        const bounce = isSelected ? Math.sin(saveSelectTime * 3) * 3 : 0;

        // Card background
        if (isSelected) {
            ctx.fillStyle = slot ? 'rgba(52, 152, 219, 0.15)' : 'rgba(46, 204, 113, 0.15)';
            ctx.fillRect(cx - 6, cy - 6 + bounce, cardW + 12, cardH + 12);

            ctx.strokeStyle = slot ? '#3498db' : '#2ecc71';
            ctx.lineWidth = 3;
            ctx.strokeRect(cx - 4, cy - 4 + bounce, cardW + 8, cardH + 8);
        }

        ctx.fillStyle = isSelected
            ? (slot ? 'rgba(52, 152, 219, 0.25)' : 'rgba(46, 204, 113, 0.2)')
            : 'rgba(100, 100, 100, 0.15)';
        ctx.fillRect(cx, cy + bounce, cardW, cardH);

        // Slot number
        ctx.fillStyle = isSelected ? '#fff' : 'rgba(255,255,255,0.4)';
        ctx.font = 'bold 16px monospace';
        ctx.fillText(`Save ${i + 1}`, px, cy + 28 + bounce);

        if (slot) {
            // Slot com dados — mostrar info
            const skinData = SKINS[slot.skin] || SKINS[0];

            // Personagem preview
            drawPlayerPreview(ctx, px, cy + 70 + bounce, slot.skin, 2);

            ctx.fillStyle = isSelected ? '#f1c40f' : 'rgba(241, 196, 15, 0.6)';
            ctx.font = '14px monospace';
            ctx.fillText(skinData.name, px, cy + 105 + bounce);

            // Fases desbloqueadas
            ctx.fillStyle = isSelected ? '#2ecc71' : 'rgba(46, 204, 113, 0.6)';
            ctx.font = '13px monospace';
            const levelsText = slot.unlockedLevels >= 4 ? 'Todas as fases' : `Fase ${slot.unlockedLevels}/4`;
            ctx.fillText(levelsText, px, cy + 128 + bounce);

            // Recorde
            if (slot.highScore > 0) {
                ctx.fillStyle = isSelected ? '#f1c40f' : 'rgba(241, 196, 15, 0.5)';
                ctx.font = '12px monospace';
                ctx.fillText(`Recorde: ${slot.highScore}`, px, cy + 148 + bounce);
            }

            // Data
            if (slot.lastPlayed) {
                ctx.fillStyle = isSelected ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.25)';
                ctx.font = '11px monospace';
                const date = new Date(slot.lastPlayed);
                const dateStr = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
                ctx.fillText(dateStr, px, cy + 168 + bounce);
            }

            // Label "Continuar"
            if (isSelected) {
                ctx.fillStyle = '#3498db';
                ctx.font = 'bold 14px monospace';
                ctx.fillText('CONTINUAR', px, cy + 192 + bounce);
            }
        } else {
            // Slot vazio
            ctx.fillStyle = isSelected ? '#2ecc71' : 'rgba(255,255,255,0.3)';
            ctx.font = 'bold 40px monospace';
            ctx.fillText('+', px, cy + 100 + bounce);

            ctx.fillStyle = isSelected ? '#2ecc71' : 'rgba(255,255,255,0.3)';
            ctx.font = '14px monospace';
            ctx.fillText('Novo Jogo', px, cy + 135 + bounce);
        }
    }

    // Setas de navegacao
    ctx.fillStyle = '#f1c40f';
    ctx.font = 'bold 30px monospace';
    if (selectedSlot > 0) {
        ctx.fillText('<', baseX - 1.5 * spacing - 20, baseY);
    }
    if (selectedSlot < MAX_SLOTS - 1) {
        ctx.fillText('>', baseX + 1.5 * spacing + 20, baseY);
    }

    // Instrucoes
    if (isTouch) {
        ctx.fillStyle = '#fff';
        ctx.font = '18px monospace';
        ctx.fillText('Toque no save para selecionar', w / 2, h - 80);
    } else {
        if (Math.floor(saveSelectTime * 2) % 2 === 0) {
            ctx.fillStyle = '#fff';
            ctx.font = '18px monospace';
            ctx.fillText('ENTER = Selecionar', w / 2, h - 80);
        }
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.font = '14px monospace';
        const hasSlot = slots[selectedSlot] !== null;
        if (hasSlot && !confirmingDelete) {
            ctx.fillText('Setas <- -> para escolher  |  DEL = Apagar save  |  ESC = Voltar', w / 2, h - 45);
        } else if (confirmingDelete) {
            ctx.fillStyle = '#e74c3c';
            ctx.font = 'bold 16px monospace';
            ctx.fillText('Apagar este save? ENTER = Sim  |  ESC = Cancelar', w / 2, h - 45);
        } else {
            ctx.fillText('Setas <- -> para escolher  |  ESC = Voltar', w / 2, h - 45);
        }
    }
}

export function renderCharacterSelect(ctx, canvas, selectTime, selectedSkin, isTouch) {
    const w = canvas.width;
    const h = canvas.height;

    drawGradientBg(ctx, w, h);

    ctx.fillStyle = '#f1c40f';
    ctx.font = 'bold 36px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('ESCOLHA SEU PERSONAGEM', w / 2, 80);

    const spacing = Math.min(220, w / 4);
    const baseX = w / 2;
    const baseY = h / 2 - 20;

    for (let i = 0; i < 3; i++) {
        const px = baseX + (i - 1) * spacing;
        const py = baseY;
        const isSelected = i === selectedSkin;

        if (isSelected) {
            const bounce = Math.sin(selectTime * 3) * 4;
            ctx.fillStyle = 'rgba(241, 196, 15, 0.15)';
            ctx.beginPath();
            ctx.arc(px, py + bounce, 70, 0, Math.PI * 2);
            ctx.fill();

            ctx.strokeStyle = '#f1c40f';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(px, py + bounce, 68, 0, Math.PI * 2);
            ctx.stroke();

            drawPlayerPreview(ctx, px, py - 10 + bounce, i, 3);
        } else {
            ctx.globalAlpha = 0.5;
            drawPlayerPreview(ctx, px, py - 10, i, 2.5);
            ctx.globalAlpha = 1;
        }

        ctx.fillStyle = isSelected ? '#f1c40f' : 'rgba(255,255,255,0.5)';
        ctx.font = isSelected ? 'bold 20px monospace' : '16px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(SKINS[i].name, px, py + 80);

        ctx.fillStyle = isSelected ? '#fff' : 'rgba(255,255,255,0.3)';
        ctx.font = '14px monospace';
        ctx.fillText(SKINS[i].desc, px, py + 102);
    }

    ctx.fillStyle = '#f1c40f';
    ctx.font = 'bold 30px monospace';
    ctx.textAlign = 'center';
    if (selectedSkin > 0) {
        ctx.fillText('<', baseX - 1.5 * spacing - 10, baseY);
    }
    if (selectedSkin < 2) {
        ctx.fillText('>', baseX + 1.5 * spacing + 10, baseY);
    }

    if (Math.floor(selectTime * 2) % 2 === 0) {
        ctx.fillStyle = '#fff';
        ctx.font = '20px monospace';
        const msg = isTouch ? 'Toque no personagem para jogar' : 'Pressione ENTER para confirmar';
        ctx.fillText(msg, w / 2, h - 80);
    }

    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.font = '14px monospace';
    if (!isTouch) {
        ctx.fillText('Setas <- -> para escolher', w / 2, h - 40);
    }
}

export function renderLevelSelect(ctx, canvas, levelSelectTime, selectedLevel, unlockedLevels, totalLevels, highScore, isTouch) {
    const w = canvas.width;
    const h = canvas.height;

    drawGradientBg(ctx, w, h);

    ctx.fillStyle = '#f1c40f';
    ctx.font = 'bold 36px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('SELECIONE A FASE', w / 2, 80);

    const spacing = Math.min(200, (w - 100) / totalLevels);
    const baseX = w / 2;
    const baseY = h / 2 - 30;

    for (let i = 0; i < totalLevels; i++) {
        const px = baseX + (i - Math.floor(totalLevels / 2)) * spacing;
        const py = baseY;
        const isSelected = i === selectedLevel;
        const isUnlocked = i < unlockedLevels;

        const cardW = 140;
        const cardH = 160;
        const cx = px - cardW / 2;
        const cy = py - cardH / 2;

        if (isSelected) {
            const bounce = Math.sin(levelSelectTime * 3) * 3;

            ctx.fillStyle = isUnlocked ? 'rgba(241, 196, 15, 0.15)' : 'rgba(150, 150, 150, 0.1)';
            ctx.fillRect(cx - 6, cy - 6 + bounce, cardW + 12, cardH + 12);

            ctx.strokeStyle = isUnlocked ? '#f1c40f' : '#666';
            ctx.lineWidth = 3;
            ctx.strokeRect(cx - 4, cy - 4 + bounce, cardW + 8, cardH + 8);

            ctx.fillStyle = isUnlocked ? 'rgba(52, 152, 219, 0.3)' : 'rgba(80, 80, 80, 0.3)';
            ctx.fillRect(cx, cy + bounce, cardW, cardH);

            ctx.fillStyle = isUnlocked ? '#fff' : '#666';
            ctx.font = 'bold 48px monospace';
            ctx.fillText(`${i + 1}`, px, py - 10 + bounce);

            ctx.fillStyle = isUnlocked ? '#f1c40f' : '#555';
            ctx.font = '13px monospace';
            ctx.fillText(LEVEL_NAMES[i].split(' - ')[1] || LEVEL_NAMES[i], px, py + 35 + bounce);

            if (!isUnlocked) {
                ctx.fillStyle = '#e74c3c';
                ctx.font = '12px monospace';
                ctx.fillText('BLOQUEADA', px, py + 58 + bounce);
            } else {
                ctx.fillStyle = '#2ecc71';
                ctx.font = '12px monospace';
                ctx.fillText('DESBLOQUEADA', px, py + 58 + bounce);
            }
        } else {
            ctx.globalAlpha = isUnlocked ? 0.5 : 0.25;

            ctx.fillStyle = isUnlocked ? 'rgba(52, 152, 219, 0.2)' : 'rgba(80, 80, 80, 0.2)';
            ctx.fillRect(cx, cy, cardW, cardH);

            ctx.fillStyle = isUnlocked ? '#aaa' : '#555';
            ctx.font = 'bold 48px monospace';
            ctx.fillText(`${i + 1}`, px, py - 10);

            ctx.fillStyle = isUnlocked ? '#888' : '#444';
            ctx.font = '13px monospace';
            ctx.fillText(LEVEL_NAMES[i].split(' - ')[1] || LEVEL_NAMES[i], px, py + 35);

            if (!isUnlocked) {
                ctx.fillStyle = '#555';
                ctx.font = '24px monospace';
                ctx.fillText('\uD83D\uDD12', px, py + 60);
            }

            ctx.globalAlpha = 1;
        }
    }

    ctx.fillStyle = '#f1c40f';
    ctx.font = 'bold 30px monospace';
    if (selectedLevel > 0) {
        ctx.fillText('<', baseX - Math.floor(totalLevels / 2) * spacing - 50, baseY);
    }
    if (selectedLevel < totalLevels - 1) {
        ctx.fillText('>', baseX + Math.floor(totalLevels / 2) * spacing + 50, baseY);
    }

    if (Math.floor(levelSelectTime * 2) % 2 === 0) {
        ctx.fillStyle = '#fff';
        ctx.font = '20px monospace';
        if (isTouch) {
            ctx.fillText('Toque na fase para jogar', w / 2, h - 80);
        } else if (selectedLevel < unlockedLevels) {
            ctx.fillText('Pressione ENTER para jogar', w / 2, h - 80);
        } else {
            ctx.fillStyle = '#e74c3c';
            ctx.fillText('Complete a fase anterior para desbloquear', w / 2, h - 80);
        }
    }

    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.font = '14px monospace';
    if (!isTouch) {
        ctx.fillText('Setas <- -> para escolher  |  ESC para voltar', w / 2, h - 40);
    }

    if (highScore > 0) {
        ctx.fillStyle = 'rgba(241, 196, 15, 0.6)';
        ctx.font = '14px monospace';
        ctx.textAlign = 'right';
        ctx.fillText(`Recorde: ${highScore}`, w - 20, 30);
        ctx.textAlign = 'center';
    }
}
