# Design — Sistema de Campo, Arapucas e Novas Cartas
### Comandante do Caos · Adições para Demo

---

## 1. CAMPO COMPARTILHADO

### Conceito
Uma zona única, entre os dois campos, que representa quem está "controlando o ambiente" da batalha. Quem controla o Campo ativa um efeito global que altera as regras daquele turno.

A disputa pelo Campo é resolvida com a **Influência poupada** — não gasta em cartas. Isso cria a tensão central: jogar mais cartas (gastar Influência) vs guardar para vencer a disputa pelo Campo.

### Fluxo por fase

**AÇÃO (fase do jogador):**
- O jogador pode colocar uma Carta de Campo virada na zona especial de Campo (fora dos 6 slots normais — zona própria no centro).
- Isso é opcional — se não colocar nada, não participa da disputa.
- Custo de declarar: gratuito (a carta de Campo não tem custo de Influência — o custo É a Influência que você não vai gastar em outras coisas).

**RESOLUÇÃO:**
1. **Traps ativam primeiro** (ver seção 2).
2. **Disputa de Campo:**
   - Se apenas 1 jogador declarou Campo → vence automaticamente.
   - Se ambos declararam → compara Influência restante. Quem sobrou mais ganha. Empate → Campo atual se mantém (ou vazio se não havia).
   - Se nenhum declarou → Campo permanece do turno anterior (se houver).
3. **Vencedor do Campo recebe bônus** baseado na Influência que sobrou **depois da declaração de vitória:**
   - Sobrou 1✦ → +1 carta comprada no próximo DRAW
   - Sobrou 2✦ → +2✦ de Influência no próximo turno
   - Sobrou 3+✦ → efeito da Carta de Campo ativa integralmente
4. **Pools de ATK e DEF calculados** (com efeito de Campo ativo se aplicável).
5. **Dano aplicado.**
6. Todos os cards do campo (unidades + arapucas) vão para o descarte. A Carta de Campo **permanece** na zona de Campo até ser substituída — ela não vai para o descarte após um turno.

### O que acontece com a Carta de Campo perdedora?
- Vai para o descarte do dono.
- O Campo ativado permanece até ser disputado novamente (não é one-shot).

### Exemplo de partida
*Turno 2. Fanta tem 3✦ sobrando. Arthur tem 5✦ sobrando. Fanta declarou Campo "LAN House" (Nerdola). Arthur também declarou "Academia" (Marombeiro). Arthur vence. Como sobrou 5✦, o efeito de "Academia" ativa (DEF +30%). Na próxima rodada, Arthur guarda menos e Fanta guarda mais — o jogo de blefe começa.*

---

### Cartas de Campo (kind: `campo`)

Cartas de Campo não têm custo de Influência. Ocupam a zona especial de Campo, não os slots de unidade. Permanecem em jogo até serem substituídas.

| id | name | vibe | efeito (3+✦ pra ativar) | tier |
|---|---|---|---|---|
| campo_lan | LAN House | amarelo | Jogador compra +2 cartas extras no próximo DRAW | bronze |
| campo_academia | Academia | azul | DEF pool do controlador +30% nesta resolução | bronze |
| campo_manifestacao | Manifestação | vermelho | ATK pool do adversário -20% nesta resolução | bronze |
| campo_baile | Baile Funk | roxo | ATK pool do controlador +20% e uma arapuca aleatória do adversário é anulada | bronze |
| campo_resenha | Resenha em Casa | verde | Custo de todas as cartas do controlador -1✦ no próximo turno | bronze |
| campo_funeraria | Funerária | roxo | Adversário não pode ativar arapucas neste turno | bronze |
| campo_academia_gold | Academia Olímpica | azul | DEF pool do controlador +50% + recupera 200 de PV | gold |
| campo_manifestacao_gold | Greve Geral | vermelho | ATK pool adversário -40% + queima 2✦ do adversário | gold |

---

## 2. ARAPUCAS (SISTEMA ATUALIZADO)

As arapucas já existem como tipo no CSV, mas precisam de mecânica formal:

### Regras
- Ocupam 1 slot do campo (como unidade), mas ficam **viradas face-down** — igual a qualquer carta baixada.
- O adversário não sabe se o slot tem uma unidade ou uma arapuca.
- **Na RESOLUÇÃO:**
  1. Primeiro: todas as cartas viram face-up.
  2. Segundo: arapucas ativam (em sequência, posição 1→6 do campo).
  3. Terceiro: pools de ATK/DEF calculados com efeitos já aplicados.
  4. Quarto: dano.
  5. Quinto: tudo vai para o descarte (incluindo as arapucas).
- Arapucas **não contribuem** para ATK nem DEF pool.
- Arapucas afetam o turno em que ativam — não persistem.

### Novas arapucas a adicionar ao CSV

| id | name | efeito |
|---|---|---|
| trap_relacionamento_toxico | Relacionamento Tóxico | ATK pool do jogador alvo -25% nesta resolução |
| trap_zoado | Zoado no Grupo | DEF pool do jogador alvo -30% nesta resolução |
| trap_historia_ingrata | História Ingrata Relembrada | Uma unidade aleatória do adversário é removida antes do cálculo do pool |
| trap_tudo_ou_nada_atk | Tudo ou Nada | Cara: ATK inimigo -50%. Coroa: SEU ATK -50%. (coin flip na resolução) |
| trap_tudo_ou_nada_def | Tudo ou Nada #2 | Cara: DEF inimigo -50%. Coroa: SUA DEF -50%. (coin flip na resolução) |

> **Nota de implementação:** `trap_historia_ingrata` remove uma unidade (não arapuca) aleatória antes do cálculo. A unidade vai para o Lixo, não o descarte.

> **Nota sobre "Tudo ou nada":** o coin flip deve ter animação de moeda girando (mesmo que simples) — é parte do charm da carta. Math.random() > 0.5 para a lógica.

---

## 3. NOVAS CARTAS DE ITEM

Adicionar ao `cards_database_v2.csv`:

| id | name | cost | efeito | emoji |
|---|---|---|---|---|
| item_mao_cagada | Mão Cagada | 2 | Descarte a mão inteira. Compre 7 cartas novas. | 🗑️ |
| item_rolezim | Rolezim | 1 | Descarte 2 cartas da mão. Compre 3 cartas. | 🔄 |
| item_mistura | Mistura de Drinks | 3 | +1 fusão disponível neste turno (ignora limite). | 🍹 |
| item_mulher | Botar Mulher pra Galera | 2 | +3✦ de Influência imediatamente. | 💃 |
| item_promocao | Promoção | 4 | Escolha um tipo de carta no baralho. Todas as cópias Bronze→Prata ou Prata→Gold. | 📈 |
| item_revirar | Revirar o Lixo | 2 | Busque 1 carta do descarte e adicione à mão. | 🔍 |
| item_antecipacao | Antecipação | 3 | Veja as 5 cartas do topo do deck. Pegue 1 para a mão, embaralhe o resto. | 🔮 |
| item_pedras | Pedras Anti Bad Vibes | 2 | Todas as arapucas/armadilhas do inimigo são anuladas nesta resolução. | 🪨 |

### Notas de implementação por carta

**Mão Cagada:** `effectType: 'discard_draw'`, `effectVal: 7`. O descarte vai para o descarte normal (não Lixo). Se o deck não tiver 7 cartas, embaralha o descarte e continua.

**Rolezim:** `effectType: 'discard_draw_partial'`, descarta 2 escolhidas pelo jogador (pequeno seletor de mão), depois compra 3.

**Mistura de Drinks:** `effectType: 'bonus_fusion'`, `effectVal: 1`. Incrementa `G.fusionsLeft += 1` neste turno apenas.

**Botar Mulher pra Galera:** `effectType: 'gain_influence'`, `effectVal: 3`. Garante que não ultrapasse o `inf_cap` do Comandante.

**Promoção:** `effectType: 'evolve_choose'`. Abre um pequeno seletor de tipo de carta (filtra pelas famílias presentes no deck). Chama `evolveCard()` para a família escolhida. Funciona como Upgrade mas sem precisar fundir.

**Revirar o Lixo:** `effectType: 'salvage_discard'`. Abre o visualizador do descarte em modo de seleção. Jogador escolhe 1 carta. Retorna ao topo da mão.

**Antecipação:** `effectType: 'scry_pick'`. Mostrar as 5 cartas do topo em uma preview. Jogador clica em 1 para pegar. Resto vai de volta (embaralhado na posição original ou no topo — embaralhado é mais equilibrado).

**Pedras Anti Bad Vibes:** `effectType: 'trap_immunity'`. Seta `G.trapImmune.player = true` para a resolução atual. As arapucas inimigas checam esse flag antes de ativar.

---

## 4. INTEGRAÇÃO — ORDEM DE RESOLUÇÃO ATUALIZADA

Com Campo Compartilhado e Arapucas formalizados, a ordem completa da RESOLUÇÃO é:

```
1. Cartas Campo: revelar ambas (se declaradas). Comparar Influência restante. 
   → Vencedor definido. Carta perdedora vai ao descarte. Carta vencedora permanece.
   
2. Pedras Anti Bad Vibes: checar se algum jogador usou. Setar flag de imunidade.

3. Arapucas: ativar em sequência (posição 1→6 em cada campo, inimigo antes do jogador).
   → Modificadores de pool aplicados.
   → Coin flips de "Tudo ou Nada" revelados com animação.
   → Historia Ingrata: remove unidade aleatória.

4. Efeito de Campo: se vencedor teve 3+✦ sobrando, efeito da Carta de Campo ativa.

5. Pools calculados: ATK e DEF de cada lado somados com todos os modificadores acumulados.

6. Dano aplicado a cada Comandante.

7. Limpeza: todas as cartas de campo (unidades + arapucas) → descarte. Carta de Campo fica.

8. Bônus de Campo: se vencedor sobrou 1✦ → +1 draw; 2✦ → +2 Influência próximo turno.
```

---

## 5. PRIORIDADE PARA O PRÓXIMO CODE SESSION

**O que vai no Code agora (junto com o v4.1 já preparado):**

Prioridade 1 (desbloqueiam jogabilidade):
- Arapucas: formalizar ativação na resolução + novas 5 do CSV
- Novas cartas de item (CSV + `effectType` handlers)
- Balanceamento emergencial (×3 ATK temporário do v4.1)

Prioridade 2 (adiciona camada estratégica):
- Sistema de Campo Compartilhado (zona visual + bid de Influência)
- Cartas de Campo no CSV + handler de campo ativo

**O que vai para Design antes do Code:**
- Mockup da zona de Campo Compartilhado (onde fica na tela? sugestão: entre os dois campos, substituindo o label "Campo de Batalha", como uma carta em slot dedicado com bordas douradas)

**O que fica pra discussão aqui:**
- Efeitos das habilidades passivas/ativas dos Comandantes (próxima sessão)
- Balanceamento dos números do CSV (quando você devolver a planilha revisada)

---

## 6. ADIÇÕES AO GDD (atualizar antes de mandar pro Code)

Nova seção `§9 — Sistemas Avançados`:
- Campo Compartilhado: ordem de resolução, mecânica de bid, cartas de Campo
- Arapucas: posicionamento, ordem de ativação, interação com imunidade
- Ordem de resolução completa (copiar seção 4 acima)
