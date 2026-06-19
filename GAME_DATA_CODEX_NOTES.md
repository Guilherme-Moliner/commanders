# GAME_DATA_CODEX - notas de implementa??o

Criado a partir de `C:/Users/guibr/Downloads/GAME_DATA.csv` com 74 cartas originais + 52 cartas novas = 126 linhas.

## O que funciona s? colocando no CSV atual

O engine atual reconhece `kind` como `pawn`, `hero`, `fusion`, `item` e `trap`.

Efeitos de item j? implementados em `applyTurnItem()`:

- `heal_all`
- `atk_buff`
- `draw2`
- `resurrect`
- `next_hp_buff`
- `debuff_all_atk`
- `debuff_flat`
- `debuff_strongest`
- `debuff_silence`

Efeitos de arapuca j? implementados em `applyTrap()`:

- `trap_skip`
- `trap_double`
- `trap_net`
- `trap_drain`
- `trap_smoke`

Cartas novas marcadas com `FUNCIONA_AGORA` ou `FUNCIONA_AGORA_APROX` usam apenas esses efeitos. As `APROX` jogam hoje, mas ainda n?o s?o a fantasia final.

## O que ainda precisa de c?digo

- `field`: o c?digo tem `G.playerFieldCard`/`G.aiFieldCard` e zona visual, mas `computeFieldAtk()` ainda n?o aplica aura de campo.
- `equip`: n?o existe anexar equipamento a uma unidade nem persistir buff no card equipado.
- `archetype/tags`: o parser atual ignora colunas extras. Para Academia/Dinheiro/Gamer/Controle funcionarem direito, precisamos adicionar colunas novas ao `CARDS_CSV` e manter esses dados em `makeFC()`.
- `resource/economia`: Faria Lima, Cart?o Black, Porsche/Carr?o e CEO precisam definir se o jogo ter? recurso real, desconto de custo, compra extra ou a??o extra.
- chef?es com `special` novo (`boss_*`) entram como monstros fortes, mas seus poderes finais precisam ser implementados.
- receitas envolvendo `equip_*` em `FUSIONS_CODEX.csv` s?o planejamento; o resolver de fus?o atual trabalha melhor com IDs de cartas-monstro e vibes/tags j? presentes.

## Sugest?o de ordem

1. Importar primeiro os itens/arapucas `FUNCIONA_AGORA`.
2. Depois implementar `field` como aura global simples: `field_*` altera compra, ATK ou rank.
3. Depois implementar `equip` como carta r?pida que escolhe um slot aliado e grava `equips[]` ou `modsPermanent` na unidade.
4. Por ?ltimo adicionar `archetype,tags,class` no CSV e usar esses dados para campos, equipamentos, fus?es e recompensas.

## Dire??o de imagens

- Azul/Academia: academia exagerada, luz fria, halteres, whey, pose ?pica.
- Verde/Dinheiro: escrit?rio, luxo cafona, gr?fico subindo, terno, planilhas.
- Amarelo/Gamer: neon, setup RGB, energ?tico, live, campeonato, headset.
- Roxo/Caos: glitch, roleta, fuma?a, dado, portal, express?o surtada.
- Vermelho/Controle: carimbos, processo, microfone, plen?rio, censura, burocracia agressiva.
