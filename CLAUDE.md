# editor/ (app Remotion)

⛔ **Antes de qualquer edição de vídeo, leia o playbook certo (nesta pasta) e siga à risca.**

- **`PLAYBOOK-2.md`** — Framework 2, estilo "Captions" (09/08/2026). **É o padrão pra vídeos
  novos.** Legenda simples branca, palavra marcante atrás da pessoa, transições e SFX.
- `PLAYBOOK.md` — Framework 1, o estilo anterior (legenda com caixa amarela, sem SFX).

Na dúvida sobre qual usar, pergunte ao dono. Não pule a revisão (stills + Studio) e não rode
o render final sem o "ok" dele.

No Framework 2, as animações são **inventadas a partir da fala de cada vídeo** (Etapas 5 e 9
do `PLAYBOOK-2.md`) — não reaproveite as de um vídeo anterior.

- Rodar comandos a partir desta pasta. Windows + PowerShell: use sempre `-LiteralPath`.
- `npm run dev` → `http://localhost:3000/MeuVideo`. Após mudanças: `npx tsc --noEmit` (exit 0).
