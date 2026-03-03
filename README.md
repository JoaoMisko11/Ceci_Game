# Ceci Game

Jogo de plataforma 2D para web, feito com HTML5 Canvas e JavaScript puro.

## Como Rodar

O projeto usa ES6 modules, entao precisa de um servidor local (abrir o HTML direto no navegador nao funciona).

**Opcao 1 — Live Server (VSCode):**
1. Instale a extensao [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer)
2. Clique com botao direito no `index.html` → "Open with Live Server"

**Opcao 2 — npx (sem instalar nada):**
```bash
npx serve .
```
Acesse `http://localhost:3000` no navegador.

**Opcao 3 — Python:**
```bash
python3 -m http.server 8000
```
Acesse `http://localhost:8000` no navegador.

## Como Jogar

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
