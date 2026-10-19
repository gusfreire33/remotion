// Stills de revisão da VSL Wonne Max (PLAYBOOK-2 Etapa 14) + folha de contato.
// uso: node scripts/wmvsl-stills.cjs <seg> <seg> ...   (segundos, aceita decimais)
const path = require("path");
const fs = require("fs");
const { bundle } = require("@remotion/bundler");
const { selectComposition, renderStill } = require("@remotion/renderer");
(async () => {
  const outDir = path.join(process.cwd(), "out", "wmvsl-stills");
  fs.mkdirSync(outDir, { recursive: true });
  const serveUrl = await bundle({ entryPoint: path.join(process.cwd(), "src", "index.ts") });
  const composition = await selectComposition({ serveUrl, id: "WonneMaxVSL", port: 3411 });
  const secs = process.argv.slice(2).map(Number);
  for (const s of secs) {
    const frame = Math.min(composition.durationInFrames - 1, Math.round(s * 30));
    const out = path.join(outDir, `f${String(frame).padStart(5, "0")}.jpg`);
    await renderStill({ composition, serveUrl, output: out, frame, port: 3411, imageFormat: "jpeg", jpegQuality: 80, scale: 0.5 });
    console.log("ok", s, out);
  }
})().catch((e) => { console.error(e); process.exit(1); });
