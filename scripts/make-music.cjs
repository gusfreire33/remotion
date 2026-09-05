// Sintetiza a TRILHA DE FUNDO (WAV estéreo 16-bit 44.1kHz) em public/music/bed.wav.
//
// Referência ("Bilhon-OS Motor de Receita Permanente", analisada em 04/09/2026):
// trilha cinematográfica de tensão, ambient, com sub-grave constante e SEM
// batida marcada. Fica mais presente no hook, abaixa no miolo argumentativo e
// volta a subir no fechamento. Nada externo — tudo procedural, sem licença.
//
// Uso (a partir de editor/):  node .\scripts\make-music.cjs [duracao_em_segundos]
const fs = require("fs");
const path = require("path");

const SR = 44100;
const DUR = Number(process.argv[2]) || 272;
const N = Math.floor(DUR * SR);

const outDir = path.join(process.cwd(), "public", "music");
fs.mkdirSync(outDir, { recursive: true });

// ── harmonia: Ré menor, um acorde a cada 8s (lento = tensão, não groove) ──
// graus em semitons a partir de D2 (73.4 Hz)
const D2 = 73.42;
const st = (n) => D2 * Math.pow(2, n / 12);
const CHORDS = [
  [0, 3, 7, 10], // Dm7
  [-4, 0, 3, 7], // Bb(add9)-ish  (Bb D F A)
  [-7, -4, 0, 5], // Gm / F  (G Bb D  + G)
  [-2, 2, 5, 9], // C / A  (C E G  ... tensão)
];
const CHORD_SEC = 8;

// ── curva de presença (0..1) ao longo do vídeo — a "mixagem" da referência ──
// hook cheio → miolo mais baixo → sobe no fechamento
const presence = (t) => {
  const p = t / DUR;
  const pts = [
    [0.0, 0.0],
    [0.02, 1.0],
    [0.3, 1.0],
    [0.42, 0.55],
    [0.7, 0.55],
    [0.8, 0.85],
    [0.97, 1.0],
    [1.0, 0.0],
  ];
  for (let i = 1; i < pts.length; i++) {
    if (p <= pts[i][0]) {
      const [a, va] = pts[i - 1];
      const [b, vb] = pts[i];
      const k = (p - a) / (b - a);
      const s = k * k * (3 - 2 * k);
      return va + (vb - va) * s;
    }
  }
  return 0;
};

// ruído rosa barato (Paul Kellet)
const mkPink = () => {
  let b0 = 0, b1 = 0, b2 = 0;
  return () => {
    const w = Math.random() * 2 - 1;
    b0 = 0.99765 * b0 + w * 0.099046;
    b1 = 0.963 * b1 + w * 0.2965164;
    b2 = 0.57 * b2 + w * 1.0526913;
    return (b0 + b1 + b2 + w * 0.1848) * 0.12;
  };
};
const pinkL = mkPink();
const pinkR = mkPink();

// filtro passa-baixa 1 polo (pra "abafar" o pad e o ruído)
const lp = (cut) => {
  let y = 0;
  const a = 1 - Math.exp((-2 * Math.PI * cut) / SR);
  return (x) => (y += a * (x - y));
};
const lpPadL = lp(900);
const lpPadR = lp(900);
const lpNoiseL = lp(1400);
const lpNoiseR = lp(1400);
const lpSub = lp(120);

const L = new Float32Array(N);
const R = new Float32Array(N);

// vozes do pad: cada nota = 3 osciladores levemente desafinados (largura)
const voice = (f, t, detune) =>
  (Math.sin(2 * Math.PI * f * t) +
    Math.sin(2 * Math.PI * f * (1 + detune) * t + 1.3) +
    Math.sin(2 * Math.PI * f * (1 - detune) * t + 2.1)) /
  3;

for (let i = 0; i < N; i++) {
  const t = i / SR;
  const ci = Math.floor(t / CHORD_SEC) % CHORDS.length;
  const cn = (ci + 1) % CHORDS.length;
  // crossfade de 1,5s entre acordes (sem "degrau")
  const inChord = t % CHORD_SEC;
  const xf = Math.min(1, Math.max(0, (inChord - (CHORD_SEC - 1.5)) / 1.5));

  let padL = 0;
  let padR = 0;
  for (let v = 0; v < 4; v++) {
    const fA = st(CHORDS[ci][v]) * 2; // uma oitava acima do sub
    const fB = st(CHORDS[cn][v]) * 2;
    const a = voice(fA, t, 0.004 + v * 0.001);
    const b = voice(fB, t, 0.004 + v * 0.001);
    const mixed = a * (1 - xf) + b * xf;
    // espalha as vozes no estéreo
    const pan = (v - 1.5) / 3;
    padL += mixed * (0.5 - pan * 0.5);
    padR += mixed * (0.5 + pan * 0.5);
  }
  // LFO lentíssimo no brilho do pad = "respiração"
  const breath = 0.7 + 0.3 * Math.sin(2 * Math.PI * t / 23);
  padL = lpPadL(padL) * breath;
  padR = lpPadR(padR) * breath;

  // sub-grave: fundamental do acorde, com pulsação lenta (não é batida)
  const subF = st(CHORDS[ci][0]) * (1 - xf) + st(CHORDS[cn][0]) * xf;
  const pulse = 0.75 + 0.25 * Math.sin(2 * Math.PI * t / 4.0);
  const sub = lpSub(Math.sin(2 * Math.PI * (subF / 2) * t)) * pulse;

  // textura: ruído rosa abafado, bem baixo (o "ar" da sala)
  const nL = lpNoiseL(pinkL());
  const nR = lpNoiseR(pinkR());

  // nota alta ocasional (tensão): 5ª do acorde, 2 oitavas acima, quase inaudível
  const hiF = st(CHORDS[ci][2]) * 4;
  const hiEnv = Math.max(0, Math.sin(2 * Math.PI * t / 16)) ** 3;
  const hi = Math.sin(2 * Math.PI * hiF * t) * hiEnv * 0.05;

  const pres = presence(t);
  L[i] = (padL * 0.32 + sub * 0.55 + nL * 0.9 + hi) * pres;
  R[i] = (padR * 0.32 + sub * 0.55 + nR * 0.9 + hi) * pres;
}

// normaliza pra pico 0.5 (a mistura final ainda leva um volume no Remotion)
let peak = 0;
for (let i = 0; i < N; i++) peak = Math.max(peak, Math.abs(L[i]), Math.abs(R[i]));
const g = peak > 0 ? 0.5 / peak : 1;

const buf = Buffer.alloc(44 + N * 4);
buf.write("RIFF", 0);
buf.writeUInt32LE(36 + N * 4, 4);
buf.write("WAVE", 8);
buf.write("fmt ", 12);
buf.writeUInt32LE(16, 16);
buf.writeUInt16LE(1, 20);
buf.writeUInt16LE(2, 22);
buf.writeUInt32LE(SR, 24);
buf.writeUInt32LE(SR * 4, 28);
buf.writeUInt16LE(4, 32);
buf.writeUInt16LE(16, 34);
buf.write("data", 36);
buf.writeUInt32LE(N * 4, 40);
for (let i = 0; i < N; i++) {
  buf.writeInt16LE((Math.max(-1, Math.min(1, L[i] * g)) * 32767) | 0, 44 + i * 4);
  buf.writeInt16LE((Math.max(-1, Math.min(1, R[i] * g)) * 32767) | 0, 46 + i * 4);
}
const out = path.join(outDir, "bed.wav");
fs.writeFileSync(out, buf);
console.log("OK", out, `${DUR}s`, `${(buf.length / 1e6).toFixed(1)} MB`);
