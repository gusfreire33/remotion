// Converte os tokens (sub-palavras) do Whisper em PALAVRAS inteiras com timestamps.
// Regra: um token inicia nova palavra se o texto comeca com espaco; senao,
// e continuacao/pontuacao e gruda na palavra anterior.
const fs = require("fs");
const path = require("path");

const tokens = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), "public", "captions.json"), "utf8"),
);

const words = [];
for (const tk of tokens) {
  const startsNew = tk.text.startsWith(" ") || words.length === 0;
  if (startsNew) {
    words.push({
      text: tk.text.trim(),
      startMs: tk.startMs,
      endMs: tk.endMs,
      confSum: tk.confidence,
      confN: 1,
    });
  } else {
    const w = words[words.length - 1];
    w.text += tk.text;
    w.endMs = tk.endMs;
    w.confSum += tk.confidence;
    w.confN += 1;
  }
}

// Limpa: remove palavras vazias e normaliza confianca media
const clean = words
  .map((w) => ({
    text: w.text,
    startMs: w.startMs,
    endMs: w.endMs,
    confidence: +(w.confSum / w.confN).toFixed(3),
  }))
  .filter((w) => w.text.replace(/[\s,.!?]/g, "").length > 0);

fs.writeFileSync(
  path.join(process.cwd(), "public", "words.json"),
  JSON.stringify(clean, null, 2),
);

// Tambem emite um modulo TS pra importar direto no bundle (sem fetch/delayRender)
const dataDir = path.join(process.cwd(), "src", "data");
fs.mkdirSync(dataDir, { recursive: true });
const ts =
  "// GERADO automaticamente por scripts/build-words.cjs — nao edite a mao.\n" +
  "export type Word = { text: string; startMs: number; endMs: number; confidence: number };\n\n" +
  "export const WORDS: Word[] = " +
  JSON.stringify(clean) +
  ";\n";
fs.writeFileSync(path.join(dataDir, "words.ts"), ts);

console.log("Palavras:", clean.length);
console.log("Preview:", clean.slice(0, 12).map((w) => w.text).join(" | "));
console.log(
  "Texto completo:\n" + clean.map((w) => w.text).join(" "),
);
