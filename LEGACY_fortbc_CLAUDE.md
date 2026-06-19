# CLAUDE.md — Contexto do Projeto fortbc

> Este arquivo é lido automaticamente pelo Claude Code ao iniciar. Mantém o contexto do projeto entre sessões. Atualize-o quando decisões importantes mudarem.
> **Sempre atualize este arquivo ao final de cada sessão de trabalho.**

## 🎯 O que é

**Batalha dos Amigos** (repo: `fortbc`) é um jogo de cartas de batalha **por turnos** (estilo Yu-Gi-Oh! Forbidden Memories), single-file HTML. As cartas-herói são feitas a partir de fotos de 10 amigos reais, com habilidades humorísticas personalizadas. Tom: engraçado, adulto, referências a álcool e cultura de amigos.

> **v5 (2026-06-12):** Jogo completamente reescrito de real-time lanes → turn-based. Engine antigo (lanes/ATB) removido. Ver seção "Arquitetura" abaixo.

- **Plataforma:** navegador (single-file `index.html`, sem build, sem servidor)
- **Persistência atual:** `localStorage` (scores e níveis de carta)
- **Hospedagem de assets:** GitHub raw (`raw.githubusercontent.com/Guilherme-Moliner/fortbc/main/assets/`) com fallback base64 embutido
- **Repo:** https://github.com/Guilherme-Moliner/fortbc
- **Jogo online:** https://guilherme-moliner.github.io/fortbc/

## 🗂️ Estrutura do repositório

```
fortbc/
├── index.html          # o jogo completo (single-file, ~300KB com base64 fallback)
├── CLAUDE.md           # este arquivo
├── POLISH.md           # backlog de polish v5.1 + briefing p/ discussão no chat
├── README.md
├── ASSETS.md
├── GAME_DESIGN.md      # mecânicas v5 turn-based (ATUAL)
├── gamedesignfort.md   # ⚠️ LEGADO — design v4 Fort Condor / real-time
├── GAME_DATA.md
├── GAME_DATA.csv       # fonte de verdade dos stats (edição manual, refletir em BASE_CARDS)
├── SETUP.md
└── assets/
    ├── heroes/         # arthur.png fanta.png garopaba.png bala.png
    │                   # nathan.png leo.png zaga.png vitao.png borba.png letti.png
    └── audio/          # MP3 (não OGG — melhor compat. cross-browser, inclusive iOS Safari)
```

## 🎮 Mecânicas-chave (v5 — Turn-Based)

### Tabuleiro
- **Jogador (BC):** 5 slots de monstro (4 normais + 1 Comandante) + 4 slots face-down + zona de campo + cemitério
- **IA (Floripa):** espelho do jogador
- **Base:** 2000 LP cada lado. Não há torres separadas — dano direto à base.

### Fases por turno (estilo YGO Forbidden Memories)
1. **DRAW** — ambos compram até o limite da mão (5 cartas). Deck out = derrota.
2. **STANDBY** — cartas em campo sobem de rank por turns survived.
3. **DOWN FASE** — cada lado baixa 1 carta simultaneamente (player escolhe, IA decide em segredo).
4. **LAST MINUTE** — fase de cartas rápidas (V1: auto-passa se não há quick-play).
5. **RESOLUÇÃO** — ATK total do campo ataca os slots do adversário em ordem (slot 1→2→3→4→CMD). Overflow vai para a base do adversário.

### Combate
- `sumAtk(field)` = soma de `getEffAtk(card)` para cada slot ocupado.
- `getEffAtk` = `atk × rankMult` onde rankMult = Bronze×1.0 / Prata×1.10 / Ouro×1.25.
- `applyDamageToField(totalAtk, field, grave)` — desconta HP slot a slot, envia mortos ao cemitério, retorna overflow.
- Se overflow > 0 → aplica na base inimiga.
- Simultâneo: player e IA resolvem ao mesmo tempo.
- Empate de bases (ambas chegam a 0): compare ATK em campo. Se igual, ambas ficam em 1 LP.

### Rank de cartas (turnsOnField)
- 0 turnos → 🥉 Bronze (×1.0)
- 2 turnos → 🥈 Prata (×1.10)
- 4 turnos → 🥇 Ouro (×1.25)

### Triângulo de tipos (mantido no código, sem efeito ativo no V1)
- `ATK` ⚔ / `DEF` 🛡 / `BAL` ⚖ — visível nas cartas, mecânica de vantagem a implementar.

### Constantes chave
- `HAND_LIMIT = 9` (TETO da mão) · `INITIAL_HAND = 5` (compra inicial; turno 2+ compra +1/turno acumulando até o teto)
- `BASE_HP = 2000` (LP de cada base)
- `PHASES = ['draw','standby','main','lastminute','resolution']`

### Roguelike (mantido)
- 3 fights, recompensa entre eles (level up / nova carta / buff de deck).
- Níveis: Bronze→Prata→Ouro→Platina→Esmeralda→Diamante (×1.0 a ×1.75), em localStorage.
- Dificuldades: Iniciante / Veterano / Mestre.

## 🎨 Sistema de VIBES (a implementar)

Vibes coexistem com o triângulo ATAQUE/DEFESA/EQUILÍBRIO — funcionam como tipos do Pokémon: cada carta tem tipo (triângulo) **e** vibe. Os nomes das vibes serão trocados pelo usuário para algo engraçado/adulto; as mecânicas e cores abaixo estão aprovadas.

| # | Cor | Tema | Mecânica passiva |
|---|---|---|---|
| 1 | 🟡 Amarelo | Festa/Energia | Regenera ATB extra em campo |
| 2 | 🔴 Vermelho | Força bruta | Bonus dano, vai ao herói mais próximo |
| 3 | 🔵 Azul | Controle/Cura | Cura aliados adjacentes |
| 4 | 🟣 Roxo | Caos/Debuff | Debuff aleatório ao morrer |
| 5 | 🟢 Verde | Sustain | Ganha stats progressivamente |

**Sinergia:** 2 cartas da mesma Vibe em campo → +10% stat relevante. 3+ → +20%.
**Items de Vibe:** efeito bônus se o player tiver ≥1 carta da Vibe em campo.
**Arapucas de Vibe:** bônus se ativadas por carta inimiga da mesma Vibe.

## 🧙 Heróis e habilidades

| Herói | Tipo | Range | Vibe | Habilidade |
|---|---|---|---|---|
| Arthur | ATAQUE | long | (a definir) | único herói long range |
| Fanta | EQUILÍBRIO | mid | (a definir) | Recycler: +1 ATB ao ser tributado |
| Garopaba | ATAQUE | melee | (a definir) | Morte heroica: +20% ATK aliados 10s ao morrer |
| Bala | DEFESA | melee | (a definir) | Provoker: atrai ataques |
| Nathan | DEFESA | melee | (a definir) | — |
| Léo | ATAQUE | melee | (a definir) | — |
| Zaga | EQUILÍBRIO | mid | (a definir) | — |
| Vitão | EQUILÍBRIO | mid | (a definir) | Healer: cura aliado ferido ao entrar |
| Borba | DEFESA | melee | (a definir) | — |
| Letti | ATAQUE | melee | (a definir) | Rusher: ignora unidades, vai direto à torre |

## 🃏 Novos cards planejados (a implementar)

### Itens — Debuffs
| Nome | Vibe | Custo | Efeito |
|---|---|---|---|
| Ressaca | 🟡 | 2 | Inimigo perde 40% velocidade por 8s |
| Dedinho Mindinho | 🟣 | 2 | Inimigo mais forte perde 30% ATK por 10s |
| Calúnia | 🟣 | 3 | Inimigo ataca aliados por 5s (confusão) |
| Joga Areia | 🔴 | 1 | Inimigo mais próximo perde 50% de range por 6s |
| Barraco | 🟣 | 4 | Todos inimigos em campo ficam lentos (−30%) por 4s |

### Peões de Vibe (1 por vibe, ★2, custo 2)
| Nome | Vibe | Tipo | Passiva |
|---|---|---|---|
| (nome a definir) 🎉 | 🟡 | ATAQUE | +0.2 ATB/s extra enquanto em campo |
| (nome a definir) ⚔️ | 🔴 | ATAQUE | +20% ATK, vai ao herói inimigo mais próximo |
| (nome a definir) 🌊 | 🔵 | DEFESA | Cura 15 HP/s aos aliados adjacentes. Mid range. |
| (nome a definir) 💀 | 🟣 | EQUILÍBRIO | Ao morrer: debuff aleatório no inimigo que o matou |
| (nome a definir) 🌿 | 🟢 | DEFESA | +5% ATK/HP a cada 10s em campo (empilha até 3x) |

### Arapucas (Armadilhas — novo tipo de carta)
| Nome | Vibe | Custo | Efeito ao ativar |
|---|---|---|---|
| Buraco na Pista | 🟡 | 2 | Para inimigo por 3s (bônus HYPE: 5s) |
| Emboscada | 🔴 | 3 | 2x dano no 1º inimigo (bônus: atinge todos da lane) |
| Rede | 🔵 | 2 | −60% velocidade 8s + cura aliado mais próximo |
| Praga | 🟢 | 3 | Drena 20 HP/s por 6s, transfere para aliado |
| Bomba de Fumaça | 🟣 | 3 | Todos inimigos da lane ficam melee por 5s |

## 🔊 Mapa de SFX (`assets/audio/sfx/`)

### UI
`ui_card_draw` · `ui_card_select` · `ui_cancel` · `ui_atb_full` · `ui_error` · `ui_click`

### Combate
`hit_melee` · `hit_mid` · `hit_long` · `unit_die` · `struct_hit` · `struct_destroy` · `base_hit` · `tower_retaliate`

### Invocação de heróis
`hero_arthur` · `hero_fanta` · `hero_garopaba` · `hero_bala` · `hero_nathan` · `hero_leo` · `hero_zaga` · `hero_vitao` · `hero_borba` · `hero_letti`

### Especiais
`special_recycler` · `special_deathbuff` · `special_provoker` · `special_healer` · `special_rusher`

### Arapucas & Itens
`trap_place` · `trap_trigger` · `item_heal` · `item_debuff` · `item_buff`

### Estado do jogo
`fight_win` · `fight_lose` · `reward` · `mode_turbo` · `mode_sudden`

## 🎵 Mapa de OST (`assets/audio/`)

| Arquivo | Quando toca | Estilo |
|---|---|---|
| `ost_menu.mp3` | Menu principal (loop) | ~100 BPM Pop/Funk |
| `ost_select.mp3` | Seleção de dificuldade/nome | ~75 BPM Ambient |
| `ost_preduel.mp3` | Tela pré-fight (~5s, stinger) | ~85 BPM tensão |
| `ost_battle1.mp3` | Fight 1 (loop) | ~130 BPM Rock/Electronic |
| `ost_battle2.mp3` | Fight 2 (loop) | ~145 BPM mais intenso |
| `ost_battle3.mp3` | Fight 3 final (loop) | ~155 BPM épico |
| `ost_sudden.mp3` | Morte Súbita (últimos 60s) | ~170 BPM Industrial |
| `ost_reward.mp3` | Tela de recompensa | ~90 BPM Lo-fi/Jazz |
| `ost_win.mp3` | Vitória final da run | ~120 BPM Triunfal |
| `ost_lose.mp3` | Derrota / Game Over | ~65 BPM Piano |
| `ost_scores.mp3` | Ranking/Highscores | ~80 BPM Ambient |

> Modo Turbo: variação pitch+speed +15% da trilha atual (dinâmico, sem arquivo novo).

## 🏗️ Arquitetura do código (index.html)

### Constantes e dados
- **`CARDS_CSV` → `BASE_CARDS`** (2026-06-14): a fonte única agora é o bloco de texto **`CARDS_CSV`** (CSV embutido no topo do script). `BASE_CARDS` é **gerado** por `parseCardsCSV()` no load. Editar SÓ o `CARDS_CSV`. `GAME_DATA.csv` é espelho. Schema 19 colunas (inclui `kind` e `vibe`). Linhas `#` = comentário. Ver `CONTEXT_CARDS.md`.
- **Bloco TUNING** (perto de `AI_DECKS`): `FIGHT_CURVE` (curva da IA por fight — Fight 1 fraco), `PLAYER_HAND_BONUS`, `VIBE_SYNERGY_ON`/`VIBE_SYN_2`/`VIBE_SYN_3`, `AI_DECKS[*].usesItems`. Todos editáveis p/ balancear.
- **Camada de efeitos turn-based** (2026-06-14): `G.mods{player,ai}` (atkMult/atkFlat/skip por turno, reset no DRAW), `G.nextHpBuff`. `computeFieldAtk(side)` = sumAtk × vibe × mods. Itens em `applyTurnItem()` (jogados na LAST MINUTE, valem só na resolução). Arapucas em `resolveTraps()`/`applyTrap()` (auto-disparam na resolução se o inimigo ataca).
- **Imagens de carta** (2026-06-14): coluna `img` no CSV → `cardImgSrc(card)` (img própria em `assets/cards/` > imagem de herói > emoji). Fallback via `imgFallback()`. Usado em `renderHand`/`renderFC`/`libImg`.
- **Deck Builder + coleção com quantidade** (2026-06-14): `Save.collection` virou mapa `{id:qtd}` (migração automática no `normalize`). Tela `deckbuilder` (menu "🃏 MEU BARALHO") monta o baralho que vai pro jogo; persiste em `Save.deck`. `buildPlayerDeck()` agora usa `Save.deck` (ou `autoDeckIds()` da coleção) em Roguelite **e** Duelo Livre. Constantes `DECK_SIZE=30`/`MIN_DECK=10`. Helpers: `Save.ownedQty/collectionIds/getDeck/setDeck`, `instOf/currentDeckIds/autoDeckIds`, `DB.*`/`renderDeckBuilder`.
- **Fusão (V0, 2026-06-16):** estilo YGO Forbidden Memories. Fonte única **`FUSIONS_CSV`** (logo após `BASE_CARDS`, espelho em `FUSIONS.csv`): `mode(general|specific),a,b,result,note`. Geral = par de **vibes**; específica = par de **ids** (prioridade). `parseFusions`→`FUSIONS`, `fusePair`/`resolveFusion` (encadeia 2–5, trava de ATK do FM), `bfDoFusion()` invoca no board (cap pela licença). Cartas-resultado = `kind:fusion`, `copies:0` (fora de deck/loja/recompensa). Detalhes e pendências em **`CONTEXT_FUSION.md`**.
- **`HERO_IMAGES_B64`** — fallback base64 dos 10 heróis embutido. **NÃO MODIFICAR.**
- **`preloadImages()`** — tenta GitHub raw, cai pro base64 se falhar (timeout 2.5s por imagem).
- **`HAND_LIMIT=9` (teto) + `INITIAL_HAND=5`, `BASE_HP=2000`, `PHASES=[...]`** — constantes do engine turn-based.
- **`AI_DECKS`** — configs de dificuldade (lvOverride, atkMult).

### Estado do jogo
- **`G`** — estado do fight atual:
  - `playerField[5]`, `aiField[5]` — slots 0-3 + slot 4 (Comandante)
  - `playerHidden[4]`, `aiHidden[4]` — slots face-down
  - `playerBase{hp,maxHp}`, `aiBase{hp,maxHp}` — LP das bases
  - `playerHand[]`, `aiHand[]`, `playerDeck[]`, `aiDeck[]`, `playerGrave[]`, `aiGrave[]`
  - `turn`, `phase`, `score`, `gameOver`
- **`APP`** — estado da run (nome, dificuldade, fightNum, totalScore, deck, extraHandSize).

### Engine turn-based (linhas ~930+, substituem o engine real-time antigo)
- **`initFight()`** → configura G, distribui mãos iniciais, chama `startPhase('draw')`
- **`startPhase(phase)`** → dispatcher de fases
- **`phaseDraw()`** → compra cartas
- **`phaseStandby()`** → rank-up de cartas em campo
- **`phaseMain()`** → player escolhe carta + slot; IA decide em segredo via `aiDecideMain()`
- **`confirmMain()`** → revela ambas as escolhas, chama `phaseLastMinute`
- **`phaseResolution()`** → `applyDamageToField()` para ambos os lados, verifica vitória
- **`endFight(winner)`** → atualiza APP, vai para recompensa ou fim

### UI
- **Palco fixo (UX, 2026-06-15):** todo o jogo vive num `<div id="stage">` de **resolução de design 1280×720 (16:9)**, escalado via `transform: scale()` e centralizado, com **letterbox**. Layout idêntico em qualquer proporção de janela. Bloco editável `const STAGE={W,H}` + `fitStage()` (recalcula `--stage-scale` no `resize`/`orientationchange`) — trocar W/H muda a proporção do jogo inteiro. CSS: `#stage` + `.screen{height:100%}`. `#fade`/`#msg-area`/`dmg-float` ficam fora do palco (cobrem a janela toda). Ver `CONTEXT_UX.md`.
- **Camada de JUICE (UX, 2026-06-15):** bloco editável `const JUICE={...}` (timings/toggles, `JUICE.on`=master switch) + helpers genéricos: `animateNumber()` (contagem easeOut, cancela anterior; usado em `updateBaseUI`/`addScore`), `playSFXPitch()` (SFX com `playbackRate`), `juiceShake/juiceFlash/juiceLand/juiceDie`. Resolução animada estilo Balatro em `resolveSequence()`/`tallySide()` (soma carta a carta + pitch + overlay `#resolve-overlay` ATK×ATK) → `resolveApply()` (async) mantém as mutações de estado originais. **Dano carta a carta:** `animateFieldDamage(defSide,totalAtk)` aplica dano na ordem dos slots (`.being-hit` + `floatCardDmg` + HP caindo + dissolução), antes da mutação real. Compra de carta anima via `.juice-draw` (tag `card._shown`). Mão: `.card.playable`/`.card.dimmed` por fase. Ver `CONTEXT_UX.md`.
- **Fase ITENS + recompensa contextual (UX, 2026-06-15):** "LAST MINUTE" renomeada **ITENS** (badge/faixa/hints) e **encerra ao usar 1 item** (`selectQuickCard`→`startPhase('resolution')`); só itens destacados na mão. `generateRewards()` reescrita: contextual ao baralho (`deckMonsterIds`/`dominantVibe`/`buffAffects`) — Evoluir só cartas do deck, Recrutar pela vibe dominante, Artefato só buffs que afetam o deck; chips UNIDADE×ARTEFATO. `BUFF_POOL` mais forte (+10/15/18%) e por tipo. **Fontes do tabuleiro aumentadas** (corrige disparidade carta grande × texto minúsculo).
- **Port do Campo de Batalha (UX, 2026-06-16):** tela de jogo reescrita a partir do mockup do Claude Design (`Campo de Batalha.dc.html`), engine intacto. Layout 3 colunas (identidade · board · trilho Inspetor/Log) escopado em `#screen-game` com vars `--bf-*`. 5 temas (`BF_THEMES`, `bfApplyTheme`, persist `fortbc_theme`). Mão em **leque** (`renderHand`/`bfLayoutHand`): hover destaca, **arrastar baixa** (`bfPlay`→`confirmMain`/`selectQuickCard`), **clicar marca fusão** (até 5, `bfDoFusion` STUB). Trilho recolhível com re-centro da mão (delta 0). Modais: settings/cemitério/deckmenu/decklist/desistir (`bfOpenModal`/`bfOpenGrave`/`bfRenderDeckList`). Comandante com glow `cmdPulse`. Ids do engine preservados (slots, hidden, turn-num, ps-*, score-display, deck/grave-count, action-bar) e `renderFC` mantém `.fc-*` → juice/resolução seguem funcionando. Ver `CONTEXT_UX.md` §10. **Ajustes leva 4b (2026-06-16):** pilhas Cemitério/Deck + barra de ação na **coluna esquerda** (leque em largura cheia); **arrastar pro slot específico** (`bfSlotAt`/`bfDropValid`/`bfPlay(i,at)`); slots de armadilha face-down reimplementados e dropáveis (`player-fd-N`, `selectQuickCard(idx,hiddenSlot)`); inspetor inspeciona cartas **visíveis do adversário** (`renderFC` `onclick`); **compra: 5 inicial, +1/turno até 9** (`INITIAL_HAND`/`HAND_LIMIT`). **Falta:** terreno real, fusão no engine, retratos, comandante-quebrado (sinal do engine).
- **Layout de cartas/campo (UX, 2026-06-15 leva 3):** faixa de fases movida pro `#topbar` (`#phase-track`), `#phase-banner` do meio removido (mais espaço vertical). **Cartas full-bleed:** imagem cobre o card todo (`.card-img`/`.fc-img` absolute inset:0), texto em overlay no rodapé com gradiente (sem fundo sólido), fontes maiores. **Field card portrait** (`aspect-ratio:.72`, absolute `top/bottom:0` no slot) — exigiu `.mslot{display:grid;place-items:center}` + `.monster-grid{grid-template-rows:1fr}` (senão a linha colapsa). **Botão direito** em carta (mão/campo) → `showCardDetail()` reusa `#card-viewer` (imagem `contain` completa + escala de progressão de tiers).
- **`updateFieldUI()`** → re-renderiza todos os slots (`renderFC()` por carta)
- **`updateBaseUI()`** → atualiza barras de LP e topbar
- **`renderHand()`** → re-renderiza a mão do player (clicável via `selectHandCard(idx)`)
- **`updatePhaseBanner/Badge()`** → atualiza indicador de fase
- **Telas (v5.1):** `loading → title → nameload → menu →{ campaign | runsetup | freeduel | library | password } → game → reward → end` (`showScreen()`).
  - `showScreen(id)` agora também seta `CUR` e chama `onScreenEnter(id)` (hook que inicializa cada tela).

### Sistema de Menu (v5.1 — polish, frente "Menus & Telas")
- **`title`** — logo + "PRESSIONE START" piscando; qualquer clique/tecla → `advanceTitle()` → `nameload`.
- **`Save`** (objeto) — persistência de **perfil** em `localStorage` (chave `fortbc_save`): `{name, created, lastPlayed, campaign, runs}`. Separado de `LS_SCORES`/`LS_LEVELS`. `cloudSync()` é **stub** preparado p/ camada 2 (Google Sheets via Apps Script) e camada 3 (OAuth).
- **`nameload`** — se `Save.has()`: mostra nome salvo + Continuar/Novo Jogo; senão: input de nome simples (`confirmNewName()`).
- **`menu`** — 5 opções em lista vertical; navegação por `VMenu` (cursor ↑↓/Enter + clique), estilo Forbidden Memories. `MENU_ACTIONS` mapeia cada opção a uma tela.
- **`runsetup`** — Roguelite: escolhe dificuldade → `startRoguelite()` (fluxo de 3 fights existente; `APP.mode='roguelite'`).
- **`freeduel`** — Duelo Livre: oponente + dificuldade → `startFreeDuel()` (1 fight, `APP.mode='free'`, `endFight` pula reward e vai direto ao `end`).
- **`password`** — `PASSWORD_DECKS` (códigos `BOTECO`, `HEROIS`) → carrega deck e inicia fight.
- **`library`** — `renderLibrary()` monta grid de `BASE_CARDS`; clique → `showCardViewer()` (modal `#card-viewer`).
- **`campaign`** — só esqueleto de stage-select (sem narrativa, conforme combinado).
- Teclado global: setas/Enter no `menu`/`campaign`, Esc volta; ignora quando foco está em `INPUT`.

### Economia / progressão (v5.1 — tabelas editáveis no topo do bloco MENU SYSTEM)
- **`VIBES`** — 5 vibes com nomes **provisórios** (`Os Festeiros`, `Os Brutamontes`, `Os Maestros`, `Os Caóticos`, `As Raízes`). O usuário vai trocar por nomes engraçados/adultos. Cores/temas seguem o quadro de VIBES do design.
- **`STARTER_DECKS` + `STARTER_BASE`** — deck inicial por vibe (ids de `BASE_CARDS`). Ao criar conta, o player escolhe 1 vibe na tela `deckselect`; isso vira `Save.collection` (= histórico/coleção do player).
- **`Save`** agora guarda: `vibe`, `collection[]`, `money` (início 300), `duels`, `license`, `campaign.chapter`, `pity{}`. `Save.normalize()` migra saves antigos. Helpers: `owns/addCard/addMoney/spend/recordDuel`.
- **Biblioteca = discovery:** mostra todas as cartas; só as de `Save.collection` são reveladas/clicáveis, o resto mostra verso ("não descoberta"). Adquirir carta (loja/futuro: em jogo) revela.
- **`OPPONENTS`** — Duelo Livre lista oponentes; `source:'campaign'` fica trancado até a KB de adversários (a ser criada pelo usuário).
- **Loja (`BOOSTERS`+`RARITY`):** gacha estilo Duel Links. `rarityRoll()` por peso; **pity** garante uma rara a cada N aberturas (`buyBooster`). Cartas vão pra `collection`.
- **Licença (`LICENSE_TIERS`):** nível de duelista evolui por nº de duelos; cada tier libera uma fusão (dupla→tripla→quádrupla→quíntupla). `recordDuel()` chamado em `endFight`. Mecânica de fusão em si ainda não implementada.
- **Dinheiro:** +50 por fight ganho (roguelite) / +30 (duelo livre), em `endFight`. Gasto na loja.
- **HUD inferior (`#menu-hud`):** só na tela `menu`. Nome, capítulo, dinheiro, licença, ⚙ (settings/volume), 🔐 login (stub camada 3).
- **Polish:** `showScreen` faz fade via `#fade` (~0.3s). `#menu-bg` = cartas dos heróis flutuando (`mountCardBg`), visível nas telas de menu. Volume persiste em `localStorage` `fortbc_vol` (`setVolume`).

### Áudio — OST + SFX (v5.1, frente "Áudio" — 2026-06-14)
> Detalhes completos em **`CONTEXT_AUDIO.md`**. Resumo:
- **Caminho relativo** `assets/audio/` (+ `sfx/`) — funciona no preview local e no GitHub Pages. **Não** usa GitHub raw pra áudio. **OST `.mp3`, SFX `.wav`** (`OST_EXT`/`SFX_EXT`).
- **OST:** `playOST(name)`/`stopOST()` com **crossfade ~600ms** em 2 canais `Audio`. `OST_BY_SCREEN` (tabela editável) + `ostForScreen(id)` (resolve `game` por `APP.fightNum`, `end` por `G.winner`). Troca automática centralizada em `onScreenEnter(id)`. Faixa igual à atual = no-op (não reinicia entre sub-telas).
- **SFX:** `playSFX(name)` fire-and-forget com **pool de 4 instâncias** por som; não interfere na OST. Ganchos ligados em draw/select/rank-up/baixar carta/resolução/vitória/derrota/reward/booster/menu (ver tabela no CONTEXT_AUDIO).
- **Volumes separados:** `musicVol` (`fortbc_vol`) e `sfxVol` (`fortbc_sfxvol`); 2 sliders no modal ⚙. `toggleMute` = mute geral.
- **Unlock iOS:** `unlockAudio()` no 1º gesto (`advanceTitle`, clique na `title`).
- **Preload + fallback:** `preloadAudio()` pré-carrega críticos com timeout; arquivo faltando = silêncio (404 com `.catch`), **nunca quebra o jogo**.
- **Arquivos:** áudios reais já incluídos (OST `.mp3`, SFX `.wav`). Pendentes: `ost_select.mp3` e `base_hit.wav` (tocam em silêncio até chegarem). Adicionar um som = dropar com o nome certo na pasta certa; zero código muda. `fight_win`/`fight_lose` foram descartados (a tela `end` já troca pra `ost_win`/`ost_lose`).

### Nota: código antigo ainda presente no arquivo
O engine real-time (lanes, ATB, gameLoop, etc.) ainda existe nas linhas 514-825 mas é **inerte**: as novas funções com mesmo nome declaradas depois sobrescrevem-no. Não chamar nem modificar essas funções antigas.

## ✅ Próximas tarefas (backlog priorizado)

> **Fase de POLISH (v5.1):** o gameplay V1 turn-based foi testado e funciona mecanicamente. O backlog de polish está detalhado em **`POLISH.md`**, separando o que precisa de decisão criativa do usuário (🗣️ CHAT) do que é implementação direta (🔧). Consultar antes de iniciar polish.

### Concluído
- [x] Testar o fluxo completo do jogo turn-based — OK (2026-06-12)
- [x] Sistema de Menu completo (title, name/load, menu, campanha-esqueleto, roguelite, duelo livre, biblioteca, password) + abstração `Save` com stub cloud — OK (2026-06-13)
- [x] Polish + economia do menu — OK (2026-06-13): fade entre telas (~0.3s), texto maior, fundo animado de cartas, deck inicial por vibe (coleção do player), botão Score, Loja com gacha+pity, licença de duelista, HUD inferior (nome/cap/dinheiro/licença/⚙/login), discovery na Biblioteca, Duelo Livre com lista de oponentes

### Urgente — Gameplay V1 (turn-based recém-implementado)
- [ ] Limpar o código antigo (engine real-time linhas 514-825) — opcional, não bloqueia nada
- [ ] Implementar triângulo de tipos na resolução (ATK bate DEF bate BAL bate ATK, multiplicador 1.5x/0.67x)
- [ ] Implementar mecânica de "campo deve ser zerado antes de atacar a base" (opcional para V1)
- [ ] Mecânica de comeback ligada à torre/defesa (a definir)

### Conteúdo
- [ ] Renomear ATK/DEF/BAL → ATAQUE/DEFESA/EQUILÍBRIO em toda a UI e lógica
- [ ] Definir nomes finais das 5 Vibes (usuário vai escolher nomes engraçados/adultos)
- [x] Adicionar campo `vibe` em todas as cartas — OK (2026-06-14, distribuição placeholder)
- [x] Sinergia passiva de Vibes (+10%/+20% ATK) — OK (2026-06-14, leve; passivas individuais ainda STUB)
- [x] Itens de debuff (5) no `CARDS_CSV` — OK (2026-06-14, stats placeholder)
- [x] Criar 5 peões de Vibe — OK (2026-06-14, passiva própria STUB)
- [x] Implementar Arapucas (face-down, auto-disparo na resolução) — OK (2026-06-14)
- [x] Itens funcionais no turn-based (`applyTurnItem`, fase LAST MINUTE) — OK (2026-06-14)
- [x] Balanceamento Fight 1 (`FIGHT_CURVE`/`PLAYER_HAND_BONUS`/`usesItems`) — OK (2026-06-14, ajustar números jogando)
- [x] Deck Builder (tela `deckbuilder`, 2 colunas) + coleção com quantidade + baralho persistente (`Save.deck`) — OK (2026-06-14)
- [x] Coluna `img` p/ imagem em qualquer carta (assets/cards/, fallback emoji) — OK (2026-06-14)
- [ ] Trocar stats/nomes/efeitos placeholder; implementar passivas `vibe_*` e habilidades dos heróis no turn-based; redesenhar `turboboost`
- [ ] Adicionar as imagens reais das cartas (preencher coluna `img` + dropar arquivos em `assets/cards/`)
- [ ] Polish de layout do Deck Builder (no capítulo Experiência & Clareza)
- [x] **Palco de proporção fixa 16:9 com letterbox** (capítulo Experiência & Clareza) — OK (2026-06-15, `#stage`+`STAGE`/`fitStage`)
- [x] Integrar SFX e OST — OK (2026-06-14): gerenciador de OST com crossfade + roteamento por tela, SFX com pool, unlock iOS, preload+fallback, volumes separados OST/SFX. Placeholders de silêncio em `assets/audio/`. Ver `CONTEXT_AUDIO.md`. **Falta:** o usuário produzir os `.mp3` reais (mesmos nomes); ligar SFX dos eventos ainda não disparados (especiais/arapucas/vibes/hero-summon)
- [x] Gerar `BASE_CARDS` a partir do CSV — OK (2026-06-14: `CARDS_CSV` embutido + `parseCardsCSV`, fonte única)
- [ ] Imagens de peões/itens (hoje são emoji)
- [ ] Persistência de score via n8n (webhook)

## ⚠️ Convenções importantes

- **Áudio:** **OST em `.mp3`, SFX em `.wav`** (constantes `OST_EXT`/`SFX_EXT` no bloco AUDIO). Nunca `.ogg`. Boa compat., inclusive iOS Safari.
- Nomes de arquivos de herói: **minúsculos, sem acento** (`vitao.png`, `leo.png`).
- Não quebrar o fallback base64: o jogo deve rodar offline.
- Ao mudar stats: editar **tanto** `BASE_CARDS` (index.html) **quanto** `GAME_DATA.csv`.
- Todo push atualiza automaticamente o GitHub Pages.

## 🔄 Fluxo de trabalho multi-máquina

O usuário trabalha em mais de um computador. Fluxo ao trocar de máquina:
1. Na máquina atual: fazer commit + push de tudo antes de sair.
2. Na nova máquina: `git pull` (ou `git clone` se for a primeira vez).
3. Abrir o Claude Code apontando para a pasta — este CLAUDE.md carrega o contexto automaticamente.

**Sempre atualizar este arquivo ao final de cada sessão** com decisões, mudanças de mecânica e backlog atualizado.
