import {
    GRAVITY, MAX_FALL_SPEED, MOVE_SPEED, JUMP_FORCE, FRICTION,
    WATER_GRAVITY_MULT, WATER_SPEED_MULT, WATER_JUMP_MULT, WATER_MAX_FALL_MULT,
    WATER_FRICTION, SPEED_BOOST_MULT, DOUBLE_JUMP_MULT,
    PLAYER_WIDTH, PLAYER_HEIGHT, PLAYER_LIVES, INVINCIBLE_DURATION,
    PUNCH_DURATION, PUNCH_COOLDOWN, PUNCH_RANGE, PUNCH_HEIGHT,
    SPEED_BOOST_DURATION, DOUBLE_JUMP_DURATION
} from './constants.js';

export class Player {
    constructor(x, y, skin = 0) {
        this.x = x;
        this.y = y;
        this.width = PLAYER_WIDTH;
        this.height = PLAYER_HEIGHT;
        this.skin = skin;

        this.vx = 0;
        this.vy = 0;
        this.onGround = false;

        this.lives = PLAYER_LIVES;
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
        this.PUNCH_DURATION = PUNCH_DURATION;
        this.PUNCH_COOLDOWN = PUNCH_COOLDOWN;
        this.PUNCH_RANGE = PUNCH_RANGE;
        this.PUNCH_HEIGHT = PUNCH_HEIGHT;

        // Agua
        this.inWater = false;
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
        this.invincibleTimer = INVINCIBLE_DURATION;
    }

    applyPowerUp(type) {
        if (type === 'speed') {
            this.speedBoost = true;
            this.speedTimer = SPEED_BOOST_DURATION;
        } else if (type === 'doubleJump') {
            this.doubleJump = true;
            this.doubleJumpTimer = DOUBLE_JUMP_DURATION;
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

        let currentSpeed = this.speedBoost ? MOVE_SPEED * SPEED_BOOST_MULT : MOVE_SPEED;
        let currentJumpForce = JUMP_FORCE;
        let currentGravity = GRAVITY;
        let currentMaxFall = MAX_FALL_SPEED;

        // Modificadores de agua
        if (this.inWater) {
            currentSpeed *= WATER_SPEED_MULT;
            currentJumpForce *= WATER_JUMP_MULT;
            currentGravity *= WATER_GRAVITY_MULT;
            currentMaxFall *= WATER_MAX_FALL_MULT;
        }

        // Movimento horizontal
        if (input.left) {
            this.vx = -currentSpeed;
            this.lastDirection = -1;
        } else if (input.right) {
            this.vx = currentSpeed;
            this.lastDirection = 1;
        } else {
            this.vx *= this.inWater ? WATER_FRICTION : FRICTION;
            if (Math.abs(this.vx) < 1) this.vx = 0;
        }

        // Pulo (na agua pode pular varias vezes — nadar pra cima)
        if (input.jumpPressed && this.inWater) {
            this.vy = currentJumpForce;
        } else if (input.jumpPressed && this.onGround) {
            this.vy = currentJumpForce;
            this.onGround = false;
            if (this.doubleJump) this.canDoubleJump = true;
        } else if (input.jumpPressed && !this.onGround && this.canDoubleJump) {
            this.vy = currentJumpForce * DOUBLE_JUMP_MULT;
            this.canDoubleJump = false;
        }

        // Gravidade
        this.vy += currentGravity * dt;
        if (this.vy > currentMaxFall) {
            this.vy = currentMaxFall;
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
