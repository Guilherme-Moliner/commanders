# 🦅 GAME DESIGN FORT — Batalha dos Amigos (LEGADO v4 · Fort Condor)

> ⚠️ **DOCUMENTO LEGADO / HISTÓRICO.**
> Este é o design ORIGINAL do jogo (v1–v4), baseado no minigame **Fort Condor** de Final Fantasy VII Remake/Rebirth: tempo real, lanes verticais, ATB, movimento e range de unidades.
>
> **Em 2026-06-12 (v5) o jogo foi reescrito para turn-based** (estilo Yu-Gi-Oh! Forbidden Memories). Este engine NÃO está mais ativo — o código real-time ainda existe inerte no `index.html` (linhas ~514-825) mas é sobrescrito pelo engine novo.
>
> **Mantido como referência** das ideias de carta/herói/item que podem ser readaptadas. Para o design atual, veja `GAME_DESIGN.md`. Para o backlog de migração, veja `POLISH.md`.

---

## 🗺️ Tabuleiro (Fort Condor)

```
            [ BASE FLORIPA ]   (topo, IA)
         ┌──────────┬──────────┐
         │ 🏰 Torre │ 🏰 Torre │   ← torres da IA (bloqueiam)
         │   Esq    │   Dir    │
         │  LANE 0  │  LANE 1  │
         │   ESQ    │   DIR    │
         │ 🏰 Torre │ 🏰 Torre │   ← torres do jogador
         │   Esq    │   Dir    │
         └──────────┴──────────┘
            [ BASE BC ]        (baixo, jogador)
```

- **2 lanes verticais** (Esquerda / Direita), separadas por uma **zona nula** central.
- Cada jogador tinha **2 torres** (uma por lane, 400 HP) + **1 base central** (1000 HP).
- Unidades saíam da base, subiam pela lane escolhida, e seguiam em direção à base inimiga.

---

## ⚔️ Fluxo de Combate (Fort Condor)

1. Você posicionava unidades **apenas no seu lado**; elas percorriam a lane sozinhas.
2. Unidades **não morriam** ao chegar na estrutura inimiga — ficavam **atacando** (cerco).
3. Unidades inimigas **se cruzavam** livremente; só entravam em combate quando ficavam dentro do **alcance (range)** uma da outra.
4. **Prioridade**: unidades preferiam lutar contra unidades inimigas a avançar.
5. A **torre bloqueava** a lane: era preciso destruí-la para a unidade seguir até a base.
6. **Torres e bases revidavam** (long range): atiravam na unidade inimiga mais próxima dentro do alcance.

---

## 🎯 Range (Alcance) — DROPADO na v5

| Range | Alcance | Indicador | Comportamento |
|---|---|---|---|
| ⚔️ Melee | curto | ⚪ branco | luta corpo-a-corpo |
| 🏹 Mid | médio | 🟠 laranja | ataca à média distância |
| 🎯 Long | longo | 🟣 roxo | bombardeia de longe |

> A v5 dropou range, attack speed e mobilidade. As cartas mantêm o campo `range` nos dados, mas ele é inerte — efeitos de carta vão substituir essas ideias.

---

## 🃏 Triângulo de Poder

```
ATK ▶ vence ▶ DEF ▶ vence ▶ BAL ▶ vence ▶ ATK
```
- Vantagem de tipo: **1.5×** dano · Desvantagem: **0.67×** dano.

> Conceito mantido na v5 (visível nas cartas), mas a mecânica de vantagem ainda não foi reativada no engine turn-based — ver `POLISH.md` #3.

---

## ⭐ Estrelas e Tributo

| Estrelas | Tributo necessário |
|---|---|
| 1–2 (peões) | nenhum |
| 3–4 (heróis) | nenhum |
| 5–6 (heróis) | sacrificar 1 unidade em campo |

O sacrifício era **imediato** — permitia o "deny" (sacrificar uma unidade prestes a morrer para não dar pontos ao inimigo, e ainda invocar um herói forte).

> A lógica de tributo ainda não foi portada para a Down Fase do turn-based — ver `POLISH.md` #8.

---

## 🧙 Habilidades Especiais (real-time — a readaptar)

| Herói | Habilidade (Fort Condor) |
|---|---|
| Arthur | Único herói **long range** |
| Fanta | **Recycler**: +1 ATB ao ser tributado |
| Garopaba | **Morte heroica**: ao morrer, +20% ATK aos aliados por 10s |
| Bala | **Provoker**: atrai os ataques inimigos |
| Vitão | **Healer**: ao entrar, cura o aliado mais ferido (+100 HP) |
| Letti | **Rusher**: ignora unidades e vai direto à torre |

> Várias dependem de conceitos que não existem mais (ATB, lanes, movimento). Precisam ser redesenhadas para turn-based — ver `POLISH.md` #4.

---

## 🎒 Itens (efeitos real-time — a readaptar)

| Item | Custo | Efeito (Fort Condor) |
|---|---|---|
| 🥩 Churrasco | 2 | cura todas as unidades +80 HP |
| ⚡ Energético | 2 | +30% ATK em campo por 15s |
| 🍺 Rodada | 1 | compra 2 cartas |
| 💨 Turbo Boost | 2 | 2× velocidade por 10s |
| 🔄 Ressurreição | 4 | revive a última unidade morta (50% HP) |
| 🧱 Reforço | 3 | próxima unidade entra com +50% HP |

> Efeitos baseados em tempo ("por 15s", "2× velocidade") não existem no turn-based — virar efeitos por turno. Ver `POLISH.md` #11.

---

## ⏱️ ATB e Anti-empate (REMOVIDOS na v5)

- **ATB** regenerava ~0.6/s (máx 10). Cada carta custava ATB para jogar.
- **3 min** → ⚡ Turbo (2× velocidade) · **4 min** → 🔥 Turbo+ (4×) · **5 min** → 💀 Morte Súbita (um hit mata).
- **Deck Out** (deck + mão vazios) = derrota. *(Esta regra foi mantida na v5.)*

---

## 🔄 Estrutura Roguelike (MANTIDA na v5)

```
Início (nome + dificuldade)
  → Fight 1 → Recompensa (1 de 3)
  → Fight 2 → Recompensa (1 de 3)
  → Fight 3 → Tela final + Highscores
```

### Recompensas possíveis
1. **Level up** de uma carta (Bronze → ... → Diamante)
2. **Nova carta** adicionada ao deck da run
3. **Buff de deck** permanente (ex: +5% HP geral, −1 custo de peões)

---

## 🏆 Pontuação (parcialmente revista na v5)

| Evento | Pontos |
|---|---|
| Unidade inimiga morta | +50 a +200 (por estrela) |
| Dano em torre/base | +1 por HP |
| Vitória no fight | +500 |
| Bônus velocidade (<1/2/3 min) | +500 / +300 / +100 |
| Cartas restantes na mão | +20 cada |
| Cartas restantes no deck | +10 cada |
| Unidade própria perdida | −30 a −100 |

> Os bônus de velocidade (ligados ao timer) saíram na v5. A pontuação atual está descrita em `GAME_DESIGN.md`.

---

## ⭐ Níveis de Carta (MANTIDOS na v5)

| Nível | Tier | Multiplicador | Borda |
|---|---|---|---|
| 1 | Bronze | ×1.00 | fosca |
| 2 | Prata | ×1.10 | metálica |
| 3 | Ouro | ×1.20 | brilhante |
| 4 | Platina | ×1.35 | glow |
| 5 | Esmeralda | ×1.50 | pulsante |
| 6 | Diamante | ×1.75 | arco-íris |

Os níveis persistem entre sessões (localStorage) e sobem via recompensas.
