# CLAUDE.md — Contexto do Projeto `commanders` (Comandante do Caos)

> Este arquivo é lido automaticamente pelo Claude Code ao iniciar. Mantém o contexto do projeto entre sessões. **Sempre atualize ao final de cada sessão de trabalho.**

---

## ⚠️ LEIA PRIMEIRO — este é um FORK DE DESIGN, com mudança de direção

**`commanders` ("Comandante do Caos") é um fork de design do projeto `fortbc` ("Batalha dos Amigos").** O conteúdo foi copiado do `fortbc` em 2026-06-19, mas com **história de git zerada** (commit inicial novo) e em um **repositório novo e separado** (`commanders`).

### O que está ABANDONADO (não reaproveitar como arquitetura)
- O sistema original estilo **Fort Condor (FFVII Remake)** — **lanes, torres e ATB** — está **abandonado**. **Não** tente adaptá-lo, nem usá-lo como referência de arquitetura.
- O engine real-time (lanes/ATB/gameLoop) que ainda existe inerte no `index.html` (linhas ~514-825) é **lixo histórico**. Não chamar, não modificar, não copiar.
- O engine **turn-based v5** herdado do `fortbc` (fases DRAW/STANDBY/etc., resolução slot-a-slot) **também não é a arquitetura-alvo** do `commanders`. Trate-o como referência, não como base a estender. O combate do `commanders` será **1x1 com tabuleiro/zonas próprias por Comandante**, a ser projetado.

> **Regra de ouro:** se parecer que faz sentido reaproveitar uma função ou estrutura de dados específica do código antigo, **pergunte antes** — não assuma.

### O que é o NOVO núcleo de gameplay (a ser projetado e documentado antes de codar)
- **Roguelike single-player**, run de **tamanho fixo** (sem NG+, sem progressão infinita).
- **Fusão de cartas** estilo **Yu-Gi-Oh! Forbidden Memories** como mecânica central.
- **4 Comandantes do Caos fixos**, enfrentados em **ordem fixa**.
- **Tabuleiros / geração de recursos assimétricos por comandante** — cada Comandante joga de um jeito diferente (não é só skin visual).

### Conteúdo reaproveitado do `fortbc` (matéria-prima, não arquitetura)
- Os **10 heroes** existentes (com suas vibes/naipes) servem de **base de referência** para os Comandantes.
- **Apenas 4 deles** serão implementados como Comandantes do Caos nesta versão. **Quais 4 ainda está EM ABERTO.**
- O **Card Lab** (`cardlab/`, e a pasta solta `Card Lab/`) continua sendo a ferramenta de criação de cartas — pode ser reaproveitado como está ou adaptado.
- Arte, CSVs de cartas e docs herdados são insumo de conteúdo.

### Estado deste setup (2026-06-19)
- ✅ Conteúdo do `fortbc` copiado para esta pasta (sem `.git` do fortbc, sem `fortbc-main/`, sem `.codex_tmp/`).
- ✅ Repositório git novo inicializado (história zerada).
- ⏳ Repositório GitHub **privado** `commanders` + push inicial + GitHub Pages — ver seção "Infra / Deploy" abaixo conforme o progresso.

### Novo Campo de Batalha (re-pipe — 2026-06-22)
Implementado em `index.html` a partir de `UI_CAMPO.md` + `GAME_DESIGN.md` (mockup do Claude Design). **Re-pipe do engine**, não só visual:
- **6 zonas de unidade por lado** (`G.playerField`/`aiField` = arrays de `ZONES=6`). Constante `ZONES`.
- **Comandante FORA do campo:** vira a carta da coluna esquerda (`G.playerCmd`/`aiCmd`, `pickCommander()`), com **PV = HP de base** (`G.playerBase.hp`, 2000), chips 🌀 Fusão (`G.playerFuses{used,limit}`) e ✦ Influência (`G.playerInf`). Inspecionável (`bfInspectCmd`).
- **Fases unificadas:** `PHASES=['draw','standby','action','resolution']` (DOWN+ITENS → **AÇÃO**). `phaseAction`/`endAction`; IA monta plano secreto (`aiDecideAction`/`applyAiPlan`), revelado na resolução. Turno **simultâneo** (sem jogador ativo).
- **Influência** (`regenInfluence`, placeholder TUNÁVEL — fórmula real por-Comandante EM ABERTO): gera no DRAW, gasta ao baixar carta (`playCost`/`spendInf`). Constantes `INF_*`, `DEFAULT_PLAY_COST`, `SHOP_PAWN_COST`, `FUSES_PER_TURN`.
- **Cartas baixadas ficam face-down** (`faceDown=true`) até a RESOLUÇÃO (`flipFaceUp`); fusão entra face-up.
- **Fusão = exatamente 2 cartas** (`bfDoFusion`, cap em `bfToggleFusion`): materiais **voltam ao DECK** (`shuffleDeck`), resultado vai à mão, respeita 🌀/turno. Usa `fusePair` (FUSIONS_CSV).
- **Pilhas:** Deck+Descarte por lado no board; **Lixo central compartilhado** (`G.trash`, `bfOpenTrash`). Deck-out reembaralha o descarte (`reshuffleIfEmpty`).
- **Zonas herdam a cor da vibe** do Comandante (`--bf-zone`). Mão do oponente = versos espiando (`renderFoeHand`).
- **Frames** (§6): sem tag de tipo/ITEM; esfera de vibe (monstro) + ✦ custo no canto. **Trilho** com 4 abas: Inspetor·Log·**Artefatos**·**Loja** (`bfRenderArte`/`bfRenderShop`/`bfBuyPawn`). Temas: Nebulosa·Fumaça·Brasa·Feltro·Carvão (`charcoal`).
- **Testado** no preview (sem erros de console; turno completo + resolução + nextTurn OK).

**Pendências conhecidas (placeholder/STUB):** geração de Influência por-Comandante; tabuleiros/regras assimétricos por Comandante; quais 4 heroes são Comandantes (+arte); efeitos reais de Artefatos; carta-efeito "geradora de peões" (vibe cruzada); balanceamento. Código morto inerte do fluxo antigo (`phaseLastMinute`/`selectQuickCard`/`bfSlotGhost`) deixado no arquivo.

> Antes desta etapa: **nenhuma** mecânica nova existia. O engine turn-based herdado do fortbc foi a base re-pipada (não estendida).

### Sprint v4 (2026-07-16) — ver GDD.md §10 (fonte da verdade)
Motor de combate REESCRITO para **pool-vs-pool** (rank por tempo abolido), **evolução por tiers** bronze/prata/gold (item UPGRADE → Lixo; artefato `evolve_family`), **data-driven** (`CARDS_CSV`+`COMMANDERS_CSV` embutidos, `tools/sync_cards.js` sincroniza dos CSVs da raiz), **tela de Seleção de Comandante**, fluxo demo (Rogue = seleção → Fanta→Arthur→Bala→Garopaba; modos extras trancados; passwords de debug), **animações YGOFM** (draw em arco + fusão espiral), **score** com Google Forms preparado (URLs vazias). Run completa testada de ponta a ponta no preview. Pendências: efeitos de passiva/ativa dos Comandantes, tabuleiros assimétricos, balanceamento, arte real.

---

## 🗂️ Onde está o contexto herdado do `fortbc`

O CLAUDE.md original e detalhado do `fortbc` (engine turn-based v5, sistema de menus, áudio, fusão V0, Card Lab, etc.) foi preservado como:

- **`LEGACY_fortbc_CLAUDE.md`** — o CLAUDE.md completo do fortbc. Consulte para entender o que o `index.html` herdado faz hoje. **Leia-o como história, não como plano.**
- `CONTEXT_*.md` — docs de contexto herdados (UX, CARDS, FUSION, AUDIO, MENUS, GAMEPLAY, VISUAL).
- `GAME_DESIGN.md`, `GAME_DATA.md`, `GAME_DATA.csv`, `FUSIONS.csv`, `POLISH.md` — design/dados herdados.
- `gamedesignfort.md` — ⚠️ legado v4 Fort Condor (real-time). Apenas histórico.
- Arquivos `*_CODEX*` e `RELATORIO_HANDOFF_CARTAS_CODEX.md`, `AGENTS.md` — handoff de trabalho de cartas trazido junto do fortbc.

## 🗂️ Estrutura (herdada — single-file HTML, sem build)

```
commanders/
├── index.html                 # jogo herdado do fortbc (engine a ser substituído)
├── CLAUDE.md                  # este arquivo (contexto do commanders)
├── LEGACY_fortbc_CLAUDE.md    # contexto detalhado herdado do fortbc
├── cardlab/                   # Card Lab (ferramenta de criação de cartas) — reaproveitável
├── Card Lab/                  # versão solta do Card Lab (ignorada no git)
├── assets/                    # heroes, cards, audio (matéria-prima de conteúdo)
├── Imagens/                   # arte de referência
├── CONTEXT_*.md / GAME_*.* / FUSIONS*.csv / POLISH.md   # docs/dados herdados
└── ...
```

- **Plataforma:** navegador (single-file `index.html`, sem build, sem servidor).
- **Persistência:** `localStorage` (herdado).

## 🛠️ Infra / Deploy

- **Repo GitHub:** `commanders` — **PRIVADO** por padrão. Só tornar público quando houver versão apresentável para os amigos.
- **Conta:** Guilherme-Moliner. (fortbc original permanece intacto em `github.com/Guilherme-Moliner/fortbc` e na pasta `C:\Users\guibr\Desktop\Claudinho Codinho`.)
- **GitHub Pages:** ⚠️ Pages em repo **privado** exige plano **GitHub Pro/Team/Enterprise**. No plano Free, Pages só funciona com repo público. Verificar o plano antes de configurar; até lá, testar abrindo `index.html` localmente.
- **Pasta de trabalho local:** `C:\Users\guibr\Desktop\Claudinho Codinho\COMMANDERS` (nota: está aninhada dentro da árvore de trabalho do fortbc; o repo do fortbc enxerga `COMMANDERS/` como diretório não rastreado — **não** commitar `COMMANDERS/` dentro do fortbc).

## 🔄 Fluxo multi-máquina

O usuário trabalha em mais de um computador. Ao trocar de máquina: commit + push antes de sair; `git pull` (ou `git clone`) na nova; abrir o Claude Code apontando para a pasta. **Atualize este arquivo ao final de cada sessão.**

## ✅ Próximos passos (ordem)

1. **(setup)** Finalizar GitHub: repo privado `commanders`, push inicial, Pages (se o plano permitir).
2. **(design — antes de qualquer código novo)** Definir e documentar:
   - Sistema de combate 1x1 com tabuleiro/zonas próprias por Comandante.
   - Mecânica de fusão (Forbidden Memories) adaptada ao roguelike.
   - Geração de recursos assimétrica por Comandante.
   - Quais 4 dos 10 heroes viram Comandantes do Caos.
   - Estrutura da run de tamanho fixo.
3. **(implementação)** Só depois do design aprovado, começar o código novo.

> **NÃO** comece a implementar mecânicas de gameplay antes do design ser definido e aprovado pelo usuário.
