import type { Cut } from "../../lib/cuts";
import { BEAT_TIMING } from "./beats";
import { BEHIND_WORDS } from "./behind";

// Framework 2: cut changes move visual transition AND sound together.
export const CUTS: Cut[] = [
  ...BEAT_TIMING.map(
    (beat): Cut => ({ at: beat.from, kind: "punch", from: beat.key }),
  ),
  ...BEHIND_WORDS.map(
    (word): Cut => ({ at: word.from, kind: "glitch", from: word.text }),
  ),
].sort((a, b) => a.at - b.at);
