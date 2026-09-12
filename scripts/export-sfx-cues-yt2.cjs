// Exporta as cues de SFX do "Vídeo 2 YT" (src/yt2/lib/sfx.ts, já com MASTER
// aplicado) pra out/yt2/sfx-cues.json — usado por scripts/mix-audio-yt2.py
// na junção dos blocos do render 4K.
const path = require("path");
const fs = require("fs");
const { buildSync } = require("esbuild");
fs.mkdirSync(path.join("out", "yt2"), { recursive: true });
const tmp = path.join(process.cwd(), "out", "yt2", "_sfx.cjs");
buildSync({ entryPoints: [path.join("src", "yt2", "lib", "sfx.ts")], bundle: true, platform: "node", format: "cjs", outfile: tmp, logLevel: "silent",
  // TypeWriter importa remotion/react só pra tipos+componente; o bundle node não precisa executar JSX
  external: ["remotion", "react", "@remotion/*"] });
const { CUES, MASTER } = require(tmp);
const cues = CUES.map((c) => ({ file: c.file, at: Math.round(c.at * 30) / 30, volume: MASTER * c.volume }));
fs.writeFileSync(path.join("out", "yt2", "sfx-cues.json"), JSON.stringify(cues));
console.log("cues:", cues.length, "MASTER:", MASTER);
