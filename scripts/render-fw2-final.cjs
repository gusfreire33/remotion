// Render FINAL 4K (2160x3840 @30fps) de um Reels do Framework 2.
//   node scripts/render-fw2-final.cjs 32 "Reels 32 - editado 4K.mp4"
// Bundle com publicDir enxuto (só os assets deste Reels), fonte + matte 4K
// (`master4k: true`), concurrency 2 + cache 1 GB (render-4k-matte gotcha).
// Depois valida com ffprobe e copia pra "Downloads Remo/".
const path = require("path");
const fs = require("fs");
const { execFileSync } = require("child_process");
const { bundle } = require("@remotion/bundler");
const { openBrowser, selectComposition, renderMedia } = require("@remotion/renderer");

const N = process.argv[2];
const NAME = process.argv[3] || `Reels ${N} - editado 4K.mp4`;
const COMP = `Reels${N}`;
const ROOT = process.cwd();
const OUT = path.join(ROOT, "out", `reels${N}`);
const ASSETS = path.join(OUT, "master-assets");
const BUNDLE = path.join(OUT, "bundle-final");
// FRAMES=0-2 → probe curto (prova que o comando inteiro funciona antes do render inteiro)
const PROBE = process.env.FRAMES ? process.env.FRAMES.split("-").map(Number) : null;
const OUTPUT = PROBE ? path.join(OUT, `_probe4k-${PROBE[0]}-${PROBE[1]}.mp4`) : path.join(OUT, NAME);
const DEST = path.join(ROOT, "Downloads Remo", NAME);
const PORT = Number(process.env.PORT || 3406);
const FFPROBE = path.join(ROOT, "node_modules", "@remotion", "compositor-win32-x64-msvc", "ffprobe.exe");
const t0 = Date.now();
const log = (m) => console.log(`[${((Date.now() - t0) / 60000).toFixed(1)}min] ${m}`);

(async () => {
  if (PROBE) fs.rmSync(OUTPUT, { force: true });
  if (fs.existsSync(OUTPUT)) throw new Error(`já existe: ${OUTPUT} — confira antes de sobrescrever`);
  fs.rmSync(ASSETS, { recursive: true, force: true });
  fs.mkdirSync(path.join(ASSETS, `reels${N}`), { recursive: true });
  fs.mkdirSync(path.join(ASSETS, "sfx"), { recursive: true });
  fs.mkdirSync(path.join(ASSETS, "broll"), { recursive: true });
  for (const f of ["source4k.mp4", "matte4k.webm"]) {
    fs.copyFileSync(path.join(ROOT, "public", `reels${N}`, f), path.join(ASSETS, `reels${N}`, f));
  }
  for (const f of fs.readdirSync(path.join(ROOT, "public", "sfx"))) {
    fs.copyFileSync(path.join(ROOT, "public", "sfx", f), path.join(ASSETS, "sfx", f));
  }
  for (const f of fs.readdirSync(path.join(ROOT, "public", "broll")).filter((x) => x.startsWith(`r${N}-`))) {
    fs.copyFileSync(path.join(ROOT, "public", "broll", f), path.join(ASSETS, "broll", f));
  }
  log("assets copiados; bundling...");
  await bundle({ entryPoint: path.join(ROOT, "src", "index.ts"), outDir: BUNDLE, publicDir: ASSETS });
  const inputProps = { master4k: true };
  const browser = await openBrowser("chrome");
  try {
    const composition = await selectComposition({
      serveUrl: BUNDLE, id: COMP, inputProps, port: PORT, puppeteerInstance: browser, timeoutInMilliseconds: 180000,
    });
    log(`render ${COMP}: ${composition.durationInFrames} frames @${composition.fps} → ${composition.width * 2}x${composition.height * 2}`);
    let last = -1;
    await renderMedia({
      serveUrl: BUNDLE, composition, inputProps, codec: "h264", outputLocation: OUTPUT,
      frameRange: PROBE ? [PROBE[0], PROBE[1]] : null,
      scale: 2, crf: 17, pixelFormat: "yuv420p", imageFormat: "jpeg", jpegQuality: 98,
      audioBitrate: "320k", enforceAudioTrack: true, colorSpace: "bt709", concurrency: 2,
      port: PORT, puppeteerInstance: browser, offthreadVideoCacheSizeInBytes: 1024 * 1024 * 1024,
      timeoutInMilliseconds: 180000,
      onProgress: ({ progress, renderedFrames }) => {
        const pct = Math.floor(progress * 20) * 5;
        if (pct !== last) { last = pct; log(`FINAL 4K ${pct}% (${renderedFrames}/${composition.durationInFrames})`); }
      },
    });
  } finally {
    await browser.close({ silent: true });
  }
  const probe = execFileSync(FFPROBE, ["-v", "error", "-show_entries", "stream=codec_type,width,height,r_frame_rate,nb_frames,channels", "-show_entries", "format=duration", "-of", "compact", OUTPUT]).toString();
  log("ffprobe:\n" + probe);
  if (!/width=2160\|height=3840\|r_frame_rate=30\/1/.test(probe) || !/codec_type=audio/.test(probe)) {
    throw new Error("ffprobe fora do esperado (2160x3840 @30 + áudio)");
  }
  if (PROBE) { log("PROBE OK: " + OUTPUT); return; }
  fs.mkdirSync(path.dirname(DEST), { recursive: true });
  fs.copyFileSync(OUTPUT, DEST);
  if (fs.statSync(DEST).size !== fs.statSync(OUTPUT).size) throw new Error("cópia incompleta");
  log(`PRONTO: ${DEST} (${(fs.statSync(DEST).size / 1e6).toFixed(1)} MB)`);
})().catch((e) => { console.error(e); process.exit(1); });
