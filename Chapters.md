# Chapters — Batalha dos Amigos (`fortbc`)

> Índice das **frentes de trabalho** ("capítulos") do projeto. Cada capítulo vira (ou já é) uma conversa separada no Claude. Use o **título sugerido** pra renomear a conversa correspondente e manter a referência organizada.
>
> Convenção: cada capítulo tem um doc de contexto `CONTEXT_*.md` que o Claude lê no início da sessão (junto do `CLAUDE.md`). Ao abrir uma conversa, mande o Claude dar `git pull` e ler `CLAUDE.md` + o `CONTEXT_*` do capítulo.

| Status | Significado |
|---|---|
| ✅ | V1 implementado e testado |
| 🟡 | Em andamento / parcial |
| 🔜 | Planejado, ainda não começou |
| 🔁 | Revisão de algo já existente |

---

## 🔊 Capítulo: Áudio (OST + SFX) — ✅ V1
**Título sugerido da conversa:** `fortbc · Áudio (OST + SFX)`
**Doc:** [`CONTEXT_AUDIO.md`](CONTEXT_AUDIO.md)

Trilha sonora por tela (crossfade) + efeitos sonoros. Já implementado: gerenciador de OST com troca automática em `onScreenEnter`, SFX fire-and-forget com pool, unlock de áudio no iOS (1º clique da title), preload com fallback gracioso, volumes separados Música × Efeitos (2 sliders em ⚙). OST em `.mp3`, SFX em `.wav`.

**Falta:** ligar SFX dos eventos que ainda não existem (invocação por herói, especiais, arapucas, vibes); `ost_preduel`/`ost_sudden` aguardam telas/modos; Modo Turbo (pitch +15% via Web Audio).

---

## 🃏 Capítulo: Expansão de Base / Cartas — 🟡 V1 (estrutura pronta, balancear)
**Título sugerido da conversa:** `fortbc · Cartas & Base de Dados`
**Doc:** [`CONTEXT_CARDS.md`](CONTEXT_CARDS.md) · fonte de stats: bloco `CARDS_CSV` no `index.html` (espelho em [`GAME_DATA.csv`](GAME_DATA.csv))

Expandir o conjunto de cartas pra deixar o jogo mais rico e **balanceado**.

**Feito (2026-06-14):** pipeline de fonte única `CARDS_CSV` → `BASE_CARDS` (parser); campo `vibe` em todas as cartas + sinergia leve (+10/20% ATK); +15 cartas novas (5 itens-debuff, 5 peões de vibe, 5 arapucas); **itens funcionais** no turn-based (fase LAST MINUTE, efeito só na resolução); **arapucas** auto-disparam; bloco TUNING (`FIGHT_CURVE`/`PLAYER_HAND_BONUS`/`usesItems`) com Fight 1 mais fácil. **Deck Builder** (tela `deckbuilder`, 2 colunas coleção×baralho) + coleção com quantidade + baralho persistente que vai pro jogo (Roguelite e Duelo Livre). **Coluna `img`** p/ imagem em qualquer carta (fallback emoji). Tudo testado no preview, sem erro.

**Falta:** trocar stats/nomes/efeitos placeholder; **adicionar as imagens reais** (coluna `img` + arquivos em `assets/cards/`); passivas individuais `vibe_*` e habilidades dos heróis; redesenhar `turboboost`; IA setar arapucas; polish de layout do Deck Builder (→ Experiência & Clareza). Triângulo de tipos e rename ATAQUE/DEFESA/EQUILÍBRIO → Game Mechanics.

---

## 📖 Capítulo: Visual Novel — 🔜
**Título sugerido da conversa:** `fortbc · Visual Novel`
**Doc:** `CONTEXT_VISUALNOVEL.md` *(a criar no início do capítulo)*

Sistema de narração: um personagem como **imagem PNG** + uma **caixa de texto** que surge na tela e conta as informações necessárias (tutoriais, contexto, dicas de balanceamento). Usar como camada de apresentação/onboarding e pra explicar mecânicas ao jogador.

**A definir:** quem é o personagem, gatilhos (quando aparece), estilo da caixa, se é dispensável/avançável, integração com `showScreen`.

---

## ⚙ Capítulo: Game Mechanics — 🔜
**Título sugerido da conversa:** `fortbc · Game Mechanics`
**Doc:** [`CONTEXT_GAMEPLAY.md`](CONTEXT_GAMEPLAY.md) · design: [`GAME_DESIGN.md`](GAME_DESIGN.md)

Adicionar/ajustar mecânicas do engine turn-based. Candidatos já no backlog do `CLAUDE.md`: triângulo de tipos na resolução (ATK→DEF→BAL), sinergia de Vibes, arapucas (face-down ativadas por inimigos), especiais dos heróis, "zerar campo antes de bater na base", mecânica de comeback. **Inclui ajustar a dificuldade** (está alta demais).

> ⚠️ A descrição original deste capítulo veio cortada ("quero adicio..."). **Completar o escopo no início da conversa.**

---

## 🙂 Capítulo: Experiência do Jogador (UX & Clareza) — 🟡 em andamento
**Título sugerido da conversa:** `fortbc · Experiência & Clareza`
**Doc:** [`CONTEXT_UX.md`](CONTEXT_UX.md)

Deixar o jogo **compreensível e confortável** pro humano que está jogando (não é mecânica nova — é percepção/clareza). Dores já levantadas: tela **estática/travada por proporção** (16:9 vs 21:9 mudam o layout — queremos palco de proporção fixa com letterbox), clareza de "o que tem no meu baralho", entender o que cada fase faz, feedback legível do combate, onboarding/tutorial leve.

**Feito (2026-06-15):**
- ✅ **Palco fixo 16:9** — `#stage` (1280×720) escalado/centralizado com letterbox em qualquer proporção (testado 16:9, 21:9 ultrawide, 4:3). Bloco editável `STAGE={W,H}` + `fitStage()` no JS; troca a proporção do jogo inteiro num lugar só. Não tocou engine/áudio/menus/fallback base64.
- 🟡 **Camada de JUICE (V1)** — bloco editável `JUICE={...}` + helpers. Compra de carta animada, encaixe no slot, **resolução estilo Balatro** (soma carta a carta + pitch crescente via `playbackRate` + overlay ATK×ATK), contagem animada de números (vida/score), barra de vida drenando após o impacto, microfeedbacks (tremor/flash/dissolução). Verificado no preview.
- 🟡 **Leva 2 (2026-06-15)** — **dano carta a carta** na ordem dos slots (`.being-hit` + `-X` flutuante + HP caindo + dissolução); **fontes do tabuleiro aumentadas** (corrige disparidade carta grande × texto minúsculo); fase **"LAST MINUTE" → "ITENS"** (só itens destacados na mão, encerra ao usar 1 item); **recompensa contextual ao baralho** (Evoluir só cartas do deck, Recrutar pela vibe dominante, Artefatos filtrados por `buffAffects`, chips UNIDADE×ARTEFATO, buffs mais fortes). Verificado no preview.
- 🟡 **Leva 4 (2026-06-16) — PORT do Campo de Batalha (Claude Design):** tela de jogo reescrita em layout 3 colunas (identidade · board · trilho Inspetor/Log), **5 temas** trocáveis em Configurações, **mão em leque** com hover/arrastar-pra-baixar/clicar-pra-fundir, trilho recolhível que re-centra a mão, modais (config/cemitério/deck list/desistir), comandante com glow, **HAND_LIMIT 9**. Engine 100% intacto (ids/hooks preservados; juice/resolução seguem). Verificado no preview. **Falta:** terreno real, fusão no engine, retratos, comandante-quebrado.
- 🟡 **Leva 4b (2026-06-16) — ajustes do port:** pilhas Cemitério/Deck + botão Passar movidos pra coluna esquerda (leque em largura cheia); **arrastar pro slot específico** (não mais 1º livre); **slots de armadilha face-down** reimplementados e dropáveis na fase ITENS; **inspetor** inspeciona cartas visíveis do adversário; **compra de cartas:** 5 inicial + 1/turno acumulando até o teto 9 (antes enchia direto pra 9). Verificado no preview.
- 🟡 **Leva 3 (2026-06-15)** — **faixa de fases foi pro topbar** (banner do meio removido → mais espaço); **cartas full-bleed** (imagem ocupa o card inteiro, texto em overlay com gradiente, fontes maiores, sem fundo sólido); **field card portrait em tamanho cheio** (nada cortado); **botão direito → visão detalhada** (imagem completa + escala de progressão de tiers). Verificado no preview.

**Falta (próximas levas):** afinar timings jogando; SFX de impacto dedicados + partículas leves; `animateNumber` na loja (ouro/recompensas); **clareza de baralho** (o que resta no deck/cemitério durante o jogo) + **onboarding/tutorial leve** (dor #2/#8 do `CONTEXT_UX.md`).

> Fronteira: **UI & Telas** = design/fluxo; **Visual Novel** = narração; aqui = lado do jogador entender/se situar.

---

## 🎨 Capítulo: UI & Telas — 🔁
**Título sugerido da conversa:** `fortbc · UI & Telas`
**Docs:** [`CONTEXT_MENUS.md`](CONTEXT_MENUS.md) · [`CONTEXT_VISUAL.md`](CONTEXT_VISUAL.md) · [`POLISH.md`](POLISH.md)

A UI já está boa pra entender o básico, mas precisa ficar **mais lógica e ajustada**. Revisão de fluxo de telas, hierarquia, clareza dos menus e do tabuleiro, consistência visual.

---

## Mapa rápido capítulo → doc de contexto
| Capítulo | Doc principal |
|---|---|
| Áudio | `CONTEXT_AUDIO.md` |
| Cartas & Base | `CONTEXT_CARDS.md` (+ `GAME_DATA.csv`) |
| Experiência & Clareza | `CONTEXT_UX.md` |
| Visual Novel | `CONTEXT_VISUALNOVEL.md` (a criar) |
| Game Mechanics | `CONTEXT_GAMEPLAY.md` (+ `GAME_DESIGN.md`) |
| UI & Telas | `CONTEXT_MENUS.md` / `CONTEXT_VISUAL.md` |

> **Sempre:** ao fechar uma sessão de capítulo, atualizar o `CONTEXT_*` daquele capítulo, o `CLAUDE.md` (arquitetura/backlog) e o status aqui no `Chapters.md`.
