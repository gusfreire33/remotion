// Exporta a lista de cues de SFX (mesma lógica de src/audio/SoundFX.tsx) pra
// out/chunks/sfx-cues.json — usado por scripts/mix-audio.py quando o render
// só-áudio do Remotion não cabe na RAM.
const path = require("path");
const { buildSync } = require("esbuild");
const tmp = path.join(process.cwd(), "out", "chunks", "_cuts.cjs");
buildSync({ entryPoints: [path.join("src", "lib", "cuts.ts")], bundle: true, platform: "node", format: "cjs", outfile: tmp, logLevel: "silent" });
const { CUTS } = require(tmp);
const tmp2 = path.join(process.cwd(), "out", "chunks", "_callouts.cjs");
buildSync({ entryPoints: [path.join("src", "lib", "callouts.ts")], bundle: true, platform: "node", format: "cjs", outfile: tmp2, logLevel: "silent" });
const { CALLOUTS } = require(tmp2);
const MASTER = 0.3;
const cues = [];
const add = (file, at, volume) => cues.push({ file, at: Math.max(0, Math.round(at * 30) / 30), volume: MASTER * volume });
for (const cut of CUTS) {
  if (cut.kind === "whip") { add("swoosh", cut.at - 0.07, 0.6); add("boom", cut.at, 0.9); }
  else if (cut.kind === "punch") { add("whoosh", cut.at - 0.07, 0.35); add("boom", cut.at, 0.75); }
}
for (const c of CALLOUTS) {
  if (c.kind === "over") {
    add("whoosh", c.from - 0.05, 0.22);
    const mono = c.lines.find((l) => l.voice === "mono");
    if (mono && mono.at !== undefined && mono.at - c.from > 0.3) add("impact", mono.at, 0.35);
  } else if (c.kind === "chips") {
    for (const it of c.items) add("tick", it.at, 0.45);
    if (c.tail && c.tail.at !== undefined) add("impact", c.tail.at, 0.5);
  } else if (c.kind === "steps") {
    for (const it of c.items) { add("click", it.at, 0.5); add("ding", it.at + 0.03, 0.35); }
  } else if (c.kind === "card") {
    for (const l of c.lines.slice(1)) if (l.at !== undefined) add("pop", l.at, 0.4);
    if (c.chips) for (const it of c.chips) add("tick", it.at, 0.42);
    if (c.moneyAt !== undefined) { add("riser", c.moneyAt - 0.5, 0.4); add("ding", c.moneyAt, 0.45); }
  }
}
require("fs").writeFileSync(path.join("out", "chunks", "sfx-cues.json"), JSON.stringify(cues));
console.log("cues:", cues.length);
