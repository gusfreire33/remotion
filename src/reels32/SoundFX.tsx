import { Audio, Sequence, staticFile } from "remotion";
import { CUTS } from "./lib/cuts";
import { BEAT_TIMING, ELEMENT_FRAMES } from "./lib/beats";
import { frameAt } from "./lib/constants";

/**
 * EFEITOS SONOROS — "Reels 32".
 *   Camada 1: um som por corte (derivado de cuts.ts).
 *   Camada 2: um som por elemento escalonado (os mesmos frames de
 *   ELEMENT_FRAMES que movem a animação).
 *
 * ⚠️ MASTER NÃO se herda — medir com scripts/measure-audio.py (Etapa 13.3).
 */
export const MASTER = 0.32;

type Sound = "whoosh" | "swoosh" | "glitch" | "boom" | "tick" | "click" | "pop" | "impact" | "ding" | "type" | "riser";
const LEN: Record<Sound, number> = {
  whoosh: 0.36, swoosh: 0.24, glitch: 0.14, boom: 0.6, tick: 0.09, click: 0.05,
  pop: 0.16, impact: 0.4, ding: 0.6, type: 0.06, riser: 0.5,
};
export type Cue = { file: Sound; frame: number; volume: number; duration: number };
const cues: Cue[] = [];
const add = (file: Sound, frame: number, volume: number): void => {
  cues.push({ file, frame: Math.max(0, frame), volume, duration: Math.ceil(LEN[file] * 30) + 2 });
};

// ── camada 1: cortes
for (const cut of CUTS) {
  if (cut.kind === "glitch") {
    add("glitch", frameAt(cut.at) - 1, 0.3);
    add("boom", frameAt(cut.at), 0.55);
  } else if (cut.kind === "whip") {
    add("swoosh", frameAt(cut.at) - 2, 0.55);
  } else {
    add("whoosh", frameAt(cut.at) - 2, 0.48);
  }
}

// ── camada 2: elementos
const at = (key: string): number => frameAt(BEAT_TIMING.find((b) => b.key === key)!.from);
const E = ELEMENT_FRAMES;

// esquece: clientes acendem (tick) · apagam (click) · rótulo (pop)
E.esquece.acende.forEach((f) => add("tick", at("esquece") + f, 0.42));
E.esquece.apaga.forEach((f) => add("click", at("esquece") + f, 0.5));
add("pop", at("esquece") + E.esquece.rotulo, 0.4);

// atestado: papel (pop) · assinatura (whoosh baixo) · letras (type) · riser antes do carimbo · carimbo (impact)
add("pop", at("atestado") + E.atestado.papel, 0.4);
add("whoosh", at("atestado") + E.atestado.assina, 0.22);
E.atestado.letras.forEach((f) => add("type", at("atestado") + f, 0.4));
add("riser", at("atestado") + E.atestado.carimbo - 15, 0.32);
add("impact", at("atestado") + E.atestado.carimbo, 0.7);

// vendendo: painel (pop) · barras (tick) · última venda (ding)
add("pop", at("vendendo") + E.vendendo.painel, 0.4);
E.vendendo.barras.forEach((f) => add("tick", at("vendendo") + f, 0.45));
add("ding", at("vendendo") + E.vendendo.barras[3] + 2, 0.35);

// convencer: painéis (pop) · cliente chega (ding) · nova pessoa (pop) · batidas (click, click, impact) · veredito (impact)
add("pop", at("convencer") + E.convencer.painelA, 0.4);
add("pop", at("convencer") + E.convencer.painelB, 0.4);
add("ding", at("convencer") + E.convencer.chega, 0.32);
add("pop", at("convencer") + E.convencer.novaPessoa, 0.35);
add("click", at("convencer") + E.convencer.batidas[0], 0.5);
add("click", at("convencer") + E.convencer.batidas[1], 0.5);
add("impact", at("convencer") + E.convencer.batidas[2], 0.4);
add("impact", at("convencer") + E.convencer.veredito, 0.65);

// travas: kicker (pop) · linhas (pop) · cadeados fecham (click)
add("pop", at("travas") + E.travas.kicker, 0.3);
E.travas.linhas.forEach((f) => add("pop", at("travas") + f, 0.42));
E.travas.fecha.forEach((f) => add("click", at("travas") + f, 0.55));

export const SFX_CUES = cues;

export const SoundFX: React.FC = () => (
  <>
    {SFX_CUES.map((c, i) => (
      <Sequence key={i} from={c.frame} durationInFrames={c.duration} name={`sfx:${c.file}`}>
        <Audio src={staticFile(`sfx/${c.file}.wav`)} volume={() => MASTER * c.volume} />
      </Sequence>
    ))}
  </>
);
