export class PowerUp {
    constructor(x, y, type = 'speed') {
        this.x = x;
        this.y = y;
        this.w = 24;
        this.h = 24;
        this.type = type; // 'speed', 'doubleJump'
        this.collected = false;

        this.baseY = y;
        this.floatTime = Math.random() * Math.PI * 2;
    }

    update(dt) {
        if (this.collected) return;
        this.floatTime += dt * 2;
        this.y = this.baseY + Math.sin(this.floatTime) * 5;
    }

    render(ctx) {
        if (this.collected) return;

        const cx = this.x + this.w / 2;
        const cy = this.y + this.h / 2;
        const r = this.w / 2;

        // Brilho externo
        ctx.fillStyle = this.type === 'speed'
            ? 'rgba(46, 204, 113, 0.3)'
            : 'rgba(52, 152, 219, 0.3)';
        ctx.beginPath();
        ctx.arc(cx, cy, r + 5, 0, Math.PI * 2);
        ctx.fill();

        // Caixa do power-up
        ctx.fillStyle = this.type === 'speed' ? '#2ecc71' : '#3498db';
        ctx.fillRect(this.x + 2, this.y + 2, this.w - 4, this.h - 4);

        // Icone
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 14px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.type === 'speed' ? '>' : '^', cx, cy);
        ctx.textBaseline = 'alphabetic';
    }

    collect() {
        this.collected = true;
    }
}
