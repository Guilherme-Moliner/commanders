# CONTEXT: Fusão — Batalha dos Amigos

> Mecânica de fusão estilo **Yu-Gi-Oh! Forbidden Memories**, adaptada ao jogo turn-based.
> Implementação V0 (2026-06-16). Stats/nomes das cartas-resultado são **placeholder** — balancear.

## Receita por CARACTERÍSTICA (2026-06-16, modelo novo)
- Fusão agora é por **receita de características** (`FUSIONS_CSV`/`FUSIONS.csv`): `mode,a,b,result,note`.
  - `recipe`: `a`/`b` = requisitos `chave:valor`. Chaves ativas: **`vibe`** e **`postura`** (= coluna `type` re-rotulada: ATK=briga, DEF=muro, BAL=labia). Cada material satisfaz 1 requisito; ordem não importa.
  - `specific`: par de `id`s (prioridade máxima).
  - Ordem de match = ordem no CSV (`postura` listada ANTES de vibe → tem prioridade, pra a característica nova realmente entrar; senão a vibe casaria sempre).
- Colunas do CSV **mantêm as chaves** type/range/cost/speed (Card Lab/planilha/produção não quebram) — `postura` é derivada de `type` em runtime (`POSTURA`/`cardTrait`/`matchReq`).
- Decisão do usuário: começar simples com **2 características (vibe + postura)**; expandir (alcance/caos/pique de range/cost/speed) depois.

## Decisões travadas (com o usuário)
- **Fusão geral = par de VIBES** (não ATK/DEF/BAL). As 5 vibes funcionam como o "tipo" do FM.
- **Resultados = cartas novas dedicadas** (`kind:fusion`) — só surgem via fusão, NÃO entram em deck/loja/recompensa.
- **Fusão específica** (par de IDs de carta) tem prioridade sobre a geral (resolve os "conflitos" do FM).

## Regra (V0) — espelha o Forbidden Memories
1. **Materiais:** 2–5 monstros da mão, encadeados da esquerda→direita. O nº máximo vem do **tier de licença** (`LICENSE_TIERS[*].fusion` = 2→5). Só monstros (`pawn`/`hero`/`fusion`); itens/arapucas não fundem.
2. **Encadeamento sequencial:** funde os 2 primeiros → resultado → funde com o 3º → etc. (`resolveFusion()`).
3. **Cada par (`fusePair`)**:
   - procura **fusão específica** pelo par de `id`s; se não houver,
   - procura **fusão geral** pelo par de `vibe`s;
   - **trava de ATK (regra FM):** o resultado só vale se seu ATK for **maior que o ATK efetivo dos DOIS materiais**. Senão, o par **não funde**.
4. **Falha não pune (decisão 2026-06-16):** se um par não funde, **descarta o material de índice menor** (vai pro cemitério) e segue a cadeia usando o próximo como base. Se funde, **ambos os materiais vão pro cemitério** e o resultado vira a base do próximo par. Fusões intermediárias descartadas também vão pro cemitério. No fim, a **carta-base sobrevivente é invocada** (`runFusionChain` → `{summon, grave}`).
5. **Invocação:** a carta sobrevivente entra num slot livre (rank Bronze) e **substitui a ação de baixar 1 monstro** na DOWN FASE.

> Exemplo (4 cartas): C1+C2 não fundem → C1 ao cemitério, base=C2. C2+C3 fundem → C2,C3 ao cemitério, base=resultado#1. resultado#1+C4: se fundem → invoca resultado#2; se não → resultado#1 ao cemitério e invoca C4.

## Onde está no código (`index.html`)
- **`FUSIONS_CSV`** (logo após `BASE_CARDS`) — fonte única da tabela; espelhada em **`FUSIONS.csv`**. Schema: `mode(general|specific),a,b,result,note`. Linhas `#` = comentário.
- `parseFusions()` → `FUSIONS={general:{}, specific:{}}` (chave = `fuseKey(a,b)` = par ordenado).
- `fusePair(a,b)` / `resolveFusion(cards)` — lógica pura da regra acima.
- `bfDoFusion()` — UI do board: lê `BF.fusion` (índices marcados na mão), resolve, invoca. Botão "Fundir" na `#bf-fusionbar`.
- Cartas-resultado no `CARDS_CSV` com `kind:fusion`, `copies:0`. Parser seta `c.fusion=true`; `isMonster()` inclui fusion; `generateRewards` exclui `kind:fusion` do recruta.

## Tabela atual (exemplos — expandir)
| mode | a | b | result |
|---|---|---|---|
| general | amarelo | amarelo | fus_resenha |
| general | amarelo | azul | fus_camarote |
| general | vermelho | roxo | fus_climao |
| general | verde | verde | fus_brotheragem |
| specific | arthur | letti | fus_lenda |

**Os 15 pares gerais de vibe estão preenchidos** (placeholder — stats/nomes/img a refinar). Específicas: só 1 exemplo (Arthur+Letti) — adicionar quantas quiser no `FUSIONS_CSV`/`FUSIONS.csv`. As 16 cartas-resultado (`kind:fusion`) têm `img` apontando p/ arquivos de `Imagens/` (provisório, mover p/ `assets/cards/`).

## Pendências / decisões em aberto (validar)
- ✅ **Falha de par / cemitério** — resolvido (ver passo 4 acima).
- **Cadeias de resultado (famílias):** hoje cada par → 1 resultado fixo. O FM tem uma "família" ordenada por ATK e pega o menor que passa na trava. Dá pra evoluir o `FUSIONS_CSV` p/ múltiplos resultados por par.
- **`tags` (tipos secundários do FM):** não adicionados ainda. Se quiser fusões mais ricas (uma carta pertencer a +de 1 família), adicionar coluna `tags` no schema depois.
- **IA não funde** (só o player). 
- **Animação/visual de fusão** no board (hoje é toast + invocação direta).
