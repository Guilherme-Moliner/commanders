# 🎴 Card Lab — Como transformar um placeholder em carta do jogo

Manual rápido pra você (e os amigos) criarem as artes das cartas e plugarem no jogo.

## Como o jogo acha a imagem
Cada carta tem a coluna **`img`** na base (`GAME_DATA.csv` / `CARDS_CSV`). O jogo carrega a arte de **`assets/cards/<img>`**.
- Se `img` está vazia → a carta usa o emoji provisório.
- Pra carta ter arte: salvar um PNG com o nome da coluna `img` e colocá-lo em `assets/cards/`.

> ⚠️ Use nomes de arquivo **web-safe**: minúsculos, sem espaços nem acentos (ex.: `rei_do_camarote.png`, não `Rei do Camarote.PNG`). Os placeholders de fusão hoje apontam pra nomes da pasta `Imagens/` com espaço/acento — ao mover pra `assets/cards/`, renomeie e ajuste a coluna `img`.

## Passo a passo

1. **Crie a pasta** `assets/cards/` no projeto (uma vez só; ainda não existe).
2. **Abra o Card Lab:**
   - Local: dê duplo clique em `cardlab/index.html`.
   - Online (depois do push): `https://guilherme-moliner.github.io/fortbc/cardlab/`
3. **Conecte a base:** o campo "URL da Planilha" já vem apontado pra `GAME_DATA.csv` do GitHub. Clique **🔗 Conectar Planilha**.
   - Pra enxergar suas edições mais recentes, elas precisam estar **commitadas/pushadas** — ou cole a URL CSV publicada da sua planilha de apoio.
4. **Escolha a carta** no dropdown "Selecionar Carta". `⬜` = ainda sem imagem, `✅` = já tem. Os stats carregam sozinhos. (Ou use os botões de **Preset**.)
5. **Suba a foto:** botão **📤 Foto do herói (frente)** e escolha a imagem do amigo. A prévia atualiza ao vivo.
   - (Opcional) ajuste **Nível/Frame**, ligue **Buffs** só pra ver como fica — não afeta a base.
   - (Opcional) **🖼️ Frame customizado** pra versões Full Art.
6. **Confira o nome do arquivo:** o botão de salvar usa a coluna `img` da carta; se estiver vazia, salva como `<id>.png`.
7. **Salve:** **💾 Salvar carta (900×1350 px)** (ou tecla **S**). Baixa o PNG em alta resolução.
8. **Mova** o PNG pra `assets/cards/` com o **mesmo nome** que está (ou que vai ficar) na coluna `img`.
9. **Garanta o `img` na base:**
   - Carta que já existe: confirme que `img` = nome do arquivo.
   - Carta nova: clique **📋 Copiar linha CSV (p/ planilha)** e cole na planilha de apoio (ou me mande a linha que eu sincronizo no `CARDS_CSV`/`GAME_DATA.csv`).
10. **Commit + push** (ou me peça). O GitHub Pages atualiza e a carta aparece no jogo. ✅

## Fluxo combinado com o Claude (aqui)
- Você planeja/edita na **planilha de apoio** e produz as artes no **Card Lab** (com os amigos / outra IA).
- Me manda as linhas novas/alteradas (ou o link da planilha) → eu atualizo `CARDS_CSV` + `GAME_DATA.csv`, valido e deixo o GitHub atualizado.
- Meta: chegar a ~100 cartas. A base já tem o esqueleto (vibes, fusão, itens, arapucas) — falta encher de conteúdo.
