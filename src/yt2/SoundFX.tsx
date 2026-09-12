import { Audio, Sequence, staticFile } from "remotion";
import { CUES, MASTER } from "./lib/sfx";
import { FPS } from "./lib/constants";

/** duração (s) de cada arquivo em public/sfx — só pra dimensionar a Sequence */
const DUR: Record<string, number> = {
  whoosh: 0.36, burn: 0.7, pop: 0.16, tick: 0.09, ding: 0.6, impact: 0.4,
  swoosh: 0.24, boom: 0.6, riser: 0.5, click: 0.05, type: 0.04, glitch: 0.2,
  key1: 0.07, key2: 0.07, key3: 0.07,
};

export const SoundFX: React.FC = () => (
  <>
    {CUES.map((c, i) => (
      <Sequence
        key={`${c.file}-${i}`}
        from={Math.round(c.at * FPS)}
        durationInFrames={Math.ceil((DUR[c.file] ?? 0.5) * FPS) + 2}
        name={`sfx:${c.file}`}
      >
        <Audio src={staticFile(`sfx/${c.file}.wav`)} volume={MASTER * c.volume} />
      </Sequence>
    ))}
  </>
);
