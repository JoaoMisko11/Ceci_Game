export class Platform {
    constructor(x, y, w, h, color = '#4a90d9', type = 'static') {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.color = color;
        this.type = type; // 'static', 'moving', 'breakable'
        this.active = true;

        // Plataforma movel
        this.startX = x;
        this.startY = y;
        this.moveDistX = 0;
        this.moveDistY = 0;
        this.moveSpeed = 60;
        this.moveProgress = 0;
        this.moveDir = 1;

        // Plataforma quebravel
        this.breakTimer = 0;
        this.breaking = false;
        this.shakeAmount = 0;
    }

    update(dt) {
        if (!this.active) return;

        if (this.type === 'moving') {
            this.moveProgress += this.moveSpeed * this.moveDir * dt;
            const maxDist = Math.max(Math.abs(this.moveDistX), Math.abs(this.moveDistY));
            if (maxDist > 0) {
                const ratio = this.moveProgress / maxDist;
                if (ratio >= 1) {
                    this.moveProgress = maxDist;
                    this.moveDir = -1;
                } else if (ratio <= 0) {
                    this.moveProgress = 0;
                    this.moveDir = 1;
                }
                const t = this.moveProgress / maxDist;
                this.x = this.startX + this.moveDistX * t;
                this.y = this.startY + this.moveDistY * t;
            }
        }

        if (this.type === 'breakable' && this.breaking) {
            this.breakTimer -= dt;
            this.shakeAmount = 2;
            if (this.breakTimer <= 0) {
                this.active = false;
            }
        }
    }

    startBreaking() {
        if (this.type === 'breakable' && !this.breaking) {
            this.breaking = true;
            this.breakTimer = 0.5; // meio segundo antes de quebrar
        }
    }

    render(ctx) {
        if (!this.active) return;

        const shakeX = this.breaking ? (Math.random() - 0.5) * this.shakeAmount * 2 : 0;
        const shakeY = this.breaking ? (Math.random() - 0.5) * this.shakeAmount * 2 : 0;

        ctx.fillStyle = this.breaking ? '#e74c3c' : this.color;
        ctx.fillRect(this.x + shakeX, this.y + shakeY, this.w, this.h);

        // Indicador visual para plataformas moveis (setas)
        if (this.type === 'moving') {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
            const cx = this.x + this.w / 2;
            const cy = this.y + this.h / 2;
            ctx.beginPath();
            if (this.moveDistX !== 0) {
                ctx.moveTo(cx - 6, cy - 3);
                ctx.lineTo(cx - 6, cy + 3);
                ctx.lineTo(cx - 10, cy);
                ctx.moveTo(cx + 6, cy - 3);
                ctx.lineTo(cx + 6, cy + 3);
                ctx.lineTo(cx + 10, cy);
            }
            if (this.moveDistY !== 0) {
                ctx.moveTo(cx - 3, cy - 6);
                ctx.lineTo(cx + 3, cy - 6);
                ctx.lineTo(cx, cy - 10);
                ctx.moveTo(cx - 3, cy + 6);
                ctx.lineTo(cx + 3, cy + 6);
                ctx.lineTo(cx, cy + 10);
            }
            ctx.fill();
        }

        // Rachaduras para plataformas quebraveis
        if (this.type === 'breakable' && !this.breaking) {
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(this.x + this.w * 0.3, this.y);
            ctx.lineTo(this.x + this.w * 0.4, this.y + this.h);
            ctx.moveTo(this.x + this.w * 0.7, this.y);
            ctx.lineTo(this.x + this.w * 0.6, this.y + this.h);
            ctx.stroke();
        }
    }
}

// Cria plataforma a partir de dados JSON
export function createPlatform(data) {
    const p = new Platform(data.x, data.y, data.w, data.h, data.color, data.type || 'static');
    if (data.moveDistX) p.moveDistX = data.moveDistX;
    if (data.moveDistY) p.moveDistY = data.moveDistY;
    if (data.moveSpeed) p.moveSpeed = data.moveSpeed;
    return p;
}

// Detecta colisao AABB entre dois retangulos
export function checkAABB(a, b) {
    if (b.active === false) return false;
    return (
        a.x < b.x + b.w &&
        a.x + a.w > b.x &&
        a.y < b.y + b.h &&
        a.y + a.h > b.y
    );
}

// Resolve colisao do jogador com uma plataforma
export function resolveCollision(player, platform) {
    if (platform.active === false) return null;

    const pw = player.width;
    const ph = player.height;

    const overlapLeft = (player.x + pw) - platform.x;
    const overlapRight = (platform.x + platform.w) - player.x;
    const overlapTop = (player.y + ph) - platform.y;
    const overlapBottom = (platform.y + platform.h) - player.y;

    const minOverlap = Math.min(overlapLeft, overlapRight, overlapTop, overlapBottom);

    if (minOverlap === overlapTop) {
        player.y = platform.y - ph;
        player.vy = 0;
        player.onGround = true;

        // Plataforma quebravel comeca a quebrar quando pisada
        if (platform.type === 'breakable') {
            platform.startBreaking();
        }

        return 'top';
    } else if (minOverlap === overlapBottom) {
        player.y = platform.y + platform.h;
        player.vy = 0;
        return 'bottom';
    } else if (minOverlap === overlapLeft) {
        player.x = platform.x - pw;
        player.vx = 0;
        return 'left';
    } else if (minOverlap === overlapRight) {
        player.x = platform.x + platform.w;
        player.vx = 0;
        return 'right';
    }

    return null;
}
