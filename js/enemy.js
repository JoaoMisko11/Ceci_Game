export class Enemy {
    constructor(x, y, patrolDistance = 100, type = 'walker') {
        this.x = x;
        this.y = y;
        this.w = 30;
        this.h = 30;
        this.alive = true;
        this.type = type;

        // Patrulha
        this.startX = x;
        this.startY = y;
        this.patrolDistance = patrolDistance;
        this.speed = type === 'flyer' ? 60 : 80;
        this.direction = 1;

        // Voador
        this.floatTime = Math.random() * Math.PI * 2;
    }

    update(dt) {
        if (!this.alive) return;

        this.x += this.speed * this.direction * dt;

        if (this.x > this.startX + this.patrolDistance) {
            this.x = this.startX + this.patrolDistance;
            this.direction = -1;
        } else if (this.x < this.startX) {
            this.x = this.startX;
            this.direction = 1;
        }

        // Voador flutua verticalmente
        if (this.type === 'flyer') {
            this.floatTime += dt * 3;
            this.y = this.startY + Math.sin(this.floatTime) * 20;
        }
    }

    render(ctx) {
        if (!this.alive) return;

        // O renderer cuida do desenho visual
        ctx.fillStyle = this.type === 'flyer' ? '#e67e22' : '#9b59b6';
        ctx.fillRect(this.x, this.y, this.w, this.h);
    }

    kill() {
        this.alive = false;
    }
}
