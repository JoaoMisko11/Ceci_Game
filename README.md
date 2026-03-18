# Ceci Game

Jogo de plataforma 2D para web, feito com HTML5 Canvas e JavaScript puro.

## Como Rodar

> **IMPORTANTE:** Nao funciona abrir o `index.html` direto no navegador (duplo clique).
> O projeto usa ES6 modules, que exigem um servidor HTTP local.

### Jeito mais rapido (escolha UM):

**Se voce tem Node.js instalado:**
```bash
cd Ceci_Game
npx serve .
```
Acesse `http://localhost:3000` no navegador.

**Se voce tem Python instalado:**
```bash
cd Ceci_Game
python3 -m http.server 8000
```
Acesse `http://localhost:8000` no navegador.

**Se voce usa VSCode:**
1. Instale a extensao [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer)
2. Clique com botao direito no `index.html` → "Open with Live Server"

### Nao tem Node.js nem Python?

Instale o Node.js em https://nodejs.org (basta baixar e instalar, depois rodar `npx serve .` na pasta do projeto).

## Como Jogar

### Controles

| Tecla | Acao |
|-------|------|
| Setas / WASD | Mover |
| Espaco / Seta cima | Pular |
| X / Z | Soco |

## Funcionalidades

- 3 personagens selecionaveis (Luna, Mei, Leo)
- 3 fases com dificuldade progressiva (tutorial, avancado, aquatico)
- Seletor de fases com progresso salvo
- Inimigos terrestres, voadores e nadadores com IA de patrulha
- Plataformas moveis e quebraveis
- Zonas de agua com fisica aquatica
- Power-ups temporarios (velocidade, pulo duplo)
- Mecanica de soco para atacar inimigos
- Efeitos sonoros sintetizados via Web Audio API
- Sistema de particulas (poeira, brilho, explosoes)
- Background com parallax (ceu, estrelas, montanhas)
- Tela de titulo, selecao de personagem, HUD, game over e vitoria
- Progresso salvo automaticamente (localStorage)
- PWA — instalavel e funciona offline

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
