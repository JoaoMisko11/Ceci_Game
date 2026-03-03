# Ceci Game

Jogo de plataforma 2D para web usando HTML5 Canvas e JavaScript puro.

## Stack

- **Linguagem:** JavaScript (ES6+)
- **Renderizacao:** HTML5 Canvas API
- **Estrutura:** Vanilla JS, sem frameworks
- **Plataforma:** Navegador web

## Estrutura do Projeto

```
Ceci_Game/
├── index.html          # Pagina principal
├── css/
│   └── style.css       # Estilos
├── js/
│   ├── main.js         # Entry point e game loop
│   ├── game.js         # Classe principal do jogo
│   ├── player.js       # Logica do jogador
│   ├── level.js        # Sistema de fases
│   ├── platform.js     # Plataformas e colisoes
│   ├── input.js        # Captura de input (teclado)
│   ├── camera.js       # Camera e viewport
│   └── renderer.js     # Renderizacao no canvas
├── assets/
│   ├── sprites/        # Sprites e spritesheets
│   ├── audio/          # Sons e musica
│   └── levels/         # Dados dos niveis (JSON)
├── CLAUDE.md           # Instrucoes para o Claude
└── implementation.md   # Plano de implementacao
```

## Convencoes

- Codigo e comentarios em **portugues** quando possivel
- Nomes de variaveis e funcoes em **ingles** (camelCase)
- Classes em **PascalCase**
- Constantes em **UPPER_SNAKE_CASE**
- Um arquivo por classe/modulo
- Usar ES6 modules (`import`/`export`)

## Comandos

- Abrir `index.html` no navegador para testar
- Usar Live Server (extensao do VSCode) para hot reload

## Workflow

- **Antes de iniciar qualquer tarefa:** ler o arquivo `implementation.md` para entender o estado atual do projeto e o que precisa ser feito
- **Ao concluir uma tarefa:** atualizar o arquivo `implementation.md` marcando os itens finalizados (`[x]`) e adicionando notas relevantes se necessario
- **Ao atualizar o codigo:** sempre atualizar o arquivo `diagrama-projeto.html` para refletir as mudancas feitas no codigo

## Regras

- Manter o codigo simples e legivel
- Nao usar bibliotecas externas a menos que necessario
- Priorizar performance no game loop (60 FPS)
- Separar logica de jogo da renderizacao
