import { Game } from './game.js';

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        if (game) game.resize();
    }

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const game = new Game(canvas, ctx);

    window.addEventListener('resize', resize);
    window.addEventListener('keydown', (e) => game.handleKey(e.code));

    // Tap para navegar menus no mobile
    canvas.addEventListener('touchstart', (e) => {
        if (e.touches.length === 1) {
            const touch = e.touches[0];
            const x = touch.clientX * (canvas.width / canvas.clientWidth);
            const y = touch.clientY * (canvas.height / canvas.clientHeight);
            game.handleTap(x, y);
        }
    });

    game.start();
});
