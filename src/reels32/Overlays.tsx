import type { CSSProperties, ReactNode } from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  Sequence,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { CameraMotionBlur } from "@remotion/motion-blur";
import { ANTON, MONTSERRAT } from "../lib/fonts";
import { COLORS, TEXT_SHADOW } from "../lib/theme";
import { BRoll } from "../overlays/BRoll";
import { BEAT_TIMING, ELEMENT_FRAMES, type BeatKey } from "./lib/beats";
import { BROLL } from "./lib/broll";
import { frameAt } from "./lib/constants";

/* ------------------------------------------------------------------------
   MOTION DESIGN INÉDITO — "Reels 32" (cliente que já comprou vs. pessoa nova)

   ETAPA 9 do PLAYBOOK-2: cada beat nasceu da pergunta "QUE MOVIMENTO essa
   frase está descrevendo?":

     esquece    · ESQUECER / APAGAR      → fileira de unidades (clientes apagam)
     atestado   · ASSINAR / CARIMBAR     → selo / carimbo   ★ RESSALVA
     vendendo   · CONTINUAR (empilhar)   → medida crescente (vendas empilham)
     convencer  · CONVENCER (empurrar)   → split / versus (barreiras)
     travas     · TRAVAR (não abrir)     → lista com estado (cadeados fecham)

   Nada aqui veio de vídeo anterior. Tratamento: CameraMotionBlur 150/6,
   película só sobre o rosto, ExitFade 12f, sem film burn, sem Math.random.
   --------------------------------------------------------------------- */

const EASE = Easing.inOut(Easing.ease);
const OUT = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const E = ELEMENT_FRAMES;

const LIFT: CSSProperties = {
  justifyContent: "center",
  alignItems: "center",
  paddingBottom: 700,
};

const useEnter = (delay = 0, stiffness = 170, damping = 14): number => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config: { damping, mass: 0.6, stiffness } });
};
const useRamp = (a: number, b: number): number => {
  const frame = useCurrentFrame();
  return interpolate(frame, [a, b], [0, 1], { ...OUT, easing: EASE });
};
const on = (s: number, k = 2): number => Math.min(1, s * k);

const kicker: CSSProperties = {
  fontFamily: MONTSERRAT,
  fontWeight: 900,
  letterSpacing: 4,
  textTransform: "uppercase",
  fontSize: 22,
  color: "rgba(255,255,255,0.8)",
};
const display: CSSProperties = { fontFamily: ANTON, letterSpacing: 1, textShadow: TEXT_SHADOW };
const panel: CSSProperties = {
  background: COLORS.panel,
  border: "3px solid rgba(255,255,255,0.16)",
  borderRadius: 22,
  boxShadow: "0 22px 60px rgba(0,0,0,0.5)",
};

/* ---------- formas desenhadas (glifos ✓ ✕ 🔒 não existem na Anton) */

const Check: React.FC<{ size: number; color: string; grow: number }> = ({ size, color, grow }) => (
  <div style={{ width: size, height: size, position: "relative" }}>
    <div style={{ position: "absolute", left: size * 0.12, top: size * 0.48, width: size * 0.34 * grow, height: Math.max(4, size * 0.14), borderRadius: 6, background: color, transform: "rotate(42deg)", transformOrigin: "left center" }} />
    <div style={{ position: "absolute", left: size * 0.33, top: size * 0.66, width: size * 0.58 * grow, height: Math.max(4, size * 0.14), borderRadius: 6, background: color, transform: "rotate(-52deg)", transformOrigin: "left center" }} />
  </div>
);

const Pessoa: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <div style={{ width: size, height: size, position: "relative" }}>
    <div style={{ position: "absolute", left: "50%", top: size * 0.1, width: size * 0.36, height: size * 0.36, borderRadius: "50%", background: color, transform: "translateX(-50%)" }} />
    <div style={{ position: "absolute", left: "50%", top: size * 0.52, width: size * 0.74, height: size * 0.5, borderRadius: `${size * 0.37}px ${size * 0.37}px 0 0`, background: color, transform: "translateX(-50%)" }} />
  </div>
);

/** Cadeado com a alça que DESCE e fecha (`shut` 0→1). */
const Cadeado: React.FC<{ size: number; color: string; shut: number }> = ({ size, color, shut }) => (
  <div style={{ width: size, height: size, position: "relative" }}>
    <div style={{ position: "absolute", left: "50%", top: size * 0.02 - (1 - shut) * size * 0.22, width: size * 0.5, height: size * 0.44, border: `${Math.max(4, size * 0.1)}px solid ${color}`, borderBottom: "none", borderRadius: `${size * 0.25}px ${size * 0.25}px 0 0`, transform: `translateX(-50%) rotate(${(1 - shut) * -18}deg)`, transformOrigin: "left bottom" }} />
    <div style={{ position: "absolute", left: "50%", top: size * 0.42, width: size * 0.78, height: size * 0.54, background: color, borderRadius: size * 0.1, transform: "translateX(-50%)" }} />
    <div style={{ position: "absolute", left: "50%", top: size * 0.6, width: size * 0.12, height: size * 0.18, borderRadius: size * 0.06, background: "rgba(0,0,0,0.55)", transform: "translateX(-50%)" }} />
  </div>
);

/* ================= 1. ESQUECE · FILEIRA DE UNIDADES ================= */
/**
 * "a grande maioria das empresas ESQUECE das pessoas"
 * VERBO: ESQUECER → cinco clientes (com selo de compra) acendem um a um e,
 * no instante de "esquece", APAGAM um a um: viram cinza e afundam, sobrando
 * só o contorno tracejado. O movimento É o esquecimento.
 */
const EsqueceBeat: React.FC = () => {
  const kick = useEnter(0, 210, 14);
  const acende = E.esquece.acende.map((d) => useEnter(d, 260, 12));
  const apaga = E.esquece.apaga.map((d) => useRamp(d, d + 10));
  const rotulo = useEnter(E.esquece.rotulo, 240, 12);

  return (
    <AbsoluteFill style={LIFT}>
      <div style={{ ...kicker, marginBottom: 26, opacity: on(kick) }}>a maioria das empresas</div>
      <div style={{ display: "flex", gap: 22 }}>
        {acende.map((e, i) => {
          const a = apaga[i];
          return (
            <div key={i} style={{ position: "relative", width: 168, height: 190 }}>
              <div style={{ position: "absolute", inset: 0, borderRadius: 26, border: "3px dashed rgba(255,255,255,0.35)", opacity: a }} />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: 26,
                  background: `rgba(48,209,88,${0.16 * (1 - a)})`,
                  border: `3px solid ${a > 0.5 ? "rgba(255,255,255,0)" : COLORS.success}`,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                  opacity: on(e) * (1 - a * 0.88),
                  filter: `grayscale(${a})`,
                  transform: `translateY(${interpolate(e, [0, 1], [26, 0]) + a * 34}px) scale(${interpolate(e, [0, 1], [0.7, 1]) - a * 0.12})`,
                }}
              >
                <Pessoa size={84} color={COLORS.white} />
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 26, height: 26, borderRadius: 8, background: COLORS.success, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Check size={18} color="#fff" grow={1} />
                  </div>
                  <div style={{ ...kicker, fontSize: 15, letterSpacing: 2, color: COLORS.white }}>comprou</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div
        style={{
          ...display,
          fontSize: 62,
          color: COLORS.white,
          marginTop: 26,
          opacity: on(rotulo),
          transform: `translateY(${interpolate(rotulo, [0, 1], [20, 0])}px)`,
          letterSpacing: 6,
        }}
      >
        ESQUECIDOS
      </div>
    </AbsoluteFill>
  );
};

/* ================= 2. ATESTADO · SELO / CARIMBO  ★ RESSALVA ================= */
/**
 * "isso é ASSINAR ATESTADO de ÓBITO PRECOCE"
 * VERBO: ASSINAR / CARIMBAR → um papel entra, a assinatura se DESENHA no
 * instante de "assinar", o título se escreve em "atestado" e o carimbo
 * vermelho BATE em "óbito" — o papel treme. É o efeito mais forte do vídeo.
 */
const TITULO = "ATESTADO".split("");
const AtestadoBeat: React.FC = () => {
  const frame = useCurrentFrame();
  const papel = useEnter(E.atestado.papel, 170, 15);
  const assina = useRamp(E.atestado.assina, E.atestado.assina + 20);
  const letras = E.atestado.letras.map((d) => useEnter(d, 400, 12));
  const carimbo = useEnter(E.atestado.carimbo, 330, 9);
  const tremor =
    frame >= E.atestado.carimbo && frame < E.atestado.carimbo + 10
      ? Math.sin((frame - E.atestado.carimbo) * 2.4) * (10 - (frame - E.atestado.carimbo)) * 1.1
      : 0;

  return (
    <AbsoluteFill style={LIFT}>
      <div
        style={{
          width: 760,
          padding: "42px 48px 40px",
          background: "#F4EFE1",
          borderRadius: 10,
          boxShadow: "0 30px 80px rgba(0,0,0,0.6)",
          position: "relative",
          opacity: on(papel),
          transform: `translate(${tremor}px, ${interpolate(papel, [0, 1], [90, 0]) + tremor * 0.4}px) rotate(-2deg)`,
        }}
      >
        <div style={{ display: "flex", height: 70, alignItems: "flex-end", gap: 2 }}>
          {TITULO.map((ch, i) => (
            <span
              key={i}
              style={{
                ...display,
                textShadow: "none",
                fontSize: 66,
                color: "#1A1A1A",
                letterSpacing: 6,
                opacity: on(letras[i], 3),
                transform: `translateY(${interpolate(letras[i], [0, 1], [-14, 0])}px)`,
              }}
            >
              {ch}
            </span>
          ))}
        </div>
        <div style={{ height: 3, background: "#1A1A1A", marginTop: 6, opacity: 0.85 }} />

        {[0.92, 0.7, 0.84].map((w, i) => (
          <div key={i} style={{ height: 12, borderRadius: 6, background: "rgba(26,26,26,0.22)", width: `${w * 100}%`, marginTop: i === 0 ? 26 : 16, transform: `scaleX(${on(papel, 1.4)})`, transformOrigin: "left" }} />
        ))}

        <div style={{ marginTop: 34, display: "flex", alignItems: "flex-end", gap: 18 }}>
          <div style={{ flex: 1 }}>
            <svg width="100%" height="84" viewBox="0 0 420 84" preserveAspectRatio="none">
              <path
                d="M8 62 C 40 10, 70 10, 96 58 S 150 90, 176 40 S 230 8, 258 56 S 318 84, 344 40 S 392 22, 412 50"
                pathLength={1}
                strokeDasharray={1}
                strokeDashoffset={1 - assina}
                stroke="#1B2A7A"
                strokeWidth={5}
                fill="none"
                strokeLinecap="round"
              />
            </svg>
            <div style={{ height: 3, background: "#1A1A1A", opacity: 0.7 }} />
            <div style={{ ...kicker, fontSize: 15, color: "rgba(26,26,26,0.6)", marginTop: 8 }}>assinatura</div>
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            right: 34,
            bottom: 36,
            padding: "14px 26px",
            border: `9px solid ${COLORS.danger}`,
            borderRadius: 14,
            color: COLORS.danger,
            ...display,
            textShadow: "none",
            fontSize: 58,
            lineHeight: 1,
            letterSpacing: 3,
            whiteSpace: "nowrap",
            opacity: on(carimbo, 3),
            transform: `rotate(-14deg) scale(${interpolate(carimbo, [0, 1], [2.4, 1])})`,
            mixBlendMode: "multiply",
          }}
        >
          ÓBITO PRECOCE
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ================= 3. VENDENDO · MEDIDA CRESCENTE ================= */
/**
 * "é muito mais fácil você CONTINUAR VENDENDO para uma pessoa"
 * VERBO: CONTINUAR → a mesma cliente à esquerda; à direita as vendas
 * EMPILHAM, cada barra maior que a anterior. A medida cresce porque é a
 * mesma pessoa comprando de novo.
 */
const VEN_ALVOS = [0.32, 0.52, 0.74, 0.96];
const VendendoBeat: React.FC = () => {
  const frame = useCurrentFrame();
  const painel = useEnter(E.vendendo.painel, 200, 14);
  const barras = E.vendendo.barras.map((d) => useRamp(d, d + 14));
  const entra = E.vendendo.barras.map((d) => useEnter(d, 260, 12));
  const n = E.vendendo.barras.filter((d) => frame >= d).length;

  return (
    <AbsoluteFill style={LIFT}>
      <div style={{ ...kicker, marginBottom: 22, opacity: on(painel) }}>continuar vendendo</div>
      <div
        style={{
          ...panel,
          width: 860,
          padding: "26px 30px 22px",
          display: "flex",
          alignItems: "flex-end",
          gap: 28,
          opacity: on(painel),
          transform: `translateY(${interpolate(painel, [0, 1], [34, 0])}px)`,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: 150 }}>
          <div style={{ width: 120, height: 120, borderRadius: 32, background: "rgba(48,209,88,0.16)", border: `3px solid ${COLORS.success}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Pessoa size={92} color={COLORS.white} />
          </div>
          <div style={{ ...kicker, fontSize: 15, letterSpacing: 2, color: COLORS.white }}>mesma pessoa</div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12 }}>
            <div style={{ ...kicker, fontSize: 17, letterSpacing: 3, color: "rgba(255,255,255,0.65)" }}>vendas</div>
            <div style={{ ...display, fontSize: 56, color: COLORS.success, lineHeight: 1 }}>{n}</div>
          </div>
          <div style={{ display: "flex", gap: 18, alignItems: "flex-end", height: 200 }}>
            {VEN_ALVOS.map((alvo, i) => (
              <div key={i} style={{ flex: 1, height: "100%", display: "flex", flexDirection: "column", justifyContent: "flex-end", alignItems: "center", gap: 8, opacity: on(entra[i]) }}>
                <div style={{ width: "100%", height: `${Math.round(barras[i] * alvo * 100)}%`, minHeight: 4, borderRadius: 12, background: i === 3 ? COLORS.success : COLORS.white }} />
                <div style={{ ...kicker, fontSize: 15, letterSpacing: 2, color: "rgba(255,255,255,0.7)" }}>{i + 1}ª</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ================= 4. CONVENCER · SPLIT / VERSUS ================= */
/**
 * "do que tentar CONVENCER uma NOVA PESSOA a comprar o produto. É muito mais DIFÍCIL"
 * VERBO: CONVENCER / EMPURRAR → dois painéis. À esquerda o ponto chega na
 * compra direto. À direita ele EMPURRA contra barreiras, quica, e trava na
 * hora de "comprar"; em "difícil" o veredito vermelho bate no painel.
 */
const MUROS = [0.34, 0.64, 0.92];
const ConvencerBeat: React.FC = () => {
  const frame = useCurrentFrame();
  const a = useEnter(E.convencer.painelA, 200, 14);
  const b = useEnter(E.convencer.painelB, 200, 14);
  const chega = useRamp(4, E.convencer.chega);
  const check = useEnter(E.convencer.chega, 320, 11);
  const nova = useEnter(E.convencer.novaPessoa, 260, 12);
  const veredito = useEnter(E.convencer.veredito, 340, 9);
  const [h1, h2, h3] = E.convencer.batidas;
  // trajeto do ponto da direita: avança, bate e recua (determinístico)
  const x = interpolate(
    frame,
    [10, h1, h1 + 6, h2, h2 + 6, h3, h3 + 4],
    [0, 0.31, 0.22, 0.61, 0.52, 0.61, 0.6],
    { ...OUT, easing: Easing.out(Easing.quad) },
  );
  const bate = [h1, h2, h3].map((h) => (frame >= h && frame < h + 8 ? (8 - (frame - h)) / 8 : 0));
  const empurra = frame > h3 + 4 ? Math.sin((frame - h3) * 0.9) * 0.012 : 0;
  const tremor = frame >= E.convencer.veredito && frame < E.convencer.veredito + 8 ? Math.sin((frame - E.convencer.veredito) * 2.5) * (8 - (frame - E.convencer.veredito)) : 0;

  const Trilho: React.FC<{ pos: number; walls?: number[]; hits?: number[]; color: string }> = ({ pos, walls = [], hits = [], color }) => (
    <div style={{ position: "relative", height: 74, margin: "18px 0 6px" }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 33, height: 8, borderRadius: 4, background: "rgba(255,255,255,0.14)" }} />
      <div style={{ position: "absolute", left: 0, width: `${pos * 100}%`, top: 33, height: 8, borderRadius: 4, background: color }} />
      {walls.map((w, i) => (
        <div key={i} style={{ position: "absolute", left: `${w * 100}%`, top: 4, width: 14, height: 66, borderRadius: 4, background: COLORS.danger, transform: `translateX(-50%) translateX(${hits[i] * 6}px) scaleY(${1 + hits[i] * 0.12})`, boxShadow: hits[i] ? `0 0 ${hits[i] * 22}px rgba(255,59,48,0.8)` : "none" }} />
      ))}
      <div style={{ position: "absolute", left: `${pos * 100}%`, top: 19, width: 36, height: 36, borderRadius: "50%", background: color, transform: "translateX(-50%)", boxShadow: "0 0 18px rgba(0,0,0,0.5)" }} />
    </div>
  );

  const Painel: React.FC<{ s: number; children: ReactNode; borda: string; dx: number }> = ({ s, children, borda, dx }) => (
    <div style={{ ...panel, border: `3px solid ${borda}`, width: 486, padding: "22px 24px 20px", opacity: on(s), transform: `translateX(${interpolate(s, [0, 1], [dx, 0])}px)` }}>{children}</div>
  );

  return (
    <AbsoluteFill style={LIFT}>
      <div style={{ display: "flex", gap: 20, transform: `translateX(${tremor}px)` }}>
        <Painel s={a} borda="rgba(48,209,88,0.7)" dx={-120}>
          <div style={{ ...kicker, fontSize: 17, color: COLORS.success }}>já cliente</div>
          <div style={{ ...display, fontSize: 44, color: COLORS.white, marginTop: 6 }}>já confia</div>
          <Trilho pos={chega} color={COLORS.success} />
          <div style={{ display: "flex", alignItems: "center", gap: 10, height: 44, opacity: on(check) }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: COLORS.success, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Check size={24} color="#fff" grow={on(check, 1.5)} />
            </div>
            <div style={{ ...kicker, fontSize: 17, color: COLORS.white }}>compra</div>
          </div>
        </Painel>

        <Painel s={b} borda="rgba(255,59,48,0.7)" dx={120}>
          <div style={{ ...kicker, fontSize: 17, color: COLORS.danger }}>nova pessoa</div>
          <div style={{ ...display, fontSize: 44, color: COLORS.white, marginTop: 6, opacity: on(nova), transform: `translateY(${interpolate(nova, [0, 1], [10, 0])}px)` }}>não conhece</div>
          <Trilho pos={x + empurra} walls={MUROS} hits={bate} color={COLORS.white} />
          <div style={{ position: "relative", height: 44 }}>
            <div style={{ ...kicker, fontSize: 17, color: "rgba(255,255,255,0.55)", lineHeight: "44px" }}>convencer…</div>
            <div
              style={{
                position: "absolute",
                right: -8,
                top: -14,
                padding: "6px 16px",
                border: `6px solid ${COLORS.danger}`,
                borderRadius: 10,
                color: COLORS.danger,
                ...display,
                textShadow: "none",
                fontSize: 46,
                lineHeight: 1,
                opacity: on(veredito, 3),
                transform: `rotate(-8deg) scale(${interpolate(veredito, [0, 1], [2.2, 1])})`,
                background: "rgba(0,0,0,0.35)",
              }}
            >
              DIFÍCIL
            </div>
          </div>
        </Painel>
      </div>
    </AbsoluteFill>
  );
};

/* ================= 5. TRAVAS · LISTA COM ESTADO ================= */
/**
 * "ainda NÃO COMPROU, ainda NÃO CONFIA em você e NEM SABE QUEM VOCÊ É"
 * VERBO: TRAVAR → três linhas entram no instante de cada item e o cadeado
 * de cada uma FECHA (a alça desce e trava). A lista termina toda fechada —
 * é a cabeça da pessoa nova, item a item.
 */
const TRAVAS_ITENS = ["não comprou", "não confia em você", "não sabe quem você é"];
const TravasBeat: React.FC = () => {
  const kick = useEnter(E.travas.kicker, 210, 14);
  const linhas = E.travas.linhas.map((d) => useEnter(d, 250, 13));
  const fecha = E.travas.fecha.map((d) => useRamp(d, d + 6));
  const bate = E.travas.fecha.map((d) => useEnter(d, 380, 9));

  return (
    <AbsoluteFill style={LIFT}>
      <div style={{ ...kicker, marginBottom: 22, opacity: on(kick) }}>na cabeça dessa pessoa</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 16, width: 840 }}>
        {TRAVAS_ITENS.map((t, i) => {
          const e = linhas[i];
          const f = fecha[i];
          return (
            <div
              key={t}
              style={{
                ...panel,
                border: `3px solid ${f > 0.9 ? "rgba(255,59,48,0.75)" : "rgba(255,255,255,0.16)"}`,
                display: "flex",
                alignItems: "center",
                gap: 22,
                padding: "16px 26px",
                opacity: on(e),
                transform: `translateX(${interpolate(e, [0, 1], [90, 0])}px) scale(${1 + (1 - Math.min(1, bate[i])) * 0.03 * (f > 0 ? 1 : 0)})`,
              }}
            >
              <div style={{ width: 64, height: 64, borderRadius: 16, background: `rgba(255,59,48,${0.12 + f * 0.16})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Cadeado size={40} color={COLORS.danger} shut={f} />
              </div>
              <div style={{ ...display, fontSize: 50, color: COLORS.white, flex: 1, lineHeight: 1 }}>{t}</div>
              <div style={{ ...kicker, fontSize: 18, color: "rgba(255,255,255,0.4)" }}>{String(i + 1).padStart(2, "0")}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------ wrapper */

const BEATS: Partial<Record<BeatKey, React.FC>> = {
  esquece: EsqueceBeat,
  atestado: AtestadoBeat,
  vendendo: VendendoBeat,
  convencer: ConvencerBeat,
  travas: TravasBeat,
};

const BeatScrim: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const o = Math.min(
    interpolate(frame, [0, 8], [0, 1], OUT),
    interpolate(frame, [durationInFrames - 10, durationInFrames - 1], [1, 0], OUT),
  );
  return (
    <AbsoluteFill
      style={{
        opacity: o,
        background: "radial-gradient(125% 95% at 50% 40%, rgba(0,0,0,0.32) 0%, rgba(0,0,0,0.64) 100%)",
      }}
    />
  );
};

const ExitFade: React.FC<{ children: ReactNode }> = ({ children }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const o = interpolate(frame, [durationInFrames - 12, durationInFrames - 2], [1, 0], { ...OUT, easing: EASE });
  return <AbsoluteFill style={{ opacity: o, transform: `scale(${1 + (1 - o) * 0.05})` }}>{children}</AbsoluteFill>;
};

export const Overlays: React.FC = () => (
  <Sequence name="MOTION DESIGN" layout="none">
    {BEAT_TIMING.map(({ key, from, to }) => {
      const Comp = BEATS[key];
      const clip = BROLL.find((c) => c.key === key);
      if (!Comp && !clip) return null;
      const scrim = Boolean(Comp) && clip?.layout !== "full";
      return (
        <Sequence key={key} from={frameAt(from)} durationInFrames={frameAt(to) - frameAt(from)} name={`beat:${key}`}>
          {scrim ? <BeatScrim /> : null}
          <ExitFade>
            {clip ? <BRoll clip={clip} /> : null}
            {Comp ? (
              <CameraMotionBlur shutterAngle={150} samples={6}>
                <Comp />
              </CameraMotionBlur>
            ) : null}
          </ExitFade>
        </Sequence>
      );
    })}
  </Sequence>
);
