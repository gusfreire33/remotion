/**
 * EFEITOS SONOROS — "VSLL Wonne V4" (estilo VSL "Bilhon-OS").
 *
 * A referência usa poucos sons e todos graves: um BOOM na entrada de cada
 * cartão e de cada palavra grande. Aqui:
 *   · corte whip (cartão)      → swoosh 2f antes + boom no frame
 *   · corte punch (atrás)      → whoosh suave 2f antes + boom no frame
 *   · texto "over"             → whoosh bem baixo (o typewriter é silencioso)
 *   · chip / step entrando     → tick / click
 *   · notas de dinheiro        → riser curto antes
 *
 * ⚠️ MASTER NÃO se herda. Medir com `scripts/measure-audio.py` (Etapa 13.3).
 */

import { Audio, Sequence, staticFile } from "remotion";
import { secToFrame } from "../lib/constants";
import { CUTS } from "../lib/cuts";
import { CALLOUTS } from "../lib/callouts";

export const MASTER = 0.3;

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

for (const cut of CUTS) {
  if (cut.kind === "whip") {
    add("swoosh", cut.at - 0.07, 0.6, 0.24);
    add("boom", cut.at, 0.9, 0.6);
  } else if (cut.kind === "punch") {
    add("whoosh", cut.at - 0.07, 0.35, 0.36);
    add("boom", cut.at, 0.75, 0.6);
  }
}

for (const c of CALLOUTS) {
  if (c.kind === "over") {
    add("whoosh", c.from - 0.05, 0.22, 0.36);
    // a palavra de impacto (mono) ganha um impacto seco quando entra
    const mono = c.lines.find((l) => l.voice === "mono");
    if (mono && mono.at !== undefined && mono.at - c.from > 0.3) {
      add("impact", mono.at, 0.35, 0.4);
    }
  } else if (c.kind === "chips") {
    for (const it of c.items) add("tick", it.at, 0.45, 0.09);
    if (c.tail?.at !== undefined) add("impact", c.tail.at, 0.5, 0.4);
  } else if (c.kind === "steps") {
    for (const it of c.items) {
      add("click", it.at, 0.5, 0.05);
      add("ding", it.at + 0.03, 0.35, 0.6);
    }
  } else if (c.kind === "card") {
    for (const l of c.lines.slice(1)) {
      if (l.at !== undefined) add("pop", l.at, 0.4, 0.16);
    }
    if (c.chips) for (const it of c.chips) add("tick", it.at, 0.42, 0.09);
    if (c.moneyAt !== undefined) {
      add("riser", c.moneyAt - 0.5, 0.4, 0.5);
      add("ding", c.moneyAt, 0.45, 0.6);
    }
  }
}

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
