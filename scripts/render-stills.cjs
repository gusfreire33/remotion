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

  // "Vídeo 18 {RE EDITADO.mp4" — CHAT GPT ADS, 20 beats @30fps (1917 frames).
  // Stills = as 10 palavras ATRÁS da pessoa + pico dos overlays + B-roll +
  // um FIM de beat (checar o ExitFade) + um frame limpo.
  const frames = [
    30, //   [ATRAS] 1,0s "CHATGPT ADS"
    90, //   [hookTitulo] 3,0s ticker + título
    128, //  [FIM hookTitulo] 4,27s saída — tela tem que estar limpando
    165, //  [B-ROLL aiRede] 5,5s animação de IA
    240, //  [ATRAS] 8,0s "GOOGLE" (contorno)
    294, //  [B-ROLL googleLado] 9,8s busca no laptop
    354, //  [maioria] 11,8s avatares + barra
    402, //  [ATRAS] 13,4s "PESQUISAR"
    468, //  [B-ROLL pesquisaGpt] 15,6s digitando
    549, //  [versus] 18,3s ChatGPT x Google
    606, //  [ATRAS] 20,2s "INTENÇÃO" (amarelo)
    660, //  [B-ROLL intencaoAlvo] 22,0s flecha no alvo
    729, //  [CARD segmentacao] 24,3s dashboard
    792, //  [ATRAS] 26,4s "SEGMENTAÇÃO"
    855, //  [filtros] 28,5s chips com toggle
    924, //  [B-ROLL filtroDados] 30,8s dados filtrando
    1029, // [similar] 34,3s equalizer de eficiência
    1092, // [ATRAS] 36,4s "EFICIENTE" (verde)
    1143, // [B-ROLL brasil] 38,1s selo sobre São Paulo
    1203, // [contas] 40,1s cadeado + contador
    1248, // [ATRAS] 41,6s "POUCAS CONTAS" (contorno)
    1332, // [ATRAS] 44,4s "SORTEADAS"
    1389, // [vaAtras] 46,3s checklist
    1467, // [problema] 48,9s faixa de alerta
    1530, // [ATRAS] 51,0s "SAÚDE" (vermelho)
    1575, // [naoAnuncia] 52,5s carimbo
    1644, // [querAnunciar] 54,8s campo de busca
    1710, // [B-ROLL perdido] 57,0s travado no PC
    1761, // [tranquilo] 58,7s chip verde
    1806, // [ATRAS] 60,2s "VAZAMENTO"
    1875, // [cta] 62,5s caixa de comentário + card do celular
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
