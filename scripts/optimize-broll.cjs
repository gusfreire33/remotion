/**
 * Reencoda os clipes do Pexels em public/broll para um formato "amigável a
 * seek": keyframe a cada ~0,3s, sem áudio, faststart.
 *
 * Motivo: os arquivos originais do Pexels têm bitrate alto e keyframes
 * espaçados (1 a cada 5-10s). Como cada beat entra no meio do clipe
 * (`startAt`), o player precisa decodificar desde o keyframe anterior —
 * é isso que faz o preview do Studio engasgar na virada dos cortes.
 *
 * Uso: node .\scripts\optimize-broll.cjs
 * (idempotente: pula o que já foi otimizado, marcado em .optimized.json)
 */
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const DIR = path.join(process.cwd(), "public", "broll");
const MARK = path.join(DIR, ".optimized.json");

const done = fs.existsSync(MARK) ? JSON.parse(fs.readFileSync(MARK, "utf8")) : [];
const files = fs.readdirSync(DIR).filter((f) => f.endsWith(".mp4"));

for (const f of files) {
  if (done.includes(f) && !process.argv.includes("--force")) {
    console.log(`  --  ${f} já otimizado`);
    continue;
  }
  const src = path.join(DIR, f);
  const tmp = path.join(DIR, `tmp-${f}`);
  const before = fs.statSync(src).size;
  execFileSync(
    "npx",
    [
      "remotion", "ffmpeg",
      // aspas obrigatórias: o caminho do projeto tem espaços e colchetes
      "-i", `"${src}"`,
      "-an",                    // B-roll é mudo (a voz vem do vídeo base)
      "-c:v", "libx264",
      "-preset", "veryfast",
      "-crf", "21",
      "-g", "9",                // keyframe a cada ~0,3s
      "-keyint_min", "9",
      "-sc_threshold", "0",
      "-pix_fmt", "yuv420p",
      "-movflags", "+faststart",
      `"${tmp}"`, "-y",
    ],
    { stdio: ["ignore", "ignore", "ignore"], shell: true },
  );
  fs.renameSync(tmp, src);
  const after = fs.statSync(src).size;
  console.log(
    `  ok  ${f}  ${(before / 1e6).toFixed(1)}MB -> ${(after / 1e6).toFixed(1)}MB`,
  );
  done.push(f);
  fs.writeFileSync(MARK, JSON.stringify(done, null, 2));
}
console.log("DONE");
