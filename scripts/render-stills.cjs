// Faz o bundle uma vez e renderiza varios frames-chave como PNG (pra revisao).
const path = require("path");
const fs = require("fs");
const { bundle } = require("@remotion/bundler");
const { selectComposition, renderStill } = require("@remotion/renderer");

(async () => {
  const outDir = path.join(process.cwd(), "out");
  fs.mkdirSync(outDir, { recursive: true });

  console.log("Bundling...");
  const serveUrl = await bundle({
    entryPoint: path.join(process.cwd(), "src", "index.ts"),
  });

  // Porta dedicada: a 3000 pode estar ocupada por outro app (ex.: Jarvis).
  const PORT = 3399;
  console.log("Selecionando composicao...");
  const composition = await selectComposition({ serveUrl, id: "MeuVideo", port: PORT });

  // "VSLL Wonne V4.mp4" — VSL horizontal estilo "Bilhon-OS", 69 eventos
  // @30fps (8104 frames). Stills = palavras ATRÁS + cartões + chips/steps +
  // fins de evento (tela limpa) + cortes.
  const frames = [
    45, //    1,50s [over top] "uma pergunta DIRETA"
    62, //    2,07s [FIM over] — nada pode sobrar
    108, //   3,60s [ATRAS] "INDICAÇÃO"
    177, //   5,90s [over chest] "ENTRARIAM AMANHÃ?"
    237, //   7,90s [CARD sem moldura] "SÉRIO."
    297, //   9,90s [over tr] "DESCONFORTÁVEL"
    378, //  12,60s [over tl] "5 MINUTOS"
    486, //  16,20s [ATRAS] "FATURAMENTO"
    594, //  19,80s [CARD + dinheiro] "MÁQUINA DE CLIENTES"
    636, //  21,20s [CARD linha 3] "chegando toda semana"
    659, //  21,97s [CORTE whip] saída do cartão
    738, //  24,60s [over tl] "ONE DIGITAL"
    885, //  29,50s [ATRAS] "DEMANDA PREVISÍVEL"
    1335, // 44,50s [CHIPS + tail] agência/social/editor/programador
    1455, // 48,50s [ATRAS] "GERENTE DE FREELANCER"
    1815, // 60,50s [CARD] "O FATURAMENTO PARA JUNTO"
    1914, // 63,80s [over chest] "ISSO É APOSTA"
    2280, // 76,00s [CARD] "7 FRENTES DE CRESCIMENTO"
    2460, // 82,00s [ATRAS] "SISTEMA RADAR"
    2730, // 91,00s [STEPS R + over tl]
    3840, // 128,0s [STEPS R·A·D·A·R completo + over tl]
    4305, // 143,5s [CARD] leads/custa/cliente
    4740, // 158,0s [CHIPS] 7 frentes (2 fileiras)
    5430, // 181,0s [CARD OneMax + chips]
    5700, // 190,0s [ATRAS] "CONTRATA RESULTADO"
    6420, // 214,0s [STEPS 1-2 + CHIPS topo]
    7134, // 237,8s [CARD] "A GENTE PEDE AUDITORIA"
    7410, // 247,0s [ATRAS] "DIAGNÓSTICO GRATUITO"
    7920, // 264,0s [CHIPS riscados] sem indicação/aposta/freelancer
    7977, // 265,9s [ATRAS] "CLIQUE AGORA"
    8070, // 269,0s [CARD final] "MAS A INÉRCIA TEM CUSTO."
  ];
  // `node scripts/render-stills.cjs 134 216 331` renderiza só esses frames —
  // útil pra conferir um ponto específico sem re-render da lista inteira.
  const argFrames = process.argv.slice(2).map(Number).filter(Number.isFinite);
  const list = argFrames.length > 0 ? argFrames : frames;

  for (const frame of list) {
    const output = path.join(outDir, `still-${String(frame).padStart(5, "0")}.png`);
    await renderStill({ composition, serveUrl, output, frame, port: PORT });
    console.log("OK frame", frame, "->", output);
  }
  console.log("DONE");
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
