import { Audio, Sequence, staticFile } from "remotion";
import { CUTS } from "./lib/cuts";
import { BEAT_TIMING, ELEMENT_FRAMES } from "./lib/beats";
import { frameAt } from "./lib/constants";

/**
 * EFEITOS SONOROS — "Reels 33". Camada 1 = cortes (cuts.ts); camada 2 = um
 * som por elemento (mesmos frames de ELEMENT_FRAMES).
 * ⚠️ MASTER NÃO se herda — medir com scripts/measure-audio.py.
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

// anos2026: faixa (pop) · 2026 cai (impact) · anos rolam (tick)
add("pop", at("anos2026") + E.anos2026.faixa, 0.4);
add("impact", at("anos2026") + E.anos2026.ano, 0.45);
E.anos2026.rola.forEach((f) => add("tick", at("anos2026") + f, 0.45));

// falir: painel (pop) · barras caem (click) · riser antes · FALIR bate (impact)
add("pop", at("falir") + E.falir.painel, 0.4);
E.falir.cai.forEach((f) => add("click", at("falir") + f, 0.5));
add("riser", at("falir") + E.falir.palavra - 12, 0.28);
add("impact", at("falir") + E.falir.palavra, 0.7);

// naoPermite: painel (pop) · linhas (pop) · tentativa (click) · trava (impact)
add("pop", at("naoPermite") + E.naoPermite.painel, 0.4);
E.naoPermite.linhas.forEach((f) => add("pop", at("naoPermite") + f, 0.4));
add("click", at("naoPermite") + E.naoPermite.tentativa, 0.55);
add("click", at("naoPermite") + E.naoPermite.tentativa + 8, 0.45);
add("impact", at("naoPermite") + E.naoPermite.trava, 0.55);

// cada34anos: casas (tick; a 1ª com pop do carro) · "3" (tick) · 2º carro (ding) · rótulo (pop)
E.cada34anos.casas.forEach((f, i) => add(i === 0 ? "pop" : "tick", at("cada34anos") + f, 0.42));
add("tick", at("cada34anos") + E.cada34anos.tres, 0.5);
add("ding", at("cada34anos") + E.cada34anos.quatro, 0.4);
add("pop", at("cada34anos") + E.cada34anos.rotulo, 0.3);

// semestral: painel (pop) · linha (whoosh baixo) · degraus (tick) · rótulo (ding)
add("pop", at("semestral") + E.semestral.painel, 0.4);
add("whoosh", at("semestral") + E.semestral.linha, 0.2);
E.semestral.degraus.forEach((f) => add("tick", at("semestral") + f, 0.5));
add("ding", at("semestral") + E.semestral.rotulo, 0.4);

// soco extra em "Lembre-se" (19,90s) — sem transição visual, só o boom leve
add("boom", frameAt(19.9), 0.4);

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
