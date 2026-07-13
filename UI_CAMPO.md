# UI_CAMPO.md — Tela de Duelo (Campo de Batalha)

> Documenta as decisões de **layout, fluxo de tela e interação** da tela de duelo, validadas a partir do mockup `Comandantes_do_Caos_-_Campo__standalone_.html` (Claude Design) e da conversa de design subsequente.
> **Estes valores são definitivos como decisões de UI/UX.** Números visíveis no mockup (ATK, PV, custos, geração de Influência) são placeholders de balanceamento — não são definidos por este documento (ver `GAME_DESIGN.md` para mecânica).

---

## 1. Layout geral — topbar + 3 colunas

- **Topbar**: indicador "Turno N" com nota "simultâneo" · trilha de fases **DRAW · STANDBY · AÇÃO · RESOLUÇÃO** (fase ativa destacada em dourado) · Placar · botão de som · botão de configurações (engrenagem).
- **Coluna esquerda**: carta do Comandante de cada lado (inimigo em cima, jogador embaixo).
- **Coluna central**: mão do oponente (versos) → 6 zonas do inimigo → linha de frente → 6 zonas do jogador → pilhas de Deck/Descarte por lado + Lixo central → leque da mão do jogador.
- **Coluna direita**: trilho de abas — **Inspetor · Log · Artefatos · Loja** — recolhível.

### Decisão sobre turno simultâneo
Não existe indicador de "turno ativo" de um jogador específico. Ambos os lados jogam na mesma rodada. Esta é uma decisão de fluxo de jogo (não só visual) — não reintroduzir conceito de `currentPlayer`/jogador ativo sem discussão explícita.

### Fases unificadas
"Guerreiros" + "Itens" (fases antigas) foram fundidas em uma única fase **AÇÃO**. Ordem final: **DRAW → STANDBY → AÇÃO → RESOLUÇÃO**.

---

## 2. Slot do Comandante (substitui o profile genérico do jogador)

O que antes era um profile genérico (porta-retrato + números soltos de PV/Deck/Cemitério/Mão) agora **é a carta do Comandante**:

- Borda neon na cor da vibe do Comandante.
- Nome do Comandante no topo.
- Dot/indicador da vibe.
- Barra de PV — **PV exibido é o PV do Comandante** (não um "PV do jogador" abstrato).
- Dois chips de contador dentro do card:
  - 🌀 **Fusões disponíveis no turno** — formato `usadas/limite` (ex: "1/1").
  - ✦ **Influência** — recurso de ação disponível.
- Rodapé do card: ⚔ ATK / ♥ PV / vibe.
- **Inspecionável**: clique ou hover abre os detalhes completos no painel Inspetor, igual qualquer outra carta.

Cemitério, Deck e Mão **saíram do slot do Comandante** e passaram a viver como pilhas próprias no campo (ver seção 4).

---

## 3. Zonas de campo

- **6 zonas de unidade por lado** (jogador e oponente), separadas por uma "linha de frente" central.
- Zonas vazias mostram o rótulo de texto **"UNIDADE"** — mantido deliberadamente como texto, não como ícone (decisão revisada e confirmada).
- Zonas **não têm tipo fixo predeterminado**; ao selecionar um Comandante, todas as zonas do lado dele assumem a cor da vibe daquele Comandante.
- **Cartas baixadas ficam face para baixo ("VIRADA")** até a abertura da fase de RESOLUÇÃO, quando viram para cima e o jogo roda os cálculos.
- **Cartas resultantes de fusão entram direto face para cima** — não passam pelo estado virado.

---

## 4. Pilhas — Deck, Descarte, Lixo

- **Deck e Descarte**: um par por jogador, posicionado ao lado da fileira de zonas daquele jogador (inimigo no topo, jogador na base).
  - Deck tem **volume visual dinâmico** (pilha mais alta/cheia quanto mais cartas restantes).
  - Ao esgotar o Deck, o **Descarte é reembaralhado automaticamente** e volta a ser fonte de compra.
- **Lixo**: pilha única, **central, compartilhada entre os dois jogadores**. Recebe cartas removidas por efeito (não as cartas de material de fusão, que voltam para o monte do próprio dono — confirmar essa distinção na implementação). Recuperável por itens específicos (ex: item "Catador").
- Cliques:
  - Deck → abre menu (Deck List / Desistir).
  - Descarte → abre visualizador das cartas ali.
  - Lixo → abre visualizador compartilhado.

---

## 5. Mão do jogador e do oponente

- **Mão do jogador**: leque na parte inferior da tela, ocupando a faixa inteira.
  - Hover destaca a carta.
  - Arrastar para o campo baixa a carta (face para baixo).
  - Clicar marca/desmarca a carta para fusão — **máximo 2 cartas selecionadas simultaneamente**.
- **Mão do oponente**: visível só pelos versos, ~50% de cada carta espiando no topo da tela. Sobe ao passar o mouse (mesmo comportamento da mão do jogador). Mostra a **contagem real** de cartas do oponente.

---

## 6. Frames de carta

Duas versões visuais distintas para a mesma carta:

| Contexto | Estilo |
|---|---|
| Mão / campo | Arte ocupa quase todo o frame. Sem nome visível, sem caixa de texto de efeito. Mostra cor/borda por tipo (ATK/DEF/BAL), vibe, e números de ATK/PV. |
| Inspetor | Estilo manga/TCG completo: moldura clara, nome no topo, caixa de texto com descrição completa do efeito, números de ATK/PV visíveis. |

Por tipo de carta:
- **Monstro**: borda branca estilo manga + esfera colorida na cor da vibe.
- **Item**: fundo preto.
- **Comandante**: colocação de cor completa (não alterado nesta rodada).

**Removido**: tags de tipo (ATK/DEF/BAL) e tag "ITEM" no canto superior direito das cartas. Esse canto agora mostra apenas **✦ custo de baixar** e, ao lado quando aplicável, **+ geração de Influência**.

---

## 7. Trilho lateral direito

4 abas, recolhível (chevron para fechar, aba "PAINEL" para reabrir):

1. **Inspetor** — carta selecionada/hover em tamanho grande, com efeito completo.
2. **Log** — histórico de ações, entradas coloridas pela cor do jogador que executou a ação.
3. **Artefatos** — grid de slots com os artefatos coletados na run atual. Placeholder: ícone simples por slot (ainda sem arte própria). Clique/hover mostra nome + descrição do efeito.
4. **Loja** — aba **permanente**. Permite comprar o peão básico da própria vibe do Comandante por um custo fixo de Influência.
   - **Coexiste** com a aquisição de peões via carta-efeito "geradora de peões" (que permite vibes diferentes da do jogador) — ver `GAME_DESIGN.md` seção 5. Um caminho não substitui o outro.

---

## 8. Configurações

Botão de engrenagem abre:
- Seletor de tema visual: **Nebulosa** (padrão) · Fumaça · Brasa · Feltro · Carvão.
- Toggle de Som.
- Toggle de Animações.
- Opção de Desistir.

---

## 9. O que NÃO faz parte da integração final

- **Painel DEMO** (botões de "virar resolução", "ciclar vibe do Comandante", "resetar estado") — é scaffolding de review do Claude Design, não deve ser implementado.
- Números de exemplo (ATK, PV, custos, geração de Influência, contagens de Deck/Descarte do oponente) — placeholders, não balanceamento final.
- Lógica real de cálculo de combate, geração efetiva de Influência, receitas de fusão — definidas separadamente (`GAME_DESIGN.md`), não por este documento.

---

## 10. Histórico de decisão (proveniência)

Todas as decisões acima — incluindo as que o Claude Design definiu de forma autônoma durante a iteração (fases unificadas, turno simultâneo, cartas viradas até Resolução, Lixo compartilhado, Loja permanente, manter rótulo "UNIDADE" como texto) — foram revisadas e **aprovadas explicitamente** em conversa de design posterior ao mockup. Não reverter ou "corrigir" essas decisões alegando divergência do prompt original que gerou o mockup.
