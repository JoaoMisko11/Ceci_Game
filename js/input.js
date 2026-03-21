export class Input {
    constructor() {
        this.keys = {};
        this.justPressed = {};

        // Touch state (preenchido pelo TouchControls)
        this.touch = null;

        // AbortController para cleanup de listeners
        this._ac = new AbortController();

        window.addEventListener('keydown', (e) => {
            if (!this.keys[e.code]) {
                this.justPressed[e.code] = true;
            }
            this.keys[e.code] = true;
        }, { signal: this._ac.signal });

        window.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        }, { signal: this._ac.signal });
    }

    isPressed(code) {
        return this.keys[code] === true;
    }

    wasJustPressed(code) {
        return this.justPressed[code] === true;
    }

    // Chamar no final de cada frame para limpar justPressed
    endFrame() {
        this.justPressed = {};
    }

    get left() {
        return this.isPressed('ArrowLeft') || this.isPressed('KeyA') ||
            (this.touch && this.touch.leftPressed);
    }

    get right() {
        return this.isPressed('ArrowRight') || this.isPressed('KeyD') ||
            (this.touch && this.touch.rightPressed);
    }

    get jump() {
        return this.isPressed('ArrowUp') || this.isPressed('KeyW') || this.isPressed('Space') ||
            (this.touch && this.touch.jumpPressed);
    }

    get jumpPressed() {
        return this.wasJustPressed('ArrowUp') || this.wasJustPressed('KeyW') || this.wasJustPressed('Space') ||
            (this.touch && this.touch.jumpJustPressed);
    }

    get punchPressed() {
        return this.wasJustPressed('KeyX') || this.wasJustPressed('KeyZ') ||
            (this.touch && this.touch.punchJustPressed);
    }

    destroy() {
        this._ac.abort();
    }
}
