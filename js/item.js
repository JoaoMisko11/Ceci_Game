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

    collect() {
        this.collected = true;
        return this.type === 'star' ? 50 : 10;
    }
}
