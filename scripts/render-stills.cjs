// Faz o bundle uma vez e renderiza varios frames-chave como PNG (pra revisao).
const path = require("path");
const fs = require("fs");
const { bundle } = require("@remotion/bundler");
const { selectComposition, renderStill } = require("@remotion/renderer");

(async () => {
  const outDir = path.join(process.cwd(), "out");
  fs.mkdirSync(outDir, { recursive: true });

  console.log("Bundling...");
  const serveUrl = await bundle({
    entryPoint: path.join(process.cwd(), "src", "index.ts"),
  });

  console.log("Selecionando composicao...");
  const composition = await selectComposition({ serveUrl, id: "MeuVideo" });

  const frames = [330, 336, 341, 1059, 2446];
  for (const frame of frames) {
    const output = path.join(outDir, `still-${String(frame).padStart(4, "0")}.png`);
    await renderStill({ composition, serveUrl, output, frame });
    console.log("OK frame", frame, "->", output);
  }
  console.log("DONE");
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
