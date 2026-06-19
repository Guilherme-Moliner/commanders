# CONTEXT: Experiência do Jogador (UX & Clareza) — Batalha dos Amigos

> **Para o Claude Code:** briefing do capítulo de **experiência humana / clareza**. Leia este arquivo + `CLAUDE.md` antes de mexer. Foco: deixar o jogo **compreensível e confortável** pro mano que está jogando — não é sobre adicionar mecânica nova, é sobre o jogador *entender* e *se sentir bem* com o que já existe.

## O que é este capítulo
Tudo que melhora a **percepção do jogador**: estabilidade visual da tela, saber o que está acontecendo a cada fase, entender as regras sem decorar, feedback claro de ações, onboarding/tutorial leve. Tom do jogo continua: engraçado, adulto, cultura de amigos.

## Fronteira com outros capítulos (pra não pisar)
- **UI & Telas** (`CONTEXT_MENUS.md`/`CONTEXT_VISUAL.md`): fluxo de telas, hierarquia, consistência visual "de design". Aqui é o **lado do jogador** (entender/se situar).
- **Visual Novel** (`CONTEXT_VISUALNOVEL.md`): narração com personagem + caixa de texto. Pode ser o *veículo* de parte do onboarding deste capítulo.
- **Cartas & Base** (`CONTEXT_CARDS.md`): conteúdo/stats e o **Deck Builder**. Aqui só entra a *clareza* de explicar as cartas, não o conteúdo.

## Dores concretas já levantadas (ponto de partida)

### 1. 🖥️ Tela ESTÁTICA / travada por proporção — ✅ RESOLVIDO (2026-06-15)
**Implementado:** todo o jogo agora vive num `#stage` de **resolução de design fixa 1280×720 (16:9)**, escalado por `transform: scale()` e centralizado, com **letterbox** (barras pretas) quando a janela não bate a proporção. A experiência é proporcionalmente **idêntica em qualquer monitor** (testado 16:9, 21:9 ultrawide e 4:3).
- **Como funciona:** `<div id="stage">` envolve todas as telas + `#menu-bg`/`#menu-hud` + modais. `#fade`/`#msg-area` ficam fora (cobrem a janela toda). `dmg-float` segue no `body` (usa `getBoundingClientRect`, alinha pós-scale).
- **Onde editar:** bloco `const STAGE={W:1280,H:720}` no JS (perto das constantes do engine) + `function fitStage()`. **Trocar W/H muda a proporção do jogo inteiro** (ex.: 16:10 → 1280×800, 3:2 → 1280×853, 4:3 → 1024×768). CSS: `#stage` + `.screen{height:100%}`.
- **Decisões aprovadas:** proporção **16:9**; retrato/mobile = **encolher e centralizar** (sem prompt de girar, por enquanto).

### 2. 🃏 "Não sei o que tem no meu baralho"
A Biblioteca mostra a coleção (discovery), mas faltava o **Deck Builder** (sendo feito no capítulo Cartas). Aqui entra a parte de *clareza*: deixar óbvio, durante o jogo, quais cartas o jogador montou / quantas restam / o que já passou.

### 3. ⏱️ "O que está acontecendo agora?"
As fases (DRAW → STANDBY → DOWN FASE → LAST MINUTE → RESOLUÇÃO) passam por timer. O jogador precisa entender **o que cada fase faz** e **o que se espera dele** sem ler manual. Candidatos: dicas contextuais, destaque do que clicar, micro-explicações na 1ª vez.

### 4. 🔁 Feedback e legibilidade do combate — 🟡 V1 da camada de *juice* (2026-06-15)
Deixar claro: quem atacou quem, quanto de dano, por que a carta morreu, o efeito do item/arapuca que disparou. Hoje há `showMsg`/`showDmgFloat`, mas pode ficar mais legível.

**Implementado (bloco `JUICE` editável no JS, `JUICE.on` = master switch):**
- **Compra de carta:** cartas novas surgem deslizando/acomodando (`.juice-draw`, tag `card._shown` p/ animar só as novas, com stagger).
- **Posicionamento:** slot dá "encaixe" (`.juice-land`) ao receber carta (`confirmMain`).
- **Resolução estilo Balatro:** `resolveSequence()` soma carta por carta destacando o slot (`.attacking`), total subindo com **pitch crescente** (`playSFXPitch` via `playbackRate`), acelerando a cada carta; mostra bônus de sinergia/efeitos no fim.
- **Comparação ATK×ATK:** overlay central `VOCÊ ⚔ × ⚔ FLORIPA` com nota de quem bate mais forte, antes do impacto.
- **Números animados:** `animateNumber()` (easeOutCubic, cancela anterior) em vida das bases, HP do topbar e score.
- **Barras de vida:** drenam logo *após* o impacto (`JUICE.hpDrainDelayMs`), não instantâneo (as barras já tinham `transition:width`).
- **Microfeedbacks:** tremor/flash na base atingida (`juiceShake`/`juiceFlash`), dissolução das cartas mortas (`.juice-die`).
- **Dano carta a carta (2026-06-15 leva 2):** `animateFieldDamage(defSide,totalAtk)` aplica o dano **na ordem dos slots** (1→…→CMD): destaca a carta (`.being-hit`), mostra `-X` flutuante (`floatCardDmg`), dreca o HP da carta (número + barra) e dissolve se morrer; só depois o estado real é mutado. `JUICE.dmgStepMs` controla o ritmo. Ordem: você bate o campo da Floripa, depois ela rebate o seu.

**Falta nesta frente:** SFX de impacto dedicados; partículas leves; afinar timings jogando; aplicar `animateNumber` a ouro/recompensas na loja; dissolução também fora da resolução (ex.: tributo).

### 5. 🎒 Fase de ITENS (ex-"LAST MINUTE") — ✅ (2026-06-15 leva 2)
Renomeada **LAST MINUTE → ITENS** (badge + faixa + hints). Na fase, só as cartas de **item/arapuca** ficam destacadas (`.card.playable`, glow dourado) e os monstros ficam apagados (`.card.dimmed`) — antes os monstros ainda apareciam ativos. **Encerra sozinha** ao usar 1 item/arapuca (igual ao baixar monstro na DOWN FASE), via `setTimeout`→`startPhase('resolution')` em `selectQuickCard`; quem não tem item vê "Avançar". *(Nome pode ser tematizado depois — hoje é o claro "ITENS".)*

### 6. 📏 Tamanhos & fontes do tabuleiro — ✅ V1 (2026-06-15 leva 2)
Corrigida a disparidade "carta de campo enorme × texto minúsculo". Com o palco fixo, fontes em `rem` são absolutas, então foram **aumentadas**: nome/stats da carta de campo (`.fc-name` .3→.5rem, `.fc-stats` .28→.52rem), barra de HP da carta mais alta, `slot-label`, `base-lp`, `hp-val`, `totem-name`, `zone-label`, `deck-info`, `fight-info`, `phase-step`, `action-bar` — tudo legível. Topbar/base/banner ganharam alguns px de altura.

### 7. 🎁 Recompensa contextual ao baralho — ✅ V1 (2026-06-15 leva 2)
`generateRewards()` agora lê o **baralho real** do player antes de sortear (`deckMonsterIds`/`dominantVibe`): **Evoluir** só sugere unidade que ele tem; **Recrutar** oferece unidade da vibe dominante; **Artefato** filtra `BUFF_POOL` por `buffAffects()` (só buffs que afetam o deck) — fim das sugestões de carta que o player não possui. Buffs ficaram mais fortes (+10/15/18%) e por tipo (ATAQUE/DEFESA/EQUILÍBRIO). Cada opção tem chip **UNIDADE** × **ARTEFATO**; fallback de +50 ouro se faltar buff aplicável.

### 10. 🎨 Port do Campo de Batalha (Claude Design) — ✅ V1 (2026-06-16)
Tela de jogo **reescrita** a partir do mockup `Campo de Batalha.dc.html` (handoff do Claude Design), mantendo o engine 100% intacto. Tudo escopado em `#screen-game` (vars `--bf-*`), dentro do `#stage` (palco fixo já cuida do scale/letterbox — a lógica de fit do mockup não foi portada).
- **Layout 3 colunas:** topbar (Turno · trilha de fases · Placar+som+⚙) · esquerda = painéis de identidade (inimigo/você com retrato, PV+barra, chips Deck/Cemit./Mão) · centro = board (terreno + 4 slots + CMD + face-down + linha de frente + leque da mão entre pilhas Cemitério/Deck) · direita = trilho Inspetor/Log recolhível.
- **5 temas** (`BF_THEMES`/`BF_THEME_META`: Nebulosa/Boteco/Fumaça/Brasa/Feltro) via Configurações (⚙) → `bfApplyTheme()` troca as `--bf-*`; persiste em `localStorage fortbc_theme`.
- **Leque da mão:** `renderHand` reescrito → cartas em arco (`bfLayoutHand`, fan math do mockup). **Hover** destaca; **arrastar pro campo** baixa (`bfPlay`→`confirmMain`/`selectQuickCard` conforme a fase, threshold 8px, ghost + highlight de drop); **clicar** marca **fusão** (até 5, badge numerado, barra FUSÃO — `bfDoFusion` é STUB). Re-centra ao recolher o trilho (delta 0, medido por `clientWidth` + re-medição em rAF/timeouts/resize).
- **Trilho:** Inspetor (hover/botão-direito/clique no cemitério → `bfInspect`) + Log ao vivo (`bfLog`, alimentado pelo `showMsg`). Recolhe via chevron → aba "PAINEL".
- **Modais:** Configurações (temas+som+animações+desistir), Cemitério (grid clicável→inspetor), Menu do Deck, **Deck List** (comprados vs no deck, sem ordem), Desistir.
- **Comandante:** slot CMD com borda dourada + glow `cmdPulse`. (Estado "quebrado" = quando o engine sinalizar; sem gatilho ainda.)
- **HAND_LIMIT 5 → 9.** Painel DEMO do mockup **não** foi portado (era scaffolding).
- **Hooks do engine preservados:** ids `player-slot-0..4`/`ai-slot-0..4`/`player-hidden-N`/`turn-num`/`ps-*`/`score-display`/`deck-count`/`grave-count`/`action-bar`; `renderFC` mantém `.field-card`/`.fc-hp`/`.fc-hpfill` → a camada de juice (resolução Balatro, dano carta a carta) continua funcionando. `showDmgFloat`/`juiceImpact` repontados pros painéis novos.
- **Ajustes (2026-06-16, leva 4b):**
  - **Pilhas Cemitério/Deck + barra de ação** movidas pra **coluna esquerda** (sob o painel do jogador) → leque ocupa a **largura toda**. Classes `.bf-leftrow`/`.bf-pile2`/`.bf-actionbar`.
  - **Arrastar pro slot específico:** `bfPlay(i,at)` + `bfSlotAt(e)`/`bfDropValid()`/`bfSlotEl()` — solta no slot exato (monstro→slot 0-3/CMD; arapuca→slot de armadilha; item→qualquer lugar do board). Realce do slot-alvo (`.bf-slot-drop`) durante o arraste.
  - **Slots de armadilha (face-down) reimplementados** como slots visíveis (`.bf-fdslot`, ids `player-fd-0..3`), dropáveis na fase ITENS; `selectQuickCard(idx,hiddenSlot)` aceita slot específico. (Arapucas auto-disparam na resolução — lógica do engine já existente.)
  - **Inspetor inspeciona cartas visíveis do adversário** (`renderFC` ganhou `onclick`→`showCardDetail` nos dois lados; face-down não tem handler → não inspecionável).
  - **Compra de cartas corrigida:** `INITIAL_HAND=5` (inicial), `HAND_LIMIT=9` é **teto** (não base). Turno 1 = 5; turno 2+ = **+1/turno** acumulando até 9. `initFight`/`phaseDraw` ajustados.
- **Falta:** terreno real (sem imagem; picker do mockup não ligado); fusão de verdade (engine); retratos dos jogadores; estado "comandante quebrado" precisa de sinal do engine; afinar no playthrough.

### 8. 🃏 Clareza de baralho durante o jogo — 🔜
Ainda pendente: deixar óbvio quais cartas restam no deck/cemitério (lista/contador maior já ajudou), o que cada fase espera (onboarding leve / dicas na 1ª vez).

### 9. 🗂️ Faixa de fases no topo + cartas full-bleed + campo maior — ✅ V1 (2026-06-15 leva 3)
- **Descritivo de fases foi pro cabeçalho:** os passos (DRAW · STANDBY · DOWN FASE · ITENS · RESOLUÇÃO) agora vivem no `#topbar` (`#phase-track` dentro de `.center-bar`); a faixa `#phase-banner` do meio foi **removida**, liberando espaço vertical pro tabuleiro. `updatePhaseBanner` continua mirando os `ps-*` (só mudaram de lugar). `#phase-badge` removido.
- **Cartas full-bleed (mão + campo):** a imagem ocupa o **card inteiro** (`position:absolute;inset:0;object-fit:cover`); o texto (nome/tipo/HP/ATK) é **overlay no rodapé com gradiente** (sem fundo sólido). Fontes maiores. Selo de tier mantido (movido p/ canto). `renderFC` envolve as infos em `.fc-info`.
- **Campo maior / cartas inteiras:** field card agora é **portrait** (`aspect-ratio:.72`), `position:absolute` no slot (`top/bottom:0` → altura = slot, largura pelo aspect), centralizado — **nada cortado**. ⚠️ Exigiu `.mslot{display:grid;place-items:center}` + `.monster-grid{grid-template-rows:1fr}` (sem isso a linha do grid colapsa quando o conteúdo vira absolute).
- **Visão detalhada (botão direito):** `oncontextmenu` em cartas da mão e do campo → `showCardDetail(card)` reusa o `#card-viewer` (agora `object-fit:contain` p/ mostrar a imagem **completa**) + **escala de PROGRESSÃO** (Bronze→Diamante com tier atual destacado).
- **Falta:** afinar o "fill" do placeholder (PNG real via `<img>` enche 100%); opção/zoom das cartas durante a resolução; afinar fontes jogando.

## Como iniciar uma sessão nesta frente
1. `git pull origin main`
2. Ler este arquivo + `CLAUDE.md`
3. Confirmar com o usuário as decisões de design (proporção da tela, estilo do onboarding) antes de implementar
4. Mudanças de layout: **não quebrar** engine turn-based, áudio, menus, nem o fallback base64 das imagens
5. Ao fechar a sessão: atualizar este doc, o `CLAUDE.md` e o status no `Chapters.md`
