// Controles touch para dispositivos moveis
// Joystick virtual (esquerda) + botoes de acao (direita)

export class TouchControls {
    constructor(canvas) {
        this.canvas = canvas;
        this.active = false;

        // Estado dos controles
        this.leftPressed = false;
        this.rightPressed = false;
        this.jumpPressed = false;
        this.jumpJustPressed = false;
        this.punchJustPressed = false;

        // Joystick
        this.joystick = {
            baseX: 0, baseY: 0,
            stickX: 0, stickY: 0,
            radius: 50,
            touching: false,
            touchId: null
        };

        // Botoes
        this.buttons = {
            jump: { x: 0, y: 0, radius: 35, touching: false, touchId: null },
            punch: { x: 0, y: 0, radius: 28, touching: false, touchId: null }
        };

        // Detectar se e touch device
        this.detectTouch();
    }

    detectTouch() {
        const isTouch = ('ontouchstart' in window) ||
            (navigator.maxTouchPoints > 0) ||
            (window.matchMedia && window.matchMedia('(pointer: coarse)').matches);

        if (isTouch) {
            this.enable();
        }

        // Ativar tambem se tocar na tela
        window.addEventListener('touchstart', () => {
            if (!this.active) this.enable();
        }, { once: true });
    }

    enable() {
        this.active = true;
        this.updateLayout();

        this.canvas.addEventListener('touchstart', (e) => this.onTouchStart(e), { passive: false });
        this.canvas.addEventListener('touchmove', (e) => this.onTouchMove(e), { passive: false });
        this.canvas.addEventListener('touchend', (e) => this.onTouchEnd(e), { passive: false });
        this.canvas.addEventListener('touchcancel', (e) => this.onTouchEnd(e), { passive: false });

        window.addEventListener('resize', () => this.updateLayout());
    }

    updateLayout() {
        const w = this.canvas.width;
        const h = this.canvas.height;
        const margin = 40;
        const bottomOffset = 100;

        // Joystick — canto inferior esquerdo
        this.joystick.baseX = margin + this.joystick.radius + 20;
        this.joystick.baseY = h - bottomOffset;
        this.joystick.stickX = this.joystick.baseX;
        this.joystick.stickY = this.joystick.baseY;

        // Botao pular — canto inferior direito
        this.buttons.jump.x = w - margin - 45;
        this.buttons.jump.y = h - bottomOffset - 10;

        // Botao socar — a esquerda do pular
        this.buttons.punch.x = w - margin - 120;
        this.buttons.punch.y = h - bottomOffset + 20;
    }

    onTouchStart(e) {
        e.preventDefault();
        for (const touch of e.changedTouches) {
            this.processTouch(touch, true);
        }
    }

    onTouchMove(e) {
        e.preventDefault();
        for (const touch of e.changedTouches) {
            this.processTouchMove(touch);
        }
    }

    onTouchEnd(e) {
        e.preventDefault();
        for (const touch of e.changedTouches) {
            this.releaseTouch(touch);
        }
    }

    processTouch(touch, isStart) {
        const x = touch.clientX * (this.canvas.width / this.canvas.clientWidth);
        const y = touch.clientY * (this.canvas.height / this.canvas.clientHeight);
        const halfW = this.canvas.width / 2;

        // Lado esquerdo — joystick
        if (x < halfW) {
            this.joystick.touching = true;
            this.joystick.touchId = touch.identifier;
            this.joystick.stickX = x;
            this.joystick.stickY = y;
            // Reposicionar base do joystick onde tocou
            this.joystick.baseX = x;
            this.joystick.baseY = y;
            this.updateJoystickState();
        }

        // Lado direito — botoes
        if (x >= halfW) {
            const jumpBtn = this.buttons.jump;
            const punchBtn = this.buttons.punch;

            const distJump = Math.hypot(x - jumpBtn.x, y - jumpBtn.y);
            const distPunch = Math.hypot(x - punchBtn.x, y - punchBtn.y);

            if (distJump < jumpBtn.radius + 15) {
                jumpBtn.touching = true;
                jumpBtn.touchId = touch.identifier;
                this.jumpPressed = true;
                if (isStart) this.jumpJustPressed = true;
            } else if (distPunch < punchBtn.radius + 15) {
                punchBtn.touching = true;
                punchBtn.touchId = touch.identifier;
                if (isStart) this.punchJustPressed = true;
            } else {
                // Toque generico no lado direito = pular
                jumpBtn.touching = true;
                jumpBtn.touchId = touch.identifier;
                this.jumpPressed = true;
                if (isStart) this.jumpJustPressed = true;
            }
        }
    }

    processTouchMove(touch) {
        if (touch.identifier === this.joystick.touchId) {
            const x = touch.clientX * (this.canvas.width / this.canvas.clientWidth);
            const y = touch.clientY * (this.canvas.height / this.canvas.clientHeight);

            // Limitar ao raio do joystick
            const dx = x - this.joystick.baseX;
            const dy = y - this.joystick.baseY;
            const dist = Math.hypot(dx, dy);
            const maxDist = this.joystick.radius;

            if (dist > maxDist) {
                this.joystick.stickX = this.joystick.baseX + (dx / dist) * maxDist;
                this.joystick.stickY = this.joystick.baseY + (dy / dist) * maxDist;
            } else {
                this.joystick.stickX = x;
                this.joystick.stickY = y;
            }

            this.updateJoystickState();
        }
    }

    releaseTouch(touch) {
        if (touch.identifier === this.joystick.touchId) {
            this.joystick.touching = false;
            this.joystick.touchId = null;
            this.joystick.stickX = this.joystick.baseX;
            this.joystick.stickY = this.joystick.baseY;
            this.leftPressed = false;
            this.rightPressed = false;
        }

        if (touch.identifier === this.buttons.jump.touchId) {
            this.buttons.jump.touching = false;
            this.buttons.jump.touchId = null;
            this.jumpPressed = false;
        }

        if (touch.identifier === this.buttons.punch.touchId) {
            this.buttons.punch.touching = false;
            this.buttons.punch.touchId = null;
        }
    }

    updateJoystickState() {
        const dx = this.joystick.stickX - this.joystick.baseX;
        const deadzone = this.joystick.radius * 0.25;

        this.leftPressed = dx < -deadzone;
        this.rightPressed = dx > deadzone;
    }

    // Chamar no final de cada frame
    endFrame() {
        this.jumpJustPressed = false;
        this.punchJustPressed = false;
    }

    render(ctx) {
        if (!this.active) return;

        ctx.save();
        ctx.globalAlpha = 0.3;

        // Joystick base
        ctx.beginPath();
        ctx.arc(this.joystick.baseX, this.joystick.baseY, this.joystick.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Joystick stick
        ctx.globalAlpha = this.joystick.touching ? 0.6 : 0.35;
        ctx.beginPath();
        ctx.arc(this.joystick.stickX, this.joystick.stickY, 22, 0, Math.PI * 2);
        ctx.fillStyle = '#fff';
        ctx.fill();

        // Botao pular
        const jumpBtn = this.buttons.jump;
        ctx.globalAlpha = jumpBtn.touching ? 0.5 : 0.3;
        ctx.beginPath();
        ctx.arc(jumpBtn.x, jumpBtn.y, jumpBtn.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#3498db';
        ctx.fill();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.lineWidth = 2;
        ctx.stroke();
        // Label
        ctx.globalAlpha = jumpBtn.touching ? 0.8 : 0.5;
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 16px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('PULO', jumpBtn.x, jumpBtn.y);

        // Botao socar
        const punchBtn = this.buttons.punch;
        ctx.globalAlpha = punchBtn.touching ? 0.5 : 0.3;
        ctx.beginPath();
        ctx.arc(punchBtn.x, punchBtn.y, punchBtn.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#e74c3c';
        ctx.fill();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.lineWidth = 2;
        ctx.stroke();
        // Label
        ctx.globalAlpha = punchBtn.touching ? 0.8 : 0.5;
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 13px monospace';
        ctx.fillText('SOCO', punchBtn.x, punchBtn.y);

        ctx.restore();
    }
}
