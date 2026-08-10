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

// Marcadores de nao-fala que o Whisper insere (silencio, musica, etc.)
// Inclui restos de colchete soltos (ex.: "encerramento]") e a palavra
// "encerramento" que o Whisper alucina no fim quando ha musica de saida.
const NON_SPEECH = /\[.*?\]|\(.*?\)|[\[\]]|sil[êe]ncio|BLANK_AUDIO|m[uú]sica|music|applause|aplausos|encerramento/i;

// Correcoes de termos que o Whisper erra (checadas re-transcrevendo o trecho
// isolado). A chave e a palavra crua (sem pontuacao, minuscula); a pontuacao
// original e preservada.
const FIXES = {
  seratocone: "ceratocone",
  seratoconia: "ceratocone",
  ceratoconia: "ceratocone",
  cornea: "córnea",
  popular: "irregular", // 21,5s "...a córnea começa a ficar irregular"
  calamidade: "deformidade", // 137s "...mostram a deformidade na córnea"
};

const applyFix = (text) => {
  const m = text.match(/^([\wÀ-ÿ-]+)(.*)$/u);
  if (!m) return text;
  const fix = FIXES[m[1].toLowerCase()];
  return fix ? fix + m[2] : text;
};

// Limpa: remove palavras vazias, marcadores de nao-fala e normaliza confianca
const clean = words
  .map((w) => ({
    text: applyFix(w.text),
    startMs: w.startMs,
    endMs: w.endMs,
    confidence: +(w.confSum / w.confN).toFixed(3),
  }))
  .filter((w) => w.text.replace(/[\s,.!?]/g, "").length > 0)
  .filter((w) => !NON_SPEECH.test(w.text));

// Remove conectores curtos "orfaos" no fim (sobras da alucinacao de saida):
// se a ultima palavra e um conector curto e ha um silencio grande antes dela,
// nao e fala real — descarta.
const ORPHAN = /^(de|e|a|o|que|um|uma)$/i;
while (clean.length > 1) {
  const last = clean[clean.length - 1];
  const prev = clean[clean.length - 2];
  if (ORPHAN.test(last.text.replace(/[\s,.!?]/g, "")) && last.startMs - prev.endMs > 400) {
    clean.pop();
  } else {
    break;
  }
}

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
