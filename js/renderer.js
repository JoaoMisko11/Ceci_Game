// Dados das skins
const SKINS = [
    { name: 'Luna', desc: 'Menina Loira' },
    { name: 'Mei', desc: 'Menina Chanel' },
    { name: 'Leo', desc: 'Cavaleiro de Rodas' }
];

export { SKINS };

// Desenha o jogador com a skin selecionada
export function drawPlayer(ctx, player) {
    // Piscar quando invencivel
    if (player.isInvincible && Math.floor(player.invincibleTimer * 10) % 2 === 0) {
        return;
    }

    ctx.save();

    switch (player.skin) {
        case 1:
            drawChanelGirl(ctx, player);
            break;
        case 2:
            drawWheelchairBoy(ctx, player);
            break;
        default:
            drawBlondeGirl(ctx, player);
            break;
    }

    ctx.restore();
}

// Preview para tela de selecao (escala grande, sem depender de player)
export function drawPlayerPreview(ctx, cx, cy, skinIndex, scale = 3) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(scale, scale);

    // Simular um player ficticio centralizado na origem
    const fakePlayer = {
        x: -16, y: -24, width: 32, height: 48,
        vx: 80, vy: 0, onGround: true, lastDirection: 1, skin: skinIndex
    };

    switch (skinIndex) {
        case 1:
            drawChanelGirl(ctx, fakePlayer);
            break;
        case 2:
            drawWheelchairBoy(ctx, fakePlayer);
            break;
        default:
            drawBlondeGirl(ctx, fakePlayer);
            break;
    }

    ctx.restore();
}

// === SKIN 0: Menina Loira (Luna) ===
function drawBlondeGirl(ctx, player) {
    const { x, y, width, height, vx, onGround } = player;
    const facingRight = player.lastDirection >= 0;

    // Cabelo loiro comprido (atras do corpo)
    ctx.fillStyle = '#f4d03f';
    roundRect(ctx, x + 2, y - 2, width - 4, 22, 5);
    // Mechas laterais
    if (facingRight) {
        roundRect(ctx, x - 2, y + 6, 8, 18, 3);
    } else {
        roundRect(ctx, x + width - 6, y + 6, 8, 18, 3);
    }

    // Vestido rosa
    ctx.fillStyle = '#e91e8b';
    roundRect(ctx, x + 2, y + 14, width - 4, height - 20, 4);
    // Saia (parte inferior mais larga)
    ctx.beginPath();
    ctx.moveTo(x, y + height - 14);
    ctx.lineTo(x + width, y + height - 14);
    ctx.lineTo(x + width + 2, y + height - 6);
    ctx.lineTo(x - 2, y + height - 6);
    ctx.closePath();
    ctx.fill();

    // Rosto (pele clara)
    ctx.fillStyle = '#fdebd0';
    roundRect(ctx, x + 4, y, width - 8, 16, 6);

    // Franja loira
    ctx.fillStyle = '#f4d03f';
    roundRect(ctx, x + 4, y - 1, width - 8, 7, 4);

    // Laco rosa no cabelo
    ctx.fillStyle = '#ff69b4';
    const lacoX = facingRight ? x + width - 8 : x + 2;
    ctx.beginPath();
    ctx.moveTo(lacoX + 3, y);
    ctx.lineTo(lacoX, y - 4);
    ctx.lineTo(lacoX + 3, y - 2);
    ctx.lineTo(lacoX + 6, y - 4);
    ctx.closePath();
    ctx.fill();

    // Olhos verdes
    ctx.fillStyle = '#fff';
    const eyeOffsetX = facingRight ? 4 : -4;
    ctx.fillRect(x + 8 + eyeOffsetX, y + 4, 5, 5);
    ctx.fillRect(x + width - 13 + eyeOffsetX, y + 4, 5, 5);
    ctx.fillStyle = '#27ae60';
    const pupilShift = facingRight ? 2 : 0;
    ctx.fillRect(x + 9 + eyeOffsetX + pupilShift, y + 5, 3, 3);
    ctx.fillRect(x + width - 12 + eyeOffsetX + pupilShift, y + 5, 3, 3);

    // Boca (sorriso)
    ctx.fillStyle = '#e74c3c';
    ctx.fillRect(x + 12 + (facingRight ? 2 : -2), y + 11, 4, 2);

    // Sapatilhas roxas
    ctx.fillStyle = '#8e44ad';
    drawFeet(ctx, player);
}

// === SKIN 1: Menina Chanel (Mei) ===
function drawChanelGirl(ctx, player) {
    const { x, y, width, height, vx, onGround } = player;
    const facingRight = player.lastDirection >= 0;

    // Cabelo chanel escuro (atras)
    ctx.fillStyle = '#2c3e50';
    roundRect(ctx, x + 1, y - 2, width - 2, 24, 5);
    // Laterais do chanel (na altura do queixo)
    roundRect(ctx, x - 1, y + 2, 7, 16, 3);
    roundRect(ctx, x + width - 6, y + 2, 7, 16, 3);

    // Blusa azul
    ctx.fillStyle = '#3498db';
    roundRect(ctx, x + 2, y + 14, width - 4, height - 20, 4);

    // Shorts escuros
    ctx.fillStyle = '#2c3e50';
    ctx.fillRect(x + 2, y + height - 14, width - 4, 8);

    // Rosto
    ctx.fillStyle = '#f5cba7';
    roundRect(ctx, x + 4, y, width - 8, 16, 6);

    // Franja reta (corte chanel)
    ctx.fillStyle = '#2c3e50';
    ctx.fillRect(x + 4, y - 1, width - 8, 6);

    // Olhos castanhos
    ctx.fillStyle = '#fff';
    const eyeOffsetX = facingRight ? 4 : -4;
    ctx.fillRect(x + 8 + eyeOffsetX, y + 4, 5, 5);
    ctx.fillRect(x + width - 13 + eyeOffsetX, y + 4, 5, 5);
    ctx.fillStyle = '#8b4513';
    const pupilShift = facingRight ? 2 : 0;
    ctx.fillRect(x + 9 + eyeOffsetX + pupilShift, y + 5, 3, 3);
    ctx.fillRect(x + width - 12 + eyeOffsetX + pupilShift, y + 5, 3, 3);

    // Boca
    ctx.fillStyle = '#e74c3c';
    ctx.fillRect(x + 12 + (facingRight ? 2 : -2), y + 11, 4, 2);

    // Tenis brancos
    ctx.fillStyle = '#ecf0f1';
    drawFeet(ctx, player);
}

// === SKIN 2: Menino de Cadeira de Rodas com Espada (Leo) ===
function drawWheelchairBoy(ctx, player) {
    const { x, y, width, height, vx, onGround } = player;
    const facingRight = player.lastDirection >= 0;

    // Cadeira de rodas - assento
    ctx.fillStyle = '#7f8c8d';
    roundRect(ctx, x - 2, y + 20, width + 4, 14, 3);

    // Encosto da cadeira
    const backX = facingRight ? x - 4 : x + width;
    ctx.fillRect(backX, y + 10, 4, 24);

    // Rodas grandes
    ctx.strokeStyle = '#566573';
    ctx.lineWidth = 2;
    const wheelRadius = 9;
    const wheelY = y + height - wheelRadius;
    const wheelAngle = Math.abs(vx) > 10 ? (Date.now() / 100) : 0;

    // Roda traseira (grande)
    const rearWheelX = facingRight ? x : x + width;
    ctx.beginPath();
    ctx.arc(rearWheelX, wheelY, wheelRadius, 0, Math.PI * 2);
    ctx.stroke();
    // Raios da roda
    ctx.beginPath();
    ctx.moveTo(rearWheelX + Math.cos(wheelAngle) * wheelRadius, wheelY + Math.sin(wheelAngle) * wheelRadius);
    ctx.lineTo(rearWheelX - Math.cos(wheelAngle) * wheelRadius, wheelY - Math.sin(wheelAngle) * wheelRadius);
    ctx.moveTo(rearWheelX + Math.cos(wheelAngle + 1.57) * wheelRadius, wheelY + Math.sin(wheelAngle + 1.57) * wheelRadius);
    ctx.lineTo(rearWheelX - Math.cos(wheelAngle + 1.57) * wheelRadius, wheelY - Math.sin(wheelAngle + 1.57) * wheelRadius);
    ctx.stroke();

    // Roda dianteira (menor)
    const frontWheelX = facingRight ? x + width + 2 : x - 2;
    ctx.beginPath();
    ctx.arc(frontWheelX, wheelY + 3, 5, 0, Math.PI * 2);
    ctx.stroke();

    // Centro das rodas
    ctx.fillStyle = '#566573';
    ctx.beginPath();
    ctx.arc(rearWheelX, wheelY, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(frontWheelX, wheelY + 3, 1.5, 0, Math.PI * 2);
    ctx.fill();

    // Camiseta verde
    ctx.fillStyle = '#27ae60';
    roundRect(ctx, x + 2, y + 10, width - 4, 16, 4);

    // Cabelo castanho curto
    ctx.fillStyle = '#8b6914';
    roundRect(ctx, x + 3, y - 2, width - 6, 8, 5);

    // Rosto
    ctx.fillStyle = '#f5b041';
    roundRect(ctx, x + 4, y, width - 8, 16, 6);

    // Cabelo por cima (topo)
    ctx.fillStyle = '#8b6914';
    roundRect(ctx, x + 4, y - 2, width - 8, 7, 4);

    // Olhos
    ctx.fillStyle = '#fff';
    const eyeOffsetX = facingRight ? 4 : -4;
    ctx.fillRect(x + 8 + eyeOffsetX, y + 4, 5, 5);
    ctx.fillRect(x + width - 13 + eyeOffsetX, y + 4, 5, 5);
    ctx.fillStyle = '#2c3e50';
    const pupilShift = facingRight ? 2 : 0;
    ctx.fillRect(x + 9 + eyeOffsetX + pupilShift, y + 5, 3, 3);
    ctx.fillRect(x + width - 12 + eyeOffsetX + pupilShift, y + 5, 3, 3);

    // Boca determinada
    ctx.fillStyle = '#c0392b';
    ctx.fillRect(x + 11 + (facingRight ? 2 : -2), y + 11, 6, 2);

    // Espada
    const swordDir = facingRight ? 1 : -1;
    const swordX = facingRight ? x + width + 2 : x - 14;

    // Lamina
    ctx.fillStyle = '#bdc3c7';
    ctx.fillRect(swordX + (facingRight ? 4 : 6), y + 4, 4, 20);
    // Ponta da lamina
    ctx.beginPath();
    ctx.moveTo(swordX + (facingRight ? 4 : 6), y + 4);
    ctx.lineTo(swordX + (facingRight ? 6 : 8), y - 2);
    ctx.lineTo(swordX + (facingRight ? 8 : 10), y + 4);
    ctx.closePath();
    ctx.fill();

    // Brilho da lamina
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.fillRect(swordX + (facingRight ? 5 : 7), y + 6, 1, 14);

    // Guarda da espada
    ctx.fillStyle = '#f39c12';
    ctx.fillRect(swordX + (facingRight ? 2 : 4), y + 22, 10, 3);

    // Cabo
    ctx.fillStyle = '#c0392b';
    ctx.fillRect(swordX + (facingRight ? 5 : 7), y + 25, 4, 6);
}

// Funcao auxiliar para desenhar pes (usada por skins 0 e 1)
function drawFeet(ctx, player) {
    const { x, y, width, height, vx, onGround } = player;

    if (!onGround) {
        ctx.fillRect(x + 4, y + height - 6, 8, 6);
        ctx.fillRect(x + width - 12, y + height - 6, 8, 6);
    } else if (Math.abs(vx) > 10) {
        const step = Math.floor(Date.now() / 100) % 2;
        if (step === 0) {
            ctx.fillRect(x + 2, y + height - 6, 10, 6);
            ctx.fillRect(x + width - 8, y + height - 8, 8, 8);
        } else {
            ctx.fillRect(x + 2, y + height - 8, 8, 8);
            ctx.fillRect(x + width - 12, y + height - 6, 10, 6);
        }
    } else {
        ctx.fillRect(x + 4, y + height - 5, 8, 5);
        ctx.fillRect(x + width - 12, y + height - 5, 8, 5);
    }
}

// Desenha o soco do jogador (braco estendido + punho)
export function drawPunch(ctx, player) {
    if (!player.punching) return;

    ctx.save();
    const facingRight = player.lastDirection >= 0;
    const progress = player.punchTimer / player.PUNCH_DURATION; // 1 -> 0
    const extend = Math.sin(progress * Math.PI) ; // vai e volta

    const armY = player.y + player.height / 2 - 4;

    if (facingRight) {
        const armX = player.x + player.width;
        const armLen = player.PUNCH_RANGE * extend;

        // Braco
        ctx.fillStyle = '#fdebd0';
        ctx.fillRect(armX, armY, armLen, 8);

        // Punho
        ctx.fillStyle = '#f39c12';
        ctx.beginPath();
        ctx.arc(armX + armLen, armY + 4, 7, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#e67e22';
        ctx.beginPath();
        ctx.arc(armX + armLen, armY + 4, 5, 0, Math.PI * 2);
        ctx.fill();
    } else {
        const armLen = player.PUNCH_RANGE * extend;
        const armX = player.x - armLen;

        // Braco
        ctx.fillStyle = '#fdebd0';
        ctx.fillRect(armX, armY, armLen, 8);

        // Punho
        ctx.fillStyle = '#f39c12';
        ctx.beginPath();
        ctx.arc(armX, armY + 4, 7, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#e67e22';
        ctx.beginPath();
        ctx.arc(armX, armY + 4, 5, 0, Math.PI * 2);
        ctx.fill();
    }

    ctx.restore();
}

// Desenha inimigo com aparencia melhorada
export function drawEnemy(ctx, enemy) {
    if (!enemy.alive) return;

    if (enemy.type === 'flyer') {
        drawFlyer(ctx, enemy);
        return;
    }

    const { x, y, w, h, direction } = enemy;

    // Corpo
    ctx.fillStyle = '#9b59b6';
    roundRect(ctx, x, y + 4, w, h - 4, 6);

    // Espinhos no topo
    ctx.fillStyle = '#8e44ad';
    for (let i = 0; i < 4; i++) {
        const sx = x + 3 + i * 7;
        ctx.beginPath();
        ctx.moveTo(sx, y + 6);
        ctx.lineTo(sx + 3, y - 2);
        ctx.lineTo(sx + 6, y + 6);
        ctx.fill();
    }

    // Olhos
    ctx.fillStyle = '#fff';
    ctx.fillRect(x + 6, y + 10, 6, 6);
    ctx.fillRect(x + w - 12, y + 10, 6, 6);

    // Pupilas
    ctx.fillStyle = '#000';
    const pupilOffset = direction * 2;
    ctx.fillRect(x + 7 + pupilOffset, y + 11, 4, 4);
    ctx.fillRect(x + w - 11 + pupilOffset, y + 11, 4, 4);

    // Boca
    ctx.fillStyle = '#c0392b';
    ctx.fillRect(x + 10, y + 20, w - 20, 3);
}

function drawFlyer(ctx, enemy) {
    const { x, y, w, h, direction } = enemy;

    // Corpo
    ctx.fillStyle = '#e67e22';
    roundRect(ctx, x + 2, y + 6, w - 4, h - 6, 8);

    // Asas (batem)
    ctx.fillStyle = '#f39c12';
    const wingFlap = Math.sin(Date.now() / 80) * 6;
    // Asa esquerda
    ctx.beginPath();
    ctx.moveTo(x + 2, y + 12);
    ctx.lineTo(x - 8, y + 4 + wingFlap);
    ctx.lineTo(x + 6, y + 18);
    ctx.fill();
    // Asa direita
    ctx.beginPath();
    ctx.moveTo(x + w - 2, y + 12);
    ctx.lineTo(x + w + 8, y + 4 + wingFlap);
    ctx.lineTo(x + w - 6, y + 18);
    ctx.fill();

    // Olhos
    ctx.fillStyle = '#fff';
    ctx.fillRect(x + 7, y + 10, 5, 5);
    ctx.fillRect(x + w - 12, y + 10, 5, 5);

    // Pupilas
    ctx.fillStyle = '#000';
    const pupilOffset = direction * 2;
    ctx.fillRect(x + 8 + pupilOffset, y + 11, 3, 3);
    ctx.fillRect(x + w - 11 + pupilOffset, y + 11, 3, 3);
}

// Desenha item com brilho
export function drawItem(ctx, item) {
    if (item.collected) return;

    const { x, y, w, h, type } = item;
    const cx = x + w / 2;
    const cy = y + h / 2;
    const r = w / 2;

    if (type === 'coin') {
        // Brilho externo
        ctx.fillStyle = 'rgba(241, 196, 15, 0.3)';
        ctx.beginPath();
        ctx.arc(cx, cy, r + 4, 0, Math.PI * 2);
        ctx.fill();

        // Moeda
        ctx.fillStyle = '#f1c40f';
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fill();

        // Reflexo
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.beginPath();
        ctx.arc(cx - 2, cy - 2, r * 0.4, 0, Math.PI * 2);
        ctx.fill();
    } else if (type === 'star') {
        // Brilho externo
        ctx.fillStyle = 'rgba(230, 126, 34, 0.3)';
        ctx.beginPath();
        ctx.arc(cx, cy, r + 5, 0, Math.PI * 2);
        ctx.fill();

        // Estrela
        drawStar(ctx, cx, cy, 5, r, r * 0.4, '#e67e22');

        // Reflexo
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.beginPath();
        ctx.arc(cx - 2, cy - 3, 3, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Desenha parallax de fundo
export function drawBackground(ctx, camera, levelWidth, levelHeight, canvasWidth, canvasHeight) {
    // Camada 1 — ceu gradiente
    const gradient = ctx.createLinearGradient(0, 0, 0, canvasHeight);
    gradient.addColorStop(0, '#0f0c29');
    gradient.addColorStop(0.5, '#302b63');
    gradient.addColorStop(1, '#24243e');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Camada 2 — estrelas (parallax lento)
    ctx.fillStyle = '#fff';
    const starSeed = [23, 67, 134, 198, 256, 312, 378, 445, 512, 589, 634, 701, 778, 834, 890, 945];
    for (const s of starSeed) {
        const sx = ((s * 7) % (levelWidth * 0.5)) - camera.x * 0.1;
        const sy = (s * 3) % (canvasHeight * 0.6);
        const size = (s % 3) + 1;
        ctx.globalAlpha = 0.4 + (s % 5) * 0.12;
        ctx.fillRect(sx, sy, size, size);
    }
    ctx.globalAlpha = 1;

    // Camada 3 — montanhas distantes (parallax medio)
    ctx.fillStyle = '#16213e';
    drawMountains(ctx, camera.x * 0.3, canvasHeight, levelWidth, 200, 300);

    // Camada 4 — montanhas proximas (parallax rapido)
    ctx.fillStyle = '#1a1a2e';
    drawMountains(ctx, camera.x * 0.6, canvasHeight, levelWidth, 120, 180);
}

// Helpers

function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.fill();
}

function drawStar(ctx, cx, cy, points, outerR, innerR, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    for (let i = 0; i < points * 2; i++) {
        const r = i % 2 === 0 ? outerR : innerR;
        const angle = (Math.PI / points) * i - Math.PI / 2;
        const method = i === 0 ? 'moveTo' : 'lineTo';
        ctx[method](cx + Math.cos(angle) * r, cy + Math.sin(angle) * r);
    }
    ctx.closePath();
    ctx.fill();
}

function drawMountains(ctx, offsetX, baseY, totalWidth, minH, maxH) {
    ctx.beginPath();
    ctx.moveTo(-100, baseY);
    const step = 160;
    for (let x = -100; x < totalWidth + 200; x += step) {
        const screenX = x - offsetX;
        const h = minH + ((x * 7 + 123) % (maxH - minH));
        ctx.lineTo(screenX, baseY - h);
        ctx.lineTo(screenX + step / 2, baseY - h * 0.4);
    }
    ctx.lineTo(totalWidth + 200, baseY);
    ctx.closePath();
    ctx.fill();
}
