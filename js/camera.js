export class Camera {
    constructor(viewWidth, viewHeight) {
        this.x = 0;
        this.y = 0;
        this.viewWidth = viewWidth;
        this.viewHeight = viewHeight;
    }

    follow(target, levelWidth, levelHeight) {
        // Centralizar camera no jogador
        this.x = target.x + target.width / 2 - this.viewWidth / 2;
        this.y = target.y + target.height / 2 - this.viewHeight / 2;

        // Limitar camera aos limites do nivel
        if (this.x < 0) this.x = 0;
        if (this.y < 0) this.y = 0;
        if (this.x + this.viewWidth > levelWidth) {
            this.x = levelWidth - this.viewWidth;
        }
        if (this.y + this.viewHeight > levelHeight) {
            this.y = levelHeight - this.viewHeight;
        }
    }

    applyTransform(ctx) {
        ctx.save();
        ctx.translate(-this.x, -this.y);
    }

    resetTransform(ctx) {
        ctx.restore();
    }

    resize(viewWidth, viewHeight) {
        this.viewWidth = viewWidth;
        this.viewHeight = viewHeight;
    }
}
