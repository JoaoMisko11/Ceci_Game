const GRAVITY = 1500;
const MAX_FALL_SPEED = 800;
const MOVE_SPEED = 300;
const JUMP_FORCE = -700;
const FRICTION = 0.85;

export class Player {
    constructor(x, y, skin = 0) {
        this.x = x;
        this.y = y;
        this.width = 32;
        this.height = 48;
        this.skin = skin;

        this.vx = 0;
        this.vy = 0;
        this.onGround = false;

        this.lives = 3;
        this.score = 0;
        this.invincibleTimer = 0;
        this.lastDirection = 1;

        // Power-ups
        this.speedBoost = false;
        this.speedTimer = 0;
        this.doubleJump = false;
        this.doubleJumpTimer = 0;
        this.canDoubleJump = false; // segundo pulo disponivel

        // Soco
        this.punching = false;
        this.punchTimer = 0;
        this.punchCooldown = 0;
        this.PUNCH_DURATION = 0.25; // duracao da animacao
        this.PUNCH_COOLDOWN = 0.35; // tempo entre socos
        this.PUNCH_RANGE = 28; // alcance do soco
        this.PUNCH_HEIGHT = 20; // altura da hitbox do soco
    }

    get isAlive() {
        return this.lives > 0;
    }

    get isInvincible() {
        return this.invincibleTimer > 0;
    }

    // Hitbox do soco na direcao que o jogador esta olhando
    get punchHitbox() {
        if (!this.punching) return null;
        const cx = this.lastDirection >= 0
            ? this.x + this.width
            : this.x - this.PUNCH_RANGE;
        const cy = this.y + this.height / 2 - this.PUNCH_HEIGHT / 2;
        return { x: cx, y: cy, w: this.PUNCH_RANGE, h: this.PUNCH_HEIGHT };
    }

    takeDamage() {
        if (this.isInvincible) return;
        this.lives--;
        this.invincibleTimer = 1.5; // 1.5s de invencibilidade
    }

    applyPowerUp(type) {
        if (type === 'speed') {
            this.speedBoost = true;
            this.speedTimer = 8; // 8 segundos
        } else if (type === 'doubleJump') {
            this.doubleJump = true;
            this.doubleJumpTimer = 10; // 10 segundos
        }
    }

    update(dt, input) {
        if (this.invincibleTimer > 0) {
            this.invincibleTimer -= dt;
        }

        // Timers de power-ups
        if (this.speedBoost) {
            this.speedTimer -= dt;
            if (this.speedTimer <= 0) this.speedBoost = false;
        }
        if (this.doubleJump) {
            this.doubleJumpTimer -= dt;
            if (this.doubleJumpTimer <= 0) {
                this.doubleJump = false;
                this.canDoubleJump = false;
            }
        }

        // Soco
        if (this.punchCooldown > 0) this.punchCooldown -= dt;
        if (this.punching) {
            this.punchTimer -= dt;
            if (this.punchTimer <= 0) this.punching = false;
        }
        if (input.punchPressed && !this.punching && this.punchCooldown <= 0) {
            this.punching = true;
            this.punchTimer = this.PUNCH_DURATION;
            this.punchCooldown = this.PUNCH_COOLDOWN;
        }

        const currentSpeed = this.speedBoost ? MOVE_SPEED * 1.6 : MOVE_SPEED;

        // Movimento horizontal
        if (input.left) {
            this.vx = -currentSpeed;
            this.lastDirection = -1;
        } else if (input.right) {
            this.vx = currentSpeed;
            this.lastDirection = 1;
        } else {
            this.vx *= FRICTION;
            if (Math.abs(this.vx) < 1) this.vx = 0;
        }

        // Pulo
        if (input.jumpPressed && this.onGround) {
            this.vy = JUMP_FORCE;
            this.onGround = false;
            if (this.doubleJump) this.canDoubleJump = true;
        } else if (input.jumpPressed && !this.onGround && this.canDoubleJump) {
            this.vy = JUMP_FORCE * 0.85;
            this.canDoubleJump = false;
        }

        // Gravidade
        this.vy += GRAVITY * dt;
        if (this.vy > MAX_FALL_SPEED) {
            this.vy = MAX_FALL_SPEED;
        }

        // Atualizar posicao
        this.x += this.vx * dt;
        this.y += this.vy * dt;

        // Resetar onGround (sera setado pela colisao)
        this.onGround = false;
    }

    render(ctx) {
        // Piscar quando invencivel
        if (this.isInvincible && Math.floor(this.invincibleTimer * 10) % 2 === 0) {
            return;
        }

        ctx.fillStyle = '#e74c3c';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}
