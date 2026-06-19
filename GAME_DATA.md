# 📊 GAME DATA — Batalha dos Amigos (fortbc · v5 turn-based)

> **⚠️ FONTE ÚNICA (2026-06-14):** os stats agora vivem no bloco **`CARDS_CSV`** embutido no `index.html` (parseado em `BASE_CARDS` no load). `GAME_DATA.csv` é espelho. As tabelas abaixo são referência de leitura — o número que vale é o do `CARDS_CSV`. Ver `CONTEXT_CARDS.md`.
>
> **Nota v5:** os campos `range`, `speed` e `tribute` continuam nos dados mas estão **inertes** (herança Fort Condor). `effectDur` (segundos) é legado — itens agora valem **só na resolução do turno**.
>
> **Novidade 2026-06-14:** toda carta tem `vibe`; +15 cartas (5 itens-debuff, 5 peões de vibe, 5 arapucas); itens funcionais (jogados na LAST MINUTE); arapucas auto-disparam na resolução. Stats novos = **placeholder**.

---

## 👑 Heróis

| Nome | Tipo | ⭐ | Custo | HP | ATK | Tributo | Habilidade (a portar p/ turn-based) |
|---|---|---|---|---|---|---|---|
| Arthur | ATK | 3 | 3 | 220 | 110 | 0x | (era long range — redesenhar) |
| Fanta | BAL | 3 | 3 | 200 | 70 | 0x | Recycler (`recycler`) |
| Nathan | DEF | 3 | 3 | 320 | 45 | 0x | — |
| Garopaba | ATK | 4 | 4 | 250 | 130 | 0x | Morte heroica (`deathbuff`) |
| Bala | DEF | 4 | 4 | 420 | 50 | 0x | Provoker (`provoker`) |
| Léo | ATK | 4 | 4 | 260 | 130 | 0x | — |
| Zaga | BAL | 4 | 4 | 320 | 95 | 0x | — |
| Vitão | BAL | 5 | 5 | 350 | 80 | 1x | Healer (`healer`) |
| Borba | DEF | 5 | 5 | 600 | 70 | 1x | — |
| Letti | ATK | 6 | 6 | 280 | 160 | 1x | Rusher (`rusher` — redesenhar) |

> As habilidades (`special`) estão marcadas nos dados mas **nenhuma está implementada** no turn-based. Redesenho em `POLISH.md` #4.

## ♟️ Peões

| Nome | Tipo | ⭐ | Custo | HP | ATK | Cópias |
|---|---|---|---|---|---|---|
| Zé Mané | ATK | 1 | 1 | 100 | 60 | 3 |
| Muralha | DEF | 1 | 1 | 200 | 30 | 3 |
| Genérico | BAL | 2 | 2 | 150 | 50 | 3 |
| Fortão | DEF | 2 | 2 | 280 | 40 | 3 |

## 🎒 Itens

| Carta | Custo | Cópias | Efeito (legado real-time) | Status v5 |
|---|---|---|---|---|
| Churrasco | 2 | 3 | Cura todas as unidades +80 HP | a portar |
| Energético | 2 | 3 | +30% ATK em campo por 15s | a portar (tirar o tempo) |
| Rodada | 1 | 3 | Compra 2 cartas | ok p/ turnos |
| Turbo Boost | 2 | 3 | 2× velocidade por 10s | obsoleto (sem velocidade) |
| Ressurreição | 4 | 3 | Revive última unidade morta (50% HP) | a portar (do cemitério) |
| Reforço | 3 | 3 | Próxima unidade +50% HP | a portar |

> Itens ainda **não têm efeito** no engine turn-based (a fase de jogar item não foi implementada). Readaptação em `POLISH.md` #11.

---

## 🃏 Triângulo de Tipos

```
ATAQUE ⚔ (ATK)  ·  DEFESA 🛡 (DEF)  ·  EQUILÍBRIO ⚖ (BAL)
```
Regra de vantagem (ATAQUE > DEFESA > EQUILÍBRIO > ATAQUE, ×1.5 / ×0.67) **presente nos dados mas inativa** na resolução do V1. Ver `POLISH.md` #3.

---

## 📈 Rank de Carta (tempo em campo · temporário no fight)

| Turnos em campo | Rank | Mult. de ATK |
|---|---|---|
| 0–1 | 🥉 Bronze | ×1.00 |
| 2–3 | 🥈 Prata | ×1.10 |
| 4+ | 🥇 Ouro | ×1.25 |

---

## 🏛️ Bases

| Estrutura | LP | Função |
|---|---|---|
| Base (cada lado) | **2000** | Objetivo final. O dano que transborda do campo desconta daqui. Zerar = derrota daquele lado. |

> Não há mais torres separadas (eram do engine Fort Condor). Constante: `BASE_HP = 2000`.

---

## 🎚️ Dificuldades (IA)

| Dificuldade | Nível das cartas da IA | Mult. de ATK |
|---|---|---|
| Iniciante (`easy`) | Bronze (lv 1) | ×0.8 |
| Veterano (`medium`) | Prata (lv 2) | ×1.0 |
| Mestre (`hard`) | Platina (lv 4) | ×1.25 |

---

## 🏆 Pontuação (v5 — simplificada)

| Evento | Pontos |
|---|---|
| Carta inimiga destruída na resolução | + ATK base da carta |
| Vitória no fight | +500 + (10 × turno atual) |

> Os bônus de velocidade ligados ao timer saíram com o engine real-time. Refinamento da pontuação é polish em aberto.

---

## ⭐ Níveis de Carta (persistentes · roguelike)

| Nível | Tier | Multiplicador |
|---|---|---|
| 1 | Bronze | ×1.00 |
| 2 | Prata | ×1.10 |
| 3 | Ouro | ×1.20 |
| 4 | Platina | ×1.35 |
| 5 | Esmeralda | ×1.50 |
| 6 | Diamante | ×1.75 |

Sobem via recompensas roguelike entre os 3 fights (localStorage). Não confundir com o **rank temporário** (tempo em campo) acima.
