# 🎬 PLAYBOOK 2 — Edição estilo "CAPTIONS"

> **Framework 2 de edição de vídeo.** Validado pelo dono em 09/08/2026, a partir da edição do
> vídeo "Chat GPT Ads". Quando for pedido **"edita usando o framework 2"**, siga ESTE
> documento da Etapa 0 à 15.
>
> ⚠️ **A regra mais importante deste documento:** aqui não tem lista de animações pra copiar.
> Tem o **método de pensar** a animação. Cada vídeo novo precisa das SUAS PRÓPRIAS animações,
> derivadas do que ELE diz. Se você reaproveitar a animação de um vídeo anterior, você falhou
> — mesmo que ela fosse boa. O que se repete é a **gramática**, nunca o conteúdo.

---

## 🆚 O que muda do Framework 1

O Playbook 1 (`PLAYBOOK.md`) continua válido como base técnica. O Framework 2 mantém quase
tudo dele e troca **quatro** coisas — são elas que fazem a "cara" desta edição:

| | Framework 1 | **Framework 2** |
|---|---|---|
| Legenda | caixa amarela na palavra ativa, fonte 60, `paddingBottom` 560 | **só texto branco**, fonte 46, `paddingBottom` 700 |
| Palavra de impacto | dentro do overlay | **atrás da pessoa** (recorte com canal alfa) |
| Transição | corte + `ExitFade`, e só | corte + **`whip` / `punch` / `glitch`** |
| Som | nenhum | **SFX derivados do mapa de cortes** |

Continua igual: vertical 1080×1920 (4K no render), fontes Montserrat + Anton, película só nos
beats, `CameraMotionBlur` 150/6, `ExitFade`, zoom dinâmico, **sem film burn**, e a regra de
ouro — **animação é guiada pela minutagem da fala**, nunca o contrário.

---

## ⚙️ ETAPA 0 — Pré-flight

Igual ao Playbook 1, Etapa 0. Windows + PowerShell, **sempre `-LiteralPath`** (o caminho tem
colchetes), comandos rodados de `editor/`, `npx tsc --noEmit` exit 0 antes e depois.

Adicional do Framework 2 — o recorte da pessoa precisa de Python:

```powershell
python -m pip install mediapipe opencv-python numpy
```

E do modelo de segmentação em `scripts/models/selfie_segmenter.tflite` (baixar de
`https://storage.googleapis.com/mediapipe-models/image_segmenter/selfie_segmenter/float16/latest/selfie_segmenter.tflite`).

---

## 📥 ETAPAS 1–4 — Ingerir, proxy, transcrever

Igual ao Playbook 1 (Etapas 1 a 4), com **uma adição obrigatória**: gerar o **proxy 1080p**.

```powershell
# 1. copiar a fonte
Copy-Item -LiteralPath "<origem>.mp4" -Destination ".\public\<nome>_src.mp4" -Force
npx remotion ffprobe ".\public\<nome>_src.mp4"     # anotar WxH, fps, duração

# 2. proxy 1080p — é dele que sai o preview E o recorte da pessoa
npx remotion ffmpeg -i ".\public\<nome>_src.mp4" -vf scale=1080:1920 `
  -c:v libx264 -crf 20 -preset veryfast -c:a aac -b:a 192k ".\public\<nome>_1080.mp4" -y

# 3. áudio e transcrição
npx remotion ffmpeg -i ".\public\<nome>_src.mp4" -ar 16000 -ac 1 -c:a pcm_s16le ".\audio16k.wav" -y
node ".\scripts\transcribe.cjs"
node ".\scripts\build-words.cjs"
```

Atualizar `src/lib/constants.ts` (`DURATION_IN_FRAMES = ceil(duração × fps)`) e o comentário
do `Root.tsx`.

✅ **Checklist:** proxy existe · `words.ts` gerado · a transcrição impressa lê como frases
naturais · `constants.ts` bate com o `ffprobe`.

---

## 🧠 ETAPA 5 — LER O VÍDEO (a etapa que define tudo)

🎯 Antes de decidir **qualquer** efeito, entender o que o vídeo diz. Esta etapa é 100%
raciocínio, zero código. Pular aqui é o que produz vídeo enfeitado e sem retenção.

### 5.1 · Escrever a tese em 2 linhas

Ler a transcrição inteira e escrever, com suas palavras, **qual é a afirmação central** e
**o que o espectador deveria fazer/pensar no fim**. Se você não consegue escrever isso, você
ainda não entendeu o vídeo — releia.

> Exemplo do vídeo validado: *"O ChatGPT virou a nova rede de intenção e o ChatGPT Ads chegou
> ao Brasil em acesso restrito; é a mesma segmentação do Google Ads, porém mais eficiente.
> Ressalva: saúde não pode anunciar. CTA: comentar uma palavra."*

### 5.2 · Achar a espinha do roteiro

Marcar na minutagem onde estão estes blocos (nem todo vídeo tem todos):

1. **Hook** — os primeiros ~4s. O que prende.
2. **Contexto / o que mudou** — por que isso importa agora.
3. **Argumento** — a lista de razões, provas, números, comparações.
4. **Ressalva / objeção** — o "porém", o risco, quem fica de fora. *Este é o bloco mais
   subestimado: é onde a retenção cai e onde um efeito forte segura.*
5. **CTA** — o pedido final.

### 5.3 · Classificar CADA trecho em um dos 4 tratamentos

Este é o coração do Framework 2. Percorra a transcrição do começo ao fim e atribua a cada
trecho **um, e só um**, destes tratamentos:

| Tratamento | Quando usar | O que o espectador vê |
|---|---|---|
| **LIMPO** | fala de ligação, respiro | só você + legenda |
| **PALAVRA ATRÁS** | **um substantivo/conceito** que é o ponto da frase | tipografia gigante atrás da pessoa |
| **OVERLAY** | a frase tem **estrutura** (lista, comparação, número, condição, alerta) | motion design sobre o rosto |
| **B-ROLL** | a frase descreve **uma coisa concreta do mundo** | o clipe toma a tela |

**Como decidir rápido, na dúvida:** pergunte *"o que essa frase é?"*
- É **uma palavra**? → PALAVRA ATRÁS.
- É **uma relação entre coisas** (A vs B, 3 itens, antes/depois, se→então)? → OVERLAY.
- É **um objeto ou lugar filmável** (um laptop, uma cidade, um exame)? → B-ROLL.
- Não é nada disso? → LIMPO. **E está tudo bem.** Trecho limpo não é falha, é respiro.

### 5.4 · Calibrar a densidade

O ritmo do Captions é denso, mas não é aleatório. A métrica validada:

> **1 evento a cada ~2,1 segundos.**
> (o vídeo aprovado: 30 eventos — 20 beats + 10 palavras-atrás — em 63,9s)

Regras de ritmo que valem mais que a métrica:

- **Nunca dois tratamentos iguais colados.** B-roll seguido de B-roll cansa; duas palavras-atrás
  seguidas viram enfeite. Alterne.
- **Evento nasce e morre dentro da frase.** Um beat que atravessa duas frases atrasa o vídeo.
- **Nenhum trecho limpo maior que ~3s.** Se ficou, ou entra um evento, ou entra um soco de zoom.
- **O bloco da ressalva merece o efeito mais forte do vídeo.** É onde o público ia sair.

### 5.5 · Escrever o mapa

Registrar em `src/lib/beats.ts` (`BEAT_TIMING`) e `src/lib/behind.ts` (`BEHIND_WORDS`), com o
trecho da fala **em comentário** em cima de cada entrada. O comentário não é decoração: é o que
permite conferir depois se a animação bate com o que está sendo dito.

✅ **Checklist**
- [ ] Tese escrita em 2 linhas.
- [ ] Todo trecho da transcrição tem um tratamento atribuído.
- [ ] Densidade em torno de 1 evento / 2,1s.
- [ ] Nenhum tratamento repetido em sequência; nenhum limpo > 3s.
- [ ] Beats não se sobrepõem, e **nenhuma palavra-atrás cai dentro de um B-roll full-bleed**
      (lá o vídeo base não está na tela — não há o que recortar).

🔎 **Qualidade:** lendo só o mapa de beats, dá pra contar a história do vídeo.

---

## 🔤 ETAPA 6 — Escolher as palavras que vão ATRÁS da pessoa

🎯 Este é o efeito-assinatura do Framework 2. Ele só funciona com **curadoria**; se virar
enfeite recorrente, perde o impacto.

### 6.1 · Que palavra qualifica

Uma palavra vai pra trás da pessoa quando ela passa nos **três** filtros:

1. **É o núcleo da frase.** Se você apagasse essa palavra, a frase perderia o sentido.
2. **É curta o bastante pra ser lida em <1s.** Uma palavra, ou duas em duas linhas. Nunca frase.
3. **Ela é dita.** O texto entra **junto com a palavra saindo da boca**, não antes, não depois.

Bons candidatos, na prática: o **nome do assunto** (hook), o **conceito** que o vídeo está
vendendo, o **vilão/comparação**, o **número ou a restrição**, e a **palavra do CTA**.

### 6.2 · Quantas

**~1 a cada 6s de vídeo** (o validado: 10 em 64s). Menos que isso o recurso não vira
assinatura; mais que isso vira ruído e a legenda some demais.

### 6.3 · Janela e cor

- **Duração:** 1,0s a 1,8s. Começa no timestamp da palavra em `words.ts`, termina antes do
  próximo evento.
- **Cor = semântica, não gosto.** Branco é o padrão. `accent` (#FFD60A) pro conceito que o
  vídeo está vendendo e pro CTA. `danger` (#FF3B30) pra restrição/risco. `success` (#30D158)
  pro benefício. **No máximo 3 coloridas no vídeo** — se tudo é destaque, nada é.
- **`outline` (só contorno)** pra palavra secundária ou pro "vilão": pesa menos que a sólida e
  cria variação sem competir.

### 6.4 · Posicionar — MEÇA, não chute

⚠️ **Erro que eu cometi e você não deve repetir:** posicionei o texto pelo que "parecia" certo
e ele ficou todo **acima** da cabeça — flutuando no vazio, sem cruzar a pessoa. O efeito
simplesmente não aparecia.

**O procedimento certo:** renderize um frame do recorte e **meça onde a pessoa está**.

```powershell
$ff='.\node_modules\@remotion\compositor-win32-x64-msvc\ffmpeg.exe'
& $ff -y -vcodec libvpx-vp9 -ss 20 -i ".\public\matte-pessoa.webm" -frames:v 1 -pix_fmt rgba ".\_m.png"
```

Abra o PNG e anote, em coordenadas de design 1080×1920: **onde começa a cabeça** e **onde está
o queixo**. Depois:

> **A BASE do texto tem que cair entre o topo da cabeça e o queixo.**
> Ou seja: `top + altura_do_texto` ≈ topo_da_cabeça + 20% da altura da cabeça.

Assim a palavra é **cortada ao meio** pela pessoa — que é exatamente o que faz o cérebro
entender "isso está atrás dele". Texto inteiro acima da cabeça = efeito invisível. Texto
inteiro atrás do tronco = palavra ilegível.

*Referência do enquadramento validado (busto centralizado): cabeça começa em ~y=550, queixo em
~y=1000. Os `top` usados ficaram entre 460 e 510 pra palavra de uma linha, e ~270–360 pra duas
linhas.* **Reconfira no seu vídeo — outro enquadramento muda tudo.**

### 6.5 · A legenda some aqui

Durante a janela da palavra-atrás, a legenda de baixo **é desligada** (`isBehindWindow`). A
palavra gigante já É a legenda naquele instante; mostrar as duas repete a mesma palavra na tela
e fica amador.

---

## ✂️ ETAPA 7 — Gerar o recorte da pessoa (matte)

🎯 Produzir `public/matte-pessoa.webm`: o apresentador recortado, com canal alfa.

```powershell
python ".\scripts\make-matte.py"    # lê public/<nome>_1080.mp4
```

**Como a mágica funciona** — a pilha de camadas em `MeuVideo.tsx`, nesta ordem:

```
1. vídeo base           (scale = S)
2. BehindText           ← a palavra
3. recorte da pessoa    (scale = S)   ← cobre a palavra
4. gradiente / overlays / legendas
5. Transitions          ← sempre por último
6. SoundFX
```

⛔ **Quatro armadilhas. Todas elas quebram o efeito, e todas já me pegaram:**

1. **O recorte precisa do MESMO `scale` do vídeo base.** Ele sai do mesmo frame; se os zooms
   divergirem, desencaixa e aparece um fantasma duplicado.
2. **Nada de `<Sequence>` em volta do recorte.** Dentro de uma Sequence o vídeo recomeça do
   frame 0 a cada janela — a pessoa recortada fica numa pose diferente da que está embaixo.
   Deixe **sempre montado no tempo absoluto** e ligue/desligue pela **opacidade**.
3. **`<OffthreadVideo transparent />`, não o `<Video>` do `@remotion/media`.** O último não
   decodifica VP9 com alfa: sai listrado de verde e magenta.
4. **Keyframes a cada 10 frames** no encode (`-g 10 -keyint_min 10`). Sem isso o preview
   funciona mas o **render final quebra** com `No frame found at position X`.

*(O `scripts/make-matte.py` já faz o item 4. Os outros três são do lado do React.)*

✅ **Checklist:** o webm existe · um frame extraído tem canal alfa com a pessoa sólida e o
fundo em 0 · `ffprobe` mostra a duração igual à do vídeo.

---

## 💬 ETAPA 8 — Legenda simples

🎯 Legenda que **não compete** com nada. É o oposto da do Framework 1.

Parâmetros validados (`src/components/Captions.tsx`) — só mude se o dono pedir:

| Item | Valor |
|---|---|
| Cor | **branco puro, sempre.** Nenhum destaque colorido, nenhuma caixa |
| Fonte | Montserrat 800, **46px**, uppercase |
| Palavra ativa | opacidade 1 e `scale` +8%; as outras em opacidade 0,72 |
| Posição | `paddingBottom: 700` — bem acima da UI do Reels |
| Agrupamento | ≤3 palavras / ≤24 caracteres por página (`lib/pages.ts`) |
| Sombra | discreta, só pra ler sobre fundo claro |
| Durante palavra-atrás | **desligada** |

A palavra falada muda de **peso visual**, nunca de cor. É isso que dá o ritmo sem poluir.

---

## ✨ ETAPA 9 — INVENTAR as animações (não copiar)

🎯 Esta é a etapa que o dono fez questão de deixar registrada como **raciocínio**. Não existe
biblioteca de animações pra reusar. Existe um **método**.

### 9.1 · O princípio: a animação É o verbo da frase

Para cada beat de OVERLAY, faça esta pergunta e responda em uma linha:

> **"Que MOVIMENTO essa frase está descrevendo?"**

Não "que ícone combina", não "que cor fica bonita". **Que movimento.** A frase quase sempre
contém um verbo ou uma relação que já é uma animação pronta:

- "a maioria **migrou**" → algo enchendo, passando de um lado pro outro
- "é **melhor que** o outro" → dois blocos lado a lado, um cresce e o outro recua
- "dá pra **filtrar**" → chaves ligando, itens sendo separados
- "é mais **eficiente**" → uma medida subindo
- "**chegou** aqui" → algo aterrissando, carimbando
- "é **restrito**" → algo fechando, esvaziando, travando
- "**vá atrás** e entenda" → uma lista sendo cumprida, item a item
- "o **problema** é..." → um alerta interrompendo o fluxo
- "**não pode**" → algo batendo e barrando
- "você **quer** começar?" → um campo esperando resposta

Se você não consegue nomear o movimento, o trecho **não é OVERLAY** — provavelmente é
PALAVRA ATRÁS ou LIMPO. Volte pra Etapa 5.3.

### 9.2 · Escolher a forma que carrega esse movimento

Com o verbo na mão, escolha a **família de forma** que o expressa. Estas famílias são a
gramática do estilo — combine e varie, mas **cada beat do vídeo usa uma família diferente**:

| Família | Expressa | Exemplos de uso |
|---|---|---|
| **Contadores / barras** | quantidade, proporção, escassez | % enchendo, vagas esvaziando |
| **Fileira de unidades** | "a maioria", "N de cada M" | pontos/avatares acendendo em cascata |
| **Split / versus** | comparação | dois painéis entrando, um vence |
| **Lista com estado** | condições, requisitos, passos | checklist marcando, chips com toggle |
| **Medida crescente** | eficiência, resultado, evolução | barras subindo uma a uma |
| **Selo / carimbo** | chegada, veredito, proibição | bater torto e grande, com recuo |
| **Faixa / alerta** | interrupção, ressalva, risco | listrado, pulsando |
| **Campo de entrada** | pergunta, busca, intenção | cursor digitando |
| **Interface familiar** | CTA social | caixa de comentário, botão |
| **Ticker / marquee** | novidade, "está acontecendo" | faixa deslizando |

### 9.3 · Regras de execução (estas não mudam)

- **Uma ideia por beat.** Se você precisa de duas, são dois beats — ou você não entendeu a frase.
- **Entrada escalonada:** os elementos entram **um a um** (6–11 frames de intervalo), nunca
  todos juntos. É o escalonamento que dá vida — e é ele que dá o gancho pros SFX.
- **Motion blur** em todo overlay: `<CameraMotionBlur shutterAngle={150} samples={6}>`.
- **`ExitFade` (12f)** em tudo: no último frame do beat a tela tem que estar **limpa**.
- **Película (`BeatScrim`)** só quando o overlay entra **sobre o rosto**. Se o beat é B-roll
  full-bleed, o clipe já tomou a tela — escurecer de novo só suja.
- **Área segura:** overlay é erguido pra acima de y≈1130 (`paddingBottom: 700`), senão bate na
  legenda. Se o beat tem card de B-roll **e** overlay, posicione os dois por coordenada
  explícita e confira que não colidem.
- **Nada de `Math.random()`.** Em Remotion cada frame re-executa o componente: aleatoriedade
  sorteia um desenho diferente por frame e a animação vira chuvisco. Valores fixos, sempre.
- **Emoji:** os comuns (⚠️ 🔒 👇 🔎) renderizam. **Bandeiras (🇧🇷) não** — o Chrome do render
  desenha as letras cruas ("BR"). Desenhe a forma na mão.

✅ **Checklist:** cada beat tem um verbo escrito no comentário · nenhuma família repetida ·
entradas escalonadas · nada sobra no último frame do beat.

---

## 🎞️ ETAPA 10 — B-roll

🎯 Ilustrar **literalmente** a coisa concreta que a frase citou. B-roll bonito e genérico é
pior que nenhum B-roll.

### 10.1 · Derivar os termos de busca da própria fala

Para cada beat de B-ROLL, extraia da frase **o objeto concreto** e traduza pra um termo de
busca **em inglês** (o acervo do Pexels responde muito melhor em inglês). Busque a **cena**,
não o conceito abstrato: `"typing laptop night"` funciona, `"artificial intelligence"` devolve
robô de plástico.

```powershell
node ".\scripts\pexels.cjs" search "termo em ingles"    # lista candidatos
# escolher os IDs -> escrever src/lib/broll-plan.json -> baixar:
node ".\scripts\pexels.cjs" fetch
```

Preferir sempre resultados **1080×1920 (vertical)** — o script já pontua vertical mais alto.

### 10.2 · Registrar o porquê

Em `broll-plan.json`, o campo `why` guarda **o trecho da fala** que o clipe ilustra. Se você não
consegue escrever o `why`, o clipe é decorativo — descarte.

### 10.3 · Tratamento

- **Duração 1,5–2,8s.** Inserção curta, no ritmo do Captions. Clipe longo mata a retenção.
- **`startAt`** corta a "gordura" do começo do clipe do Pexels (quase sempre 1–4s).
- **`full`** quando a frase é sobre a coisa; **`card`** quando você quer manter o rosto na tela.
- **Ken Burns sempre** (`zoom: [1.05, 1.15]`) — clipe parado denuncia o corte.
- Card tem que **fechar acima de y≈1130** (a legenda). Use `cardHeight` quando o mesmo beat
  também tem overlay.

---

## 🔍 ETAPA 11 — Zoom (o vídeo respirando)

Igual ao Playbook 1, com uma diferença de mapeamento:

- **Ken Burns** contínuo 1.03 → 1.09 no vídeo inteiro.
- **Push-in** sustentado durante cada beat (`+0.06`, bordas de 9 frames).
- **Socos (`EXTRA_PUNCHES_S`)** → no Framework 2 eles vão **exatamente nas palavras-atrás**.
  Esses são os momentos limpos (sem overlay nem B-roll), então é ali que o zoom trabalha.

---

## ⚡ ETAPA 12 — Transições

🎯 Marcar cada troca de imagem. São **cortes secos e curtos**, não dissolves. Isto **não** é
film burn — o film burn segue removido.

**O mapa de cortes é DERIVADO, não escrito à mão** (`src/lib/cuts.ts`): ele lê `beats.ts`,
`broll.ts` e `behind.ts` e monta a lista. Isso importa porque a mesma lista alimenta os SFX —
é o que garante que som e imagem caiam no mesmo frame, e que ajustar um beat mova os dois.

| Tipo | Onde | Duração | Efeito |
|---|---|---|---|
| `whip` | entrada **e saída** de B-roll full-bleed | 8f | borrão forte + risco de luz varrendo |
| `punch` | entrada de overlay | 5f | borrão curto + estouro branco |
| `glitch` | entrada de palavra-atrás | 5f | split RGB em faixas finas |

⚠️ **Três regras que quebram isso:**

1. `<Transitions />` é a **última** camada de `MeuVideo.tsx`. Ela usa `backdrop-filter`, que só
   filtra o que está **atrás** dela — em qualquer outra posição não pega o quadro inteiro e
   vira um brilho colado na frente.
2. O corte começa **2 frames antes** do evento. O borrão precisa já estar subindo quando a
   imagem troca; começando no evento, a transição chega atrasada.
3. **Faixas do glitch em posições fixas** (ver a regra do `Math.random()` na Etapa 9.3), e
   **finas, escuras, em `mix-blend-mode: screen`**. Faixa grossa e saturada vira um retângulo
   chapado cobrindo o rosto — foi assim na minha primeira tentativa, e ficou ruim.

---

## 🔉 ETAPA 13 — Efeitos sonoros

🎯 Dar corpo aos cortes e aos elementos, **sempre sob a voz**.

```powershell
node ".\scripts\make-sfx.cjs"   # sintetiza os WAVs em public/sfx/ (nada externo)
```

### 13.1 · Camada 1 — um som por corte

Sai direto de `cuts.ts`, casado com o tipo de transição:

| Corte | Som | Quando |
|---|---|---|
| `whip` | `swoosh` | 2 frames **antes** — o som puxa a imagem |
| `punch` | `whoosh` | 2 frames antes |
| `glitch` | `glitch` + `boom` | glitch 1f antes, boom no frame exato |

### 13.2 · Camada 2 — um som por elemento

É esta camada que faz o vídeo parecer "vivo". Para **cada elemento que entra escalonado** na
Etapa 9.3, um som no frame dele:

| Elemento | Som |
|---|---|
| unidade acendendo, barra subindo, item marcando | `tick` |
| toggle / chip ligando | `click` |
| caractere sendo digitado | `type` |
| bloco/painel aparecendo | `pop` |
| carimbo, selo, veredito | `impact` |
| alívio, benefício, sucesso | `ding` |
| tensão antes de um alerta | `riser` (**começa antes** do beat) |

### 13.3 · Volume — MEÇA, não chute

⚠️ No primeiro ajuste eu pus `MASTER = 0.42` e **o pico da mistura passou o pico da voz**. Só
descobri porque medi. O procedimento:

```powershell
# render curto
$env:TMP='D:\remotion-tmp'; $env:TEMP='D:\remotion-tmp'
npx remotion render MeuVideo ".\out\_teste.mp4" --frames=0-260 --scale=0.5
# extrair o WAV da mistura e o WAV da voz original, e comparar os picos
```

> **Critério de aprovação: pico da mistura ≈ pico da voz + no máximo ~10%, e zero clipping.**
> No vídeo validado: mistura 0,381 × voz 0,349, com `MASTER = 0.36`.

*(o `volumedetect` do ffmpeg do Remotion não existe — ele é compilado com `--disable-filters`.
Extraia o WAV e meça com numpy.)*

---

## 🧪 ETAPA 14 — Revisão

⛔ **Nunca pule.** Foi a revisão que pegou os dois piores bugs desta edição (o recorte listrado
e o recorte fora de sincronia) — nenhum dos dois era óbvio lendo o código.

1. **`npx tsc --noEmit` → exit 0.**
2. **Stills.** Editar a lista em `scripts/render-stills.cjs` (ou passar frames por argumento:
   `node .\scripts\render-stills.cjs 134 216 331`). Incluir obrigatoriamente:
   - **cada palavra-atrás** (o meio da janela);
   - o **pico de cada overlay**;
   - **um frame de cada B-roll**;
   - o **fim de um beat** (a tela tem que estar limpa — checa o `ExitFade`);
   - o **frame exato de 2–3 cortes** (checa as transições).
3. **Folha de contato.** Juntar os PNGs num mosaico e revisar todos de uma vez — problema de
   ritmo e colisão só aparece vendo lado a lado.
4. **Render curto de teste** (`--frames=0-260 --scale=0.5`) para: validar o **áudio** (Etapa
   13.3) e provar que o **recorte não quebra no render**. Rodar também um trecho **do fim** do
   vídeo — o erro de keyframe só aparece em timestamps tardios.
5. **Studio:** `npm run dev` → `http://localhost:3000/MeuVideo`, play com som.

### Checklist de revisão

- [ ] Cada palavra-atrás está **cortada pela pessoa** (não acima da cabeça, não ilegível).
- [ ] Legenda: só branco, legível, e **some** durante as palavras-atrás.
- [ ] Cada overlay bate com a frase que ele ilustra.
- [ ] Nenhum overlay/card colide com a legenda.
- [ ] Película só nos beats sobre o rosto; rosto sempre visível.
- [ ] Nada sobra na tela no último frame de nenhum beat.
- [ ] Transições: sentidas, não vistas — e no frame do corte.
- [ ] Áudio: SFX sob a voz, medido, zero clipping.
- [ ] Nenhum trecho parado > 3s.

---

## 🎬 ETAPA 15 — Render final

⛔ **Só depois do "ok" do dono.** Nunca antes.

```powershell
$env:TMP='D:\remotion-tmp'; $env:TEMP='D:\remotion-tmp'   # C: enche com o cache do render
$env:REMOTION_USE_4K='1'
npx remotion render MeuVideo "out/MeuVideo.mp4" --scale=2
```

✅ Render exit 0 · `ffprobe` mostra dimensões/fps corretos **e faixa de áudio** · assistir do
início ao fim.

---

## 🧰 APÊNDICE — Armadilhas (todas custaram retrabalho de verdade)

| Sintoma | Causa | Solução |
|---|---|---|
| Recorte listrado de verde/magenta | `@remotion/media` não decodifica VP9 com alfa | `<OffthreadVideo transparent />` |
| Pessoa recortada em pose diferente da de baixo | `<Sequence>` em volta reinicia o vídeo | tempo absoluto + liga/desliga por opacidade |
| `No frame found at position X` no render | GOP longo no webm com alfa | `-g 10 -keyint_min 10` |
| `Unknown input format: rawvideo` | ffmpeg do Remotion é `--disable-demuxers` | `-f image2pipe -vcodec png` |
| `volumedetect` não existe | mesmo ffmpeg, `--disable-filters` | extrair WAV e medir com numpy |
| Bandeira sai como "BR" | Chrome do render não tem emoji de bandeira | desenhar a forma na mão |
| Animação "chuviscando" no render | `Math.random()` no componente | valores fixos |
| Disco C: enchendo no render | cache de frames do Remotion | `$env:TEMP='D:\remotion-tmp'` |
| Comando falha no PowerShell | `[WD]` vira wildcard | **sempre `-LiteralPath`** |

---

## ♻️ RESUMO — fluxo pra um vídeo novo com o Framework 2

1. **(0)** Pré-flight + `mediapipe`/modelo instalados.
2. **(1–4)** Ingerir → **proxy 1080p** → áudio 16k → transcrever → `words.ts` → `constants.ts`.
3. **(5)** **Ler o vídeo:** tese → espinha → classificar cada trecho nos 4 tratamentos →
   calibrar densidade (~1 evento / 2,1s) → escrever `beats.ts` + `behind.ts`.
4. **(6)** Escolher as palavras-atrás (~1 a cada 6s) e **medir** o enquadramento pra posicionar.
5. **(7)** `python scripts/make-matte.py` + montar a pilha de camadas certa.
6. **(8)** Legenda simples (branca, 46, `paddingBottom` 700, some nas palavras-atrás).
7. **(9)** **Inventar** os overlays: verbo da frase → família de forma → uma família por beat.
8. **(10)** B-roll literal do Pexels, inserções de 1,5–2,8s, com `why` registrado.
9. **(11)** Zoom: Ken Burns + push-in nos beats + socos nas palavras-atrás.
10. **(12)** Transições derivadas de `cuts.ts`, camada do topo.
11. **(13)** SFX das mesmas `cuts.ts` + som por elemento; **medir** o volume.
12. **(14)** `tsc` + stills + folha de contato + render curto (começo **e** fim) + Studio.
13. **(15)** Após o "ok": render 4K.

> **Duas regras acima de todas as outras:**
> **A animação sai da fala — nunca de um catálogo.**
> **Meça o que dá pra medir** (posição do rosto, volume do áudio). Chutar custou retrabalho nas
> duas vezes em que eu chutei.
