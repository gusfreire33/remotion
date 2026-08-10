/**
 * B-ROLL — mídia gratuita do Pexels, amarrada aos beats de `beats.ts` pela
 * mesma chave. Cada clipe ilustra LITERALMENTE o que está sendo dito naquele
 * trecho da fala. Nada de imagem aleatória.
 *
 * Os arquivos ficam em `public/broll/<slug>.(mp4|jpg)` e são baixados por
 * `scripts/pexels.cjs fetch` a partir de `src/lib/broll-plan.json`.
 *
 * Neste vídeo (CHAT GPT ADS) o B-roll entra em inserções CURTAS (1,5–2,8s),
 * no ritmo do Captions: entra no meio da frase, sai antes de cansar.
 */
export type BRollClip = {
  /** chave do beat em BEAT_TIMING */
  key: string;
  /** nome do arquivo (sem extensão) em public/broll/ */
  slug: string;
  kind: "video" | "photo";
  /** full = toma a tela; card = inserção flutuante com o rosto visível */
  layout: "full" | "card";
  /** segundo do clipe de origem onde começar (corta a "gordura" do começo) */
  startAt?: number;
  /** Ken Burns: escala inicial -> final */
  zoom?: [number, number];
  /** deslocamento em px (design 1080x1920) do início ao fim */
  pan?: [number, number];
  /** velocidade de reprodução (0.6 = slow motion cinematográfico) */
  speed?: number;
  /** se o clipe é mais curto que o beat, repete a cada N frames */
  loopFrames?: number;
  /** topo do card (layout "card") */
  cardTop?: number;
  /** altura do card — usada pra não colidir com o overlay do mesmo beat */
  cardHeight?: number;
};

export const BROLL: BRollClip[] = [
  // "Nos últimos anos, desde o início do Chat GPT" — animação abstrata de IA
  {
    key: "aiRede",
    slug: "ai-rede",
    kind: "video",
    layout: "full",
    startAt: 2,
    zoom: [1.04, 1.14],
  },
  // "o Google foi deixado como uma rede de pesquisa e de busca de lado"
  {
    key: "googleLado",
    slug: "busca-laptop",
    kind: "video",
    layout: "full",
    startAt: 3,
    zoom: [1.05, 1.14],
  },
  // "passou a pesquisar... dentro do próprio Chat GPT"
  {
    key: "pesquisaGpt",
    slug: "digitando-noite",
    kind: "video",
    layout: "full",
    startAt: 2,
    zoom: [1.06, 1.16],
  },
  // "uma rede de intenção muito melhor do que o Google Ads" — flecha no alvo
  {
    key: "intencaoAlvo",
    slug: "alvo-mira",
    kind: "video",
    layout: "full",
    startAt: 1.5,
    zoom: [1.08, 1.2],
    speed: 0.85,
  },
  // "dar o mesmo tipo de segmentação" — dashboard, como inserção
  {
    key: "segmentacao",
    slug: "dashboard-ads",
    kind: "video",
    layout: "card",
    startAt: 3,
    cardTop: 560,
    cardHeight: 500,
  },
  // "filtrar pelo tipo de busca do interesse" — dados sendo filtrados
  {
    key: "filtroBroll",
    slug: "filtro-dados",
    kind: "video",
    layout: "full",
    startAt: 2,
    zoom: [1.05, 1.15],
  },
  // "chegou recentemente aqui no Brasil" — São Paulo do alto
  {
    key: "brasil",
    slug: "brasil-cidade",
    kind: "video",
    layout: "full",
    startAt: 1,
    zoom: [1.06, 1.16],
  },
  // "mas sente que está muito perdido" — travado na frente do computador
  {
    key: "perdidoBroll",
    slug: "perdido",
    kind: "video",
    layout: "full",
    startAt: 3,
    zoom: [1.05, 1.15],
  },
  // CTA — "comenta aqui abaixo": digitando no celular, como inserção
  {
    key: "cta",
    slug: "comentar-celular",
    kind: "video",
    layout: "card",
    // card menor e mais alto: embaixo dele entra a caixa de comentário do
    // overlay `cta` (que começa em y=820)
    startAt: 4,
    cardTop: 360,
    cardHeight: 400,
  },
];
