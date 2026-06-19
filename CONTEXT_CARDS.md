# CONTEXT: Cartas & Conteúdo — Batalha dos Amigos

> **Para o Claude Code:** este é o briefing completo para trabalhar em cartas, heróis, stats e novos conteúdos. Leia este arquivo + `CLAUDE.md` + `GAME_DATA.md` antes de qualquer mudança.

## O que é o projeto
Batalha dos Amigos (`fortbc`) — jogo de cartas turn-based. As cartas-herói são baseadas em 10 amigos reais. Tom: engraçado, adulto, referências a álcool. Ver `CLAUDE.md` para arquitetura.

## Fonte de verdade dos stats (ATUALIZADO 2026-06-14)
- **`CARDS_CSV`** — bloco de texto CSV embutido no topo do `<script>` do `index.html` (logo antes do parser). **ESTA é a fonte única.** Edite só aqui.
- `BASE_CARDS` é **gerado** desse texto no load via `parseCardsCSV()` (parser de CSV com suporte a aspas).
- `GAME_DATA.csv` (arquivo) virou **espelho/export** — mantenha igual ao `CARDS_CSV` por conveniência (abrir no Excel), mas quem manda é o bloco embutido.
- Schema (20 colunas): `id,name,kind,type,vibe,range,star,cost,hp,atk,speed,tribute,copies,special,effect,effectVal,effectDur,emoji,ability,img`
  - `img` = arquivo em `assets/cards/` (ex.: `zemane.png`). Tem prioridade sobre o emoji. Vazio = usa emoji temporário.
  - `kind` = `pawn|hero|item|trap` (gera os flags `pawn`/`hero` e força `type` ITEM/TRAP).
  - `vibe` = `amarelo|vermelho|azul|roxo|verde` (ou vazio).
  - Linhas começando com `#` são comentários (ignoradas pelo parser).
- **Template de carta nova:** copie uma linha do mesmo `kind` no `CARDS_CSV`, troque os campos. Zero código a mais.

## Heróis existentes (10 cartas)
| ID | Nome | Tipo | Estrelas | Tribute | Habilidade |
|---|---|---|---|---|---|
| arthur | Arthur | ATK | ? | ? | long range (legado) |
| fanta | Fanta | BAL | ? | ? | Recycler (legado) |
| garopaba | Garopaba | ATK | ? | ? | Morte heroica (legado) |
| bala | Bala | DEF | ? | ? | Provoker (legado) |
| nathan | Nathan | DEF | ? | ? | — |
| leo | Léo | ATK | ? | ? | — |
| zaga | Zaga | BAL | ? | ? | — |
| vitao | Vitão | BAL | ? | ? | Healer (legado) |
| borba | Borba | DEF | ? | ? | — |
| letti | Letti | ATK | ? | ? | Rusher (legado) |

> Stats exatos: ver `GAME_DATA.md` / `GAME_DATA.csv`.
> Habilidades são do design legado (real-time) e precisam ser redesenhadas para turn-based.

## Novos conteúdos planejados (não implementados)

### Itens — Debuffs (5 cartas)
| Nome | Efeito original (real-time) | Adaptar p/ turn-based |
|---|---|---|
| Ressaca | −40% velocidade 8s | −X ATK no próximo turno |
| Dedinho Mindinho | −30% ATK inimigo mais forte | −30% ATK 1 turno |
| Calúnia | Inimigo ataca aliados 5s | Carta inimiga passa 1 turno sem atacar |
| Joga Areia | −50% range 6s | −X ATK próximo turno |
| Barraco | Todos inimigos −30% velocidade | Todos inimigos −X ATK 1 turno |

### Peões de Vibe (5 cartas novas, ★2, custo 2)
| Vibe | Tipo | Passiva |
|---|---|---|
| 🟡 Festa | ATK | bônus de stat no turno |
| 🔴 Força | ATK | +20% ATK, vai ao herói mais próximo |
| 🔵 Controle | DEF | Cura aliados adjacentes |
| 🟣 Caos | BAL | Debuff aleatório ao morrer |
| 🟢 Sustain | DEF | +5% ATK/HP por turno (empilha até 3x) |

### Arapucas / Armadilhas (5 cartas, ficam face-down)
| Nome | Efeito original (real-time) | Adaptar p/ turn-based |
|---|---|---|
| Buraco na Pista | Para inimigo 3s | Inimigo perde 1 turno |
| Emboscada | 2x dano no 1º inimigo | 2x dano na resolução do turno |
| Rede | −60% velocidade + cura | −ATK + cura aliado |
| Praga | Drena HP | Drena ATK por 2 turnos |
| Bomba de Fumaça | Inimigos ficam melee | Todos inimigos −range (sem efeito turn-based ainda) |

## Sistema de Vibes (aprovado, não implementado)
Cada carta terá campo `vibe`. 5 vibes com mecânicas passivas aprovadas, **nomes a definir**:
- 🟡 Amarelo — Festa/Energia
- 🔴 Vermelho — Força bruta
- 🔵 Azul — Controle/Cura
- 🟣 Roxo — Caos/Debuff
- 🟢 Verde — Sustain

Para implementar: adicionar campo `vibe` em `BASE_CARDS` + CSV.

## Níveis de carta persistentes (roguelike)
| Nível | Multiplicador | Borda |
|---|---|---|
| Bronze | ×1.00 | fosca |
| Prata | ×1.10 | metálica |
| Ouro | ×1.20 | brilhante |
| Platina | ×1.35 | glow |
| Esmeralda | ×1.50 | pulsante |
| Diamante | ×1.75 | arco-íris |

## Convenções importantes
- Ao mudar stats: editar **tanto** `BASE_CARDS` (index.html) **quanto** `GAME_DATA.csv`
- Nomes de arquivo de herói: **minúsculos, sem acento** (`vitao.png`, `leo.png`)
- Imagens ficam em `assets/heroes/` — carregadas via GitHub raw com fallback base64

## ✅ STATUS — Implementado em 2026-06-14 (sessão "Cartas & Base de Dados")

> ⚠️ Todos os stats/efeitos novos são **PLACEHOLDER** (`// TODO balancear`). Troque à vontade no `CARDS_CSV`.

**Pipeline:** `CARDS_CSV` embutido → `parseCardsCSV()` → `BASE_CARDS`. Fonte única (ver acima).

**Vibes:** campo `vibe` adicionado a TODAS as cartas (distribuição é chute — trocar). Sinergia passiva LEVE ligada: 2 cartas da mesma vibe em campo → +10% ATK no campo; 3+ → +20% (`vibeSynergyMult`, constantes `VIBE_SYN_2/3` no bloco TUNING). Passivas individuais dos peões de vibe ainda são STUB (`special: vibe_*`).

**Itens agora FUNCIONAM no turn-based.** Decisões de design travadas com o usuário:
- Jogados na fase **LAST MINUTE** (1 carta rápida por turno: item OU arapuca). DOWN FASE continua = 1 monstro.
- Efeitos valem **só na resolução do turno** (sem timers). Implementados em `applyTurnItem()`:
  `heal_all`, `atk_buff`, `draw2`, `resurrect`, `next_hp_buff` + debuffs `debuff_all_atk`, `debuff_flat`, `debuff_strongest`, `debuff_silence`.
- `turboboost` foi repurposado p/ +20% ATK (era velocidade, obsoleta) — **TODO redesenhar**.
- A IA joga 1 item simples na LAST MINUTE só nas dificuldades com `usesItems:true` (medium/hard).

**5 itens-debuff novos:** Ressaca, Dedinho Mindinho, Calúnia, Joga Areia, Barraco (efeitos = −ATK no inimigo nesta resolução).

**5 peões de Vibe novos** (★2): Festeiro 🟡, Brutamonte 🔴, Maestrinho 🔵, Caótico 🟣, Brotinho 🟢. Entram na contagem de sinergia; passiva própria = STUB.

**5 Arapucas novas** (`kind:trap`, face-down): Buraco na Pista, Emboscada, Rede, Praga, Bomba de Fumaça. **Auto-disparam na resolução** se o inimigo está atacando (`resolveTraps`/`applyTrap`). Vão pro cemitério ao disparar.

**Balanceamento (o jogo estava difícil demais):** causa nº1 era o deck cheio de itens "mortos" (agora funcionais). Além disso, no bloco **TUNING** (topo, perto de `AI_DECKS`):
- `FIGHT_CURVE` — multiplica atkMult/lv da IA por fight. **Fight 1 propositalmente fraco** (×0.65, lv−1).
- `PLAYER_HAND_BONUS` — +1 carta inicial no Fight 1 do roguelite.
- `AI_DECKS[*].usesItems` — se a IA usa itens.

## ✅ STATUS — 2026-06-14 (parte 2: Deck Builder + imagens)

**Coluna `img` (todas as cartas):** schema ganhou `img` (último campo). `cardImgSrc(card)` resolve `img` próprio (em `assets/cards/<arquivo>`) > imagem de herói > `null` (cai no emoji). Fallback gracioso via `imgFallback()` no `onerror`. Emoji agora é só stand-in temporário até a imagem chegar. **Meta: imagem individual em toda carta** — basta preencher a coluna `img` e dropar o arquivo em `assets/cards/`.

**Coleção com QUANTIDADE:** `Save.collection` virou mapa `{id: qtd}` (antes era array de ids). `Save.normalize()` migra saves antigos automaticamente (array → mapa, qtd = `copies` da carta). Helpers: `ownedQty`, `owns`, `collectionIds`, `addCard(id,n)`. Loja (`buyBooster`) acumula quantidade. Biblioteca mostra `×N`.

**Deck Builder (tela `deckbuilder`, no menu "🃏 MEU BARALHO"):** duas colunas — esquerda COLEÇÃO (clique adiciona, respeita cópias possuídas), direita BARALHO (clique remove). Botões Auto-completar / Limpar / Salvar / Voltar. Tamanho **fixo alvo `DECK_SIZE=30`** (editável), mínimo `MIN_DECK=10` pra poder jogar. Persiste em `Save.deck` (array de ids). Funções `DB`/`openDeckBuilder`/`dbAdd`/`dbRemove`/`dbAutoFill`/`dbSave`/`renderDeckBuilder`.

**buildPlayerDeck mudou:** antes montava TODAS as cartas; agora monta a partir do **baralho salvo** (`Save.deck`) — ou, se não houver, auto-monta da coleção (`autoDeckIds`, até `DECK_SIZE`). Vale pra **Roguelite e Duelo Livre**. Password BOTECO = deck completo (todas as cartas). Helpers: `instOf`, `currentDeckIds`.

> ⚠️ Layout do Deck Builder é V1 funcional (colunas com scroll); polish fino de tela fica pro capítulo **Experiência & Clareza** (`CONTEXT_UX.md`).

### Pendências desta frente (próximas)
- [ ] Trocar nomes/efeitos/stats placeholder (vibes, peões de vibe, debuffs, arapucas).
- [ ] Implementar as passivas individuais dos peões de vibe (`vibe_*`) e habilidades dos heróis (`recycler`/`deathbuff`/etc.) no turn-based.
- [ ] Redesenhar `turboboost`.
- [ ] Triângulo ATK/DEF/BAL na resolução + renomear p/ ATAQUE/DEFESA/EQUILÍBRIO (capítulo Game Mechanics).
- [ ] IA não seta arapucas ainda.

## Como iniciar uma sessão nesta frente
1. `git pull origin main`
2. Ler este arquivo + `CLAUDE.md` + `GAME_DATA.md`
3. Para habilidades dos heróis: confirmar design turn-based com usuário antes de implementar
4. Para novos cards (itens/peões/arapucas): confirmar adaptação dos efeitos p/ turn-based
5. Ao editar stats: sempre sincronizar `BASE_CARDS` + `GAME_DATA.csv`
