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
// ⚠️ Esta tabela e ESPECIFICA DE CADA VIDEO. As correcoes do video anterior
// (vazamento; antes disso ceratocone/cornea) foram removidas ao entrar o
// "Video 20": aplicar fix de outro video troca palavra certa por errada
// (ex.: "popular" -> "irregular").
const FIXES = {
  // "Vídeo 29" — CTA. Whisper devolve `"vasamento"` (aspas grudadas).
  // (vazio — "VSLL Wonne V4": conferir a transcrição antes de adicionar)
};

// Palavras que o Whisper QUEBRA em duas (uma so palavra falada vira dois
// tokens separados por espaco, entao a regra de "comeca com espaco = palavra
// nova" nao consegue juntar). A chave e o par cru em minusculas.
// ⚠️ Tambem e ESPECIFICA DE CADA VIDEO.
const MERGES = [
  // "Vídeo 29" — a transcrição crua já junta as palavras certas.
];

const norm = (t) => t.replace(/[^\wÀ-ÿ-]/gu, "").toLowerCase();

const applyMerges = (list) => {
  const out = [];
  for (let i = 0; i < list.length; i++) {
    const cur = list[i];
    const nxt = list[i + 1];
    const m =
      nxt &&
      MERGES.find((x) => x.a === norm(cur.text) && x.b === norm(nxt.text));
    if (m) {
      // preserva a pontuacao que veio grudada no SEGUNDO token ("ziva," -> ",")
      const tail = nxt.text.match(/[^\wÀ-ÿ-]*$/u)?.[0] ?? "";
      out.push({
        text: m.to + tail,
        startMs: cur.startMs,
        endMs: nxt.endMs,
        confSum: cur.confSum + nxt.confSum,
        confN: cur.confN + nxt.confN,
      });
      i += 1;
    } else {
      out.push(cur);
    }
  }
  return out;
};

// O token pode vir com pontuacao NA FRENTE (o Whisper devolve a palavra do CTA
// como `"vasamento"`, com aspas). Por isso o prefixo e capturado a parte: sem
// isso o regex nao casava e o fix passava batido.
const applyFix = (text) => {
  const m = text.match(/^([^\wÀ-ÿ]*)([\wÀ-ÿ-]+)(.*)$/u);
  if (!m) return text;
  const fix = FIXES[m[2].toLowerCase()];
  return fix ? m[1] + fix + m[3] : text;
};

// Limpa: remove palavras vazias, marcadores de nao-fala e normaliza confianca
const clean = applyMerges(words)
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
