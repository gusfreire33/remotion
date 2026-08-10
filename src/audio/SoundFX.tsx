/**
 * EFEITOS SONOROS — religados a pedido do dono (09/08/2026: "efeitos sonoros
 * pra deixar o vídeo vivo"). Isto REVOGA a decisão de 27/07/2026 que tinha
 * tirado todo o SFX do vídeo.
 *
 * Regra que continua valendo: tudo SOB a voz. A voz do vídeo original é 1.0;
 * aqui o master é 0.42 e cada som ainda tem seu ganho próprio por cima disso.
 *
 * Os cortes vêm de `lib/cuts.ts` — a MESMA lista que desenha as transições.
 * É o que mantém som e imagem no mesmo frame.
 */
import { Audio, Sequence, staticFile } from "remotion";
import { secToFrame } from "../lib/constants";
import { CUTS } from "../lib/cuts";
import { BEAT_TIMING } from "../lib/beats";

// 0.36 e não 0.42: medindo um render de teste (0–8,75s) contra a faixa de voz
// original, com 0.42 o pico da mistura passava o pico da voz. Aqui a voz
// continua sendo o elemento mais alto do vídeo, que é a regra do playbook.
const MASTER = 0.36;

type Cue = { file: string; frame: number; volume: number; durFrames: number };

const cues: Cue[] = [];

const add = (file: string, at: number, volume: number, durSec: number): void => {
  cues.push({
    file,
    frame: secToFrame(at),
    volume,
    durFrames: Math.ceil(durSec * 30) + 2,
  });
};

const beatAt = (key: string): number =>
  BEAT_TIMING.find((b) => b.key === key)?.from ?? 0;

/* --- 1. um som por corte, casado com o tipo de transição --------------- */
for (const cut of CUTS) {
  if (cut.kind === "whip") {
    // corte forte de imagem: swoosh 2 frames antes (o som "puxa" a imagem)
    add("swoosh", cut.at - 0.07, 0.7, 0.24);
  } else if (cut.kind === "punch") {
    add("whoosh", cut.at - 0.07, 0.5, 0.36);
  } else {
    // palavra entrando atrás da pessoa: glitch curto + sub grave por baixo
    add("glitch", cut.at - 0.03, 0.4, 0.2);
    add("boom", cut.at, 0.6, 0.6);
  }
}

/* --- 2. detalhes por beat, no frame do elemento que aparece ------------ */

// maioria: cada avatar acendendo (10 bolinhas, 2,2 frames de intervalo)
for (let i = 0; i < 10; i++) {
  add("tick", beatAt("maioria") + 0.07 + i * 0.073, 0.5, 0.09);
}

// versus: os dois painéis entram e o "VS" bate no meio
add("pop", beatAt("versus") + 0.07, 0.7, 0.16);
add("pop", beatAt("versus") + 0.27, 0.7, 0.16);
add("impact", beatAt("versus") + 0.6, 0.7, 0.4);

// filtros: cada toggle ligando (3 chips, 9 frames de intervalo)
for (let i = 0; i < 3; i++) {
  add("click", beatAt("filtros") + 0.47 + i * 0.3, 0.9, 0.05);
}

// similar: 5 barras do equalizer subindo + ding no resultado
for (let i = 0; i < 5; i++) {
  add("tick", beatAt("similar") + 0.2 + i * 0.2, 0.45, 0.09);
}
add("ding", beatAt("similar") + 0.95, 0.6, 0.6);

// brasil: o selo carimba
add("impact", beatAt("brasil") + 0.07, 0.8, 0.4);

// contas: cadeado travando
add("impact", beatAt("contas") + 0.07, 0.65, 0.4);

// vaAtras: cada item do checklist marcando
for (let i = 0; i < 3; i++) {
  add("tick", beatAt("vaAtras") + 0.23 + i * 0.37, 0.8, 0.09);
}

// problema: riser subindo ANTES do alerta aparecer (tensão)
add("riser", beatAt("problema") - 0.5, 0.55, 0.5);

// naoAnuncia: o carimbo batendo
add("impact", beatAt("naoAnuncia") + 0.03, 0.7, 0.4);

// querAnunciar: digitando na barra de busca (28 caracteres em ~1,33s)
for (let i = 0; i < 14; i++) {
  add("type", beatAt("querAnunciar") + 0.2 + i * 0.095, 0.35, 0.04);
}

// tranquilo: alívio
add("ding", beatAt("tranquilo") + 0.05, 0.7, 0.6);

// cta: digitando "vazamento" (9 letras em ~1,13s) + pop no botão publicar
for (let i = 0; i < 9; i++) {
  add("type", beatAt("cta") + 0.33 + i * 0.126, 0.45, 0.04);
}
add("pop", beatAt("cta") + 1.53, 0.9, 0.16);

export const SoundFX: React.FC = () => (
  <>
    {cues.map((c, i) => (
      <Sequence
        key={`${c.file}-${i}`}
        from={Math.max(0, c.frame)}
        durationInFrames={c.durFrames}
        name={`sfx:${c.file}`}
      >
        <Audio src={staticFile(`sfx/${c.file}.wav`)} volume={MASTER * c.volume} />
      </Sequence>
    ))}
  </>
);
