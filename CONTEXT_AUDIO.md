# CONTEXT: Áudio (OST + SFX) — Batalha dos Amigos

> **Para o Claude Code:** briefing da frente de áudio. Leia este arquivo + `CLAUDE.md` antes de mexer em áudio.
>
> **Status (2026-06-14):** sistema de áudio **IMPLEMENTADO** no `index.html` — gerenciador de OST com crossfade, SFX fire-and-forget com pool, unlock iOS, preload com fallback e volumes separados OST×SFX. O usuário já incluiu os áudios **reais** (OST `.mp3`, SFX `.wav`). Pendentes hoje: `ost_select.mp3` e `base_hit.wav` (tocam em silêncio até chegarem). Os placeholders de silêncio antigos foram movidos pra subpastas `Placeholders/`.

## O que é o projeto
Batalha dos Amigos (`fortbc`) — jogo de cartas turn-based single-file (`index.html`). **OST em `.mp3`**, **SFX em `.wav`** (ambos com boa compat., inclusive iOS Safari). Nunca `.ogg`. Sem base64 (arquivos grandes demais).

> **Extensões no código:** `OST_EXT='.mp3'` e `SFX_EXT='.wav'` (constantes no topo do bloco AUDIO). Pra trocar a extensão de uma categoria, muda só a constante.

## Como o áudio funciona hoje (arquitetura no index.html)

Caminho base: **relativo** (`assets/audio/` e `assets/audio/sfx/`) — funciona no preview local **e** no GitHub Pages (mesma origem, sem CORS). Não usa mais `raw.githubusercontent` pra áudio.

### Gerenciador de OST (trilha) — bloco `// AUDIO` no index.html
- `playOST(name)` — toca a faixa com **crossfade suave (~600ms)** a partir da atual. Usa **2 canais `Audio`** (A/B) que alternam. Se a faixa pedida **já está tocando**, é no-op (não reinicia ao navegar entre sub-telas do menu). Loop automático.
- `stopOST()` — fade-out (~400ms).
- `OST_BY_SCREEN` — tabela **editável** tela→faixa. `ostForScreen(id)` resolve `game` (por `APP.fightNum`/modo) e `end` (por `G.winner`) dinamicamente.
- Roteamento automático: `onScreenEnter(id)` chama `playOST(ostForScreen(id))` — **é o único ponto de troca de faixa**.

### SFX — fire-and-forget
- `playSFX(name)` — toca sem tocar na OST. **Pool de 4 instâncias por som** (`SFX_POOL`) pra sobrepor sons sem cortar. Respeita `sfxVol` e mute.

### Volumes (separados, persistidos)
- `musicVol` ← `localStorage fortbc_vol` (default 0.35) · slider "VOLUME DA MÚSICA"
- `sfxVol`   ← `localStorage fortbc_sfxvol` (default 0.6) · slider "VOLUME DOS EFEITOS"
- `audioMuted` (mute geral) · `toggleMute()` atualiza `#mute-btn` (tabuleiro) e `#mute-toggle` (⚙).
- `setVolume(v)` / `setSfxVolume(v)` — recebem 0–100 dos sliders.

### Unlock iOS Safari
- `unlockAudio()` é chamado no **1º gesto do usuário** (`advanceTitle`, clique/tecla na tela `title` "PRESSIONE START"). Toca um áudio mudo pra liberar o autoplay. Roda uma vez (`audioUnlocked`).

### Preload + fallback gracioso
- `preloadAudio()` pré-carrega em paralelo os **críticos** (`PRELOAD_OST` = `ost_menu`, `ost_battle1`; `PRELOAD_SFX` = uns de UI/combate), cada um com timeout 1.5s e **fallback silencioso individual** (erro = segue em silêncio). Roda no `boot()` depois das imagens.
- **Regra de ouro:** arquivo faltando **nunca** quebra o jogo — todo `play()` tem `.catch(()=>{})` e `playSFX` tem `try/catch`. Um `.mp3` ausente vira 404 silencioso.

## Mapa de OST por tela (fluxo ATUAL)
Fluxo de telas: `loading → title → nameload → menu → { campaign | runsetup | freeduel | shop | library | score | password } → deckselect → game → reward → end`

| Tela(s) | Faixa |
|---|---|
| `loading` | (silêncio) |
| `title` · `nameload` · `menu` · `library` · `shop` · `campaign` | `ost_menu` |
| `deckselect` · `runsetup` · `freeduel` · `password` | `ost_select` |
| `score` | `ost_scores` |
| `game` | `ost_battle1` / `ost_battle2` / `ost_battle3` (por `APP.fightNum`; Duelo Livre → battle1) |
| `reward` | `ost_reward` |
| `end` | `ost_win` (vitória) / `ost_lose` (derrota) — por `G.winner` |

Arquivos em `assets/audio/` (todos `.mp3`):
`ost_menu` · `ost_select` · `ost_preduel`* · `ost_battle1` · `ost_battle2` · `ost_battle3` · `ost_sudden`* · `ost_reward` · `ost_win` · `ost_lose` · `ost_scores`
\* `ost_preduel` (stinger pré-fight) e `ost_sudden` (morte súbita) existem como arquivo mas **ainda não têm tela** — stubs prontos pra quando essas telas/modos forem criados.

> Modo Turbo (futuro): variação pitch+speed +15% via Web Audio API — dinâmico, sem arquivo novo. Não implementado.

## Mapa de SFX (`assets/audio/sfx/`, todos `.wav`)

### UI
`ui_card_draw` · `ui_card_select` · `ui_cancel` · `ui_atb_full` · `ui_error` · `ui_click`

### Combate
`hit_melee` · `hit_mid` · `hit_long` · `unit_die` · `struct_hit` · `struct_destroy` · `base_hit` · `tower_retaliate`

### Invocação de heróis (um por herói)
`hero_arthur` · `hero_fanta` · `hero_garopaba` · `hero_bala` · `hero_nathan` · `hero_leo` · `hero_zaga` · `hero_vitao` · `hero_borba` · `hero_letti`

### Especiais (habilidades)
`special_recycler` · `special_deathbuff` · `special_provoker` · `special_healer` · `special_rusher`

### Arapucas & Itens
`trap_place` · `trap_trigger` · `item_heal` · `item_debuff` · `item_buff`

### Estado do jogo
`fight_win` · `fight_lose` · `reward` · `mode_turbo` · `mode_sudden`

### Ganchos de SFX já ligados no código (V1)
| Evento | SFX |
|---|---|
| Ativar item de menu (`VMenu.activate`) | `ui_click` |
| Voltar / Esc (sub-tela, viewer, booster) | `ui_cancel` |
| Avançar da `title` | `ui_click` |
| Confirmar nome / Continuar / Novo Jogo | `ui_click` |
| Nome vazio (erro) | `ui_error` |
| Escolher vibe + confirmar baralho (deckselect) | `ui_click` |
| Fase DRAW (compra) | `ui_card_draw` |
| Selecionar carta na mão | `ui_card_select` |
| Rank-up de carta (STANDBY) | `ui_atb_full` |
| Baixar carta em slot de campo/CMD | `hit_melee` |
| Baixar carta face-down | `trap_place` |
| Baixar na zona de campo | `item_buff` |
| Carta pro cemitério (descarte) | `item_debuff` |
| Resolução: houve combate | `hit_melee` |
| Resolução: morreu unidade | `unit_die` |
| Resolução: dano à base | `base_hit` |
| Tela de recompensa | `reward` |
| Abrir booster (com rara) | `reward` / `item_buff` |

> **Vitória/derrota de fight não têm SFX próprio:** a troca pra `ost_win`/`ost_lose` na tela `end` já cumpre o papel (decisão do usuário, 2026-06-14). Os nomes `fight_win`/`fight_lose` continuam reservados no mapa, mas **não há arquivo nem gancho**.

> Ainda **sem gancho** (ligar conforme as mecânicas forem implementadas): `hit_mid`/`hit_long`, `struct_*`, `tower_retaliate`, `hero_*` por invocação, `special_*`, `trap_trigger`, `item_heal`, `mode_*`, `ui_error`.

> **Arquivos ainda pendentes (404 hoje, tocam em silêncio):** `ost_select.mp3` (telas de seleção) e `base_hit.wav` (dano à base na resolução). Dropar com esses nomes pra ativar.

## Convenções
- Formato: **OST `.mp3`**, **SFX `.wav`** — nunca `.ogg`.
- Caminho **relativo** (`assets/audio/...`), não GitHub raw.
- Fallback gracioso: arquivo faltando = silêncio, nunca exceção.
- Sem base64 pra áudio.
- Substituir um placeholder = só dropar o `.mp3` real com o mesmo nome na pasta certa. Nada de código muda.

## Como iniciar uma sessão nesta frente
1. `git pull origin main`
2. Ler este arquivo + `CLAUDE.md`
3. Trocar/adicionar `.mp3` reais em `assets/audio/` e `assets/audio/sfx/` (mesmos nomes)
4. Pra novos eventos de SFX: chamar `playSFX('nome')` no ponto certo; pra nova tela: adicionar entrada em `OST_BY_SCREEN`
5. Testar no Chrome e Safari (iOS é o mais crítico — o unlock acontece no clique da `title`)
