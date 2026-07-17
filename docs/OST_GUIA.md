# 🎵 Guia de OST por Tela — Comandante do Caos

> **Como funciona:** o roteamento vive na tabela `OST_BY_SCREEN` no `index.html` (busca por `OST_BY_SCREEN` no arquivo). Cada tela toca a faixa mapeada, com crossfade automático de ~600ms. Arquivo faltando = **silêncio, sem erro** — então adicionar uma música é só dropar o `.mp3` com o nome certo em `assets/audio/`.
>
> **Pra trocar a música de uma tela:** ou troque o nome na tabela `OST_BY_SCREEN`, ou substitua o arquivo `.mp3` mantendo o nome.

## Estado atual (2026-07-17)

| Tela / estado | Faixa roteada | Arquivo existe? | Status |
|---|---|---|---|
| `loading` | — (proposital) | — | ✅ sem música mesmo |
| `title` (splash) | `ost_menu.mp3` | ✅ | ✅ ok |
| `disclaimer` (+18) | `ost_menu.mp3` | ✅ | ✅ ok |
| `nameload` (nome) | `ost_menu.mp3` | ✅ | ✅ ok |
| `menu` principal | `ost_menu.mp3` | ✅ | ✅ ok |
| **`cmdselect` (Seleção de Comandante)** | `ost_select.mp3` | ✅ | 🆕 **roteada agora** (estava SEM música) — confirme se `ost_select` serve ou se quer uma faixa própria (ex.: `ost_cmdselect.mp3` — aí eu crio a rota) |
| `freeduel` (tela antiga de lista) | `ost_select.mp3` | ✅ | ⚠️ tela quase não é mais usada (Duelo Livre agora usa `cmdselect`) |
| `password` | `ost_select.mp3` | ✅ | ✅ ok |
| `library` / `shop` / `campaign` / `deckbuilder` | `ost_menu.mp3` | ✅ | ⚠️ telas trancadas na demo — irrelevante por ora |
| `game` — Fight 1 | `ost_battle1.mp3` | ✅ | ✅ ok |
| `game` — Fight 2 | `ost_battle2.mp3` | ✅ | ✅ ok |
| `game` — Fight 3 **e 4 (boss)** | `ost_battle3.mp3` | ✅ | ❓ **decidir:** o boss (Garopaba, Fight 4) usa a MESMA faixa do Fight 3. Quer uma `ost_boss.mp3` exclusiva? (rota é 1 linha, me avise) |
| `game` — Duelo Livre | `ost_battle1.mp3` | ✅ | ❓ sempre a faixa 1 — ok assim? |
| `reward` (recompensa) | `ost_reward.mp3` | ✅ | ✅ ok |
| `end` — vitória | `ost_win.mp3` | ✅ | ✅ ok |
| `end` — derrota | `ost_lose.mp3` | ✅ | ✅ ok |
| `score` (ranking) | `ost_scores.mp3` | ✅ | ✅ ok (tela trancada na demo) |

## Faixas órfãs (existem mas não tocam em lugar nenhum)

| Arquivo | Uso original planejado | Sugestão |
|---|---|---|
| `ost_preduel.mp3` | Stinger de ~5s antes do fight | Poderia tocar na transição Seleção→Fight 1 (hoje não há tela de pré-duelo) |
| `ost_sudden.mp3` | "Morte súbita" (mecânica antiga, abolida) | Candidata a virar a faixa do **boss** — é a mais intensa (~170 BPM) |
| `YTDown_...` / `Yu-Gi-Oh! Forbidden Memories OST - *.mp3` | Fontes brutas do YGOFM | ✅ Conferi: estão **gitignoradas** (só existem na sua máquina, não vão pro repo público). Quando decidir os usos, renomeie pra chave `ost_*` correspondente |

## O que eu preciso de você

1. **Boss (Fight 4):** faixa própria? Se sim, suba `ost_boss.mp3` e me avise que eu roteio.
2. **Seleção de Comandante:** `ost_select` está ok ou quer faixa própria?
3. **Limpar as faixas brutas do YGOFM** da pasta (repo é público agora).
