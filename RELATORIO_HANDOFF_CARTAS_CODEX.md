# Relatorio de handoff - expansao de cartas CODEX

Data: 2026-06-18  
Projeto: Batalha dos Amigos / fortbc  
Objetivo desta sessao: criar uma base de expansao de cartas sem alterar o `GAME_DATA.csv` original nem o `index.html` do jogo.

## Resumo executivo

Foi criada uma versao experimental chamada **GAME_DATA_CODEX** para planejar a expansao do jogo com novas cartas inspiradas em YGO Forbidden Memories, color pie por vibe, cartas de campo, equipamentos, magias/itens, arapucas, chefes e fusoes.

Os arquivos originais do jogo nao foram modificados. A entrega ficou separada em arquivos novos:

- `GAME_DATA_CODEX.csv` - base experimental com as cartas originais + novas cartas.
- `FUSIONS_CODEX.csv` - receitas de fusao novas/planejadas.
- `GAME_DATA_CODEX_NOTES.md` - notas curtas de implementacao.
- `outputs/game_data_codex/GAME_DATA_CODEX.xlsx` - planilha Excel com abas para revisao.

O CSV experimental manteve exatamente o mesmo schema de 19 colunas usado pelo jogo atual:

```csv
id,name,kind,type,vibe,range,star,cost,hp,atk,speed,tribute,copies,special,effect,effectVal,effectDur,emoji,ability,img
```

Isso foi proposital: o arquivo pode ser comparado diretamente com o `GAME_DATA.csv` atual e partes dele podem ser importadas depois para o `CARDS_CSV` embutido no `index.html`.

## Estado dos arquivos gerados

`GAME_DATA_CODEX.csv` contem:

- 74 cartas originais vindas de `C:/Users/guibr/Downloads/GAME_DATA.csv`.
- 52 cartas novas propostas nesta sessao.
- 126 linhas totais de cartas.

Distribuicao por `kind`:

| kind | quantidade |
|---|---:|
| pawn | 39 |
| hero | 12 |
| item | 21 |
| trap | 7 |
| fusion | 22 |
| field | 10 |
| equip | 15 |

Observacao importante: `field` e `equip` ainda nao sao kinds plenamente suportados pelo engine atual. Eles foram colocados no CSV como planejamento estruturado, nao como promessa de funcionamento imediato.

## O que ja funciona so com CSV

O engine turn-based atual reconhece naturalmente:

- `pawn`
- `hero`
- `fusion`
- `item`
- `trap`

Portanto, novas cartas desses tipos funcionam se usarem campos e efeitos ja existentes.

### Efeitos de item ja implementados

Esses efeitos existem em `applyTurnItem()`:

| effect | comportamento atual |
|---|---|
| `heal_all` | cura unidades no campo do jogador/lado |
| `atk_buff` | multiplica ATK do campo nesta resolucao |
| `draw2` | compra N cartas, usando `effectVal` |
| `resurrect` | revive a ultima unidade do cemiterio com percentual de HP |
| `next_hp_buff` | proxima unidade recebe bonus de HP |
| `debuff_all_atk` | reduz ATK total do oponente nesta resolucao |
| `debuff_flat` | reduz ATK do oponente por valor fixo |
| `debuff_strongest` | reduz ATK com base no inimigo mais forte |
| `debuff_silence` | zera/apaga a contribuicao do inimigo mais forte |

### Efeitos de arapuca ja implementados

Esses efeitos existem em `applyTrap()`:

| effect | comportamento atual |
|---|---|
| `trap_skip` | inimigo nao ataca na resolucao |
| `trap_double` | dobra/multiplica seu dano nesta resolucao |
| `trap_net` | reduz ATK inimigo e cura um aliado ferido |
| `trap_drain` | reduz ATK inimigo |
| `trap_smoke` | reduz ATK inimigo, ainda placeholder |

### Cartas novas que ja sao plugaveis

Estas cartas novas foram criadas com efeitos ja existentes. Entram no jogo com pouca ou nenhuma mudanca de codigo, desde que sejam copiadas para o `CARDS_CSV` embutido no `index.html` e/ou para `GAME_DATA.csv`.

| id | nome | kind | vibe | efeito | status |
|---|---|---|---|---|---|
| `shape_verao` | Shape de Verao | item | azul | `atk_buff` 0.5 | funciona agora |
| `cafe_premium` | Cafe Premium | item | amarelo | `draw2` 2 | funciona agora |
| `segunda_chance` | Segunda Chance | item | amarelo | `resurrect` 0.5 | funciona agora |
| `lesao_muscular` | Lesao Muscular | item | vermelho | `debuff_strongest` 0.4 | funciona agora |
| `cancelamento` | Cancelamento | item | vermelho | `debuff_silence` 1 | aproximacao funcional |
| `motivacao_aleatoria` | Motivacao Aleatoria | item | roxo | `atk_buff` 0.35 | aproximacao funcional |
| `patch_balanceamento` | Patch de Balanceamento | item | roxo | `debuff_all_atk` 70 | aproximacao funcional |
| `insider_trading` | Insider Trading | item | verde | `draw2` 1 | aproximacao funcional |
| `black_friday_evento` | Black Friday | item | verde | `next_hp_buff` 0.3 | aproximacao funcional |
| `powerlifting` | Powerlifting | item | azul | `next_hp_buff` 0.6 | aproximacao funcional |
| `pausa_cafe` | Pausa para Cafe | trap | amarelo | `trap_skip` 1 | funciona agora |
| `roleta_corporativa` | Roleta Corporativa | trap | roxo | `trap_double` 2 | aproximacao funcional |

As marcadas como "aproximacao funcional" rodam no engine, mas ainda nao representam 100% a fantasia final da carta.

## O que precisa de codigo novo

### 1. Cartas de campo

Foram propostas 10 cartas de campo:

| id | nome | vibe | fantasia |
|---|---|---|---|
| `campo_academia_suprema` | Academia Suprema | azul | Academia +20% ATK |
| `campo_faria_lima` | Faria Lima | verde | motor de economia/recurso |
| `campo_twitchcon` | TwitchCon | amarelo | cartas Gamer rankam/ganham XP mais rapido |
| `campo_carnaval` | Carnaval | roxo | caos e bonus geral de ATK |
| `campo_congresso` | Congresso Nacional | vermelho | Controle custa menos |
| `campo_shopping` | Shopping Center | verde | equipamentos custam menos |
| `campo_lan_house` | Lan House | amarelo | compra extra |
| `campo_crise` | Crise Economica | roxo | reduz eficiencia de dinheiro/recurso |
| `campo_campeonato` | Campeonato Mundial | azul | elite recebe bonus |
| `campo_apocalipse_zumbi` | Apocalipse Zumbi | roxo | fusoes recebem bonus |

O `index.html` ja tem indicios de uma zona de campo:

- `clickFieldZone()`
- `G.playerFieldCard`
- `G.aiFieldCard`
- drop em `fieldzone`

Mas a regra ainda nao esta aplicada em `computeFieldAtk()` nem em compra/rank/custo. Ou seja: existe gancho de UI/estado, mas falta engine.

Implementacao sugerida:

1. Fazer `field` virar `isQuickCard()` ou uma categoria propria jogavel na fase principal.
2. Garantir que `field` so pode ir para `G.playerFieldCard` / `G.aiFieldCard`.
3. Criar `fieldAura(side)` ou `applyFieldModifiers(side)` chamado em:
   - `computeFieldAtk(side)`
   - `phaseDraw()`
   - `phaseStandby()`
   - calculo de custo, se custo passar a importar.
4. Comecar com 3 efeitos simples:
   - `field_draw_extra`
   - `field_fusion_boost`
   - `field_academia_atk` ou um buff por vibe.

### 2. Equipamentos

Foram propostas 15 cartas `equip`:

| id | nome | vibe | fantasia |
|---|---|---|---|
| `equip_creatina` | Creatina Suprema | azul | +30% HP |
| `equip_whey` | Whey Isolado | azul | regen/cura por turno |
| `equip_pretreino` | Pre-Treino Nuclear | azul | +40 ATK |
| `equip_academia_premium` | Academia Premium | azul | rank mais rapido |
| `equip_porsche` | Carrao de Arrasta | verde | gera recurso ao atacar |
| `equip_cartao_black` | Cartao Black | verde | proxima carta custa menos |
| `equip_mba` | MBA Executivo | verde | compra ao equipar |
| `equip_carteira` | Carteira de Investimentos | verde | escala com o tempo |
| `equip_setup_rgb` | Setup RGB | amarelo | XP/rank extra |
| `equip_headset` | Headset Pro | amarelo | melhora combos Gamer |
| `equip_dados` | Dados Viciados | roxo | efeito aleatorio poderoso |
| `equip_portal_caos` | Portal do Caos | roxo | libera efeitos especiais |
| `equip_processo` | Processo Judicial | vermelho | debuff persistente |
| `equip_dossie` | Dossie Confidencial | vermelho | revela mao/intencao |
| `equip_microfone_cpi` | Microfone da CPI | vermelho | silencia especiais |

O engine atual nao tem:

- escolha de alvo para equipamento;
- armazenamento de equipamento em unidade;
- buff persistente atrelado a unidade;
- remocao do equipamento quando a unidade morre;
- limite de equipamentos por carta.

Implementacao sugerida para V1:

1. `kind:'equip'` deve ser tratado como carta rapida ou como carta de fase principal.
2. Ao jogar, escolher um slot aliado ocupado.
3. Adicionar `card.equips = []` na unidade de campo.
4. Guardar efeito simples em `equips`.
5. `getEffAtk(card)` e calculo de HP devem considerar equipamentos.
6. Quando a unidade morre, seus equipamentos vao junto para o cemiterio ou simplesmente somem, decisao a tomar.

Para comecar, implementar so:

- `equip_atk_flat`
- `equip_hp_mult`
- `equip_draw_on_attach`

### 3. Arquétipos, classes e tags

A conversa anterior apontou a necessidade de um color pie mais robusto.

Identidades propostas:

| cor/vibe | fantasia | forca | fraqueza |
|---|---|---|---|
| azul | Poder Absoluto / Academia | status alto | lento |
| amarelo | Flexibilidade / Gamer / Festa | consistencia | menos poder bruto |
| roxo | Caos | quebra regras | inconsistente |
| verde | Economia / Dinheiro | escala | inicio fraco |
| vermelho | Controle | impede jogadas | pouca pressao |

O parser atual ignora colunas extras. Para o sistema ficar bom, adicionar futuramente:

```csv
archetype,class,tags
```

Exemplos:

- Investidor: `Dinheiro;Inteligencia;Ambicao`
- Streamer: `Gamer;Social;Influencia`
- Bombado: `Academia;Forca;Evolucao`
- Processo Judicial: `Controle;Debuff;Burocracia`

Por que isso importa:

- campos podem buffar `Academia`, `Gamer`, `Dinheiro`;
- equipamentos podem ter bonus por tag;
- fusoes podem usar tag em vez de depender so de vibe;
- recompensas podem ficar contextuais ao deck;
- loja/boosters podem vender arquetipos.

Implementacao sugerida:

1. Expandir `CARDS_CSV` com as colunas novas.
2. Atualizar `parseCardsCSV()` para ler `archetype`, `class`, `tags`.
3. Em `tags`, separar por `;`.
4. Garantir que `makeFC()` preserve esses campos nas cartas em campo.
5. Adicionar helpers:

```js
function hasTag(card, tag) { return card?.tags?.includes(tag); }
function hasArchetype(card, arch) { return card?.archetype === arch || hasTag(card, arch); }
```

### 4. Economia/recurso

Algumas cartas pedem um recurso que ainda nao existe claramente no turno atual:

- Faria Lima
- Cartao Black
- Carrao de Arrasta
- CEO Multimilionario
- Rei da Faria Lima
- Insider Trading

Antes de implementar, decidir se "recurso" no jogo sera:

1. desconto de custo da proxima carta;
2. compra extra;
3. permissao de jogar segunda carta rapida;
4. moeda persistente da run;
5. energia por turno.

Recomendacao conservadora: nao criar mana completa agora. Para V1, mapear economia para:

- `costDiscountNext`
- `extraDrawThisTurn`
- `extraQuickPlay`

Isso combina melhor com o jogo atual.

## Chefões e fusoes planejadas

Chefes adicionados ao CODEX:

| id | nome | vibe | papel |
|---|---|---|---|
| `boss_mr_olympia` | Mr Olympia Supremo | azul | Blue Eyes do deck Academia |
| `fus_deus_shape` | Deus do Shape | azul | fusao suprema Academia |
| `boss_rei_faria_lima` | Rei da Faria Lima | verde | motor final de economia |
| `boss_ceo_multimilionario` | CEO Multimilionario | verde | gerador absurdo de recurso |
| `boss_streamer_supremo` | Streamer Supremo | amarelo | combo master Gamer |
| `boss_proplayer_lendario` | Pro Player Lendario | amarelo | sinergia Gamer |
| `boss_agente_caos` | Agente do Caos | roxo | manipula regras |
| `boss_entidade_vazio` | Entidade do Vazio | roxo | efeito imprevisivel |
| `boss_grande_censor` | Grande Censor | vermelho | controle absoluto |
| `boss_imperador_burocracia` | Imperador da Burocracia | vermelho | trava jogo |

Fusoes hibridas adicionadas:

| id | nome | ideia |
|---|---|---|
| `fus_ceo_startup` | CEO da Startup | Gamer + Dinheiro |
| `fus_streamer_fitness` | Streamer Fitness | Academia + Gamer |
| `fus_alpha_bilionario` | Alpha Bilionario | Dinheiro + Academia |
| `fus_magnata_digital` | Magnata Digital | Social/Caos + Dinheiro |
| `fus_guru_financeiro` | Guru Financeiro | Coach + Investidor |

`FUSIONS_CODEX.csv` contem receitas experimentais. Algumas usam `equip_*` como ingrediente; isso e intencional como design, mas talvez nao funcione no resolver atual sem adaptacao.

## Sobre o resolver de fusao atual

O jogo atual tem `FUSIONS_CSV` separado de `CARDS_CSV`. O modelo usa receitas por:

- vibes: `recipe,vibe:amarelo,vibe:verde,...`
- posturas/tags especiais: exemplo observado `postura:muro`
- IDs especificos: `specific,arthur,letti,...`

Para importar fusoes novas:

1. Garantir que o resultado existe como `kind:'fusion'` em `CARDS_CSV`.
2. Adicionar a receita ao `FUSIONS_CSV`.
3. Se a receita usa tags/equipamentos, confirmar se `fusionTraits()` reconhece isso.

Risco atual: receitas com `equip_*` podem nao ser validas se o resolver filtrar apenas monstros ou nao tratar equipamento como ingrediente.

## Relacao com o index.html

Foi lido o `index.html` anexado em `C:/Users/guibr/Downloads/index.html`.

Pontos relevantes encontrados:

- `CARDS_CSV` e a fonte embutida de cartas.
- `parseCardsCSV()` transforma CSV em `BASE_CARDS`.
- `BASE_CARDS` e gerado no load.
- `applyTurnItem()` define os efeitos reais de item.
- `applyTrap()` define os efeitos reais de arapuca.
- `computeFieldAtk()` calcula ATK de campo.
- `VIBE_BEATS`, `VIBE_ADV`, `VIBE_DIS` indicam que vantagem por vibe ja existe nessa versao anexada.
- `G.playerFieldCard` / `G.aiFieldCard` existem como estado, mas ainda nao viraram aura funcional clara.
- `isMonster()` reconhece `pawn`, `hero`, `fusion`.
- `isQuickCard()` reconhece `item`, `trap`.

Conclusao: para uma carta funcionar hoje, o caminho mais seguro e ela ser `item`, `trap`, `pawn`, `hero` ou `fusion` e usar efeitos ja conhecidos.

## Ordem recomendada para continuar

### Fase A - Importacao segura

Importar apenas as cartas `FUNCIONA_AGORA` e algumas `FUNCIONA_AGORA_APROX`.

Checklist:

- copiar linhas escolhidas de `GAME_DATA_CODEX.csv` para o `CARDS_CSV` embutido;
- espelhar em `GAME_DATA.csv`;
- adicionar imagens depois ou deixar fallback por enquanto;
- testar compra, uso e resolucao;
- ajustar `copies` para nao poluir demais o deck.

### Fase B - Campo simples

Implementar `kind:'field'`.

Sugestao de primeira leva:

- Lan House: compra +1.
- Academia Suprema: azul/Academia +ATK, ou se ainda nao tiver tag, cartas azuis +ATK.
- Apocalipse Zumbi: fusoes +ATK.

Evitar comecar por Faria Lima se recurso ainda nao estiver decidido.

### Fase C - Equipamento simples

Implementar `kind:'equip'` com alvo aliado.

Primeira leva:

- Creatina Suprema: +HP.
- Pre-Treino Nuclear: +ATK.
- MBA Executivo: compra ao equipar.

Evitar equipamentos com debuff inimigo, revelacao de mao e efeitos aleatorios ate o sistema basico estar solido.

### Fase D - Tags/arquetipos

Adicionar colunas ao CSV:

```csv
archetype,class,tags
```

Depois disso, voltar em campos/equipamentos para serem baseados em:

- Academia
- Dinheiro
- Gamer
- Caos
- Controle
- Social/Influencer, se desejado

### Fase E - Chefões reais

Depois de tags/campos/equipamentos, transformar chefões em cartas realmente especiais.

Exemplos:

- Mr Olympia: recebe bonus de equipamentos Academia.
- Deus do Shape: fusao suprema com stat absurdo.
- Rei da Faria Lima: acumula descontos/compra.
- Streamer Supremo: melhora combos Gamer.
- Agente do Caos: randomiza efeitos.
- Grande Censor: bloqueia item/arapuca.

## Direcao de imagens

As cartas novas usam nomes de arquivo futuros em `img`, mas as imagens ainda nao foram criadas/colocadas em `assets/cards`.

Direcao visual por vibe:

| vibe | direcao visual |
|---|---|
| azul / Academia | academia exagerada, luz fria, halteres, whey, pose epica, "boss de shape" |
| verde / Dinheiro | escritorio, graficos, luxo duvidoso, terno cafona, planilhas, lancha/carrao |
| amarelo / Gamer/Festa | neon, setup RGB, live, headset, campeonato, cafe/energetico |
| roxo / Caos | glitch, dado, roleta, portal, fumaca, expressao surtada |
| vermelho / Controle | carimbo, processo, microfone de CPI, plenario, censura, burocracia agressiva |

Evitar depender de marcas reais nas artes. Pode manter a piada, mas trocar nomes/imagens muito reconheciveis por equivalentes parodicos.

## Observacoes de privacidade

O usuario mencionou preocupacao em ter criado link publico de conversa com informacoes do jogo. Recomendacao dada:

- apagar o link em ChatGPT > Settings > Data Controls > Shared links > Manage;
- preferir colar versoes resumidas/sanitizadas de relatorios aqui;
- evitar abrir/usar links publicos com material sensivel quando o conteudo pode ser colado diretamente.

## Arquivos que o proximo Codex deve abrir primeiro

1. `RELATORIO_HANDOFF_CARTAS_CODEX.md` - este arquivo.
2. `GAME_DATA_CODEX_NOTES.md` - notas objetivas sobre implementacao.
3. `GAME_DATA_CODEX.csv` - base experimental em formato compativel.
4. `FUSIONS_CODEX.csv` - receitas novas.
5. `outputs/game_data_codex/GAME_DATA_CODEX.xlsx` - revisao em planilha.
6. `index.html` atual do repo, antes de qualquer implementacao real.
7. `CONTEXT_CARDS.md` e `CONTEXT_FUSION.md`, se for mexer em parser/fusoes.

## Decisao principal pendente

Antes de codar campos/equipamentos/economia, decidir:

**O jogo vai ter recurso/mana real ou economia sera representada por compra extra, desconto e acoes extras?**

Recomendacao atual: usar economia leve primeiro:

- desconto da proxima carta;
- compra extra;
- permissao de uma segunda carta rapida.

Isso preserva o ritmo Forbidden Memories e evita transformar o jogo em outro sistema antes de o loop principal estar polido.

