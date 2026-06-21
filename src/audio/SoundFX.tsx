import { Audio, Sequence, staticFile } from "remotion";
import { secToFrame } from "../lib/constants";
import { BEAT_TIMING } from "../lib/beats";

// Volume de TODOS os efeitos fica bem abaixo do video (voz = 1.0), pra nao
// competir nem gerar conflito com a fala.
const MASTER = 0.4;

type Cue = { file: string; frame: number; volume: number; durFrames: number };

const fromOf = (key: string): number => {
  const b = BEAT_TIMING.find((x) => x.key === key);
  return secToFrame(b ? b.from : 0);
};

const cues: Cue[] = [];

// 1) whoosh na ENTRADA de cada beat (sem som na transicao film burn)
for (const b of BEAT_TIMING) {
  cues.push({
    file: "whoosh",
    frame: secToFrame(b.from),
    volume: 0.8,
    durFrames: 14,
  });
}

// 2) ticks nos checks do checklist
for (const d of [69, 135, 186]) {
  cues.push({ file: "tick", frame: fromOf("checklist") + d + 6, volume: 0.9, durFrames: 6 });
}

// 3) ticks nos tokens da equacao do potencializador
for (const d of [4, 14, 22, 32, 40]) {
  cues.push({ file: "tick", frame: fromOf("potencializador") + d, volume: 0.7, durFrames: 6 });
}

// 4) pops nas reacoes do CTA
for (const d of [6, 26, 46]) {
  cues.push({ file: "pop", frame: fromOf("cta") + d, volume: 0.9, durFrames: 8 });
}

// 5) pops nos chips de "promessas" + impacto no carimbo "NAO ADIANTA"
for (const d of [6, 36, 63, 78]) {
  cues.push({ file: "pop", frame: fromOf("promessas") + d, volume: 0.75, durFrames: 8 });
}
cues.push({ file: "impact", frame: fromOf("promessas") + 114, volume: 1.0, durFrames: 16 });

// 6) pops nos baloes de mensagem
for (const d of [6, 28, 50]) {
  cues.push({ file: "pop", frame: fromOf("mensagens") + d, volume: 0.7, durFrames: 8 });
}

// 7) ding no clImax (arrume a casa) e no link na bio
cues.push({ file: "ding", frame: fromOf("arrumarCasa"), volume: 0.9, durFrames: 20 });
cues.push({ file: "ding", frame: fromOf("linkBio"), volume: 0.85, durFrames: 20 });

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
