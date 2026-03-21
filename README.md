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

### Mobile (Touch)

- **Joystick virtual** (lado esquerdo) — mover
- **Botao A** — pular
- **Botao B** — soco

## Funcionalidades

- 3 personagens selecionaveis (Luna, Mei, Leo)
- 4 fases com dificuldade progressiva (tutorial, avancado, profundezas, oceano profundo)
- Boss final na fase 4 (polvo) com animacao de vitoria epica
- Seletor de fases com progresso salvo
- Inimigos terrestres, voadores e nadadores com IA de patrulha
- Plataformas moveis e quebraveis
- Zonas de agua com fisica aquatica
- Power-ups temporarios (velocidade, pulo duplo)
- Mecanica de soco para atacar inimigos
- Controles touch para mobile (joystick virtual e botoes de acao)
- Efeitos sonoros sintetizados via Web Audio API
- Sistema de particulas (poeira, brilho, explosoes, fogos de artificio)
- Background com parallax (ceu, estrelas, montanhas)
- Tela de titulo, selecao de personagem, HUD, game over e vitoria
- Progresso salvo automaticamente (localStorage)
- PWA — instalavel e funciona offline

## Jogar Online

O jogo esta publicado via GitHub Pages:

**https://joaomisko11.github.io/Ceci_Game/**

Basta abrir o link no navegador (desktop ou celular).

## Instalar como App (PWA)

O Ceci Game e uma Progressive Web App — pode ser instalado no celular ou desktop e funciona offline.

### Android (Chrome)
1. Abra o link do jogo no Chrome
2. Toque nos 3 pontinhos (menu) → **"Instalar app"** (ou aguarde o banner automatico)
3. O jogo aparece na sua tela inicial como um app

### iPhone / iPad (Safari)
1. Abra o link do jogo no Safari
2. Toque no botao de compartilhar (icone ↑)
3. Toque em **"Adicionar a Tela de Inicio"**
4. Confirme tocando em **"Adicionar"**

### Desktop (Chrome / Edge)
1. Abra o link do jogo no navegador
2. Clique no icone de instalacao (⊕) na barra de endereco
3. Confirme a instalacao

Depois de instalado, o jogo abre em tela cheia e funciona mesmo sem internet.

## Deploy (GitHub Pages)

O projeto esta configurado para deploy automatico via GitHub Pages. Qualquer push na branch `main` atualiza o site.

### Como foi configurado
1. Repositorio tornado publico (GitHub Pages gratuito exige repo publico)
2. GitHub Pages ativado em **Settings → Pages → Source: main, pasta /**
3. Arquivos PWA adicionados ao projeto:
   - `manifest.json` — metadados do app (nome, icones, orientacao, tema)
   - `sw.js` — Service Worker que faz cache de todos os arquivos para funcionar offline
   - `icons/` — icones do app em 192x192 e 512x512

### Como atualizar o site
```bash
git add .
git commit -m "sua mensagem"
git push origin main
```
O deploy leva cerca de 1-2 minutos para ficar disponivel.

### Como atualizar o cache offline
Se voce alterou arquivos do jogo, incremente a versao do cache no `sw.js`:
```js
// Mude 'ceci-game-v1' para 'ceci-game-v2', etc.
const CACHE_NAME = 'ceci-game-v2';
```
Isso forca os dispositivos que ja instalaram a baixar os arquivos atualizados.

## Stack

- **JavaScript** (ES6 modules)
- **HTML5 Canvas API**
- **Web Audio API**
- Sem frameworks ou bibliotecas externas

## Estrutura

```
Ceci_Game/
├── index.html          # Pagina principal
├── manifest.json       # Web App Manifest (PWA)
├── sw.js               # Service Worker (cache offline)
├── css/style.css
├── icons/              # Icones do PWA (192 e 512)
├── js/
│   ├── main.js         # Entry point e game loop
│   ├── game.js         # Orquestrador e maquina de estados
│   ├── constants.js    # Constantes de gameplay
│   ├── skins-data.js   # Dados visuais dos personagens
│   ├── save-manager.js # Persistencia (localStorage)
│   ├── collision.js    # Sistema de colisao
│   ├── spatial-grid.js # Grade espacial (performance)
│   ├── menu-renderer.js# Renderizacao de menus e HUD
│   ├── player.js       # Jogador (movimento, pulo, soco)
│   ├── enemy.js        # Inimigos (patrulha, voador, nadador, boss)
│   ├── item.js         # Coletaveis (moedas, estrelas)
│   ├── powerup.js      # Power-ups temporarios
│   ├── platform.js     # Plataformas e colisao AABB
│   ├── level.js        # Carregamento de fases
│   ├── camera.js       # Camera com limites do mapa
│   ├── input.js        # Captura de teclado
│   ├── touch.js        # Controles touch (mobile)
│   ├── renderer.js     # Renderizacao e skins
│   ├── audio.js        # Sons sintetizados
│   └── particles.js    # Sistema de particulas
├── tests/              # Testes unitarios (vitest)
└── assets/levels/      # Dados das fases (JSON)
```
