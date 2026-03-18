// Controles touch para dispositivos moveis
// Joystick virtual (esquerda) + botoes de acao (direita)

export class TouchControls {
    constructor(canvas) {
        this.canvas = canvas;
        this.active = false;
        this.enabled = false;

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
            radius: 55,
            touching: false,
            touchId: null
        };

        // Botoes
        this.buttons = {
            jump: { x: 0, y: 0, radius: 40, touching: false, touchId: null },
            punch: { x: 0, y: 0, radius: 32, touching: false, touchId: null }
        };

        // Sempre registrar os listeners — eles so fazem algo se active = true
        this.bindEvents();

        // Detectar se e touch device
        this.detectTouch();
    }

    detectTouch() {
        const isTouch = ('ontouchstart' in window) ||
            (navigator.maxTouchPoints > 0) ||
            (window.matchMedia && window.matchMedia('(pointer: coarse)').matches);

        if (isTouch) {
            this.activate();
        }
    }

    activate() {
        if (this.active) return;
        this.active = true;
        this.updateLayout();
    }

    bindEvents() {
        const handler = (name, fn) => {
            this.canvas.addEventListener(name, (e) => {
                // Ativar touch na primeira interacao
                if (!this.active) this.activate();
                fn(e);
            }, { passive: false });
        };

        handler('touchstart', (e) => this.onTouchStart(e));
        handler('touchmove', (e) => this.onTouchMove(e));
        handler('touchend', (e) => this.onTouchEnd(e));
        handler('touchcancel', (e) => this.onTouchEnd(e));

        window.addEventListener('resize', () => {
            if (this.active) this.updateLayout();
        });
    }

    updateLayout() {
        const w = this.canvas.width;
        const h = this.canvas.height;

        // Joystick — canto inferior esquerdo
        this.joystick.baseX = 90;
        this.joystick.baseY = h - 110;
        this.joystick.stickX = this.joystick.baseX;
        this.joystick.stickY = this.joystick.baseY;

        // Botao pular — canto inferior direito (grande)
        this.buttons.jump.x = w - 80;
        this.buttons.jump.y = h - 120;

        // Botao socar — a esquerda do pular
        this.buttons.punch.x = w - 160;
        this.buttons.punch.y = h - 85;
    }

    getCanvasPos(touch) {
        const rect = this.canvas.getBoundingClientRect();
        return {
            x: (touch.clientX - rect.left) * (this.canvas.width / rect.width),
            y: (touch.clientY - rect.top) * (this.canvas.height / rect.height)
        };
    }

    onTouchStart(e) {
        e.preventDefault();
        for (let i = 0; i < e.changedTouches.length; i++) {
            this.processTouch(e.changedTouches[i], true);
        }
    }

    onTouchMove(e) {
        e.preventDefault();
        for (let i = 0; i < e.changedTouches.length; i++) {
            this.processTouchMove(e.changedTouches[i]);
        }
    }

    onTouchEnd(e) {
        e.preventDefault();
        for (let i = 0; i < e.changedTouches.length; i++) {
            this.releaseTouch(e.changedTouches[i]);
        }
    }

    processTouch(touch, isStart) {
        const { x, y } = this.getCanvasPos(touch);
        const halfW = this.canvas.width / 2;

        // Verificar botoes primeiro (tem prioridade sobre area generica)
        const jumpBtn = this.buttons.jump;
        const punchBtn = this.buttons.punch;
        const distJump = Math.hypot(x - jumpBtn.x, y - jumpBtn.y);
        const distPunch = Math.hypot(x - punchBtn.x, y - punchBtn.y);

        // Tolerancia extra no toque
        const touchTolerance = 20;

        if (distPunch < punchBtn.radius + touchTolerance && x >= halfW) {
            punchBtn.touching = true;
            punchBtn.touchId = touch.identifier;
            if (isStart) this.punchJustPressed = true;
            return;
        }

        if (distJump < jumpBtn.radius + touchTolerance && x >= halfW) {
            jumpBtn.touching = true;
            jumpBtn.touchId = touch.identifier;
            this.jumpPressed = true;
            if (isStart) this.jumpJustPressed = true;
            return;
        }

        // Lado esquerdo — joystick
        if (x < halfW) {
            this.joystick.touching = true;
            this.joystick.touchId = touch.identifier;
            // Reposicionar base do joystick onde tocou
            this.joystick.baseX = x;
            this.joystick.baseY = y;
            this.joystick.stickX = x;
            this.joystick.stickY = y;
            this.updateJoystickState();
            return;
        }

        // Toque generico no lado direito = pular
        if (x >= halfW) {
            jumpBtn.touching = true;
            jumpBtn.touchId = touch.identifier;
            this.jumpPressed = true;
            if (isStart) this.jumpJustPressed = true;
        }
    }

    processTouchMove(touch) {
        if (touch.identifier === this.joystick.touchId) {
            const { x, y } = this.getCanvasPos(touch);

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
            // Voltar stick pro centro
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
        const deadzone = this.joystick.radius * 0.2;

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

        // Joystick base
        ctx.globalAlpha = 0.2;
        ctx.beginPath();
        ctx.arc(this.joystick.baseX, this.joystick.baseY, this.joystick.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#fff';
        ctx.fill();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Joystick stick
        ctx.globalAlpha = this.joystick.touching ? 0.7 : 0.4;
        ctx.beginPath();
        ctx.arc(this.joystick.stickX, this.joystick.stickY, 24, 0, Math.PI * 2);
        ctx.fillStyle = '#fff';
        ctx.fill();

        // Setas indicadoras no joystick
        ctx.globalAlpha = 0.3;
        ctx.fillStyle = '#fff';
        ctx.font = '18px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('<', this.joystick.baseX - 30, this.joystick.baseY);
        ctx.fillText('>', this.joystick.baseX + 30, this.joystick.baseY);

        // Botao pular
        const jumpBtn = this.buttons.jump;
        ctx.globalAlpha = jumpBtn.touching ? 0.55 : 0.3;
        ctx.beginPath();
        ctx.arc(jumpBtn.x, jumpBtn.y, jumpBtn.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#3498db';
        ctx.fill();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.globalAlpha = jumpBtn.touching ? 0.9 : 0.6;
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 15px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('PULO', jumpBtn.x, jumpBtn.y);

        // Botao socar
        const punchBtn = this.buttons.punch;
        ctx.globalAlpha = punchBtn.touching ? 0.55 : 0.3;
        ctx.beginPath();
        ctx.arc(punchBtn.x, punchBtn.y, punchBtn.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#e74c3c';
        ctx.fill();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.globalAlpha = punchBtn.touching ? 0.9 : 0.6;
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 13px monospace';
        ctx.fillText('SOCO', punchBtn.x, punchBtn.y);

        ctx.restore();
    }
}
