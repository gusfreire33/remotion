// Revisão Framework 2 (Etapa 14), genérica por composição:
//   COMP=Reels32 OUT=out/reels32 node scripts/review-fw2.cjs 38 168 281      -> stills
//   COMP=Reels32 OUT=out/reels32 node scripts/review-fw2.cjs --video 0-260   -> render curto (1080p)
//   ... --reuse  reaproveita o bundle anterior em <OUT>/bundle
// Não exporta o 4K final (isso só depois do "ok" do dono).
const path = require("path");
const fs = require("fs");
const { bundle } = require("@remotion/bundler");
const { selectComposition, renderStill, renderMedia, openBrowser } = require("@remotion/renderer");

const ROOT = process.cwd();
const COMP = process.env.COMP || "Reels32";
const OUT = path.join(ROOT, process.env.OUT || `out/${COMP.toLowerCase()}`);
const BUNDLE = path.join(OUT, "bundle");
const PORT = Number(process.env.PORT || 3406);

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const args = process.argv.slice(2);
  const reuse = args.includes("--reuse");
  const vi = args.indexOf("--video");
  const range = vi >= 0 ? args[vi + 1] : null;
  const frames = args.filter((a) => /^\d+$/.test(a)).map(Number);

  if (!reuse || !fs.existsSync(BUNDLE)) {
    console.log("bundling...");
    await bundle({ entryPoint: path.join(ROOT, "src", "index.ts"), outDir: BUNDLE });
  }
  const browser = await openBrowser("chrome");
  try {
    const composition = await selectComposition({
      serveUrl: BUNDLE, id: COMP, port: PORT, puppeteerInstance: browser, timeoutInMilliseconds: 120000,
    });
    for (const frame of frames) {
      await renderStill({
        serveUrl: BUNDLE, composition, frame,
        output: path.join(OUT, `still-${String(frame).padStart(4, "0")}.png`),
        imageFormat: "png", port: PORT, puppeteerInstance: browser, timeoutInMilliseconds: 120000,
      });
      console.log(`STILL ${frame}`);
    }
    if (range) {
      const [a, b] = range.split("-").map(Number);
      const outFile = path.join(OUT, `_teste-${a}-${b}.mp4`);
      let last = -1;
      await renderMedia({
        serveUrl: BUNDLE, composition, codec: "h264", outputLocation: outFile,
        frameRange: [a, b], scale: 0.5, crf: 20, pixelFormat: "yuv420p", imageFormat: "jpeg", jpegQuality: 90,
        audioBitrate: "256k", enforceAudioTrack: true, concurrency: 2, port: PORT, puppeteerInstance: browser,
        offthreadVideoCacheSizeInBytes: 512 * 1024 * 1024, timeoutInMilliseconds: 120000,
        onProgress: ({ progress }) => { const p = Math.floor(progress * 10) * 10; if (p !== last) { last = p; console.log(`TESTE ${p}%`); } },
      });
      console.log("TESTE READY: " + outFile);
    }
  } finally {
    await browser.close({ silent: true });
  }
})().catch((e) => { console.error(e); process.exit(1); });
