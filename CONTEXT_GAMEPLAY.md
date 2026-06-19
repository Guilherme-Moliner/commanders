# CONTEXT: Gameplay & Mecânicas — Batalha dos Amigos

> **Para o Claude Code:** este é o briefing completo para trabalhar no gameplay e mecânicas. Leia este arquivo + `CLAUDE.md` + `GAME_DESIGN.md` antes de qualquer mudança.

## O que é o projeto
Batalha dos Amigos (`fortbc`) — jogo de cartas turn-based single-file (`index.html`), estilo Yu-Gi-Oh! Forbidden Memories. 5 fases por turno: DRAW → STANDBY → DOWN FASE → LAST MINUTE → RESOLUÇÃO. Ver `GAME_DESIGN.md` para regras completas.

## Estado atual do engine (v5)
- Engine turn-based funcional e testado (2026-06-12)
- Funções-chave: `initFight`, `startPhase`, `phaseDraw`, `phaseStandby`, `phaseMain`, `confirmMain`, `phaseResolution`, `endFight`
- **ATENÇÃO:** código real-time antigo ainda existe nas linhas ~514-825 mas é INERTE (sobrescrito). Não tocar.
- Combate: `sumAtk(field)` → `applyDamageToField()` → overflow na base
- Rank de carta: 0-1 turnos Bronze×1.0 / 2-3 Prata×1.10 / 4+ Ouro×1.25

## Mecânicas implementadas ✅
- 5 fases por turno
- 5 slots por lado (4 normais + 1 CMD)
- Rank de carta por tempo em campo (Bronze/Prata/Ouro)
- Roguelike: 3 fights + tela de recompensa
- Níveis de carta persistentes (Bronze→Diamante, localStorage)
- Highscores locais (top 10)

## Mecânicas NÃO implementadas (backlog priorizado)
| # | Item | Decisão necessária? |
|---|---|---|
| 1 | Triângulo de tipos ATK>DEF>BAL (1.5x/0.67x) | Sim (POLISH.md #3) |
| 2 | Habilidades dos 10 heróis | Sim (POLISH.md #4) |
| 3 | Sistema de Vibes (5 tipos + sinergia) | Sim (POLISH.md #2) |
| 4 | Mecânica do Comandante | Sim (POLISH.md #6) |
| 5 | Arapucas (face-down) | Sim (POLISH.md #5) |
| 6 | Tributo para cartas de estrela alta | Sim (POLISH.md #8) |
| 7 | Last Minute (cartas rápidas) | Sim (POLISH.md #9) |
| 8 | Mecânica de comeback | Sim (POLISH.md #7) |
| 9 | Limpeza do código morto (engine real-time linhas ~514-825) | Não — implementar direto |

## Heróis e habilidades planejadas (turn-based, a redesenhar)
| Herói | Habilidade atual (legado real-time) | Status |
|---|---|---|
| Arthur | long range | sem habilidade turn-based definida |
| Fanta | Recycler: +1 ATB ao ser tributado | adaptar p/ turn-based |
| Garopaba | Morte heroica: +20% ATK aliados ao morrer | adaptar |
| Bala | Provoker: atrai ataques | adaptar |
| Nathan | — | sem habilidade |
| Léo | — | sem habilidade |
| Zaga | — | sem habilidade |
| Vitão | Healer: cura aliado ao entrar | adaptar |
| Borba | — | sem habilidade |
| Letti | Rusher: ignora unidades | adaptar |

## Sistema de Vibes (aprovado, não implementado)
5 vibes com cores e mecânicas passivas aprovadas, **nomes a definir pelo usuário**:
- 🟡 Amarelo — Festa/Energia: bônus de stat no turno
- 🔴 Vermelho — Força bruta: bônus de dano
- 🔵 Azul — Controle/Cura: cura aliados
- 🟣 Roxo — Caos/Debuff: debuff ao morrer
- 🟢 Verde — Sustain: ganha stats progressivamente
Sinergia: 2 cartas mesma vibe = +10%; 3+ = +20%

## Constantes do engine
```js
HAND_LIMIT = 5
BASE_HP = 2000
PHASES = ['draw','standby','main','lastminute','resolution']
```

## Estado do jogo
- `G` — estado do fight: `playerField[5]`, `aiField[5]`, `playerBase`, `aiBase`, `playerHand[]`, `playerDeck[]`, `playerGrave[]`, `turn`, `phase`, `score`, `gameOver`
- `APP` — estado da run: nome, dificuldade, fightNum, totalScore, deck, extraHandSize

## Como iniciar uma sessão nesta frente
1. `git pull origin main`
2. Ler este arquivo + `CLAUDE.md` + `GAME_DESIGN.md`
3. Confirmar com o usuário qual mecânica implementar
4. Para decisões de design (🗣️ CHAT no POLISH.md), discutir antes de codificar
