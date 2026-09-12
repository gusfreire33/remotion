import { Audio, Sequence, staticFile } from "remotion";
import { CUTS } from "./lib/cuts";
import { BEAT_TIMING, ELEMENT_FRAMES, type BeatKey } from "./lib/beats";
import { frameAt } from "./lib/constants";

// Initial gain is specific to this source, whose stereo peak is ~0.49.
// Acceptance is measured on the rendered mix (opening AND late dense beat).
export const MASTER = 0.16;
type Sound =
  | "whoosh"
  | "glitch"
  | "boom"
  | "tick"
  | "click"
  | "pop"
  | "impact"
  | "ding";
export type Cue = {
  file: Sound;
  frame: number;
  volume: number;
  duration: number;
};
const lengths: Record<Sound, number> = {
  whoosh: 0.36,
  glitch: 0.14,
  boom: 0.6,
  tick: 0.09,
  click: 0.05,
  pop: 0.16,
  impact: 0.4,
  ding: 0.6,
};
const cues: Cue[] = [];
const add = (file: Sound, frame: number, volume: number): void => {
  cues.push({
    file,
    frame: Math.max(0, frame),
    volume,
    duration: Math.ceil(lengths[file] * 30) + 2,
  });
};
for (const cut of CUTS) {
  if (cut.kind === "glitch") {
    add("glitch", frameAt(cut.at) - 1, 0.3);
    add("boom", frameAt(cut.at), 0.55);
  } else {
    add("whoosh", frameAt(cut.at) - 2, 0.48);
  }
}
const sounds: Record<BeatKey, Sound[]> = {
  referral: ["pop", "pop", "click"],
  warning: ["pop", "impact"],
  verdict: ["impact", "pop"],
  lottery: ["whoosh", "pop", "click"],
  machine: ["pop", "click", "pop", "ding", "tick", "tick", "tick"],
};
for (const beat of BEAT_TIMING) {
  ELEMENT_FRAMES[beat.key].forEach((offset, i) =>
    add(sounds[beat.key][i], frameAt(beat.from) + offset, 0.42),
  );
}
// Physical circuit break on the spoken "para".
add("click", frameAt(3.96), 0.5);
export const SFX_CUES = cues;
export const SoundFX: React.FC = () => (
  <>
    {SFX_CUES.map((cue, i) => (
      <Sequence
        key={i}
        from={cue.frame}
        durationInFrames={cue.duration}
        name={`reels-sfx:${cue.file}`}
      >
        <Audio
          src={staticFile(`sfx/${cue.file}.wav`)}
          volume={() => MASTER * cue.volume}
        />
      </Sequence>
    ))}
  </>
);
