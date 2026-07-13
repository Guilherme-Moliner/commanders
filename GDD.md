# GDD — Comandante do Caos (`commanders`)

> **Documento mestre de design.** Fonte única da verdade do jogo, versionada no git. Sempre que houver divergência entre canais (Claude Code notebook, Claude Code desktop, Claude chat, Trello), **este arquivo vence** — alinhe os outros a ele.
>
> **Legenda de status:** ✅ decidido · 🟡 implementado como placeholder (funciona, mas números/regra ainda não são finais) · ❓ em aberto (precisa de decisão do criador) · 🚫 fora de escopo.
>
> Última atualização: **2026-06-22** · Mantido junto de `GAME_DESIGN.md` (regras), `UI_CAMPO.md` (tela de duelo) e `CLAUDE.md` (contexto de sessão).

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
- 🟡 **Geração:** hoje é um placeholder tunável — no DRAW ganha `INF_PER_TURN (3) + INF_PER_ZONE (1) × zonas ocupadas`, teto `INF_CAP (12)`, início `INF_START (4)`. **A fórmula real é por-Comandante e está ❓ em aberto** (gatilhos a explorar: campo vazio, campo cheio, mono-vibe, multi-vibe…).
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

## 7. Cartas ✅

- ✅ Tipos: **DEFENSE / ATTACK / BALANCE** — são **tipos**, não stats. Cada carta tem só **ATK e PV**.
- ✅ Campos de range/ATB existem na estrutura por herança, mas estão **inertes** (não implementar).
- ✅ **Frames** (UI_CAMPO §6): monstro = borda branca + **esfera de vibe**; item = fundo preto; Comandante = cor cheia. Canto sup. dir. = **✦ custo** (sem tag de tipo/ITEM).
- 🟡 **Rank em campo** (herdado): Bronze ×1.0 / Prata ×1.10 (2 turnos) / Ouro ×1.25 (4 turnos). *Revisar se fica.*

---

## 8. Combate, tabuleiro e fases 🟡

- ✅ **1×1**, turno **simultâneo** (sem jogador ativo).
- ✅ **6 zonas de unidade por lado** (`ZONES = 6`), Comandante **fora** do campo (é a carta da coluna esquerda).
- ✅ **Fases:** DRAW → STANDBY → **AÇÃO** → RESOLUÇÃO. (AÇÃO fundiu as antigas "Guerreiros" + "Itens".)
- ✅ **Cartas baixadas ficam viradas (face-down)** até a RESOLUÇÃO; fusão entra face-up.
- ✅ Na AÇÃO o jogador age livremente gastando Influência (baixa monstros/arapucas nas zonas, usa itens, funde). A IA monta plano secreto, revelado na resolução.
- 🟡 **Resolução:** soma ATK por lado (rank × vibe × mods), dano slot-a-slot; overflow vai pro **PV do Comandante** adversário. `BASE_HP = 2000`.
- ❓ **Regras assimétricas por Comandante** (o "de verdade" de cada tabuleiro).

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

## 10. Estado de implementação (o que já roda) 🟡

Implementado e testado no preview (turno completo → resolução → próximo turno, sem erro de console):
- Layout completo da tela de duelo conforme UI_CAMPO.
- Engine re-pipado: 6 zonas, Comandante off-field, fases unificadas, Influência, fusão de 2 (materiais → deck), face-down até resolução, Lixo compartilhado, deck-out reembaralha.
- Abas Artefatos (placeholder) e Loja (compra peão da própria vibe).
- Temas + settings.

### Placeholders/STUB conhecidos
- Geração de Influência por-Comandante (fórmula genérica).
- `pickCommander()` deriva Comandante pela vibe dominante (sem arte de retrato).
- Efeitos reais de Artefatos.
- Carta geradora de peões (vibe cruzada).
- Balanceamento.
- Código morto inerte do fluxo antigo (`phaseLastMinute`, `selectQuickCard`, `bfSlotGhost`) — remoção opcional.

---

## 11. Ferramentas & conteúdo

- **Card Lab** (`cardlab/`): ferramenta de criação de cartas. Reaproveitável.
- **Dados de cartas:** `CARDS_CSV` embutido no `index.html` (fonte única) + espelho `GAME_DATA.csv`. 72 cartas hoje.
- **Fusões:** `FUSIONS_CSV` no `index.html` + espelho `FUSIONS.csv`.
- **Assets:** `assets/heroes`, `assets/cards`, `assets/audio`. Fallback base64 dos heróis embutido.
- Docs herdados: `CONTEXT_*.md`, `LEGACY_fortbc_CLAUDE.md` (histórico).

---

## 12. Decisões em aberto (checklist pra destravar) ❓

Em ordem de impacto:
1. **Quais 4 heroes** são os Comandantes.
2. Pra cada Comandante: vibe · **fórmula de geração de Influência** (gatilho único) · **regra de tabuleiro assimétrica**.
3. **Ordem fixa** de enfrentamento dos 3.
4. **Estrutura da run**: recompensas entre combates, condição de vitória final, variação da monta inicial.
5. **Receitas de fusão** novas (pares de vibe + específicas).
6. **Efeitos dos Artefatos** + carta geradora de peões.
7. **Balanceamento** (números de Influência, custos, ATK/PV, rank).
8. **Ajustes visuais** do campo (retratos dos Comandantes, layout fino, frames, ícones de artefato).

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
