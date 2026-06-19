# 🚀 SETUP — Organizar o repositório (para o Claude Code)

Este guia é o passo a passo que o Claude Code deve seguir para deixar o repositório `fortbc` pronto. Você pode simplesmente pedir ao Claude Code:

> "Leia o CLAUDE.md e o SETUP.md e organize o repositório seguindo o checklist."

## Estrutura final desejada

```
fortbc/
├── index.html
├── CLAUDE.md
├── README.md
├── ASSETS.md
├── GAME_DESIGN.md
├── GAME_DATA.md
├── GAME_DATA.csv
├── SETUP.md
├── .gitignore
└── assets/
    ├── heroes/
    │   ├── arthur.png   fanta.png   garopaba.png  bala.png
    │   ├── nathan.png   leo.png     zaga.png      vitao.png
    │   └── borba.png    letti.png
    └── audio/
        └── (bgmusic.mp3 — adicionar depois)
```

## Passos

1. **Confirmar arquivos na raiz**: `index.html` e todos os `.md`/`.csv` devem estar na raiz do repo.

2. **Criar pastas de assets**:
   ```bash
   mkdir -p assets/heroes assets/audio
   ```

3. **Mover os PNGs dos heróis** para `assets/heroes/`. Os arquivos podem ter vindo numa subpasta `assets_to_upload/heroes/` — mova de lá para `assets/heroes/`. Garanta os nomes exatos (minúsculos, sem acento):
   `arthur, fanta, garopaba, bala, nathan, leo, zaga, vitao, borba, letti` (todos `.png`).

4. **Validar o repositório**:
   - `index.html` abre no navegador sem erros de console
   - Os 10 PNGs estão em `assets/heroes/`

5. **Commit e push**:
   ```bash
   git add .
   git commit -m "Organiza repositório: jogo, assets e documentação"
   git push origin main
   ```

6. **Ativar GitHub Pages** (manual, no site): Settings → Pages → Source: branch `main` / root → Save. Depois acesse `https://guilherme-moliner.github.io/fortbc/`.

7. **Testar o caminho raw** (validação de imagem):
   Abra no navegador: `https://raw.githubusercontent.com/Guilherme-Moliner/fortbc/main/assets/heroes/arthur.png`
   Se a imagem aparecer, o preload do jogo vai funcionar online.

## Observações

- Se algum PNG estiver com nome errado (maiúscula ou acento), renomeie para o padrão.
- O jogo funciona mesmo sem os assets no GitHub (usa base64), mas subir os PNGs deixa o `index.html` mais leve no futuro e permite imagens em alta qualidade.
