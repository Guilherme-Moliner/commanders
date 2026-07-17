# GDD — Comandante do Caos (`commanders`)

> **Documento mestre de design.** Fonte única da verdade do jogo, versionada no git. Sempre que houver divergência entre canais (Claude Code notebook, Claude Code desktop, Claude chat, Trello), **este arquivo vence** — alinhe os outros a ele.
>
> **Legenda de status:** ✅ decidido · 🟡 implementado como placeholder (funciona, mas números/regra ainda não são finais) · ❓ em aberto (precisa de decisão do criador) · 🚫 fora de escopo.
>
> Última atualização: **2026-07-16** (sprint v4) · Mantido junto de `GAME_DESIGN.md` (regras), `UI_CAMPO.md` (tela de duelo) e `CLAUDE.md` (contexto de sessão). Dados: `cards_database_v2.csv` + `commanders_database.csv` (sincronizar c/ `node tools/sync_cards.js`).

---

## 0. Como retomar em outra máquina (prompt de chamada)

Ao abrir o Claude Code (ou chat) em qualquer máquina, faça `git pull` e cole o prompt da seção **§13** deste documento. Ele coloca a IA em dia e lista as decisões pendentes.

---

## 1. Visão geral

**Comandante do Caos** (repo `commanders`, codinome de board "Memórias do Proibidão") é um **roguelike de cartas single-player**, single-file HTML (sem build, sem servidor, `localStorage`). É um **fork de design** de "Batalha dos Amigos" (`fortbc`) — o sistema antigo de Fort Condor (lanes/torres/ATB) está **🚫 abandonado**.

- **Plataforma:** navegador. `index.html` único.
- **Público:** grupo fechado de amigos, +18, humor interno. Heróis com a cara de amigos reais.
- **Proposta de valor:** pessoal/autoral + social + sessão curta (runs jogáveis numa noite, repetíveis).
- **PvP/multiplayer:** 🚫 fase 2 condicional, fora deste escopo.

### Pitch de uma frase
Você escolhe 1 Comandante do Caos, enfrenta os outros 3 em ordem fixa, e evolui seu deck **fundindo cartas** (estilo Yu-Gi-Oh! Forbidden Memories) numa run de tamanho fixo.

---

## 2. Estrutura da run ✅ (base) / ❓ (detalhes)

- ✅ **4 Comandantes fixos** nesta versão (dos 10 heroes do universo). O jogador escolhe **1**; enfrenta os outros **3** em **ordem pré-definida**.
- ✅ **Run de tamanho fixo** — sem NG+, sem progressão infinita. Termina ao vencer/perder o último combate.
- ✅ **Deck persiste pela run inteira** — fusões e peões adquiridos no combate 1 seguem pro 2, 3 e 4. A run conta a história da evolução daquele deck.
- ✅ **Vitória/derrota de cada combate:** zerar o PV do Comandante oponente (ou ter o seu zerado).
- ❓ **Recompensas entre combates** (o que se ganha, como escolhe).
- ❓ **Condição/tela de vitória final** da run.
- ❓ **Variação inicial** do deck-base (monta com pequena aleatoriedade — quanto?).

---

## 3. Comandantes ✅ (framework) / ❓ (quais 4 + identidade)

Cada Comandante é **assimétrico de verdade** (não é skin):
- ✅ **Deck-base próprio** (fixo + pequena variação na monta).
- ❓ **Tabuleiro/regras de combate próprias** — zonas/posicionamento que mudam regra, não só visual.
- ❓ **Geração de Influência própria** — lógica condicional exclusiva (ver §4).
- ✅ **PV próprio** (os "PV do jogador" são, na prática, os PV do Comandante).
- ✅ **Vibe do Comandante tinge o campo** daquele lado.

### Os 10 heroes e suas vibes (base de referência)
| Herói | Vibe | Cor |
|---|---|---|
| Fanta, Nathan | Nerdola (amarelo) | `#f5c542` |
| Garopaba, Borba | Socialista (vermelho) | `#e63946` |
| Arthur, Vitão | Marombeiro (azul) | `#2196f3` |
| Léo, Zaga | Rolezeiro (roxo) | `#9c27b0` |
| Bala, Letti | Dinheirista (verde) | `#4caf50` |

> ❓ **DECISÃO-CHAVE #1:** quais **4** destes viram Comandantes; a **vibe/identidade** de cada; a **geração de Influência** de cada; a **regra de tabuleiro** de cada; e a **ordem fixa** de enfrentamento.

---

## 4. Recursos — Influência ✅ (conceito) / 🟡 (geração)

- ✅ **Influência** = recurso de ação do turno. Baixar carta custa Influência.
- ✅ **Geração base por-Comandante** (CSV): no DRAW ganha `inf_per_turn` do Comandante + `INF_PER_ZONE (1)` × zonas ocupadas, teto `inf_cap`, início `inf_start` — ex.: Letti começa com 6✦/+4/teto 16; Bala começa com 5✦. Artefatos incrementam via `APP.commanderMods`. ❓ A camada **condicional** única de cada um (pass_trigger: campo vazio/cheio, mono/multi-vibe…) ainda não está plugada.
- ✅ Peões funcionam como **motores de Influência**: campo desenvolvido importa tanto quanto ter a carta mais forte.

---

## 5. Fusão ✅

- ✅ Mecânica central de progressão da run (estilo Forbidden Memories).
- ✅ Consome **exatamente 2 cartas** da mão → as 2 originais **voltam pro deck** (não descartadas) → produz **1 carta nova** na mão.
- ✅ **Limite de fusões por turno** (contador 🌀, hoje `FUSES_PER_TURN = 1`; ampliável por artefato/efeito — futuro).
- ✅ Receitas por **vibe** (par de cores) + receitas **específicas** (herói A + herói B → carta única). Fonte: `FUSIONS_CSV` no `index.html` (espelho em `FUSIONS.csv`).
- ❓ **Conteúdo de receitas novas** (além do herdado) a definir.

### Aquisição de peões — dois caminhos que coexistem ✅
1. **Loja** (aba permanente na tela de duelo): peão básico da **própria vibe** por custo fixo (`SHOP_PAWN_COST = 3` ✦). 🟡 implementado.
2. **Carta-efeito "geradora de peões"**: permite comprar peões de **qualquer vibe** (abre fusão cruzada). ❓ conteúdo/efeito a implementar.

---

## 6. Vibes (naipes) ✅

5 vibes, cor e tema fixos:

| Vibe | Cor | Nome | Tema |
|---|---|---|---|
| 🟡 Amarelo | `#f5c542` | Nerdola | Geek, games & internet |
| 🔴 Vermelho | `#e63946` | Socialista | Povo, treta & revolução |
| 🔵 Azul | `#2196f3` | Marombeiro | Academia & shape |
| 🟣 Roxo | `#9c27b0` | Rolezeiro | Balada, night & pegação |
| 🟢 Verde | `#4caf50` | Dinheirista | Grana & investimentos |

- 🟡 **Círculo de vantagem** (implementado, tunável): Nerdola › Dinheirista › Socialista › Rolezeiro › Marombeiro › Nerdola. Vantagem ×1.5, desvantagem ×0.67 (por slot, na resolução).
- 🟡 **Sinergia de vibe**: 2 da mesma no campo → bônus; 3+ → bônus maior (hoje só +ATK, leve).

---

## 7. Cartas ✅ (+ evolução por tiers)

- ✅ Tipos: **DEFENSE / ATTACK / BALANCE** — são **tipos**, não stats. No motor v4: `atk` = contribuição ao pool de ataque; `hp` = contribuição ao pool de defesa (BAL = metade de cada).
- ✅ Campos de range/ATB existem na estrutura por herança, mas estão **inertes** (não implementar).
- ✅ **Frames v2**: monstro = borda branca + **dot de vibe** + rodapé ⚔|🛡; item/arapuca/upgrade = fundo preto sem borda; Comandante = cor cheia. Canto sup. dir. = **✦ custo**.
- ✅ **EVOLUÇÃO POR TIERS** (substitui o rank por tempo, que foi **abolido**): cartas têm `tier` (bronze/prata/gold), `evolve_to` e `base_card` no CSV — a mesma carta em níveis distintos. Evoluir via **item UPGRADE** (funde com um monstro; o upgrade vai pro **Lixo** — única exceção à regra "materiais voltam ao deck") ou via **artefato** com `evolve_family`. **Todos os exemplares da família evoluem juntos** (deck+mão+descarte+campo), com flash dourado.
- ✅ **Deck do Boss (Garopaba):** `is_boss=TRUE` no CSV carrega também as versões gold de cada carta do deck.

---

## 8. Combate, tabuleiro e fases ✅ (motor v4 — pool vs pool)

- ✅ **1×1**, turno **simultâneo** (sem jogador ativo).
- ✅ **6 zonas de unidade por lado** (`ZONES = 6`), Comandante **fora** do campo (é a carta da coluna esquerda).
- ✅ **Fases:** DRAW → STANDBY → **AÇÃO** → RESOLUÇÃO. (AÇÃO fundiu as antigas "Guerreiros" + "Itens".)
- ✅ **Cartas baixadas ficam viradas (face-down)** até a RESOLUÇÃO; fusão entra face-up.
- ✅ Na AÇÃO o jogador age livremente gastando Influência (baixa monstros/arapucas nas zonas, usa itens, funde, compra na Loja). A IA monta plano secreto, revelado na resolução. HUD ⚔/🛡 em tempo real + preview no hover.
- ✅ **MOTOR v4 (pool vs pool):** cartas ATK somam `.atk` ao pool de ataque; DEF somam `.hp` ao pool de defesa; BAL soma metade de cada (arred. p/ cima). Itens/arapucas modificam os pools. **Dano = max(0, seu ATK − DEF inimiga)**, aplicado direto no PV do Comandante. Após a resolução, **todo o campo (ambos os lados) vai pro descarte** — cada turno é um board novo. Cartas não têm HP em campo, não morrem. Ambos ≤0 → **jogador perde** (empate técnico punitivo). **Rank por tempo de campo: ABOLIDO.**
- ✅ **Stats por-Comandante** vêm do `commanders_database.csv` (PV, Influência inicial/por turno/teto, mão, fusões/turno), com fallback nas constantes globais e incrementos de artefato (`APP.commanderMods`).
- ✅ **INVOCAÇÃO DO COMANDANTE (v4.1):** 1×/turno, cada Comandante tem uma **condição própria** (`summon_condition` no CSV — ex.: Fanta 2+ fusões no fight, Nathan 4+ cartas na mão, Garopaba PV<50%, Zaga paga 5✦, Bala campo 6/6, Letti turno 3+). Quando atendida, o botão no perfil vira "⚡ Invocar!" (dourado pulsante): o Comandante ocupa uma zona livre, **contribui aos pools** do turno e **volta ao slot de Comandante** após a resolução (não vai pro descarte). Reset no DRAW. Condição exibida no seletor de Comandante.
- ✅ **Tipos ATK/DEF/BAL abolidos do VISUAL (v4.1 A1):** seguem como metadado interno do motor/boss deck, mas as cartas mostram só ⚔ atk e 🛡 hp (escudo, não coração). 🟡 TEMP: pool de ATK com multiplicador **×3** no motor até o CSV ser rebalanceado (Bloco E).
- ✅ **DRAW compra até o alvo (v4.1 C3):** completa a mão até `hand_start` do Comandante + artefatos (não +1 fixo).
- ❓ **Passivas/ativas dos Comandantes** (descritas no CSV, exibidas na UI) — efeitos mecânicos ainda não implementados.
- ❓ **Regras assimétricas de tabuleiro** por Comandante (além dos stats).
- ❓ **Cartas de CAMPO** (kind `campo` no CSV v2.1): parseadas mas **inertes** — mecânica de onde/como jogar ainda não especificada.

### Constantes atuais (tunáveis, em `index.html`)
`ZONES=6` · `BASE_HP=2000` · `HAND_LIMIT=9` · `INITIAL_HAND=5` · `INF_START=4` · `INF_PER_TURN=3` · `INF_PER_ZONE=1` · `INF_CAP=12` · `DEFAULT_PLAY_COST=2` · `FUSES_PER_TURN=1` · `SHOP_PAWN_COST=3`

---

## 9. Tela de duelo (Campo de Batalha) ✅

Detalhe completo em `UI_CAMPO.md`. Resumo:
- Topbar (fases + turno "simultâneo" + placar + som + config).
- Coluna esquerda: **carta do Comandante** de cada lado (PV, chips 🌀 Fusão e ✦ Influência, rodapé ⚔/♥/vibe, inspecionável).
- Centro: mão do oponente (versos) → 6 zonas inimigas → linha de frente (+ **Lixo central compartilhado**) → 6 zonas do jogador → Deck/Descarte por lado → leque da mão.
- Direita: trilho **Inspetor · Log · Artefatos · Loja** (recolhível).
- Temas: **Nebulosa · Fumaça · Brasa · Feltro · Carvão**.
- 🚫 Painel DEMO do mockup **não** entra.

---

## 10. Estado de implementação (o que já roda) ✅ (sprint v4 — 2026-07-16)

Testado no preview: **run completa de ponta a ponta** (seleção de Comandante → 4 fights c/ recompensas → tela final com score), sem erros de console.
- **Motor v4 pool-vs-pool** (§8) — combate, varredura pro descarte, dano no Comandante.
- **Evolução por tiers** (§7) — UPGRADE via fusão/arraste, artefato `evolve_family`, deck gold do boss.
- **Data-driven:** `CARDS_CSV`+`COMMANDERS_CSV` embutidos, sincronizados por `tools/sync_cards.js`; stats/deck/ordem-do-rogue por Comandante vêm do CSV.
- **Tela de Seleção de Comandante** (grid 3×4, deck preview, passiva/ativa, P1, Entrar na Run).
- **Fluxo demo:** Rogue via seleção (sem dificuldade), 4 inimigos fixos, Duelo Livre contra qualquer Comandante, modos não-demo desativados c/ tooltip, seleção de vibe removida, ⚙ global, toggles BGM/SFX, Loja em jogo c/ quantidade 1–5, **passwords de debug** (SKIP_TO_BOSS · GOD_MODE · MAX_FUSIONS · KILL_BOSS · FULL_HAND · EVOLVE_ALL).
- **Animações YGOFM** (ref. YouTube `5v-hEPv5icA`): draw 0:22–0:24 (cartas voam do deck em arco, ~120ms/carta, ~60ms de stagger, pipeline paralela) e fusão 1:15–1:18 (espiral ~720° em ~1.5s → flash 50ms → resultado 0→1.3→1.0 + glow ~1s). Banner de fase deslizante, flash de evolução, contadores progressivos na resolução.
- **Score** (§ fórmula na Parte 7 do sprint): fights×1000 + PV×2 + fusões×150 + artefatos×200 − turnos×5; boss ×1.5. Submissão Google Forms preparada (constantes vazias, falha silenciosa).

### Placeholders/STUB conhecidos
- Passivas/ativas dos Comandantes: **exibidas** (seleção + inspetor), efeitos não plugados.
- Artefatos: estrutura funcional, pool de conteúdo raso (buffs de deck herdados).
- Balanceamento dos CSVs (decks defensivos empatam — ver §12.3).
- Arte real (monogramas/emojis por enquanto).
- Código morto inerte do fluxo antigo (real-time + `phaseLastMinute`) — remoção opcional.

---

## 11. Ferramentas & conteúdo

- **Card Lab** (`cardlab/`): ferramenta de criação de cartas. Reaproveitável.
- **Dados de cartas:** `CARDS_CSV` embutido no `index.html` (fonte única) + espelho `GAME_DATA.csv`. 72 cartas hoje.
- **Fusões:** `FUSIONS_CSV` no `index.html` + espelho `FUSIONS.csv`.
- **Assets:** `assets/heroes`, `assets/cards`, `assets/audio`. Fallback base64 dos heróis embutido.
- Docs herdados: `CONTEXT_*.md`, `LEGACY_fortbc_CLAUDE.md` (histórico).

---

## 12. Decisões em aberto (checklist pra destravar) ❓

Resolvidas no sprint v4: ~~quais Comandantes~~ (todos os 10 jogáveis; inimigos fixos **Fanta→Arthur→Bala→Garopaba/BOSS** via `rogue_order` no CSV) · ~~geração base de Influência~~ (stats por-Comandante no CSV) · ~~fluxo da run~~ (seleção → 4 fights → recompensas entre eles → score final).

Ainda em aberto, em ordem de impacto:
1. **Efeitos mecânicos das passivas/ativas** dos Comandantes (descritas no CSV, exibidas na UI — falta plugar no engine).
2. **Regras assimétricas de tabuleiro** por Comandante (além dos stats).
3. **Balanceamento** dos números do CSV (pools ATK/DEF estagnam em decks defensivos — testar e ajustar).
4. **Receitas de fusão** novas (pares de vibe + específicas).
5. **Artefatos**: pool real de artefatos c/ efeitos (estrutura pronta: `addArtifact`, `evolve_family`, `commanderMods`).
6. **Arte**: retratos dos 10 Comandantes (profile + seleção), 100% das cartas demo, ícones de artefato.
7. **Google Forms/Sheets do score**: criar o form e preencher `SCORE_SUBMIT_URL`/`LEADERBOARD_URL`.

## 15. Projeto Sonho 🚫 (salvar, não fazer agora)

- Multiplayer / Battle Royale (arquitetura simultânea já ajuda; falta rede)
- Save com conta Google (OAuth + Sheets como backend)
- Boss Mode separado
- Decks desbloqueáveis
- ART_BIBLE completo por vibe (estilo artístico próprio por vibe)
- Duelo assíncrono (joga seu turno, manda o estado pro amigo)
- Carta de Campo/Terreno com efeito (descartada, pode voltar numa v2)
- Modo campanha leve (3-4 fights com narrativa mínima)

---

## 13. Prompt de chamada (colar ao retomar em qualquer máquina)

```
Estou retomando o projeto commanders (Comandante do Caos) depois de um tempo parado.
Antes de agir: rode `git pull`, depois leia nesta ordem: GDD.md (fonte única da verdade),
CLAUDE.md, UI_CAMPO.md e GAME_DESIGN.md. Em seguida me devolva um resumo curto de:
(1) o estado atual de implementação do Campo de Batalha,
(2) as decisões de design ainda EM ABERTO (seção §12 do GDD),
(3) qualquer divergência que você notar entre o código (index.html) e o GDD.
NÃO comece a implementar nada novo até eu aprovar por qual decisão começamos.
O jogo roda em https://guilherme-moliner.github.io/commanders/ e o repo é público.
```

---

## 14. Infra / Deploy

- **Repo:** https://github.com/Guilherme-Moliner/commanders — **público** (desde 2026-06-22).
- **Pages (jogo online):** https://guilherme-moliner.github.io/commanders/ — atualiza automático a cada push na `main`.
- **Fluxo multi-máquina:** commit+push antes de trocar de máquina; `git pull` na outra. Trabalha-se direto na `main`.
- **Trello:** ❓ desatualizado — realinhar à seção §12 deste GDD.
