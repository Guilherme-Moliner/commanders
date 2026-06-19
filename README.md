# ⚔️ Batalha dos Amigos · fortbc

Um jogo de cartas de batalha **por turnos** (estilo **Yu-Gi-Oh! Forbidden Memories**), com cartas-herói feitas a partir de fotos de amigos reais. Single-file HTML, sem build, sem servidor.

> **v5 (2026-06-12):** o jogo foi reescrito de tempo-real (lanes/Fort Condor) para **turn-based**. O design legado está preservado em `gamedesignfort.md`.

---

## 🎮 Como rodar

**Opção 1 — Direto do arquivo:** abra `index.html` no navegador (Chrome, Firefox, Edge). Funciona offline; se não achar as imagens no GitHub, usa as embutidas em base64.

**Opção 2 — GitHub Pages:** acesse `https://guilherme-moliner.github.io/fortbc/` (deploy automático a cada push para `main`).

---

## 🗂️ Estrutura do repositório

```
fortbc/
├── index.html          ← o jogo (single-file)
├── README.md           ← este arquivo
├── CLAUDE.md           ← contexto do projeto (lido pelo Claude Code)
├── POLISH.md           ← backlog de polish v5.1 + briefing p/ discussão
├── GAME_DESIGN.md      ← mecânicas e regras (v5 turn-based, ATUAL)
├── gamedesignfort.md   ← design legado (v4 Fort Condor / real-time)
├── GAME_DATA.md        ← tabela de stats (leitura)
├── GAME_DATA.csv       ← tabela de stats (edição)
├── ASSETS.md           ← guia de imagens e áudio
├── SETUP.md            ← checklist de organização do repo
└── assets/
    ├── heroes/         ← arthur.png, fanta.png, ... (10 heróis)
    └── audio/          ← OST e SFX em .mp3 (ver ASSETS.md)
```

O jogo tenta carregar imagens de `assets/heroes/<id>.png` via `raw.githubusercontent.com`. Se falhar (offline, arquivo ausente), usa o fallback base64 embutido — **nunca quebra**.

---

## 🕹️ Como jogar

O combate acontece em turnos, cada um com 5 fases:

1. **DRAW** — você e a IA compram cartas até encher a mão (5).
2. **STANDBY** — cartas que sobreviveram em campo sobem de rank (🥉→🥈→🥇).
3. **DOWN FASE** — você baixa 1 carta num slot; a IA baixa a dela em segredo; ambas são reveladas juntas.
4. **LAST MINUTE** — janela para cartas rápidas (no V1 costuma auto-passar).
5. **RESOLUÇÃO** — o ataque total do seu campo bate nos slots inimigos; o que sobra vai na base.

| Ação | Como |
|---|---|
| Selecionar carta da mão | Clique na carta |
| Baixar no campo | Clique no slot (após selecionar a carta) |
| Passar a Down Fase | Botão "Passar" |
| Avançar fase | Botão "Avançar ›" |
| Mutar música | Botão 🔊 no topo |

---

## 🎯 Objetivo

Cada lado começa com **2000 LP** na base. Some o ATK das suas cartas em campo, derrube as cartas inimigas e faça o dano transbordar para a **base adversária**. Zere os **2000 LP** do inimigo para vencer o fight. Vença os **3 fights** seguidos, escolhendo recompensas entre eles (estilo roguelike).

Veja `GAME_DESIGN.md` para as regras completas e `GAME_DATA.md` para os stats.

---

## 🛠️ Editar stats

1. Abra `GAME_DATA.csv` (Excel/Google Sheets)
2. Ajuste os números
3. Reflita as mudanças na constante `BASE_CARDS` dentro do `index.html`

> Próximo passo planejado: gerar o `BASE_CARDS` automaticamente a partir do CSV.

---

## 🗺️ Roadmap

### Concluído
- [x] Engine turn-based (Draw → Standby → Down Fase → Last Minute → Resolução)
- [x] 5 slots por lado (4 + Comandante), face-down, zona de campo, cemitério
- [x] Rank de carta por tempo em campo (Bronze/Prata/Ouro)
- [x] Roguelike de 3 fights + recompensas
- [x] Níveis de carta persistentes (Bronze → Diamante)
- [x] Highscores locais
- [x] Loading + preload de imagens via GitHub (fallback base64)

### Em aberto (ver `POLISH.md`)
- [ ] Habilidades dos 10 heróis (turn-based)
- [ ] Sistema de Vibes (nomes + sinergia)
- [ ] Ativar o triângulo de tipos na resolução
- [ ] Mecânica do Comandante, tributo, comeback
- [ ] Arapucas (armadilhas) nos slots face-down
- [ ] Novos itens de debuff e peões de vibe
- [ ] Trilha sonora (OST) e SFX
- [ ] Persistência de score via n8n
