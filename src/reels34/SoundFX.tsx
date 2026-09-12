import { Audio, Sequence, staticFile } from "remotion";
import { CUTS } from "./lib/cuts";
import { BEAT_TIMING, ELEMENT_FRAMES, EXTRA_PUNCH_S } from "./lib/beats";
import { frameAt } from "./lib/constants";

/**
 * EFEITOS SONOROS — "Reels 34". Camada 1 = cortes (cuts.ts); camada 2 = um
 * som por elemento (mesmos frames de ELEMENT_FRAMES).
 * ⚠️ MASTER NÃO se herda — medir com scripts/measure-audio.py.
 */
export const MASTER = 0.28;

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
    // 0,30 (não 0,48): em 46,0s o whoosh do card "código" cai em cima do pico
    // da voz e a mistura passava +11% — medido no render final.
    add("whoosh", frameAt(cut.at) - 2, 0.3);
  }
}

const at = (key: string): number => frameAt(BEAT_TIMING.find((b) => b.key === key)!.from);
const E = ELEMENT_FRAMES;

// muro: MARKETING (impact) · tijolos (tick, um por tijolo) · "= MURO" (pop)
add("impact", at("muro") + E.muro.palavra, 0.4);
E.muro.tijolos.forEach((f) => add("tick", at("muro") + f, 0.4));
add("pop", at("muro") + E.muro.rotulo, 0.4);

// veReal: painéis (pop) · olhos (click) · real (ding) · não é real (impact)
add("pop", at("veReal") + E.veReal.painelA, 0.4);
add("click", at("veReal") + E.veReal.olhoA, 0.45);
add("ding", at("veReal") + E.veReal.realA, 0.4);
add("pop", at("veReal") + E.veReal.painelB, 0.4);
add("click", at("veReal") + E.veReal.olhoB, 0.5);
add("impact", at("veReal") + E.veReal.realB, 0.55);

// muroSobe: base (pop) · olho (click) · fileiras (tick)
add("pop", at("muroSobe") + E.muroSobe.base, 0.4);
add("click", at("muroSobe") + E.muroSobe.olho, 0.4);
E.muroSobe.fileiras.forEach((f) => add("tick", at("muroSobe") + f, 0.45));

// otimizacao: painel (pop) · sliders (click) · selo (impact) · resultado (ding)
add("pop", at("otimizacao") + E.otimizacao.painel, 0.4);
E.otimizacao.sliders.forEach((f) => add("click", at("otimizacao") + f, 0.45));
add("impact", at("otimizacao") + E.otimizacao.selo, 0.5);
add("ding", at("otimizacao") + E.otimizacao.resultado, 0.45);

// pagina: código (pop) · linhas (type) · página cobre (whoosh) · some (click) · selo (impact)
add("pop", at("pagina") + E.pagina.codigo, 0.4);
E.pagina.linhas.forEach((f) => add("type", at("pagina") + f, 0.4));
add("whoosh", at("pagina") + E.pagina.pagina, 0.4);
add("click", at("pagina") + E.pagina.some, 0.4);
add("impact", at("pagina") + E.pagina.selo, 0.5);

// socos extras (sem transição visual): boom leve
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
