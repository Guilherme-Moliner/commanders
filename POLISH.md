# 🎨 POLISH v5.1 — Briefing de Discussão

> **Para o usuário:** este arquivo é feito para você **colar num chat de brainstorm** (cada bloco é independente). Discuta lá as decisões criativas/design, depois volte ao Claude Code com as respostas e ele implementa.
>
> **Para o Claude Code:** este é o backlog de polish da v5 (turn-based). Os tópicos marcados 🗣️ **CHAT** dependem de decisão criativa do usuário — não implementar sem input. Os marcados 🔧 **IMPLEMENTAR** podem ser feitos direto.

---

## 📋 Índice rápido

| # | Tópico | Tipo |
|---|---|---|
| 1 | Identidade visual & tom | 🗣️ CHAT |
| 2 | Nomes + mecânicas finais das 5 Vibes | 🗣️ CHAT |
| 3 | Renomear ATK/DEF/BAL + ativar o triângulo | 🗣️ CHAT |
| 4 | Habilidades dos 10 heróis | 🗣️ CHAT |
| 5 | Slots face-down + Zona de Campo (o que fazem?) | 🗣️ CHAT |
| 6 | Regra especial do Comandante | 🗣️ CHAT |
| 7 | Mecânica de comeback | 🗣️ CHAT |
| 8 | Tributo p/ cartas de estrela alta | 🗣️ CHAT |
| 9 | Last Minute / cartas rápidas | 🗣️ CHAT |
| 10 | Balanceamento (números & ritmo) | 🗣️ CHAT |
| 11 | Novos cards: itens, peões de vibe, arapucas | 🗣️ CHAT |
| 12 | Áudio (OST + SFX) | 🗣️ CHAT (curadoria) |
| A | Polish visual de layout/CSS | 🔧 IMPLEMENTAR |
| B | Animações (dano, ataque, rank-up, fases) | 🔧 IMPLEMENTAR |
| C | Feedback de fase mais claro | 🔧 IMPLEMENTAR |
| D | Limpeza do código morto (engine antigo) | 🔧 IMPLEMENTAR |
| E | Responsividade / mobile | 🔧 IMPLEMENTAR |

---

# 🗣️ TÓPICOS PARA O CHAT (precisam de decisão sua)

## 1. Identidade visual & tom
**Estado:** UI funcional mas genérica (cores escuras padrão, emojis como ícones). O tom "engraçado/adulto/álcool" ainda não aparece visualmente nem nos textos.
**Decidir:**
- Paleta de cores / vibe visual geral (boteco? neon? zoeira?).
- Tom dos textos de UI (mensagens de fase, vitória, derrota) — quer piadas internas, gírias?
- Nome do jogo na tela inicial, nome dos lados (hoje "BC" vs "FLORIPA").

## 2. Nomes + mecânicas finais das 5 Vibes
**Estado:** Mecânicas e cores já aprovadas (ver CLAUDE.md). Faltam os **nomes** (você quer algo engraçado/adulto) e ainda **não estão no código**.
**Decidir:**
- Nome de cada uma das 5 vibes (🟡 Festa, 🔴 Força, 🔵 Controle, 🟣 Caos, 🟢 Sustain).
- Confirmar se as mecânicas passivas fazem sentido no formato turn-based (algumas foram desenhadas para real-time, ex: "regenera ATB" — ATB não existe mais).
- Regra de sinergia: 2 cartas = +10%, 3+ = +20% — em qual stat para cada vibe?

## 3. Renomear ATK/DEF/BAL + ativar o triângulo
**Estado:** Código usa `ATK/DEF/BAL`. Você quer renomear para ATAQUE/DEFESA/EQUILÍBRIO. O triângulo (vantagem 1.5x) **não está ativo** na resolução turn-based.
**Decidir:**
- Confirmar nomes finais (ou apelidos zoados?).
- O triângulo deve afetar a resolução? Como? (ex: na hora de aplicar dano slot a slot, comparar tipo do atacante x defensor).
- Risco: como o ataque hoje é "ATK total somado", aplicar triângulo carta-a-carta muda muito a lógica. Vale discutir o modelo.

## 4. Habilidades dos 10 heróis
**Estado:** 6 heróis têm habilidade desenhada (no GAME_DESIGN antigo), mas eram para o real-time (ex: "Rusher: vai direto à torre" não faz sentido sem lanes). **Nenhuma está implementada.**
**Decidir (o maior tópico):**
- Definir/redesenhar a habilidade de cada um dos 10 heróis para o formato turn-based.
- Quando dispara? (ao entrar / na resolução / ao morrer / passiva contínua).
- Heróis sem habilidade ainda: Nathan, Léo, Zaga, Borba.

## 5. Slots face-down + Zona de Campo (o que fazem?)
**Estado:** Existem no tabuleiro (4 slots face-down + 1 zona de campo por lado) mas **não têm mecânica** — são decorativos.
**Decidir:**
- Slots face-down = onde ficam as Arapucas (armadilhas)? Ativam quando?
- Zona de Campo = carta de efeito global (estilo "Field Spell" do YGO)? O que ela faz?
- Ou simplificar e remover por enquanto?

## 6. Regra especial do Comandante
**Estado:** O slot CMD existe e só aceita cartas marcadas `commander`, mas **nenhuma carta é comandante** hoje e não há regra especial.
**Decidir:**
- O que torna uma carta "Comandante"? (uma por deck? o herói principal?).
- Bônus do slot CMD (ex: +ATK, imune até o campo estar limpo, condição de derrota se morrer?).

## 7. Mecânica de comeback
**Estado:** Citada no design, nunca definida. Hoje o dano vai direto na base (2000 LP).
**Decidir:**
- Existe uma "torre/escudo" antes da base? (você mencionou querer isso).
- Gatilho de comeback: quando a base fica baixa, ganha algum bônus? (ex: +1 carta, buff de ATK).

## 8. Tributo p/ cartas de estrela alta
**Estado:** Cartas têm campo `tribute` e `star`, mas no turn-based **não há lógica de tributo** ao baixar carta.
**Decidir:**
- Manter tributo (sacrificar carta em campo p/ invocar estrela alta)?
- Como funciona na Down Fase? (escolher qual sacrificar antes de baixar).

## 9. Last Minute / cartas rápidas
**Estado:** A fase existe mas **auto-passa** (nenhuma carta tem `quickPlay`).
**Decidir:**
- Quais cartas são "rápidas" (jogáveis na Last Minute)? Itens? Arapucas?
- Vale a fase existir no V1 ou simplificar?

## 10. Balanceamento (números & ritmo)
**Estado:** Bases com 2000 LP, dano = ATK total somado. Não testado a fundo o ritmo.
**Decidir (precisa de playtest + números):**
- Partidas estão curtas/longas demais?
- 2000 LP é o número certo? Mão de 5 é boa?
- Multiplicadores de rank (1.0/1.10/1.25) dão diferença suficiente?

## 11. Novos cards: itens debuff, peões de vibe, arapucas
**Estado:** Listados no CLAUDE.md (5 debuffs, 5 peões, 5 arapucas) mas **desenhados p/ real-time** e não implementados.
**Decidir:**
- Readaptar cada efeito para turn-based (ex: "−40% velocidade" não existe; virar "−X ATK no próximo turno").
- Prioridade: quais entram no V1?

## 12. Áudio (OST + SFX)
**Estado:** Mapa completo no CLAUDE.md. Você disse que já achou músicas. Pasta `assets/audio/` existe mas vazia.
**Decidir / fazer:**
- Curar e nomear os arquivos conforme o mapa (`ost_menu.mp3`, etc.).
- Confirmar quais SFX são prioridade pro V1.
- **Quando os arquivos chegarem, o Claude Code integra (isso é 🔧 implementação).**

---

# 🔧 TÓPICOS DE IMPLEMENTAÇÃO (Claude Code faz aqui, sem precisar de chat)

## A. Polish visual de layout/CSS
Refinar espaçamentos, contraste, legibilidade dos slots e cartas, estados de hover/selecionado.

## B. Animações
- Flutuante de dano na base (já existe básico) e nos slots.
- Animação de carta entrando no slot.
- Destaque de rank-up no Standby.
- Transição visual entre fases.
- Projétil/feedback de ataque na Resolução.

## C. Feedback de fase mais claro
Banner de fase com destaque maior, indicação de "vez do oponente", contagem visual do que vai acontecer na Resolução (preview do dano).

## D. Limpeza do código morto
Remover o engine real-time inerte (linhas ~514-825: lanes, ATB, gameLoop, spawnUnit, etc.). Não bloqueia nada, mas deixa o arquivo limpo. **Fazer com cuidado** para não tocar em `BASE_CARDS`, `HERO_IMAGES_B64`, persistência e funções de UI reaproveitadas.

## E. Responsividade / mobile
Garantir que o tabuleiro funcione em telas estreitas (o jogo roda no navegador, possivelmente no celular).

---

## ✅ Fluxo recomendado

1. **Cole os blocos 🗣️ do POLISH.md num chat** de brainstorm (sugiro começar pelos de maior impacto: **#4 habilidades**, **#2 vibes**, **#3 triângulo**).
2. Discuta e feche as decisões lá.
3. **Volte ao Claude Code** com as respostas (pode colar o resumo das decisões).
4. Enquanto isso, o Claude Code pode adiantar os 🔧 (A–E) que não dependem de você.
