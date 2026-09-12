import { Audio, Sequence, staticFile } from "remotion";
import { CUTS } from "./lib/cuts";
import { BEAT_TIMING, ELEMENT_FRAMES, EXTRA_PUNCH_S } from "./lib/beats";
import { frameAt } from "./lib/constants";

/**
 * EFEITOS SONOROS — "Reels 35". Camada 1 = cortes (cuts.ts); camada 2 = um
 * som por elemento (mesmos frames de ELEMENT_FRAMES).
 * ⚠️ MASTER NÃO se herda — medir com scripts/measure-audio.py.
 */
export const MASTER = 0.22;

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

const at = (key: string): number => frameAt(BEAT_TIMING.find((b) => b.key === key)!.from);
const E = ELEMENT_FRAMES;

// roubadas: caixa (pop) · cartas (pop) · rótulo (click) · cartas saem (whoosh) · destino (ding)
add("pop", at("roubadas") + E.roubadas.caixa, 0.4);
E.roubadas.cartas.forEach((f) => add("pop", at("roubadas") + f, 0.38));
add("click", at("roubadas") + E.roubadas.rotulo, 0.4);
E.roubadas.saem.forEach((f) => add("whoosh", at("roubadas") + f, 0.3));
add("ding", at("roubadas") + E.roubadas.destino, 0.4);

// relatorios: relógio (pop) · folhas (tick) · contador (impact)
add("pop", at("relatorios") + E.relatorios.relogio, 0.4);
E.relatorios.folhas.forEach((f) => add("tick", at("relatorios") + f, 0.45));
add("impact", at("relatorios") + E.relatorios.rotulo, 0.45);

// ontemHojeAmanha: kicker (pop) · linhas (pop) · estados (click; o 1º com ding)
add("pop", at("ontemHojeAmanha") + E.ontemHojeAmanha.kicker, 0.3);
E.ontemHojeAmanha.linhas.forEach((f) => add("pop", at("ontemHojeAmanha") + f, 0.42));
E.ontemHojeAmanha.estados.forEach((f, i) => add(i === 0 ? "ding" : "click", at("ontemHojeAmanha") + f, 0.45));

// feito3: kicker (pop) · colunas (pop) · cartões (click; o último com ding)
add("pop", at("feito3") + E.feito3.kicker, 0.3);
E.feito3.colunas.forEach((f) => add("pop", at("feito3") + f, 0.42));
E.feito3.cartoes.forEach((f, i) => add(i === 2 ? "ding" : "click", at("feito3") + f, 0.45));

// projetar: cabeça (pop) · projetor (click) · feixe (riser curto) · carimbo (impact) · rótulo (pop)
add("pop", at("projetar") + E.projetar.cabeca, 0.4);
add("click", at("projetar") + E.projetar.projetor, 0.45);
add("riser", at("projetar") + E.projetar.feixe, 0.3);
add("impact", at("projetar") + E.projetar.carimbo, 0.65);
add("pop", at("projetar") + E.projetar.rotulo, 0.35);

EXTRA_PUNCH_S.forEach((s) => add("boom", frameAt(s), 0.35));

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
