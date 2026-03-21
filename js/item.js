import { ITEM_SIZE, ITEM_FLOAT_FREQ, ITEM_FLOAT_AMP, SCORE_COIN, SCORE_STAR } from './constants.js';

export class Item {
    constructor(x, y, type = 'coin') {
        this.x = x;
        this.y = y;
        this.w = ITEM_SIZE;
        this.h = ITEM_SIZE;
        this.type = type;
        this.collected = false;

        // Animacao de flutuacao
        this.baseY = y;
        this.floatTime = Math.random() * Math.PI * 2; // fase aleatoria
    }

    update(dt) {
        if (this.collected) return;
        this.floatTime += dt * ITEM_FLOAT_FREQ;
        this.y = this.baseY + Math.sin(this.floatTime) * ITEM_FLOAT_AMP;
    }

    collect() {
        this.collected = true;
        return this.type === 'star' ? SCORE_STAR : SCORE_COIN;
    }
}
