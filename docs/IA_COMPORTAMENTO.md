# 🤖 Como a IA joga — Comandante do Caos

> Documento pra você avaliar se a lógica faz sentido e apontar mudanças. Tudo aqui está implementado no `index.html` (funções `aiDecideAction`, `applyAiPlan`, `aiDecideLastMinute`† e auxiliares). Nível: **heurística simples e determinística** — sem árvore de busca, sem aleatoriedade além dos itens.

## Visão geral do turno da IA

A IA joga nas mesmas regras do jogador (mesma Influência, mesmo deck do Comandante via CSV, mesmos custos). O turno é **simultâneo**: durante a sua fase de AÇÃO, a IA monta um **plano secreto** (`aiDecideAction`); quando você aperta **Finalizar ›**, o plano é aplicado (`applyAiPlan`) e as cartas dela entram viradas — reveladas na RESOLUÇÃO, junto com as suas.

## Passo a passo da decisão (fase AÇÃO)

1. **Inventário:** olha a própria mão, a Influência disponível e as zonas livres.
2. **Monstros primeiro, do mais forte pro mais fraco:** ordena os monstros da mão por **ATK bruto decrescente** e baixa um por um enquanto:
   - houver zona livre (até 6), e
   - a Influência bancar o custo (`cost` da carta, ou o padrão do Comandante).
   > ⚠️ Ponto de avaliação: ela **não** considera DEF na priorização — um tanque de 500🛡/30⚔ perde pra um atacante de 60⚔. Com o motor pool-vs-pool, isso significa que a IA tende a montar pools ofensivos e subvalorizar defesa. Faz sentido pro seu design, ou quer um balanceador (ex.: ordenar por `atk×3 + hp`)?
3. **Um item por turno (se a dificuldade permitir):** com a Influência que sobrar, joga **no máximo 1 item**, escolhido nesta ordem de preferência:
   1. Buff de ATK (`atk_buff` — Energético/Turbo)
   2. Qualquer debuff (`debuff_*` — Ressaca, Calúnia…)
   3. O primeiro item qualquer que tiver
   > Upgrades (⬆️) são ignorados pela IA (ela não evolui cartas — ponto de avaliação).
4. **Fim.** O que sobra de Influência acumula pro turno seguinte (até o teto do Comandante).

## O que a IA **não** faz hoje (lista honesta)

| Capacidade | Status | Nota |
|---|---|---|
| Fundir cartas | ❌ | Nunca funde — não usa o 🌀 dela |
| Invocar o Comandante | ❌ | A mecânica de Invocação (v4.1) é só do jogador por ora |
| Usar arapucas estrategicamente | ⚠️ | Baixa arapucas como se fossem monstros (entram na ordenação por ATK 0 → viram a última prioridade; na prática quase nunca entram) |
| Evoluir tiers (Upgrade) | ❌ | Ignora itens de upgrade |
| Comprar na Loja | ❌ | Não compra peões |
| Itens geradores de peões | ✅ | Se jogar Recruta/Mercado Negro, ganha peões aleatórios na mão |
| Itens de escolha (scry, salvage, evolve_choose) | ✅ simplificado | Sem UI: pega a 1ª opção / aleatória |
| Declarar Carta de Campo | ✅ (v4.2) | Declara se tiver carta de Campo na mão E sobrar 2+✦ após as jogadas |
| Ler o SEU campo / reagir | ❌ | O plano dela ignora completamente o que você fez no turno |

## Dificuldade

- No **Rogue**, a força da IA vem do **deck do Comandante** (CSV): decks e stats melhores a cada fight, e o boss (Garopaba) tem PV 2500, 2 fusões/turno (não usadas ainda) e deck com versões **gold**.
- O multiplicador antigo de dificuldade (`AI_DECKS` easy/medium/hard) só é usado como **fallback** quando não há Comandante inimigo definido (ex.: decks de password). `usesItems` da dificuldade `medium+` é o que libera o passo 3 acima.

## Onde mexer (se você quiser ajustar)

Tudo em `index.html`:
- `aiDecideAction()` — o cérebro do turno (ordenação, orçamento de Influência, escolha de item, declaração de Campo).
- `applyAiPlan()` — aplica o plano (não mexer, é execução).
- `commanderDeckIds()` / `commanders_database.csv` — força real da IA (deck e stats por Comandante).

## Sugestões que eu (Code) faria — pra você aprovar ou descartar

1. **Peso de defesa na ordenação** (`atk*3 + hp*0.5`) — evita a IA ignorar tanques.
2. **IA funde** quando tiver par de mesma vibe na mão e 🌀 disponível — usa a infra que já existe (`fusePair`).
3. **IA invoca o Comandante** quando a condição dela estiver atendida (checagem já existe: `checkSummonCondition('ai')`).
4. **Guardar Influência de propósito** em turnos de Campo declarado (hoje ela declara Campo só com o que sobra por acaso).

† `aiDecideLastMinute` é código morto do fluxo antigo (fase ITENS extinta) — ignorar.
