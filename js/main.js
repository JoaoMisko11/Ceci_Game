import { Game } from './game.js';

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    if (!canvas) {
        console.error('Canvas element #gameCanvas nao encontrado');
        return;
    }
    const ctx = canvas.getContext('2d');
    if (!ctx) {
        console.error('Nao foi possivel obter contexto 2D do canvas');
        return;
    }

    // AbortController para listeners do main
    const ac = new AbortController();

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        if (game) game.resize();
    }

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const game = new Game(canvas, ctx);

    window.addEventListener('resize', resize, { signal: ac.signal });
    window.addEventListener('keydown', (e) => game.handleKey(e.code), { signal: ac.signal });

    // Tap para navegar menus no mobile
    canvas.addEventListener('touchstart', (e) => {
        if (e.touches.length === 1) {
            const touch = e.touches[0];
            const x = touch.clientX * (canvas.width / canvas.clientWidth);
            const y = touch.clientY * (canvas.height / canvas.clientHeight);
            game.handleTap(x, y);
        }
    }, { signal: ac.signal });

    game.start();
});
