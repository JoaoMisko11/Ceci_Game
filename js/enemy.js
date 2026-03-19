export class Enemy {
    constructor(x, y, patrolDistance = 100, type = 'walker') {
        this.x = x;
        this.y = y;
        this.w = type === 'octopus' ? 80 : 30;
        this.h = type === 'octopus' ? 70 : 30;
        this.alive = true;
        this.type = type;

        // Patrulha
        this.startX = x;
        this.startY = y;
        this.patrolDistance = patrolDistance;
        this.speed = type === 'flyer' ? 60 : type === 'swimmer' ? 70 : type === 'octopus' ? 40 : 80;
        this.direction = 1;

        // Voador
        this.floatTime = Math.random() * Math.PI * 2;

        // Nadador
        this.swimTime = Math.random() * Math.PI * 2;

        // Boss (octopus)
        this.lives = type === 'octopus' ? 5 : 1;
        this.maxLives = this.lives;
        this.isBoss = type === 'octopus';
        this.bossPhase = 1; // muda comportamento conforme perde vida
        this.hitTimer = 0; // flash ao levar dano
        this.tentacleTime = 0; // animacao dos tentaculos
        this.inkCooldown = 0; // cooldown do ataque de tinta
        this.inkAttacks = []; // projeteis de tinta ativos
    }

    update(dt) {
        if (!this.alive) return;

        // Boss octopus tem comportamento especial
        if (this.type === 'octopus') {
            this.updateBoss(dt);
            return;
        }

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

        // Nadador oscila verticalmente (simulando nado)
        if (this.type === 'swimmer') {
            this.swimTime += dt * 2.5;
            this.y = this.startY + Math.sin(this.swimTime) * 15;
        }
    }

    updateBoss(dt) {
        this.tentacleTime += dt;
        if (this.hitTimer > 0) this.hitTimer -= dt;

        // Fase do boss baseada nas vidas restantes
        const lifeRatio = this.lives / this.maxLives;
        if (lifeRatio <= 0.4) {
            this.bossPhase = 3; // rapido e agressivo
        } else if (lifeRatio <= 0.7) {
            this.bossPhase = 2; // mais rapido
        }

        // Velocidade aumenta por fase
        const phaseSpeed = this.speed * (1 + (this.bossPhase - 1) * 0.5);
        this.x += phaseSpeed * this.direction * dt;

        if (this.x > this.startX + this.patrolDistance) {
            this.x = this.startX + this.patrolDistance;
            this.direction = -1;
        } else if (this.x < this.startX) {
            this.x = this.startX;
            this.direction = 1;
        }

        // Flutuacao vertical do polvo
        this.swimTime += dt * (1.5 + this.bossPhase * 0.5);
        this.y = this.startY + Math.sin(this.swimTime) * (20 + this.bossPhase * 5);

        // Ataque de tinta
        this.inkCooldown -= dt;
        const inkInterval = this.bossPhase === 3 ? 1.5 : this.bossPhase === 2 ? 2.5 : 3.5;
        if (this.inkCooldown <= 0) {
            this.inkCooldown = inkInterval;
            this.spawnInk();
        }

        // Atualizar projeteis de tinta
        for (let i = this.inkAttacks.length - 1; i >= 0; i--) {
            const ink = this.inkAttacks[i];
            ink.x += ink.vx * dt;
            ink.y += ink.vy * dt;
            ink.life -= dt;
            if (ink.life <= 0) {
                this.inkAttacks.splice(i, 1);
            }
        }
    }

    spawnInk() {
        const cx = this.x + this.w / 2;
        const cy = this.y + this.h / 2;
        // Dispara tinta em varias direcoes conforme a fase
        const numInks = this.bossPhase;
        for (let i = 0; i < numInks; i++) {
            const angle = (Math.PI / (numInks + 1)) * (i + 1) + (this.direction > 0 ? Math.PI : 0);
            const speed = 150 + this.bossPhase * 30;
            this.inkAttacks.push({
                x: cx,
                y: cy,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                life: 3,
                w: 10,
                h: 10
            });
        }
    }

    takeDamage() {
        if (!this.isBoss || this.hitTimer > 0) return false;
        this.lives--;
        this.hitTimer = 0.8; // invencibilidade temporaria
        if (this.lives <= 0) {
            this.kill();
        }
        return true;
    }

    kill() {
        this.alive = false;
    }
}
