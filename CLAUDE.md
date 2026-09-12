# editor/ (app Remotion)

⛔ **Antes de qualquer edição de vídeo, leia o playbook certo (nesta pasta) e siga à risca.**

- **`PLAYBOOK-2.md`** — Framework 2, estilo "Captions" (09/08/2026). **É o padrão pra vídeos
  novos.** Legenda simples branca, palavra marcante atrás da pessoa, transições e SFX.
- `PLAYBOOK.md` — Framework 1, o estilo anterior (legenda com caixa amarela, sem SFX).

Na dúvida sobre qual usar, pergunte ao dono. Não pule a revisão (stills + Studio) e não rode
o render final sem o "ok" dele.

No Framework 2, as animações são **inventadas a partir da fala de cada vídeo** (Etapas 5 e 9
do `PLAYBOOK-2.md`) — não reaproveite as de um vídeo anterior.

Scripts de **medição** da revisão (o playbook manda medir, não chutar):
`measure-matte.py` (onde a pessoa está, pra posicionar o texto atrás) ·
`measure-audio.py` (pico da mistura vs. pico da voz) · `contact-sheet.py` (folha de contato
dos stills).

- Rodar comandos a partir desta pasta. Windows + PowerShell: use sempre `-LiteralPath`.
- `npm run dev` → `http://localhost:3000/MeuVideo`. Após mudanças: `npx tsc --noEmit` (exit 0).

## Variante YouTube horizontal (`src/yt2/`, composição `Yt2`) — 12/09/2026

Framework 2 adaptado pra vídeos longos de YouTube: **sem legenda, sem blur de fundo**, B-roll
horizontal (`pexels.cjs ... --landscape`), cartões com fundo animado e texto **digitado com
teclado** (`components/TypeWriter.tsx`), ícones Lucide (`components/Icon.tsx`). Mapa em
`src/yt2/lib/map.ts` (mesma Etapa 5/9 do PLAYBOOK-2). Stills:
`COMP=Yt2 NO_MATTE=1 node scripts/render-stills.cjs <frames>`. Render 4K: `scripts/render-yt2-4k.cmd`.
⚠️ Nada de `CameraMotionBlur` em volta do typewriter (ghosta a letra digitada).
