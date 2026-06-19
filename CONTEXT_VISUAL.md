# CONTEXT: Polish Visual & UI — Batalha dos Amigos

> **Para o Claude Code:** este é o briefing completo para trabalhar no visual, CSS, animações e UX. Leia este arquivo + `CLAUDE.md` antes de qualquer mudança.

## O que é o projeto
Batalha dos Amigos (`fortbc`) — jogo de cartas turn-based single-file (`index.html`). Todo o CSS e JS estão nesse único arquivo. Sem build, sem bundler. Ver `CLAUDE.md` para arquitetura.

## Estado visual atual
- UI funcional mas genérica (cores escuras padrão)
- Tom "engraçado/adulto/álcool" ainda não aparece visualmente
- Cartas renderizadas via `renderFC(card)` — retorna HTML string
- Slots renderizados via `updateFieldUI()`
- Barras de LP via `updateBaseUI()`
- Mão do player via `renderHand()`
- Indicador de fase via `updatePhaseBanner()` / `updatePhaseBadge()`

## Backlog de polish visual (implementar direto, sem decisão necessária)

### A — Layout/CSS
- [ ] Refinar espaçamentos e contraste dos slots
- [ ] Legibilidade das cartas (nome, stats, tipo visíveis)
- [ ] Estados visuais: hover, selecionado, desativado
- [ ] Diferenciação visual entre slots normais e slot CMD

### B — Animações
- [ ] Flutuante de dano na base (existe básico — melhorar)
- [ ] Flutuante de dano nos slots
- [ ] Animação de carta entrando no slot (DOWN FASE)
- [ ] Destaque visual de rank-up no STANDBY (Bronze→Prata→Ouro)
- [ ] Transição visual entre fases (banner aparece/some)
- [ ] Feedback de ataque na RESOLUÇÃO (projétil ou flash)
- [ ] Animação de carta indo ao cemitério

### C — Feedback de fase
- [ ] Banner de fase com destaque maior e mais claro
- [ ] Indicação visual de "IA pensando" / "aguarde"
- [ ] Preview de dano antes da RESOLUÇÃO (mostrar quanto vai bater)
- [ ] Indicador de quais cartas vão morrer na resolução

### E — Responsividade / Mobile
- [ ] Tabuleiro funcional em telas estreitas (celular)
- [ ] Cartas da mão tocáveis no mobile (área de toque adequada)
- [ ] Scroll suave se o campo não couber na tela

## Identidade visual (decidir com usuário — POLISH.md #1)
A paleta e o "vibe visual" ainda não foram definidos. Antes de um redesign completo, confirmar:
- Paleta de cores (boteco? neon? zoeira? dark com acento colorido?)
- Fontes (pixel? manuscrita? sans-serif pesada?)
- Tom dos textos (piadas internas, gírias, emojis?)

## Função de renderização de carta (`renderFC`)
Gera o HTML de uma carta para o campo. Inclui: imagem do herói, nome, ATK, HP atual/max, tipo (ATK/DEF/BAL), rank (🥉🥈🥇), estrelas. Modificar aqui afeta TODOS os cards no campo.

## Cartas na mão (`renderHand`)
Renderiza as cartas clicáveis da mão do player. Clicar = `selectHandCard(idx)`. Visual diferente do campo (mais compacto, horizontal).

## Como iniciar uma sessão nesta frente
1. `git pull origin main`
2. Ler este arquivo + `CLAUDE.md`
3. Abrir `index.html` no navegador (Chrome recomendado) para ver o estado atual
4. Atacar um item do backlog A/B/C/E por vez — commitar a cada melhoria
5. Para decisões de paleta/identidade, confirmar com o usuário antes de mudar cores globais
