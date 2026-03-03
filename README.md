# Ceci Game

Jogo de plataforma 2D para web, feito com HTML5 Canvas e JavaScript puro.

## Como Jogar

Abra o `index.html` no navegador ou use um servidor local (ex: Live Server no VSCode).

### Controles

| Tecla | Acao |
|-------|------|
| Setas / WASD | Mover |
| Espaco / Seta cima | Pular |
| X / Z | Soco |

## Funcionalidades

- 3 personagens selecionaveis (Luna, Mei, Leo)
- 2 fases com dificuldade progressiva
- Inimigos terrestres e voadores com IA de patrulha
- Plataformas moveis e quebraveis
- Power-ups temporarios (velocidade, pulo duplo)
- Mecanica de soco para atacar inimigos
- Efeitos sonoros sintetizados via Web Audio API
- Sistema de particulas (poeira, brilho, explosoes)
- Background com parallax (ceu, estrelas, montanhas)
- Tela de titulo, selecao de personagem, HUD, game over e vitoria

## Stack

- **JavaScript** (ES6 modules)
- **HTML5 Canvas API**
- **Web Audio API**
- Sem frameworks ou bibliotecas externas

## Estrutura

```
Ceci_Game/
├── index.html
├── css/style.css
├── js/
│   ├── main.js         # Entry point e game loop
│   ├── game.js         # Orquestrador e maquina de estados
│   ├── player.js       # Jogador (movimento, pulo, soco)
│   ├── enemy.js        # Inimigos (patrulha, voador)
│   ├── item.js         # Coletaveis (moedas, estrelas)
│   ├── powerup.js      # Power-ups temporarios
│   ├── platform.js     # Plataformas e colisao AABB
│   ├── level.js        # Carregamento de fases
│   ├── camera.js       # Camera com limites do mapa
│   ├── input.js        # Captura de teclado
│   ├── renderer.js     # Renderizacao e skins
│   ├── audio.js        # Sons sintetizados
│   └── particles.js    # Sistema de particulas
└── assets/levels/      # Dados das fases (JSON)
```
