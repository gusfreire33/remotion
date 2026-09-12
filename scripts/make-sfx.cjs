// Sintetiza efeitos sonoros (WAV PCM 16-bit mono 44.1kHz) em public/sfx/.
// Tudo procedural — nenhum asset externo necessario.
const fs = require("fs");
const path = require("path");

const SR = 44100;

const outDir = path.join(process.cwd(), "public", "sfx");
fs.mkdirSync(outDir, { recursive: true });

const rnd = () => Math.random() * 2 - 1;

// envelope linear simples (attack/release em segundos)
const ar = (i, n, atk, rel) => {
  const a = Math.max(1, atk * SR);
  const r = Math.max(1, rel * SR);
  if (i < a) return i / a;
  if (i > n - r) return Math.max(0, (n - i) / r);
  return 1;
};

const writeWav = (name, samples) => {
  // normaliza pra pico 0.7
  let peak = 0;
  for (const s of samples) peak = Math.max(peak, Math.abs(s));
  const g = peak > 0 ? 0.7 / peak : 1;
  const n = samples.length;
  const buf = Buffer.alloc(44 + n * 2);
  buf.write("RIFF", 0);
  buf.writeUInt32LE(36 + n * 2, 4);
  buf.write("WAVE", 8);
  buf.write("fmt ", 12);
  buf.writeUInt32LE(16, 16);
  buf.writeUInt16LE(1, 20); // PCM
  buf.writeUInt16LE(1, 22); // mono
  buf.writeUInt32LE(SR, 24);
  buf.writeUInt32LE(SR * 2, 28);
  buf.writeUInt16LE(2, 32);
  buf.writeUInt16LE(16, 34);
  buf.write("data", 36);
  buf.writeUInt32LE(n * 2, 40);
  for (let i = 0; i < n; i++) {
    const v = Math.max(-1, Math.min(1, samples[i] * g));
    buf.writeInt16LE((v * 32767) | 0, 44 + i * 2);
  }
  fs.writeFileSync(path.join(outDir, name + ".wav"), buf);
  console.log("OK", name + ".wav", n, "samples");
};

// media movel com janela variavel (filtro que "abre" -> whoosh)
const movingAvg = (src, winFn) => {
  const out = new Float32Array(src.length);
  for (let i = 0; i < src.length; i++) {
    const w = Math.max(1, Math.round(winFn(i / src.length)));
    let sum = 0;
    let c = 0;
    for (let k = i - w; k <= i; k++) {
      if (k >= 0) {
        sum += src[k];
        c++;
      }
    }
    out[i] = sum / c;
  }
  return out;
};

/* ----- whoosh (entrada das animacoes): ruido filtrado abrindo ----- */
const makeWhoosh = (dur, opening) => {
  const n = Math.floor(dur * SR);
  const noise = new Float32Array(n);
  for (let i = 0; i < n; i++) noise[i] = rnd();
  // janela grande -> pequena (filtro abre = brilho aumenta)
  const filt = movingAvg(noise, (t) =>
    opening ? 80 - t * 74 : 6 + t * 74,
  );
  const out = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    out[i] = filt[i] * ar(i, n, 0.12, 0.16) * 1.4;
  }
  return out;
};

/* ----- burn (transicao film burn): whoosh aereo + crepitar ----- */
const makeBurn = (dur) => {
  const n = Math.floor(dur * SR);
  const noise = new Float32Array(n);
  for (let i = 0; i < n; i++) noise[i] = rnd();
  const filt = movingAvg(noise, (t) => 40 - t * 30);
  const out = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const t = i / n;
    let s = filt[i] * ar(i, n, 0.05, 0.45) * 1.3;
    // crepitar (impulsos aleatorios raros)
    if (Math.random() < 0.004) s += rnd() * 0.6 * (1 - t);
    // rumble grave descendente
    s += Math.sin(2 * Math.PI * (90 - t * 40) * (i / SR)) * 0.18 * (1 - t);
    out[i] = s;
  }
  return out;
};

/* ----- pop (elemento aparecendo): blip com pitch caindo ----- */
const makePop = (dur) => {
  const n = Math.floor(dur * SR);
  const out = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const t = i / n;
    const f = 680 - t * 480;
    const decay = Math.exp(-t * 12);
    out[i] = Math.sin(2 * Math.PI * f * (i / SR)) * decay * 0.9;
  }
  return out;
};

/* ----- tick (check do checklist): clique curto e agudo ----- */
const makeTick = (dur) => {
  const n = Math.floor(dur * SR);
  const out = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const t = i / n;
    const decay = Math.exp(-t * 35);
    const tone = Math.sin(2 * Math.PI * 1500 * (i / SR));
    const click = rnd() * Math.exp(-t * 80);
    out[i] = (tone * 0.6 + click * 0.5) * decay;
  }
  return out;
};

/* ----- ding (sucesso/clImax): sino com 3 harmonicos ----- */
const makeDing = (dur) => {
  const n = Math.floor(dur * SR);
  const out = new Float32Array(n);
  const parts = [880, 1320, 1760];
  for (let i = 0; i < n; i++) {
    const t = i / n;
    const decay = Math.exp(-t * 5);
    let s = 0;
    for (let p = 0; p < parts.length; p++) {
      s += Math.sin(2 * Math.PI * parts[p] * (i / SR)) * (1 / (p + 1.5));
    }
    out[i] = s * decay * 0.7;
  }
  return out;
};

/* ----- impact (carimbo "NAO ADIANTA"): boom grave curto ----- */
const makeImpact = (dur) => {
  const n = Math.floor(dur * SR);
  const out = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const t = i / n;
    const f = 160 - t * 90;
    const decay = Math.exp(-t * 9);
    const body = Math.sin(2 * Math.PI * f * (i / SR));
    const knock = rnd() * Math.exp(-t * 50) * 0.6;
    out[i] = (body + knock) * decay;
  }
  return out;
};

/* ================= sons novos — edição estilo Captions (09/08/2026) ======= */

/* ----- swoosh: whip curto e brilhante, pro corte de B-roll ----- */
const makeSwoosh = (dur) => {
  const n = Math.floor(dur * SR);
  const noise = new Float32Array(n);
  for (let i = 0; i < n; i++) noise[i] = rnd();
  // filtro fecha->abre->fecha: dá a sensação de "passar voando"
  const filt = movingAvg(noise, (t) => 70 - Math.sin(t * Math.PI) * 62);
  const out = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    out[i] = filt[i] * ar(i, n, 0.03, 0.1) * 1.6;
  }
  return out;
};

/* ----- boom: sub grave pra palavra que entra atrás da pessoa ----- */
const makeBoom = (dur) => {
  const n = Math.floor(dur * SR);
  const out = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const t = i / n;
    // pitch caindo de 110Hz pra 38Hz = "drop" de impacto
    const f = 110 - t * 72;
    const decay = Math.exp(-t * 4.5);
    const body = Math.sin(2 * Math.PI * f * (i / SR));
    const sub = Math.sin(2 * Math.PI * (f / 2) * (i / SR)) * 0.5;
    const knock = rnd() * Math.exp(-t * 60) * 0.35;
    out[i] = (body + sub + knock) * decay;
  }
  return out;
};

/* ----- riser: tensão curta subindo antes de uma revelação ----- */
const makeRiser = (dur) => {
  const n = Math.floor(dur * SR);
  const noise = new Float32Array(n);
  for (let i = 0; i < n; i++) noise[i] = rnd();
  const filt = movingAvg(noise, (t) => 90 - t * 84);
  const out = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const t = i / n;
    // ruído abrindo + tom subindo junto
    const tone = Math.sin(2 * Math.PI * (220 + t * t * 900) * (i / SR)) * 0.35;
    out[i] = (filt[i] * 1.2 + tone) * Math.pow(t, 1.6) * ar(i, n, 0.01, 0.06);
  }
  return out;
};

/* ----- click: UI seco (toggle, chip) ----- */
const makeClick = (dur) => {
  const n = Math.floor(dur * SR);
  const out = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const t = i / n;
    const decay = Math.exp(-t * 90);
    out[i] = (rnd() * 0.7 + Math.sin(2 * Math.PI * 2200 * (i / SR)) * 0.4) * decay;
  }
  return out;
};

/* ----- type: tecla do teclado (CTA digitando) ----- */
const makeType = (dur) => {
  const n = Math.floor(dur * SR);
  const out = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const t = i / n;
    const decay = Math.exp(-t * 120);
    out[i] = (rnd() * 0.8 + Math.sin(2 * Math.PI * 900 * (i / SR)) * 0.3) * decay;
  }
  return out;
};

/* ----- glitch: estouro digital curto pro corte com RGB split ----- */
const makeGlitch = (dur) => {
  const n = Math.floor(dur * SR);
  const out = new Float32Array(n);
  let hold = 0;
  let val = 0;
  for (let i = 0; i < n; i++) {
    const t = i / n;
    // sample-and-hold: trava o valor por N amostras = som "quebrado"/digital
    if (hold <= 0) {
      val = rnd();
      hold = 20 + Math.floor(Math.random() * 90);
    }
    hold--;
    out[i] = val * Math.exp(-t * 9) * (Math.random() < 0.85 ? 1 : 0);
  }
  return out;
};

/* ----- key1/2/3: tecla de teclado mecânico (texto digitado nos cartões) -----
   corpo: clique curto de ruído filtrado + "tock" grave do switch; três
   variações de tom pra não soar como metralhadora. */
const makeKey = (dur, tone) => {
  const n = Math.floor(dur * SR);
  const out = new Float32Array(n);
  let lp = 0;
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    const click = rnd() * Math.exp(-t * 900);          // ataque: click de plástico
    lp = lp + (rnd() - lp) * 0.25;                      // ruído filtrado (corpo)
    const body = lp * Math.exp(-t * 140) * 0.9;
    const tock = Math.sin(2 * Math.PI * tone * t) * Math.exp(-t * 90) * 0.5; // grave do switch
    const bottom = Math.sin(2 * Math.PI * (tone * 2.7) * t) * Math.exp(-t * 400) * 0.25;
    out[i] = click * 0.7 + body + tock + bottom;
  }
  return out;
};
writeWav("key1", makeKey(0.07, 180));
writeWav("key2", makeKey(0.07, 230));
writeWav("key3", makeKey(0.07, 150));

writeWav("whoosh", makeWhoosh(0.36, true));
writeWav("burn", makeBurn(0.7));
writeWav("pop", makePop(0.16));
writeWav("tick", makeTick(0.09));
writeWav("ding", makeDing(0.6));
writeWav("impact", makeImpact(0.4));
writeWav("swoosh", makeSwoosh(0.24));
writeWav("boom", makeBoom(0.6));
writeWav("riser", makeRiser(0.5));
writeWav("click", makeClick(0.05));
writeWav("type", makeType(0.04));
writeWav("glitch", makeGlitch(0.2));
console.log("DONE");
