# GAME_DESIGN.md — Comandante do Caos

> Projeto: `commanders` (codinome de board: "Memórias do Proibidão")
> Fork de design de "Batalha dos Amigos" (repo `fortbc`). Este documento substitui inteiramente o `GAME_DESIGN.md` antigo — o sistema descrito ali (lanes, torres, ATB, range melee/mid/long, tiers Bronze→Diamante) está **abandonado** e não deve ser usado como referência de mecânica. O `fortbc` é preservado só como histórico.

---

## 1. Visão do jogo

Roguelike de cartas **single-player**. O jogador escolhe 1 Comandante do Caos e enfrenta os outros 3 (dos 4 totais desta versão) em ordem fixa, numa run de tamanho fixo. O motor de progressão dentro da run é a **fusão de cartas** (inspirada em Yu-Gi-Oh Forbidden Memories): o jogador funde pares de cartas da própria mão para criar cartas mais fortes, e pode ampliar suas opções de fusão comprando peões de vibes diferentes.

PvP / multiplayer é considerado **fase 2 condicional** — só será desenvolvido se o modo Rogue gerar tração real com o grupo de amigos. Não é o foco desta etapa.

### Por que alguém joga isso

Não é conteúdo extenso nem retenção de longo prazo (campanha, decks temáticos, sistemas tipo live-service — tudo isso foi avaliado e descartado). A proposta de valor é:
- **Pessoal/autoral**: o jogo é um laboratório de design do criador, usando mecânicas admiradas de outros jogos como inspiração.
- **Social**: heróis com a cara dos amigos do grupo, piadas internas, conteúdo que não existe em nenhum outro jogo.
- **De sessão curta**: runs de tamanho fixo, jogáveis em uma noite, repetíveis várias vezes.

---

## 2. Estrutura da run

- Exatamente **4 Comandantes do Caos** fixos nesta versão (dos 10 heroes totais do universo do jogo — os outros 6 não são jogáveis/inimigos nesta versão).
- Jogador escolhe **1 Comandante** para si; os outros 3 são enfrentados em **ordem pré-definida** (não escolhida pelo jogador).
- Run de **tamanho fixo**: termina ao vencer ou perder contra o 4º Comandante. Sem NG+, sem progressão infinita.
- **Deck do jogador persiste através de toda a run**: fusões feitas e peões adquiridos no combate 1 carregam para o combate 2, 3 e 4. A run conta a história de como aquele deck evoluiu.
- Vitória/derrota de cada combate: reduzir o PV do Comandante oponente a zero (ou ser reduzido a zero).

---

## 3. Comandantes

Cada Comandante (jogável ou inimigo) é assimétrico de verdade — não é só uma skin diferente:

- **Deck-base próprio**: cada Comandante começa com um deck fixo + pequena variação aleatória na monta inicial (mesma base, não é deckbuilding livre antes da run).
- **Tabuleiro próprio com regras de combate diferentes**: zonas, alcance e posicionamento variam por Comandante e afetam regras de jogo (não é só visual).
- **Geração de recursos própria**: cada Comandante tem lógica condicional própria para gerar Influência (ver seção 4). Exemplos de gatilhos a explorar: campo vazio, campo cheio, cartas da mesma vibe no campo, cartas de vibes diferentes no campo. Este espaço é de **experimentação** — variações serão testadas, não há fórmula fechada ainda.
- A carta do Comandante tem PV próprio (os PV "do jogador" são, na prática, os PV do Comandante).
- Vibe do Comandante tinge visualmente o campo daquele lado.

Os 10 heroes existentes (Arthur, Fanta, Garopaba, Bala, Nathan, Léo, Zaga, Vitão, Borba, Letti) e suas vibes são reaproveitados como base de conteúdo/referência. **Quais 4 serão os Comandantes do Caos jogáveis/inimigos desta versão ainda está em aberto.**

---

## 4. Recursos — Influência

- **Influência** é o recurso de ação do turno. Baixar uma carta (monstro/peão) custa uma quantidade fixa de Influência.
- Geração de Influência é **condicional e varia por Comandante** (ver seção 3) — derivada de cartas em campo e/ou de requisitos próprios do Comandante.
- Peões funcionam como motores de Influência: ter campo desenvolvido importa tanto quanto ter a carta mais forte na mão.

---

## 5. Fusão

- Mecânica central de progressão da run, estilo Yu-Gi-Oh Forbidden Memories.
- Consome **exatamente 2 cartas** da mão (nunca mais, nunca menos) → as duas cartas originais **voltam para o monte do deck** (não são descartadas permanentemente) → produz **1 carta nova** na mão.
- O jogador pode fazer várias fusões num turno, respeitando um limite de fusões disponíveis por turno (contador 🌀, ex: "1/1" — pode ser ampliado por artefato/efeito de run).
- Receitas de fusão são baseadas em **vibe** (cor/naipe) das cartas combinadas, e também podem existir receitas **específicas** (ex: Herói A + Herói B → carta única).
- Objetivo de turno: montar o maior combo possível de ATK com os recursos disponíveis na mão.

### Aquisição de peões (dois caminhos complementares)

1. **Loja** (aba permanente na UI): compra o peão básico da própria vibe do Comandante por um custo fixo de Influência.
2. **Carta-efeito "geradora de peões"**: ação habilitada por uma carta específica, que permite comprar peões de **qualquer vibe**, inclusive diferente da do jogador — isso é o que abre linhas de fusão cruzada entre vibes.

Esses dois caminhos **coexistem**; um não substitui o outro.

---

## 6. Vibes (naipes)

5 vibes, com cor e identidade temática fixas:

| Vibe | Cor (hex) | Nome | Tema |
|---|---|---|---|
| Amarelo | `#f5c542` | Nerdola | Geek, games & internet |
| Vermelho | `#e63946` | Socialista | Povo, treta & revolução |
| Azul | `#2196f3` | Marombeiro | Academia & shape |
| Roxo | `#9c27b0` | Rolezeiro | Balada, night & pegação |
| Verde | `#4caf50` | Dinheirista | Grana & investimentos |

---

## 7. Cartas

- Tipos: **DEFENSE / ATTACK / BALANCE** — são tipos, não valores de stat separados; cada carta tem apenas ATK e HP/PV.
- Campos de range e ATB existem na estrutura de dados por herança do sistema antigo, mas estão **inertes** nesta versão — não implementar lógica de range/ATB.
- Cartas de monstro: borda branca estilo manga, com esfera colorida na cor da vibe.
- Cartas de item: fundo preto.
- Cartas de Comandante: colocação de cor completa.

---

## 8. Fora de escopo (decisões já tomadas, não revisitar sem discussão explícita)

- Modo Campanha, modo Visual Novel.
- Decks temáticos especulativos não ligados aos heroes reais (ex: temas de outras franquias).
- Sistemas tipo live-service: cartas numeradas/NFT-like, login diário, profile de jogador, loja estilo gacha/cosmético.
- Migração de engine (ex: Godot) — o jogo continua single-file HTML, sem build system.
- Terreno como carta com efeito mecânico (descartado; tabuleiro por Comandante cumpre esse papel agora).
- PvP como modo primário (é fase 2 condicional).
- Progressão infinita / NG+ na run.

---

## 9. Ver também

- `UI_CAMPO.md` — decisões de layout, fluxo de tela e interação da tela de duelo (campo de batalha).
- `CLAUDE.md` — contexto de pivot para sessões futuras do Claude Code.
