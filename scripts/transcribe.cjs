const path = require("path");
const fs = require("fs");
const {
  installWhisperCpp,
  downloadWhisperModel,
  transcribe,
  toCaptions,
} = require("@remotion/install-whisper-cpp");

const WHISPER_VERSION = "1.5.5";
const WHISPER_PATH = path.join(process.cwd(), "whisper.cpp");
const MODEL = "medium";
const AUDIO = path.join(process.cwd(), "audio16k.wav");
const PROGRESS = path.join(process.cwd(), "transcribe-progress.txt");

const logp = (msg) => {
  fs.appendFileSync(PROGRESS, msg + "\n");
  console.log(msg);
};

(async () => {
  fs.writeFileSync(PROGRESS, "");
  logp("[1/4] Instalando Whisper.cpp " + WHISPER_VERSION + " ...");
  await installWhisperCpp({ to: WHISPER_PATH, version: WHISPER_VERSION });

  logp("[2/4] Baixando modelo '" + MODEL + "' (pode demorar, ~1.5GB) ...");
  await downloadWhisperModel({ model: MODEL, folder: WHISPER_PATH });

  logp("[3/4] Transcrevendo (pt) com timestamps por palavra ...");
  let last = -1;
  const whisperCppOutput = await transcribe({
    inputPath: AUDIO,
    whisperPath: WHISPER_PATH,
    whisperCppVersion: WHISPER_VERSION,
    model: MODEL,
    tokenLevelTimestamps: true,
    language: "pt",
    printOutput: false,
    onProgress: (p) => {
      const pct = Math.round(p * 100);
      if (pct !== last && pct % 5 === 0) {
        last = pct;
        logp("    transcrevendo... " + pct + "%");
      }
    },
  });

  logp("[4/4] Gerando captions e salvando arquivos ...");
  const { captions } = toCaptions({ whisperCppOutput });
  fs.writeFileSync(
    path.join(process.cwd(), "public", "captions.json"),
    JSON.stringify(captions, null, 2),
  );
  fs.writeFileSync(
    path.join(process.cwd(), "transcription-full.json"),
    JSON.stringify(whisperCppOutput, null, 2),
  );
  logp("DONE: " + captions.length + " palavras transcritas");
})().catch((e) => {
  fs.appendFileSync(PROGRESS, "ERRO: " + (e && e.stack ? e.stack : e) + "\n");
  console.error(e);
  process.exit(1);
});
