// === Dados Visuais dos Personagens ===
// Cores e metadata de cada skin extraidas do renderer

export const SKINS = [
    {
        name: 'Luna',
        desc: 'Menina Loira',
        colors: {
            hair: '#f4d03f',
            body: '#e91e8b',         // vestido rosa
            skin: '#fdebd0',
            bow: '#ff69b4',
            eyeIris: '#27ae60',      // olhos verdes
            mouth: '#e74c3c',
            shoes: '#8e44ad'         // sapatilhas roxas
        },
        face: { mouthX: 12, mouthW: 4 }
    },
    {
        name: 'Mei',
        desc: 'Menina Chanel',
        colors: {
            hair: '#2c3e50',
            body: '#3498db',         // blusa azul
            shorts: '#2c3e50',
            skin: '#f5cba7',
            eyeIris: '#8b4513',      // olhos castanhos
            mouth: '#e74c3c',
            shoes: '#ecf0f1'         // tenis brancos
        },
        face: { mouthX: 12, mouthW: 4 }
    },
    {
        name: 'Leo',
        desc: 'Cavaleiro de Rodas',
        colors: {
            hair: '#8b6914',
            body: '#27ae60',         // camiseta verde
            skin: '#f5b041',
            eyeIris: '#2c3e50',
            mouth: '#c0392b',
            wheelchair: '#7f8c8d',
            wheelStroke: '#566573',
            sword: {
                blade: '#bdc3c7',
                shine: 'rgba(255, 255, 255, 0.4)',
                guard: '#f39c12',
                handle: '#c0392b'
            }
        },
        face: { mouthX: 11, mouthW: 6 }
    }
];

// Cores compartilhadas entre todas as skins
export const SHARED_COLORS = {
    eyeWhite: '#fff',
    punchArm: '#fdebd0',
    punchFist: '#f39c12',
    punchFistInner: '#e67e22'
};
