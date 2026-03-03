export class Input {
    constructor() {
        this.keys = {};
        this.justPressed = {};

        window.addEventListener('keydown', (e) => {
            if (!this.keys[e.code]) {
                this.justPressed[e.code] = true;
            }
            this.keys[e.code] = true;
        });

        window.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });
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
        return this.isPressed('ArrowLeft') || this.isPressed('KeyA');
    }

    get right() {
        return this.isPressed('ArrowRight') || this.isPressed('KeyD');
    }

    get jump() {
        return this.isPressed('ArrowUp') || this.isPressed('KeyW') || this.isPressed('Space');
    }

    get jumpPressed() {
        return this.wasJustPressed('ArrowUp') || this.wasJustPressed('KeyW') || this.wasJustPressed('Space');
    }

    get punchPressed() {
        return this.wasJustPressed('KeyX') || this.wasJustPressed('KeyZ');
    }
}
