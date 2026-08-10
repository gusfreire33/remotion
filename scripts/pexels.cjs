/**
 * Busca e baixa B-roll gratuito do Pexels (vídeos e fotos) para os beats.
 *
 * Uso:
 *   node .\scripts\pexels.cjs search "termo de busca"      -> lista candidatos (não baixa)
 *   node .\scripts\pexels.cjs fetch                        -> baixa o plano de src/lib/broll-plan.json
 *
 * A chave vem de .env (PEXELS_API_KEY) — nunca hardcoded (o editor/ vai pro git).
 * Licença Pexels: uso livre, inclusive comercial, sem atribuição obrigatória.
 * Ainda assim gravamos os créditos em public/broll/CREDITS.json.
 */
const fs = require("fs");
const path = require("path");
const https = require("https");

const ROOT = process.cwd();
const ENV = path.join(ROOT, ".env");
const OUT_DIR = path.join(ROOT, "public", "broll");
const PLAN = path.join(ROOT, "src", "lib", "broll-plan.json");
const CREDITS = path.join(OUT_DIR, "CREDITS.json");

function apiKey() {
  const txt = fs.readFileSync(ENV, "utf8");
  const m = txt.match(/^\s*PEXELS_API_KEY\s*=\s*(.+)$/m);
  if (!m) throw new Error("PEXELS_API_KEY não encontrada em .env");
  return m[1].trim();
}

function getJSON(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, { headers: { Authorization: apiKey() } }, (res) => {
        let data = "";
        res.on("data", (c) => (data += c));
        res.on("end", () => {
          if (res.statusCode !== 200) {
            return reject(new Error(`HTTP ${res.statusCode}: ${data.slice(0, 200)}`));
          }
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            reject(e);
          }
        });
      })
      .on("error", reject);
  });
}

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    const go = (u, depth = 0) => {
      if (depth > 5) return reject(new Error("redirects demais"));
      https
        .get(u, (res) => {
          if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
            res.resume();
            return go(res.headers.location, depth + 1);
          }
          if (res.statusCode !== 200) {
            res.resume();
            return reject(new Error(`HTTP ${res.statusCode} ao baixar ${u}`));
          }
          res.pipe(file);
          file.on("finish", () => file.close(() => resolve(dest)));
        })
        .on("error", reject);
    };
    go(url);
  });
}

/** Melhor arquivo do vídeo: prefere vertical, senão o de maior resolução <= 4K. */
function pickVideoFile(video) {
  const files = (video.video_files || []).filter((f) => f.file_type === "video/mp4");
  if (!files.length) return null;
  const score = (f) => {
    const w = f.width || 0;
    const h = f.height || 0;
    const vertical = h > w ? 1 : 0;
    // alvo: altura ~1920 (design 1080x1920); penaliza excesso e falta
    const fit = -Math.abs((h || 0) - 1920) / 1000;
    return vertical * 3 + fit;
  };
  return files.slice().sort((a, b) => score(b) - score(a))[0];
}

async function searchVideos(query, { perPage = 12, orientation = "portrait" } = {}) {
  const url =
    `https://api.pexels.com/videos/search?query=${encodeURIComponent(query)}` +
    `&per_page=${perPage}&orientation=${orientation}&size=medium`;
  const json = await getJSON(url);
  return (json.videos || []).map((v) => ({
    id: v.id,
    url: v.url,
    user: v.user && v.user.name,
    duration: v.duration,
    width: v.width,
    height: v.height,
    file: pickVideoFile(v),
  }));
}

async function searchPhotos(query, { perPage = 12, orientation = "portrait" } = {}) {
  const url =
    `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}` +
    `&per_page=${perPage}&orientation=${orientation}`;
  const json = await getJSON(url);
  return (json.photos || []).map((p) => ({
    id: p.id,
    url: p.url,
    user: p.photographer,
    width: p.width,
    height: p.height,
    file: { link: p.src.large2x || p.src.original, width: p.width, height: p.height },
  }));
}

async function cmdSearch(query, kind) {
  const list =
    kind === "photo" ? await searchPhotos(query) : await searchVideos(query);
  console.log(`\n=== ${kind || "video"}: "${query}" — ${list.length} resultados`);
  for (const r of list) {
    const f = r.file || {};
    console.log(
      `  ${r.id}\t${f.width}x${f.height}\t${r.duration ? r.duration + "s" : "foto"}\t${r.user}\t${r.url}`,
    );
  }
}

/** Baixa um asset específico por ID (vídeo ou foto). */
async function fetchById(kind, id, slug) {
  const endpoint =
    kind === "photo"
      ? `https://api.pexels.com/v1/photos/${id}`
      : `https://api.pexels.com/videos/videos/${id}`;
  const item = await getJSON(endpoint);
  let link, credit, w, h;
  if (kind === "photo") {
    link = item.src.large2x || item.src.original;
    credit = { id, kind, author: item.photographer, url: item.url };
    w = item.width;
    h = item.height;
  } else {
    const f = pickVideoFile(item);
    if (!f) throw new Error(`vídeo ${id} sem mp4`);
    link = f.link;
    credit = { id, kind, author: item.user && item.user.name, url: item.url };
    w = f.width;
    h = f.height;
  }
  const ext = kind === "photo" ? ".jpg" : ".mp4";
  const name = `${slug}${ext}`;
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const dest = path.join(OUT_DIR, name);
  await download(link, dest);
  const size = fs.statSync(dest).size;
  console.log(`  ok  ${name}  ${w}x${h}  ${(size / 1e6).toFixed(1)}MB  (${credit.author})`);
  return { ...credit, file: name, width: w, height: h };
}

async function cmdFetch() {
  const plan = JSON.parse(fs.readFileSync(PLAN, "utf8"));
  const credits = [];
  for (const item of plan) {
    const dest = path.join(OUT_DIR, `${item.slug}${item.kind === "photo" ? ".jpg" : ".mp4"}`);
    if (fs.existsSync(dest) && !process.argv.includes("--force")) {
      console.log(`  --  ${path.basename(dest)} já existe (pulando)`);
      continue;
    }
    console.log(`[${item.slug}] ${item.kind} ${item.id} — ${item.why}`);
    credits.push(await fetchById(item.kind, item.id, item.slug));
  }
  const prev = fs.existsSync(CREDITS) ? JSON.parse(fs.readFileSync(CREDITS, "utf8")) : [];
  const merged = [...prev.filter((p) => !credits.some((c) => c.file === p.file)), ...credits];
  fs.writeFileSync(CREDITS, JSON.stringify(merged, null, 2));
  console.log(`\nDONE. Créditos em public/broll/CREDITS.json`);
}

(async () => {
  const [, , cmd, arg, kind] = process.argv;
  if (cmd === "search") await cmdSearch(arg, kind);
  else if (cmd === "fetch") await cmdFetch();
  else console.log("uso: node scripts/pexels.cjs search \"termo\" [photo|video] | fetch [--force]");
})().catch((e) => {
  console.error("ERRO:", e.message);
  process.exit(1);
});
