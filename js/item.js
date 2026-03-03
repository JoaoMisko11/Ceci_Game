export class Item {
    constructor(x, y, type = 'coin') {
        this.x = x;
        this.y = y;
        this.w = 20;
        this.h = 20;
        this.type = type;
        this.collected = false;

        // Animacao de flutuacao
        this.baseY = y;
        this.floatTime = Math.random() * Math.PI * 2; // fase aleatoria
    }

    update(dt) {
        if (this.collected) return;
        this.floatTime += dt * 3;
        this.y = this.baseY + Math.sin(this.floatTime) * 4;
    }

    render(ctx) {
        if (this.collected) return;

        if (this.type === 'coin') {
            ctx.fillStyle = '#f1c40f';
            ctx.beginPath();
            ctx.arc(this.x + this.w / 2, this.y + this.h / 2, this.w / 2, 0, Math.PI * 2);
            ctx.fill();
        } else if (this.type === 'star') {
            ctx.fillStyle = '#e67e22';
            ctx.beginPath();
            ctx.arc(this.x + this.w / 2, this.y + this.h / 2, this.w / 2, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    collect() {
        this.collected = true;
        return this.type === 'star' ? 50 : 10;
    }
}
