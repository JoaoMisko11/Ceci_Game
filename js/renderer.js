import { SKINS, SHARED_COLORS } from './skins-data.js';
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
        case 3:
            drawSamurai(ctx, player);
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
        case 3:
            drawSamurai(ctx, fakePlayer);
            break;
        default:
            drawBlondeGirl(ctx, fakePlayer);
            break;
    }

    ctx.restore();
}

// Funcao compartilhada — desenha rosto, olhos e boca (identico em todas as skins)
function drawFace(ctx, x, y, width, facingRight, skinIndex) {
    const skin = SKINS[skinIndex];
    const c = skin.colors;
    const { mouthX, mouthW } = skin.face;

    // Rosto
    ctx.fillStyle = c.skin;
    roundRect(ctx, x + 4, y, width - 8, 16, 6);

    // Olhos (esclerotica + iris)
    ctx.fillStyle = SHARED_COLORS.eyeWhite;
    const eyeOffsetX = facingRight ? 4 : -4;
    ctx.fillRect(x + 8 + eyeOffsetX, y + 4, 5, 5);
    ctx.fillRect(x + width - 13 + eyeOffsetX, y + 4, 5, 5);
    ctx.fillStyle = c.eyeIris;
    const pupilShift = facingRight ? 2 : 0;
    ctx.fillRect(x + 9 + eyeOffsetX + pupilShift, y + 5, 3, 3);
    ctx.fillRect(x + width - 12 + eyeOffsetX + pupilShift, y + 5, 3, 3);

    // Boca
    ctx.fillStyle = c.mouth;
    ctx.fillRect(x + mouthX + (facingRight ? 2 : -2), y + 11, mouthW, 2);
}

// === SKIN 0: Menina Loira (Luna) ===
function drawBlondeGirl(ctx, player) {
    const { x, y, width, height } = player;
    const facingRight = player.lastDirection >= 0;
    const c = SKINS[0].colors;

    // Cabelo loiro comprido (atras do corpo)
    ctx.fillStyle = c.hair;
    roundRect(ctx, x + 2, y - 2, width - 4, 22, 5);
    // Mechas laterais
    if (facingRight) {
        roundRect(ctx, x - 2, y + 6, 8, 18, 3);
    } else {
        roundRect(ctx, x + width - 6, y + 6, 8, 18, 3);
    }

    // Vestido rosa
    ctx.fillStyle = c.body;
    roundRect(ctx, x + 2, y + 14, width - 4, height - 20, 4);
    // Saia (parte inferior mais larga)
    ctx.beginPath();
    ctx.moveTo(x, y + height - 14);
    ctx.lineTo(x + width, y + height - 14);
    ctx.lineTo(x + width + 2, y + height - 6);
    ctx.lineTo(x - 2, y + height - 6);
    ctx.closePath();
    ctx.fill();

    drawFace(ctx, x, y, width, facingRight, 0);

    // Franja loira
    ctx.fillStyle = c.hair;
    roundRect(ctx, x + 4, y - 1, width - 8, 7, 4);

    // Laco rosa no cabelo
    ctx.fillStyle = c.bow;
    const lacoX = facingRight ? x + width - 8 : x + 2;
    ctx.beginPath();
    ctx.moveTo(lacoX + 3, y);
    ctx.lineTo(lacoX, y - 4);
    ctx.lineTo(lacoX + 3, y - 2);
    ctx.lineTo(lacoX + 6, y - 4);
    ctx.closePath();
    ctx.fill();

    // Sapatilhas roxas
    ctx.fillStyle = c.shoes;
    drawFeet(ctx, player);
}

// === SKIN 1: Menina Chanel (Mei) ===
function drawChanelGirl(ctx, player) {
    const { x, y, width, height } = player;
    const facingRight = player.lastDirection >= 0;
    const c = SKINS[1].colors;

    // Cabelo chanel escuro (atras)
    ctx.fillStyle = c.hair;
    roundRect(ctx, x + 1, y - 2, width - 2, 24, 5);
    // Laterais do chanel (na altura do queixo)
    roundRect(ctx, x - 1, y + 2, 7, 16, 3);
    roundRect(ctx, x + width - 6, y + 2, 7, 16, 3);

    // Blusa azul
    ctx.fillStyle = c.body;
    roundRect(ctx, x + 2, y + 14, width - 4, height - 20, 4);

    // Shorts escuros
    ctx.fillStyle = c.shorts;
    ctx.fillRect(x + 2, y + height - 14, width - 4, 8);

    drawFace(ctx, x, y, width, facingRight, 1);

    // Franja reta (corte chanel)
    ctx.fillStyle = c.hair;
    ctx.fillRect(x + 4, y - 1, width - 8, 6);

    // Tenis brancos
    ctx.fillStyle = c.shoes;
    drawFeet(ctx, player);
}

// === SKIN 2: Menino de Cadeira de Rodas com Espada (Leo) ===
function drawWheelchairBoy(ctx, player) {
    const { x, y, width, height, vx, onGround } = player;
    const facingRight = player.lastDirection >= 0;
    const c = SKINS[2].colors;

    // Cadeira de rodas - assento
    ctx.fillStyle = c.wheelchair;
    roundRect(ctx, x - 2, y + 20, width + 4, 14, 3);

    // Encosto da cadeira
    const backX = facingRight ? x - 4 : x + width;
    ctx.fillRect(backX, y + 10, 4, 24);

    // Rodas grandes
    ctx.strokeStyle = c.wheelStroke;
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
    ctx.fillStyle = c.wheelStroke;
    ctx.beginPath();
    ctx.arc(rearWheelX, wheelY, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(frontWheelX, wheelY + 3, 1.5, 0, Math.PI * 2);
    ctx.fill();

    // Camiseta verde
    ctx.fillStyle = c.body;
    roundRect(ctx, x + 2, y + 10, width - 4, 16, 4);

    // Cabelo castanho curto
    ctx.fillStyle = c.hair;
    roundRect(ctx, x + 3, y - 2, width - 6, 8, 5);

    drawFace(ctx, x, y, width, facingRight, 2);

    // Cabelo por cima (topo)
    ctx.fillStyle = c.hair;
    roundRect(ctx, x + 4, y - 2, width - 8, 7, 4);

    // Espada
    const swordDir = facingRight ? 1 : -1;
    const swordX = facingRight ? x + width + 2 : x - 14;

    // Lamina
    ctx.fillStyle = c.sword.blade;
    ctx.fillRect(swordX + (facingRight ? 4 : 6), y + 4, 4, 20);
    // Ponta da lamina
    ctx.beginPath();
    ctx.moveTo(swordX + (facingRight ? 4 : 6), y + 4);
    ctx.lineTo(swordX + (facingRight ? 6 : 8), y - 2);
    ctx.lineTo(swordX + (facingRight ? 8 : 10), y + 4);
    ctx.closePath();
    ctx.fill();

    // Brilho da lamina
    ctx.fillStyle = c.sword.shine;
    ctx.fillRect(swordX + (facingRight ? 5 : 7), y + 6, 1, 14);

    // Guarda da espada
    ctx.fillStyle = c.sword.guard;
    ctx.fillRect(swordX + (facingRight ? 2 : 4), y + 22, 10, 3);

    // Cabo
    ctx.fillStyle = c.sword.handle;
    ctx.fillRect(swordX + (facingRight ? 5 : 7), y + 25, 4, 6);
}

// === SKIN 3: Samurai Japones (Hiro) ===
function drawSamurai(ctx, player) {
    const { x, y, width, height, vx, onGround } = player;
    const facingRight = player.lastDirection >= 0;
    const c = SKINS[3].colors;

    // Katana (atras do corpo)
    const swordDir = facingRight ? 1 : -1;
    const katanaX = facingRight ? x + width - 2 : x - 10;

    // Bainha/lamina nas costas (diagonal)
    ctx.save();
    ctx.translate(katanaX + 6, y + 8);
    ctx.rotate(facingRight ? -0.4 : 0.4);

    // Lamina
    ctx.fillStyle = c.katana.blade;
    ctx.fillRect(-2, -18, 4, 24);
    // Ponta
    ctx.beginPath();
    ctx.moveTo(-2, -18);
    ctx.lineTo(0, -24);
    ctx.lineTo(2, -18);
    ctx.closePath();
    ctx.fill();
    // Brilho
    ctx.fillStyle = c.katana.shine;
    ctx.fillRect(-0.5, -16, 1, 18);
    // Guarda (tsuba)
    ctx.fillStyle = c.katana.guard;
    ctx.fillRect(-4, 6, 8, 3);
    // Cabo (tsuka)
    ctx.fillStyle = c.katana.handle;
    ctx.fillRect(-1.5, 9, 3, 10);
    // Fita no cabo
    ctx.fillStyle = c.katana.wrap;
    for (let i = 0; i < 3; i++) {
        ctx.fillRect(-2, 10 + i * 4, 4, 1.5);
    }

    ctx.restore();

    // Kimono vermelho (corpo)
    ctx.fillStyle = c.body;
    roundRect(ctx, x + 2, y + 14, width - 4, height - 20, 4);

    // Decote em V do kimono
    ctx.fillStyle = c.skin;
    ctx.beginPath();
    ctx.moveTo(x + 8, y + 14);
    ctx.lineTo(x + width / 2, y + 24);
    ctx.lineTo(x + width - 8, y + 14);
    ctx.closePath();
    ctx.fill();

    // Faixa (obi)
    ctx.fillStyle = c.bodyAccent;
    ctx.fillRect(x + 2, y + 26, width - 4, 5);

    // Parte inferior do kimono (hakama)
    ctx.fillStyle = c.body;
    ctx.fillRect(x, y + height - 14, width, 8);
    // Linha central do hakama
    ctx.fillStyle = c.bodyAccent;
    ctx.fillRect(x + width / 2 - 0.5, y + 31, 1, height - 37);

    // Cabelo preto
    ctx.fillStyle = c.hair;
    roundRect(ctx, x + 2, y - 2, width - 4, 14, 5);

    // Coque (chonmage) no topo
    ctx.fillStyle = c.hair;
    const bunX = x + width / 2;
    ctx.beginPath();
    ctx.ellipse(bunX, y - 4, 5, 4, 0, 0, Math.PI * 2);
    ctx.fill();

    drawFace(ctx, x, y, width, facingRight, 3);

    // Hachimaki (faixa na testa) — branco
    ctx.fillStyle = c.headband;
    ctx.fillRect(x + 3, y + 1, width - 6, 3);

    // No do hachimaki (atras)
    ctx.fillStyle = c.headbandKnot;
    const knotX = facingRight ? x : x + width - 4;
    ctx.fillRect(knotX, y, 4, 5);
    // Pontas da fita
    ctx.fillRect(knotX - (facingRight ? 4 : -4), y + 2, 4, 2);
    ctx.fillRect(knotX - (facingRight ? 3 : -3), y + 4, 3, 2);

    // Sandalia (waraji)
    ctx.fillStyle = '#8d6e63';
    drawFeet(ctx, player);
}

// Funcao auxiliar para desenhar pes (usada por skins 0, 1 e 3)
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
        ctx.fillStyle = SHARED_COLORS.punchArm;
        ctx.fillRect(armX, armY, armLen, 8);

        // Punho
        ctx.fillStyle = SHARED_COLORS.punchFist;
        ctx.beginPath();
        ctx.arc(armX + armLen, armY + 4, 7, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = SHARED_COLORS.punchFistInner;
        ctx.beginPath();
        ctx.arc(armX + armLen, armY + 4, 5, 0, Math.PI * 2);
        ctx.fill();
    } else {
        const armLen = player.PUNCH_RANGE * extend;
        const armX = player.x - armLen;

        // Braco
        ctx.fillStyle = SHARED_COLORS.punchArm;
        ctx.fillRect(armX, armY, armLen, 8);

        // Punho
        ctx.fillStyle = SHARED_COLORS.punchFist;
        ctx.beginPath();
        ctx.arc(armX, armY + 4, 7, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = SHARED_COLORS.punchFistInner;
        ctx.beginPath();
        ctx.arc(armX, armY + 4, 5, 0, Math.PI * 2);
        ctx.fill();
    }

    ctx.restore();
}

// Desenha zona de agua com ondas animadas
export function drawWater(ctx, water) {
    const { x, y, w, h, time } = water;

    // Corpo da agua (semi-transparente)
    ctx.fillStyle = 'rgba(30, 100, 200, 0.35)';
    ctx.fillRect(x, y, w, h);

    // Camada mais escura no fundo (gradiente cacheado por zona de agua)
    const gradH = Math.min(h, 60);
    if (!water._gradCache || water._gradCacheY !== y + h - gradH) {
        water._gradCache = ctx.createLinearGradient(x, y + h - gradH, x, y + h);
        water._gradCache.addColorStop(0, 'rgba(10, 50, 120, 0)');
        water._gradCache.addColorStop(1, 'rgba(10, 50, 120, 0.3)');
        water._gradCacheY = y + h - gradH;
    }
    ctx.fillStyle = water._gradCache;
    ctx.fillRect(x, y + h - gradH, w, gradH);

    // Ondas na superficie
    ctx.strokeStyle = 'rgba(100, 180, 255, 0.6)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let wx = x; wx < x + w; wx += 4) {
        const wy = y + Math.sin((wx * 0.03) + time * 3) * 3;
        if (wx === x) {
            ctx.moveTo(wx, wy);
        } else {
            ctx.lineTo(wx, wy);
        }
    }
    ctx.stroke();

    // Segunda onda (mais sutil)
    ctx.strokeStyle = 'rgba(150, 210, 255, 0.3)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let wx = x; wx < x + w; wx += 4) {
        const wy = y + 4 + Math.sin((wx * 0.04) + time * 2 + 1) * 2;
        if (wx === x) {
            ctx.moveTo(wx, wy);
        } else {
            ctx.lineTo(wx, wy);
        }
    }
    ctx.stroke();

    // Bolhas ocasionais
    ctx.fillStyle = 'rgba(180, 220, 255, 0.4)';
    for (let i = 0; i < 5; i++) {
        const bx = x + ((i * 137 + Math.floor(time * 30)) % w);
        const by = y + h * 0.3 + Math.sin(time * 1.5 + i * 2) * (h * 0.25);
        const br = 2 + (i % 3);
        ctx.beginPath();
        ctx.arc(bx, by, br, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Desenha inimigo com aparencia melhorada
export function drawEnemy(ctx, enemy) {
    if (!enemy.alive) return;

    if (enemy.type === 'octopus') {
        drawOctopus(ctx, enemy);
        return;
    }

    if (enemy.type === 'flyer') {
        drawFlyer(ctx, enemy);
        return;
    }

    if (enemy.type === 'swimmer') {
        drawSwimmer(ctx, enemy);
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

function drawSwimmer(ctx, enemy) {
    const { x, y, w, h, direction, swimTime } = enemy;

    // Corpo (peixe/criatura aquatica)
    ctx.fillStyle = '#1abc9c';
    roundRect(ctx, x + 4, y + 6, w - 8, h - 8, 10);

    // Barriga mais clara
    ctx.fillStyle = '#a3e4d7';
    roundRect(ctx, x + 8, y + 14, w - 16, h - 18, 6);

    // Barbatana dorsal
    ctx.fillStyle = '#16a085';
    ctx.beginPath();
    ctx.moveTo(x + w / 2 - 4, y + 6);
    ctx.lineTo(x + w / 2, y - 4);
    ctx.lineTo(x + w / 2 + 4, y + 6);
    ctx.closePath();
    ctx.fill();

    // Cauda (na direcao oposta ao movimento)
    ctx.fillStyle = '#16a085';
    const tailWag = Math.sin((swimTime || 0) * 5) * 4;
    if (direction >= 0) {
        ctx.beginPath();
        ctx.moveTo(x + 2, y + 10);
        ctx.lineTo(x - 8, y + 6 + tailWag);
        ctx.lineTo(x - 8, y + h - 8 + tailWag);
        ctx.lineTo(x + 2, y + h - 12);
        ctx.closePath();
        ctx.fill();
    } else {
        ctx.beginPath();
        ctx.moveTo(x + w - 2, y + 10);
        ctx.lineTo(x + w + 8, y + 6 + tailWag);
        ctx.lineTo(x + w + 8, y + h - 8 + tailWag);
        ctx.lineTo(x + w - 2, y + h - 12);
        ctx.closePath();
        ctx.fill();
    }

    // Barbatanas laterais
    ctx.fillStyle = '#48c9b0';
    const finFlap = Math.sin((swimTime || 0) * 4) * 3;
    ctx.beginPath();
    ctx.moveTo(x + w / 2, y + h - 6);
    ctx.lineTo(x + w / 2 - 6, y + h + 4 + finFlap);
    ctx.lineTo(x + w / 2 + 6, y + h + 4 + finFlap);
    ctx.closePath();
    ctx.fill();

    // Olhos
    ctx.fillStyle = '#fff';
    const eyeX = direction >= 0 ? 4 : -4;
    ctx.beginPath();
    ctx.arc(x + 10 + eyeX, y + 12, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x + w - 10 + eyeX, y + 12, 4, 0, Math.PI * 2);
    ctx.fill();

    // Pupilas
    ctx.fillStyle = '#000';
    const pShift = direction >= 0 ? 1.5 : -1.5;
    ctx.beginPath();
    ctx.arc(x + 10 + eyeX + pShift, y + 12, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x + w - 10 + eyeX + pShift, y + 12, 2, 0, Math.PI * 2);
    ctx.fill();
}

function drawOctopus(ctx, enemy) {
    const { x, y, w, h, direction, tentacleTime, hitTimer, bossPhase, lives, maxLives } = enemy;

    // Flash quando levou dano
    if (hitTimer > 0 && Math.floor(hitTimer * 10) % 2 === 0) {
        ctx.globalAlpha = 0.4;
    }

    // Cor muda conforme fase do boss
    const bodyColor = bossPhase === 3 ? '#c0392b' : bossPhase === 2 ? '#8e44ad' : '#6c3483';
    const lightColor = bossPhase === 3 ? '#e74c3c' : bossPhase === 2 ? '#a569bd' : '#8e44ad';

    // Cabeca (domo oval)
    ctx.fillStyle = bodyColor;
    ctx.beginPath();
    ctx.ellipse(x + w / 2, y + 20, w / 2, 24, 0, 0, Math.PI * 2);
    ctx.fill();

    // Manchas na cabeca
    ctx.fillStyle = lightColor;
    ctx.beginPath();
    ctx.ellipse(x + w / 2 - 10, y + 12, 8, 6, -0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(x + w / 2 + 12, y + 14, 6, 5, 0.3, 0, Math.PI * 2);
    ctx.fill();

    // Tentaculos (8 tentaculos ondulando)
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    const tentacleBaseY = y + 38;
    for (let i = 0; i < 8; i++) {
        const tx = x + 8 + i * (w - 16) / 7;
        const phase = tentacleTime * (3 + bossPhase) + i * 0.8;
        const waveX = Math.sin(phase) * (6 + bossPhase * 2);
        const waveX2 = Math.sin(phase + 1.5) * (4 + bossPhase);
        const len = h - 38;

        ctx.strokeStyle = i % 2 === 0 ? bodyColor : lightColor;
        ctx.beginPath();
        ctx.moveTo(tx, tentacleBaseY);
        ctx.quadraticCurveTo(tx + waveX, tentacleBaseY + len * 0.5, tx + waveX2, tentacleBaseY + len);
        ctx.stroke();

        // Ventosas
        ctx.fillStyle = 'rgba(255, 200, 200, 0.5)';
        const dotY = tentacleBaseY + len * 0.4;
        ctx.beginPath();
        ctx.arc(tx + waveX * 0.5, dotY, 2, 0, Math.PI * 2);
        ctx.fill();
    }

    // Olhos grandes (expressivos)
    const eyeSize = 12;
    const eyeY = y + 18;
    const leftEyeX = x + w / 2 - 16;
    const rightEyeX = x + w / 2 + 16;

    // Esclerótica
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.ellipse(leftEyeX, eyeY, eyeSize, eyeSize - 2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(rightEyeX, eyeY, eyeSize, eyeSize - 2, 0, 0, Math.PI * 2);
    ctx.fill();

    // Pupilas (olham na direcao do movimento)
    const pupilShift = direction * 3;
    ctx.fillStyle = bossPhase === 3 ? '#c0392b' : '#2c3e50';
    ctx.beginPath();
    ctx.arc(leftEyeX + pupilShift, eyeY, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(rightEyeX + pupilShift, eyeY, 5, 0, Math.PI * 2);
    ctx.fill();

    // Brilho nos olhos
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(leftEyeX + pupilShift - 2, eyeY - 2, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(rightEyeX + pupilShift - 2, eyeY - 2, 2, 0, Math.PI * 2);
    ctx.fill();

    // Boca irritada (muda com a fase)
    ctx.strokeStyle = '#2c3e50';
    ctx.lineWidth = 2;
    ctx.beginPath();
    if (bossPhase >= 2) {
        // Boca aberta — raiva
        ctx.fillStyle = '#c0392b';
        ctx.ellipse(x + w / 2, y + 32, 8, 4 + bossPhase, 0, 0, Math.PI * 2);
        ctx.fill();
    } else {
        ctx.moveTo(x + w / 2 - 8, y + 32);
        ctx.quadraticCurveTo(x + w / 2, y + 36, x + w / 2 + 8, y + 32);
        ctx.stroke();
    }

    // Sobrancelhas de raiva (mais intenso por fase)
    ctx.strokeStyle = '#2c3e50';
    ctx.lineWidth = 2 + bossPhase;
    ctx.beginPath();
    ctx.moveTo(leftEyeX - 8, eyeY - 10 - bossPhase);
    ctx.lineTo(leftEyeX + 8, eyeY - 6);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(rightEyeX + 8, eyeY - 10 - bossPhase);
    ctx.lineTo(rightEyeX - 8, eyeY - 6);
    ctx.stroke();

    ctx.globalAlpha = 1;
    ctx.lineWidth = 1;
    ctx.lineCap = 'butt';

    // Renderizar projeteis de tinta
    for (const ink of enemy.inkAttacks) {
        drawInkAttack(ctx, ink);
    }
}

function drawInkAttack(ctx, ink) {
    ctx.fillStyle = 'rgba(30, 0, 50, 0.8)';
    ctx.beginPath();
    ctx.arc(ink.x + ink.w / 2, ink.y + ink.h / 2, 6, 0, Math.PI * 2);
    ctx.fill();

    // Respingos ao redor
    ctx.fillStyle = 'rgba(50, 0, 80, 0.5)';
    ctx.beginPath();
    ctx.arc(ink.x + ink.w / 2 + 4, ink.y + ink.h / 2 - 3, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(ink.x + ink.w / 2 - 3, ink.y + ink.h / 2 + 4, 2.5, 0, Math.PI * 2);
    ctx.fill();
}

// Desenha barra de vida do boss
export function drawBossHealthBar(ctx, enemy, canvasWidth) {
    if (!enemy || !enemy.alive || !enemy.isBoss) return;

    const barW = 300;
    const barH = 16;
    const barX = (canvasWidth - barW) / 2;
    const barY = 14;

    // Fundo
    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    roundRect(ctx, barX - 4, barY - 4, barW + 8, barH + 8, 6);

    // Barra de vida
    const ratio = enemy.lives / enemy.maxLives;
    const healthColor = ratio > 0.5 ? '#8e44ad' : ratio > 0.25 ? '#e67e22' : '#e74c3c';
    ctx.fillStyle = '#333';
    roundRect(ctx, barX, barY, barW, barH, 4);
    ctx.fillStyle = healthColor;
    if (ratio > 0) {
        roundRect(ctx, barX, barY, barW * ratio, barH, 4);
    }

    // Nome do boss
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 12px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('POLVO GIGANTE', canvasWidth / 2, barY + 12);
    ctx.textAlign = 'left';
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

// Cache de gradientes — evita recriar objetos identicos a cada frame
let _bgGradient = null;
let _bgGradientH = 0;

// Desenha parallax de fundo
export function drawBackground(ctx, camera, levelWidth, levelHeight, canvasWidth, canvasHeight) {
    // Camada 1 — ceu gradiente (cacheado por altura do canvas)
    if (!_bgGradient || _bgGradientH !== canvasHeight) {
        _bgGradient = ctx.createLinearGradient(0, 0, 0, canvasHeight);
        _bgGradient.addColorStop(0, '#0f0c29');
        _bgGradient.addColorStop(0.5, '#302b63');
        _bgGradient.addColorStop(1, '#24243e');
        _bgGradientH = canvasHeight;
    }
    ctx.fillStyle = _bgGradient;
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
