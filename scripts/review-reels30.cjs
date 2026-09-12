// Framework 2 review: reusable bundle, key stills and a FULL-LENGTH preview.
// This command does not export the final 4K master (owner approval required).
const path = require("path");
const fs = require("fs");
const { bundle } = require("@remotion/bundler");
const { enableTailwind } = require("@remotion/tailwind-v4");
const {
  selectComposition,
  renderStill,
  renderMedia,
  openBrowser,
} = require("@remotion/renderer");
const ROOT = process.cwd();
const OUT = path.join(ROOT, "out", "reels30");
const BUNDLE = path.join(OUT, "bundle");
const PORT = 3406;
const frames = [
  0,
  38,
  168,
  281,
  417, // all four behind windows + original clean first frame
  112,
  231,
  358,
  512,
  590,
  625, // each overlay peak + weekly delivery
  132,
  242,
  374,
  536,
  643, // end of EVERY overlay must be clean
  20,
  92,
  401, // exact entry of two behind words + one overlay
];

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  if (!process.argv.includes("--reuse")) {
    await bundle({
      entryPoint: path.join(ROOT, "src", "index.ts"),
      outDir: BUNDLE,
      webpackOverride: enableTailwind,
    });
  }
  const browser = await openBrowser("chrome");
  try {
    const composition = await selectComposition({
      serveUrl: BUNDLE,
      id: "Reels30Framework2",
      port: PORT,
      puppeteerInstance: browser,
      timeoutInMilliseconds: 120000,
    });
    if (!process.argv.includes("--video-only")) {
      const requested = process.argv.find((a) => a.startsWith("--frames="));
      const list = requested
        ? requested.split("=")[1].split(",").map(Number)
        : frames;
      for (const frame of list) {
        await renderStill({
          serveUrl: BUNDLE,
          composition,
          frame,
          output: path.join(OUT, `still-${String(frame).padStart(4, "0")}.png`),
          imageFormat: "png",
          port: PORT,
          puppeteerInstance: browser,
          timeoutInMilliseconds: 120000,
        });
        console.log(`STILL ${frame}`);
      }
    }
    if (
      process.argv.includes("--video") ||
      process.argv.includes("--video-only")
    ) {
      let last = -1;
      await renderMedia({
        serveUrl: BUNDLE,
        composition,
        codec: "h264",
        outputLocation: path.join(OUT, "Reels30-Framework2-PREVIA.mp4"),
        scale: 1,
        crf: 18,
        pixelFormat: "yuv420p",
        imageFormat: "jpeg",
        jpegQuality: 95,
        audioBitrate: "256k",
        enforceAudioTrack: true,
        colorSpace: "bt709",
        concurrency: 2,
        port: PORT,
        puppeteerInstance: browser,
        offthreadVideoCacheSizeInBytes: 512 * 1024 * 1024,
        timeoutInMilliseconds: 120000,
        onProgress: ({ progress, renderedFrames }) => {
          const pct = Math.floor(progress * 20) * 5;
          if (pct !== last) {
            last = pct;
            console.log(`PREVIEW ${pct}% (${renderedFrames}/645)`);
          }
        },
      });
      console.log(
        "PREVIEW READY: " + path.join(OUT, "Reels30-Framework2-PREVIA.mp4"),
      );
    }
  } finally {
    await browser.close({ silent: true });
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
