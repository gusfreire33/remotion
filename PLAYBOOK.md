# 🎬 PLAYBOOK — Edição de Vídeo (Remotion)

> **LEIA ISTO ANTES DE QUALQUER EDIÇÃO.** Este é o processo validado pelo dono do projeto.
> Toda vez que for solicitada a edição de um novo vídeo, siga este documento **à risca**,
> da Etapa 0 até a Etapa 12, sem pular validações. Os parâmetros estéticos na seção
> "DECISÕES VALIDADAS" são o padrão aprovado — só mude se o usuário pedir.

**Objetivo do produto:** vídeos verticais (Reels/Shorts/TikTok) de **retenção** — dinâmicos,
corridos, com legendas que casam com a estética e ilustrações de **motion design estilo
After Effects (zoom in/out, motion, motion blur)** nos momentos de impacto da fala.

**Regra de ouro:** as animações são **guiadas pela transcrição/minutagem**. Primeiro entende-se
o que é dito e QUANDO, depois coloca-se a animação exatamente no momento da fala.

---

## ⚙️ ETAPA 0 — Pré-flight (ambiente Windows)

🎯 Garantir que o ambiente funciona antes de começar. Esta máquina é Windows + PowerShell, e o
caminho do projeto tem espaços e colchetes (`[WD] Editor de videos`), o que causa armadilhas.

🛠️ **Gotchas obrigatórios (não esquecer nunca):**
- **Sempre `-LiteralPath`** em `Set-Location`, `Test-Path`, `Get-Item`, `Remove-Item`, etc. Sem
  isso, o `[WD]` é interpretado como wildcard e o comando falha.
- Rodar comandos do projeto a partir de `editor/` via `Set-Location -LiteralPath "...\editor"`.
- O projeto Remotion fica em `editor/` (Remotion 4.x, React 19).

✅ **Checklist**
- [ ] `node`, `npm`, `git` disponíveis.
- [ ] `editor/node_modules` instalado (se não, `npm install` dentro de `editor/`).
- [ ] Pacotes presentes: `@remotion/media`, `@remotion/captions`, `@remotion/motion-blur`,
      `@remotion/google-fonts`, `@remotion/install-whisper-cpp` (dev).
- [ ] Studio sobe: `npm run dev` → responde em `http://localhost:3000`.

🔎 **Qualidade:** `npx tsc --noEmit` retorna **exit 0** antes e depois de qualquer mudança.

---

## 📥 ETAPA 1 — Ingerir o vídeo no projeto

🎯 Trazer o vídeo novo pra dentro do projeto e descobrir suas dimensões/duração/fps.

🛠️ **Como**
1. Localizar o arquivo (ex.: o vídeo mais recente em `Downloads` na data de hoje).
2. Copiar pra `public/` com nome limpo:
   `Copy-Item "<origem>.mp4" ".\editor\public\video1.mp4" -Force`
3. Ler metadados: `npx remotion ffprobe ".\public\video1.mp4"`
   - Anotar: **largura × altura**, **fps**, **duração (s)**.
   - `durationInFrames = ceil(duração_s × fps)`.
4. Ajustar a `<Composition id="MeuVideo">` em `src/Root.tsx` e as constantes em
   `src/lib/constants.ts` (`WIDTH`, `HEIGHT`, `FPS`, `DURATION_IN_FRAMES`) com esses valores.

✅ **Checklist**
- [ ] `public/video1.mp4` existe e abre.
- [ ] `Root.tsx` e `constants.ts` batem com os metadados reais (sem corte/sobra no fim).

🔎 **Qualidade:** preview no Studio mostra o vídeo inteiro, sem frames pretos no fim nem distorção.

---

## 🔊 ETAPA 2 — Extrair áudio 16 kHz

🎯 Gerar o WAV que o Whisper precisa (16 kHz, mono, PCM 16-bit).

🛠️ **Como** (dentro de `editor/`):
`npx remotion ffmpeg -i ".\public\video1.mp4" -ar 16000 -ac 1 -c:a pcm_s16le ".\audio16k.wav" -y`

✅ **Checklist**
- [ ] `audio16k.wav` criado (alguns MB).

🔎 **Qualidade:** `ffprobe` mostra 16000 Hz, mono.

---

## 📝 ETAPA 3 — Transcrição com minutagem (Whisper)

🎯 Transcrever a fala com **timestamps por palavra** (token-level via `--dtw`).

🛠️ **Como:** `node ".\scripts\transcribe.cjs"` — instala Whisper.cpp `1.5.5`, baixa o modelo
`medium`, transcreve em `pt`, gera `public/captions.json` (tokens) + `transcription-full.json`.

⚠️ **Gotcha Windows (importante):** o `installWhisperCpp` chama `Expand-Archive` SEM aspas e
**quebra** com espaços/colchetes no caminho. Se a instalação falhar nesse ponto:
1. O `whisper-bin-x64.zip` já foi baixado em `editor/`.
2. Extraia na mão via .NET (o `Expand-Archive` também falha com colchetes):
   `[System.IO.Compression.ZipFile]::ExtractToDirectory($zip, "$PWD\whisper.cpp")`
3. Confirme `whisper.cpp/main.exe` e rode o `transcribe.cjs` de novo (ele detecta e pula a instalação).

✅ **Checklist**
- [ ] `transcribe.cjs` termina com "DONE: N palavras transcritas".
- [ ] `public/captions.json` existe.

🔎 **Qualidade:** o texto bate com a fala (PT-BR). A transcrição vem em **sub-tokens** (ex.:
"tr"+"á"+"f"+"ego") — isso é normal, a próxima etapa reagrupa.

---

## 🔡 ETAPA 4 — Reagrupar tokens em palavras

🎯 Transformar sub-tokens em palavras inteiras com timestamps (base das legendas e do mapa de beats).

🛠️ **Como:** `node ".\scripts\build-words.cjs"` → gera `src/data/words.ts` (importado no bundle)
e `public/words.json`. Imprime a **transcrição completa** no console.

✅ **Checklist**
- [ ] `src/data/words.ts` gerado.
- [ ] A "Texto completo" impressa lê como frases naturais.

🔎 **Qualidade:** ler a transcrição completa do começo ao fim — é a base do roteiro de edição.

---

## 🧠 ETAPA 5 — Analisar conteúdo e mapear os beats

🎯 Entender a **mensagem** e escolher os **momentos de impacto** onde entram as animações.
Esta é a etapa criativa que define o vídeo. Guiada 100% pela minutagem da fala.

🛠️ **Como**
1. Ler a transcrição completa e resumir a tese/mensagem do vídeo.
2. Caçar gatilhos: frases-chave, números, listas, ênfases, prova social, clímax, CTA.
3. Para cada gatilho, definir um **beat**: `{ key, from (s), to (s) }` + a ideia visual
   (qual ilustração/animação combina com aquela fala).
4. Registrar os beats em `src/lib/beats.ts` (`BEAT_TIMING`) e os pontos de ênfase extra
   (fins de frase) em `EXTRA_PUNCHES_S` (pro zoom).

✅ **Checklist**
- [ ] Tese do vídeo escrita em 1–2 linhas.
- [ ] 6–10 beats mapeados com `from/to` em segundos reais da fala.
- [ ] Cada beat tem uma ideia visual que **reforça** o que está sendo dito (não decorativo à toa).
- [ ] Beats não se sobrepõem; há "respiro" entre eles.
- [ ] Inclui um beat de **clímax** (a tese) e um de **CTA** no fim.

🔎 **Qualidade:** lendo só a lista de beats dá pra entender a história. As animações batem
com a fala (conferir timestamps na `words.ts`).

---

## 💬 ETAPA 6 — Legendas estilo TikTok

🎯 Legendas animadas palavra-a-palavra, com destaque na palavra falada, casando com a estética.

🛠️ **Componentes:** `src/components/Captions.tsx` + `src/lib/pages.ts` (agrupa palavras em páginas).
Reaproveitar como está; só re-rodar a Etapa 4 atualiza o conteúdo.

✅ **Checklist**
- [ ] Máx. ~3 palavras / ~24 caracteres por página; quebra em fim de frase.
- [ ] Palavra ativa com **caixa amarela** (`#FFD60A`) + leve zoom; demais brancas com sombra.
- [ ] Posição acima da área de UI do Reels (`paddingBottom` ~360), legível.

🔎 **Qualidade:** ao dar play, a legenda acompanha a voz sem atraso e é 100% legível sobre o vídeo.

---

## ✨ ETAPA 7 — Motion design (overlays) + película (scrim)

🎯 As ilustrações de cada beat, com **motion blur estilo AE**, e uma **película** que entra só
durante as animações pra limpar o fundo e dar foco.

🛠️ **Componentes:** `src/overlays/Overlays.tsx` (cada beat é um componente), `src/components/PopIn.tsx`
(entrada com mola). Estética: emoji + tipografia pesada (**Anton**) + formas + `CameraMotionBlur`.
- Para um vídeo novo: ajustar **textos/emojis** de cada overlay pro conteúdo do beat; manter o estilo.
- A **película (BeatScrim)** já é aplicada automaticamente em cada beat no master de `Overlays.tsx`.

✅ **Checklist**
- [ ] Cada overlay usa `CameraMotionBlur` (shutterAngle ~150, samples ~6).
- [ ] Conteúdo erguido (`lift`) acima das legendas, sem colisão.
- [ ] Película = degradê radial preto (`rgba(0,0,0,0.32)`→`0.64`), **fade in/out**, só durante o beat.
- [ ] Fora dos beats o vídeo fica **limpo e claro** (sem película).

🔎 **Qualidade:** a animação "salta" sobre a película, mas o **rosto ainda é visível**. Sem
poluição visual. Validar com stills (Etapa 11).

---

## 🔍 ETAPA 8 — Zoom dinâmico (in/out)

🎯 Deixar o vídeo "respirando" o tempo todo, sem momento parado.

🛠️ **Onde:** `useVideoScale` em `src/MeuVideo.tsx`. Combina:
- Ken Burns lento contínuo (`1.03 → 1.09`).
- **Push-in sustentado** durante cada beat (`+0.055`, ease in/out nas bordas).
- **Socos rápidos** (sine, `+0.05` em ~16 frames) no início de cada beat e nos `EXTRA_PUNCHES_S`
  (fins de frase).

✅ **Checklist**
- [ ] Há socos de zoom no início dos beats E em pontos de ênfase fora deles.
- [ ] Zoom sustentado enquanto a animação está na tela (entra fechando, sai abrindo).

🔎 **Qualidade:** nenhum trecho longo fica estático; o zoom é perceptível mas não embrulha.

---

## 🔥 ETAPA 9 — Film burn na SAÍDA + saída sincronizada (correção validada)

🎯 Transição "queimado de película" (light leak) **só no final de cada animação**.

🛠️ **Componentes:** `src/components/FilmBurn.tsx` (gradientes quentes + flash branco + blend
"screen" + blur, nos últimos ~18 frames do beat) e o wrapper **`ExitFade`** no master de
`Overlays.tsx` (fade + leve recuo dos elementos nos últimos ~16 frames).

⛔ **REVISÃO 27/07/2026 — SEM FILM BURN (continua valendo).** O dono tirou a queima de película
do vídeo inteiro (não é só "no fim" nem "só na abertura": é **nenhuma**). O `<FilmBurn />`
continua em `src/components/` caso volte a ser pedido, mas **não** é montado em `Overlays.tsx`.

✅ **REVISÃO 09/08/2026 — TRANSIÇÕES NOVAS (isto NÃO é film burn).** O dono pediu efeito de
transição nos cortes. Entrou `src/components/Transitions.tsx`, com três gramáticas curtas
(5–8 frames), no ritmo do Captions:

| tipo | onde | o que faz |
|------|------|-----------|
| `whip` | entrada e saída de B-roll full-bleed | borrão forte + risco de luz varrendo |
| `punch` | entrada de overlay sobre o rosto | borrão curto + estouro branco |
| `glitch` | entrada da palavra atrás da pessoa | split RGB em faixas finas |

⚠️ **Dois detalhes que quebram isso se forem mexidos:**
1. `<Transitions />` tem que ser a **última** camada de `MeuVideo.tsx`. Ela usa
   `backdrop-filter`, que só filtra o que está **atrás** dela — em qualquer outra posição não
   pega o quadro inteiro e vira um brilho colado na frente.
2. As faixas do `glitch` têm posições **fixas**. Nada de `Math.random()` em componente
   Remotion: cada frame do render sortearia um desenho diferente e a transição vira chuvisco.

O corte começa **2 frames antes** do evento — o borrão precisa já estar subindo quando a
imagem troca, senão a transição chega atrasada.

📌 *Histórico (regras anteriores, revogadas):* "film burn só no FIM do beat" → "film burn só na
abertura do vídeo" → **sem film burn**.

⚠️ **Regra do `ExitFade` (essa continua valendo):** o film burn, quando existir, **só** entra no FIM do beat. E
os elementos da animação **DEVEM sumir junto com a queima** (via `ExitFade`) — não pode sobrar
elemento na tela depois que a transição passa. Esse ajuste é obrigatório.

✅ **Checklist**
- [ ] Film burn dispara apenas nos últimos frames de cada beat (não no início, não no meio).
- [ ] `ExitFade` envolve cada overlay; elementos chegam a opacidade 0 antes do corte.
- [ ] Visual da queima: âmbar/laranja/branco, orgânico, com estouro branco curto no pico.

🔎 **Qualidade (validar com stills no fim de um beat):** num frame perto do fim, os elementos
estão **sumindo**; no último frame do beat, a tela está **limpa** (nada sobrando). Conferir em
mais de um beat.

---

## 🔉 ETAPA 10 — Efeitos sonoros (sob a voz)

🎯 SFX que casam com elementos/transições, **sempre com volume abaixo da voz do vídeo**.

🛠️ **Como:** `node ".\scripts\make-sfx.cjs"` gera os WAVs em `public/sfx/`. O componente
`src/audio/SoundFX.tsx` posiciona cada som no frame certo (derivado de `BEAT_TIMING`).
- Mapa validado: **whoosh** na entrada de cada beat; **tick** nos checks/tokens; **pop** em
  chips/balões/CTA; **impact** em carimbos; **ding** no clímax e no "link na bio".
- Volume: `MASTER = 0.40` × ganho por som (voz do vídeo = 1.0).

✅ **REVISÃO 09/08/2026 — VALE AGORA: COM SFX.** O dono pediu efeitos sonoros de volta ("pra
deixar o vídeo vivo"). Isto **revoga** a decisão de 27/07/2026 que tinha tirado todo o SFX.

O `<SoundFX />` está montado em `MeuVideo.tsx` e a lista de cues é **derivada de
`src/lib/cuts.ts`** — a mesma lista que desenha as transições. Isso é de propósito: som e
imagem saem da mesma fonte, então mexer no timing de um beat move os dois juntos.

Mapa em uso:
- **swoosh** na entrada e na saída de cada B-roll full-bleed (corte forte);
- **whoosh** na entrada de overlay (troca menor);
- **glitch + boom** quando a palavra entra atrás da pessoa;
- **tick/click/type** nos elementos que aparecem um a um (avatares, toggles, checklist, digitação);
- **impact** nos carimbos, **ding** nos beats de alívio/sucesso, **riser** antes do alerta.

Volume: `MASTER = 0.36` × ganho por som. Esse número foi **medido**, não chutado: com 0.42 o
pico da mistura passava o pico da voz num render de teste. A voz continua sendo o elemento
mais alto do vídeo.

📌 *Histórico (revogado):* "whoosh na entrada, sem som no film burn" → "só o `burn` no film
burn" → "sem SFX" → **com SFX derivados de `cuts.ts`**.

✅ **Checklist**
- [ ] Todo corte tem som, e o som cai no MESMO frame da transição.
- [ ] Pico da mistura **não** passa o pico da voz; zero clipping.
- [ ] A voz do vídeo original está presente na saída (`ffprobe` mostra faixa de áudio).

🔎 **Qualidade:** render curto de teste (`--frames=0-260 --scale=0.5`), extrair o WAV e comparar
pico da mistura × pico da voz original. Depois dar play no Studio e ouvir.

---

## 🧪 ETAPA 11 — Revisão e validação visual

🎯 Garantir que tudo está como combinado ANTES do render final.

🛠️ **Como**
- `npx tsc --noEmit` → **exit 0** (limpar imports/arquivos de template não usados, ex.: `HelloWorld`).
- Render de stills: editar a lista `frames` em `scripts/render-stills.cjs` (incluir o pico de cada
  beat + frames do FIM de beats pra checar a saída/film burn + 1 frame fora de beat) e rodar
  `node ".\scripts\render-stills.cjs"`. Abrir os PNGs em `out/` e revisar.
- Studio: `http://localhost:3000/MeuVideo`, dar play com áudio.

✅ **Checklist de revisão**
- [ ] Cada beat aparece no momento certo da fala e reforça a mensagem.
- [ ] Legendas legíveis e sincronizadas.
- [ ] Película só nos beats; rosto visível.
- [ ] Zoom dinâmico sem trecho parado.
- [ ] Film burn só na saída; elementos somem junto (nada sobra).
- [ ] SFX sob a voz; sem som no film burn.
- [ ] `tsc` limpo; Studio compila sem erro.

🔎 **Qualidade:** se algo falhar, ajustar e re-renderizar os stills do ponto em questão até passar.

---

## 🎞️ ETAPA 12 — Render final

🎯 Gerar o MP4 final só depois do "ok" do dono.

🛠️ **Como:** `npx remotion render MeuVideo "out/MeuVideo.mp4"`
(1080×1920 @30fps por padrão; com motion blur leva alguns minutos).

✅ **Checklist**
- [ ] Render termina exit 0; `out/MeuVideo.mp4` existe.
- [ ] `ffprobe`: dimensões/fps corretos + **faixa de áudio** presente.

🔎 **Qualidade:** abrir o arquivo final e conferir do início ao fim.

---

## 🎨 DECISÕES VALIDADAS (estética padrão — só mudar se o usuário pedir)

| Item | Valor aprovado |
|------|----------------|
| Formato | Vertical 1080×1920, 30 fps (ou o que o `ffprobe` indicar) |
| Fontes | Montserrat (legendas), Anton (display/impacto) |
| Cores | accent `#FFD60A`, danger `#FF3B30`, success `#30D158`, blue `#0A84FF` |
| Legendas | TikTok, ≤3 palavras/página, palavra ativa em caixa amarela, `paddingBottom` ~360 |
| Motion blur | `CameraMotionBlur` shutterAngle 150, samples 6 |
| Película | radial `rgba(0,0,0,0.32→0.64)`, fade in 10f / out 12f, só durante beats |
| Zoom | Ken Burns 1.03→1.09 + push-in +0.055 nos beats + socos +0.05 (16f) |
| Film burn | **removido** — segue fora |
| Transições | `whip` / `punch` / `glitch` (5–8f), de `lib/cuts.ts`, camada do topo |
| SFX | **religados** (09/08/2026), derivados de `lib/cuts.ts`, `MASTER = 0.36` |

---

## ♻️ RESUMO — fluxo pra um vídeo novo

1. (0) Pré-flight + gotchas Windows (`-LiteralPath`).
2. (1) Copiar vídeo → `public/video1.mp4`; `ffprobe`; ajustar `Root.tsx`/`constants.ts`.
3. (2) `npx remotion ffmpeg ... audio16k.wav`.
4. (3) `node scripts/transcribe.cjs` (atenção ao gotcha do Whisper).
5. (4) `node scripts/build-words.cjs`; ler a transcrição.
6. (5) Mapear beats em `src/lib/beats.ts` + ideias visuais.
7. (6–10) Ajustar textos/emojis dos overlays pro conteúdo; reaproveitar legendas, scrim, zoom,
   film burn + ExitFade e SFX (`node scripts/make-sfx.cjs`).
8. (11) `tsc` limpo + render de stills + revisão no Studio.
9. (12) Após "ok": `npx remotion render MeuVideo out/MeuVideo.mp4`.

> **Nunca pule a Etapa 11.** E **nunca** rode o render final sem o "ok" do dono.
