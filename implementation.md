# Plano de Implementacao - Ceci Game

Jogo de plataforma 2D para web com HTML5 Canvas.

## Fase 1 - Fundacao ✅

- [x] Criar `index.html` com canvas responsivo
- [x] Criar `css/style.css` com reset e layout fullscreen
- [x] Criar `js/main.js` com game loop (requestAnimationFrame)
- [x] Criar `js/game.js` com classe Game (init, update, render)

## Fase 2 - Jogador ✅

- [x] Criar `js/player.js` com classe Player
  - [x] Posicao, velocidade, dimensoes
  - [x] Gravidade e fisica basica
  - [x] Movimento horizontal (esquerda/direita)
  - [x] Pulo com gravidade
  - [x] Renderizacao (retangulo colorido inicialmente)
- [x] Criar `js/input.js` com sistema de input (teclado)
  - [x] Setas ou WASD para mover
  - [x] Espaco ou seta pra cima para pular

## Fase 3 - Plataformas e Colisao ✅

- [x] Criar `js/platform.js` com classe Platform
- [x] Implementar deteccao de colisao (AABB)
- [x] Colisao com chao e plataformas
- [x] Impedir jogador de atravessar plataformas
- [x] Colisao lateral com paredes

## Fase 4 - Camera e Nivel ✅

- [x] Criar `js/camera.js` com camera que segue o jogador
- [x] Criar `js/level.js` com sistema de fases
- [x] Carregar nivel de dados JSON
- [x] Criar primeiro nivel de teste (`assets/levels/level1.json`)
- [x] Limites do mapa (jogador nao sai da tela)

## Fase 5 - Elementos de Jogo ✅

- [x] Itens coletaveis (moedas, estrelas, etc.)
- [x] Inimigos basicos (movimento patrulha)
- [x] Colisao jogador-inimigo (dano/morte)
- [x] Colisao jogador-item (coleta)
- [x] Sistema de vidas / game over

## Fase 6 - Visual e Audio ✅

- [x] Criar `js/renderer.js` para renderizacao organizada
- [x] Substituir retangulos por desenho procedural (jogador, inimigos, itens)
- [x] Animacoes do jogador (idle, andar, pular) — procedurais via Canvas API
- [x] Parallax no background (ceu gradiente, estrelas, montanhas em 2 camadas)
- [x] Efeitos sonoros sintetizados via Web Audio API (pulo, coleta, dano, kill, game over)
- [ ] Musica de fundo (pendente — requer composicao ou arquivo externo)

## Fase 7 - UI e Polish ✅

- [x] Tela de titulo / menu (com titulo flutuante e instrucoes)
- [x] HUD (coracoes para vidas, pontuacao, nome da fase)
- [x] Tela de game over (com pontuacao e restart)
- [x] Tela de vitoria (ao coletar todos os itens)
- [x] Sistema de estados (TITLE -> CHARACTER_SELECT -> PLAYING -> GAME_OVER/VICTORY)
- [x] Tela de selecao de personagem (3 skins: Luna, Mei, Leo)
- [x] Efeitos de particulas (poeira ao pular/aterrissar, brilho ao coletar, explosao ao matar)

## Fase 8 - Conteudo ✅

- [x] Criar mais fases com dificuldade progressiva (Fase 2 com buracos, mais inimigos voadores)
- [x] Novos tipos de plataformas (moveis com setas, quebraveis com rachaduras)
- [x] Novos tipos de inimigos (voador com asas animadas e flutuacao)
- [x] Power-ups (velocidade 8s, pulo duplo 10s) com timer no HUD
- [x] Sistema de progressao entre fases (ENTER na vitoria avanca)
- [x] Fase 3 com zonas de agua e inimigos nadadores (swimmer)
- [x] Fase 4 — Oceano Profundo (fase inteira submersa, peixes inimigos, boss polvo)
- [x] Boss fight: polvo gigante com 5 vidas, 3 fases de dificuldade, ataque de tinta

## Fase 8.5 - Mecanica de Soco ✅

- [x] Input de soco (teclas X / Z)
- [x] Estado de soco no jogador (duracao, cooldown, hitbox)
- [x] Colisao do soco com inimigos (mata inimigo, +150 pontos)
- [x] Animacao do soco (braco + punho estendido na direcao do jogador)
- [x] Som do soco (sintetizado via Web Audio API)
- [x] Particulas de impacto ao acertar inimigo
- [x] Instrucoes atualizadas na tela de titulo

## Fase 9 - Checkpoints e Persistencia

- [ ] Sistema de checkpoints (bandeiras/totens que salvam progresso na fase)
- [ ] Respawn no ultimo checkpoint ao morrer (em vez de reiniciar a fase)
- [x] Salvar progresso no `localStorage` (fases desbloqueadas, recorde, skin)
- [x] Carregar save ao abrir o jogo (progresso restaurado automaticamente)
- [x] Seletor de fases (tela com cards, fases bloqueadas/desbloqueadas)
- [x] Game Over: R para tentar novamente a mesma fase, ESC para seletor
- [x] Sistema de 3 slots de save independentes (continuar jogo existente ou iniciar novo)
- [x] Tela de selecao de save com preview (personagem, fases, recorde, data)
- [x] Migracao automatica do formato antigo para slot 0
- [x] Apagar save individual (DEL/Backspace com confirmacao)

## Fase 10 - Mecanicas Avancadas de Movimento

- [ ] Wall slide (escorregar na parede ao encostar)
- [ ] Wall jump (pular da parede)
- [ ] Dash horizontal (com cooldown)
- [ ] Coyote time (pular poucos frames apos sair da plataforma)
- [ ] Jump buffering (registrar pulo antes de aterrissar)

## Fase 11 - Hazards e Ambiente Interativo

- [x] Agua (desacelera movimento, pulo mais fraco, nado com pulos repetidos)
- [ ] Lava/espinhos (dano instantaneo ao toque)
- [ ] Trampolins (impulso vertical extra)
- [ ] Alavancas/botoes que abrem portas ou ativam plataformas
- [ ] Plataformas que caem apos pisar

## Fase 12 - Boss Fight ✅ (parcial)

- [x] Sistema de boss com fases (padrao de ataque muda conforme perde vida)
- [x] Barra de vida do boss no topo da tela
- [x] Arena fechada (paredes laterais na area do boss)
- [x] Projeteis que o boss dispara (tinta) e o jogador desvia
- [ ] Boss da Fase 2 diferente do da Fase 1 (futuro)

## Fase 13 - Sprites e Arte Final

- [ ] Spritesheet para o jogador (idle, correr, pular, dash, dano)
- [ ] Sprites para inimigos e bosses
- [ ] Tileset para plataformas e cenario (em vez de retangulos)
- [ ] Tilesheet para background com parallax real
- [ ] Animacoes de transicao entre fases (fade in/out)

## Fase 14 - Mobile e Acessibilidade ✅ (parcial)

- [x] Controles touch (joystick virtual + botoes de acao)
- [x] Detectar dispositivo e alternar entre teclado/touch
- [x] Redimensionamento responsivo do canvas
- [x] Navegacao por toque nos menus (titulo, selecao, game over, vitoria)
- [x] Instrucoes adaptativas (mostram controles touch ou teclado conforme o dispositivo)
- [ ] Pause ao perder foco da aba/janela
- [ ] Configuracoes (volume, dificuldade, remapear teclas)

## Fase 15 - PWA (Progressive Web App) ✅

- [x] Criar `manifest.json` (nome, icones, display fullscreen, orientacao landscape)
- [x] Criar `sw.js` — Service Worker com cache-first para funcionamento offline
- [x] Gerar icones PWA (192x192 e 512x512)
- [x] Atualizar `index.html` com meta tags PWA, link do manifest e registro do SW
- [x] Suporte a Apple Web App (meta tags apple-mobile-web-app)
- [ ] Testar instalacao em dispositivo real

## Fase 16 - Qualidade e Seguranca (parcial)

### Fase 16.1 - Correcoes Criticas ✅

- [x] Corrigir bug do punch timer (`===` para `>=` com tolerancia de dt) em `game.js`
- [x] Documentar logica de desbloqueio de fases (`+2` e conversao 0-based para 1-based) em `game.js`
- [x] Validar dados do localStorage com type checking em `game.js:loadSave()`
- [x] Adicionar Content Security Policy (CSP) no `index.html`
- [x] Corrigir service worker: error handling individual por asset, fallback offline, cache v4
- [x] Remover codigo morto: `enemy.render()`, `item.render()`, `platform.platformVx`
- [x] Adicionar error handling no `Level.load()` (validacao de resposta e campos obrigatorios)
- [x] Adicionar error handling na inicializacao do canvas em `main.js`
- [x] Adicionar try-catch no `loadLevel()` em `game.js`

### Fase 16.2 - Extrair Constantes ✅

- [x] Criar `js/constants.js` com constantes de gameplay (fisica, pontuacao, inimigos, boss, plataformas, timers, colisao)
- [x] Criar `js/skins-data.js` com definicoes visuais dos personagens (cores e metadata das 3 skins)
- [x] Substituir magic numbers por constantes nomeadas em player.js, enemy.js, platform.js, item.js, powerup.js, particles.js, game.js e renderer.js

### Fase 16.3 - Refatorar God Class (game.js) ✅

- [x] Extrair `js/save-manager.js` — classe SaveManager com load/save/delete, validacao de tipos e desbloqueio de fases
- [x] Extrair `js/collision.js` — funcoes de colisao: soco, plataformas, itens, power-ups, inimigos, tinta, queda e vitoria
- [x] Extrair `js/menu-renderer.js` — renderizacao de titulo, selecao de personagem/fase, HUD, game over, vitoria e boss victory
- [x] game.js refatorado: orquestra game loop e estados, delegando responsabilidades aos modulos extraidos

### Fase 16.4 - Testes ✅

- [x] Configurar Vitest (vitest.config.js, package.json)
- [x] Testes unitarios: camera (5), player (15), platform (12), enemy (15), item (9)
- [x] Testes unitarios: save-manager (11), collision (17) com mocks de audio
- [x] Total: 87 testes passando em 7 arquivos

### Fase 16.5 - Performance ✅

- [x] Spatial hashing para colisao (js/spatial-grid.js — grade 128px para plataformas)
- [x] Object pooling para particulas (pool pre-alocado de 512, swap-and-pop no update)
- [x] Cache de gradientes no renderer (background e water gradients cacheados)
- [x] Cleanup de event listeners (AbortController em Input, TouchControls, main.js)

### Fase 16.6 - Reduzir Duplicacao no Renderer ✅

- [x] Funcao `drawFace()` compartilhada — desenha rosto, olhos e boca para todas as skins
- [x] Parametrizar offsets via `face` config em skins-data.js (mouthX, mouthW por skin)

---

## Notas Tecnicas

### Game Loop
```
requestAnimationFrame -> calcular deltaTime -> update(dt) -> render(ctx)
```

### Fisica Simplificada
- Gravidade constante aplicada a cada frame
- Velocidade terminal para limitar queda
- Friccao horizontal para desacelerar

### Colisao AABB
```
Dois retangulos colidem se:
  A.x < B.x + B.w &&
  A.x + A.w > B.x &&
  A.y < B.y + B.h &&
  A.y + A.h > B.y
```

### Estrutura de Nivel (JSON)
```json
{
  "name": "Fase 1",
  "width": 3200,
  "height": 600,
  "platforms": [
    { "x": 0, "y": 550, "w": 3200, "h": 50 },
    { "x": 300, "y": 400, "w": 200, "h": 20 }
  ],
  "playerStart": { "x": 50, "y": 500 },
  "items": [],
  "enemies": []
}
```
