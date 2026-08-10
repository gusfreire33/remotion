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
import { secToFrame } from "../lib/constants";
import { BEAT_TIMING } from "../lib/beats";
import { BROLL } from "../lib/broll";
import { BRoll } from "./BRoll";
import { ANTON, MONTSERRAT } from "../lib/fonts";
import { COLORS, TEXT_SHADOW } from "../lib/theme";

/* ------------------------------------------------------------------------
   MASTER — motion design INÉDITO pra este vídeo (CHAT GPT ADS).

   O dono pediu edição estilo CAPTIONS e animações DIFERENTES das que já
   foram usadas. Nenhuma gramática daqui se repete dos vídeos anteriores
   (lá era: risco, balões, funil, post-its, slot, trilho, scanner):

     hookTitulo   · ticker/marquee horizontal + selo "NOVO"
     maioria      · fileira de avatares acendendo + barra de %
     versus       · dois painéis entrando em split (ChatGPT x Google)
     filtros      · chips com toggle ligando em cascata
     similar      · equalizer de eficiência subindo barra a barra
     brasil       · selo de país carimbando sobre o B-roll
     contas       · cadeado + contador de vagas caindo
     vaAtras      · checklist marcando item a item
     problema     · faixa de alerta listrada pulsando
     naoAnuncia   · carimbo "PROIBIDO" batendo torto
     querAnunciar · campo de busca com cursor digitando
     tranquilo    · chip respirando
     cta          · caixa de comentário do Instagram digitando a palavra

   O TRATAMENTO segue o playbook: CameraMotionBlur (150/6), película só
   durante o beat, ExitFade pra nada sobrar, SEM film burn e SEM SFX.
   --------------------------------------------------------------------- */

const EASE = Easing.inOut(Easing.ease);
const OUT = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// Área segura: as legendas agora ficam mais altas (paddingBottom 700, topo em
// ~1130). Todo overlay é erguido pra faixa acima disso.
const LIFT: CSSProperties = {
  justifyContent: "center",
  alignItems: "center",
  paddingBottom: 700,
};

const BeatScrim: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const fadeIn = interpolate(frame, [0, 8], [0, 1], OUT);
  const fadeOut = interpolate(
    frame,
    [durationInFrames - 9, durationInFrames],
    [1, 0],
    OUT,
  );
  return (
    <AbsoluteFill
      style={{
        opacity: Math.min(fadeIn, fadeOut),
        background:
          "radial-gradient(125% 95% at 50% 40%, rgba(0,0,0,0.32) 0%, rgba(0,0,0,0.64) 100%)",
      }}
    />
  );
};

const ExitFade: React.FC<{ children: ReactNode; duration?: number }> = ({
  children,
  duration = 16,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const startOut = durationInFrames - duration;
  const o = interpolate(frame, [startOut, durationInFrames - 2], [1, 0], OUT);
  const scale = interpolate(
    frame,
    [startOut, durationInFrames - 2],
    [1, 1.06],
    OUT,
  );
  return (
    <AbsoluteFill style={{ opacity: o, transform: `scale(${scale})` }}>
      {children}
    </AbsoluteFill>
  );
};

/* ---------------------------------------------------------------- helpers */

/** Mola simples 0→1 a partir de um delay. */
const useEnter = (delay = 0, stiffness = 170, damping = 14): number => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({
    frame: frame - delay,
    fps,
    config: { damping, mass: 0.6, stiffness },
  });
};

const kicker: CSSProperties = {
  fontFamily: MONTSERRAT,
  fontWeight: 900,
  letterSpacing: 3,
  textTransform: "uppercase",
};

const display: CSSProperties = {
  fontFamily: ANTON,
  letterSpacing: 1,
  textShadow: TEXT_SHADOW,
};

/** Selo/etiqueta pequena, usada como "label" de vários beats. */
const Tag: React.FC<{
  children: ReactNode;
  bg?: string;
  fg?: string;
  delay?: number;
  size?: number;
}> = ({ children, bg = COLORS.accent, fg = COLORS.accentInk, delay = 0, size = 30 }) => {
  const e = useEnter(delay, 210, 12);
  return (
    <div
      style={{
        ...kicker,
        fontSize: size,
        background: bg,
        color: fg,
        padding: "14px 24px",
        borderRadius: 14,
        transform: `scale(${interpolate(e, [0, 1], [0.5, 1])})`,
        opacity: Math.min(1, e * 2),
        boxShadow: "0 14px 34px rgba(0,0,0,0.45)",
      }}
    >
      {children}
    </div>
  );
};

/* ------------------------------------------------------------- 1. HOOK */

/** Ticker horizontal: a faixa desliza e o título "carimba" por cima. */
const HookTituloBeat: React.FC = () => {
  const frame = useCurrentFrame();
  const e = useEnter(2, 150, 15);
  const slide = interpolate(frame, [0, 80], [0, -520], OUT);
  const titleE = useEnter(8, 200, 11);

  return (
    <AbsoluteFill style={LIFT}>
      <div style={{ alignItems: "center", display: "flex", flexDirection: "column", gap: 34 }}>
        {/* faixa deslizante (ticker) */}
        <div
          style={{
            width: 1080,
            overflow: "hidden",
            background: COLORS.accent,
            padding: "16px 0",
            transform: `rotate(-3deg) scaleX(${interpolate(e, [0, 1], [0, 1])})`,
          }}
        >
          <div
            style={{
              ...kicker,
              fontSize: 34,
              color: COLORS.accentInk,
              whiteSpace: "nowrap",
              transform: `translateX(${slide}px)`,
            }}
          >
            {"NOVO CANAL DE MÍDIA · CHATGPT ADS · ".repeat(6)}
          </div>
        </div>

        <div
          style={{
            ...display,
            fontSize: 128,
            lineHeight: 0.94,
            color: COLORS.white,
            textAlign: "center",
            transform: `scale(${interpolate(titleE, [0, 1], [0.7, 1])})`,
            opacity: Math.min(1, titleE * 2),
          }}
        >
          A PARTIR
          <br />
          DE HOJE
        </div>

        <Tag delay={20} bg={COLORS.white} fg="#111">
          por que você deveria usar
        </Tag>
      </div>
    </AbsoluteFill>
  );
};

/* --------------------------------------------------------- 2. A MAIORIA */

/** Fileira de avatares acendendo + barra de porcentagem enchendo. */
const MaioriaBeat: React.FC = () => {
  const frame = useCurrentFrame();
  const total = 10;
  const acesos = 8;
  const bar = interpolate(frame, [6, 34], [0, 1], { ...OUT, easing: EASE });

  return (
    <AbsoluteFill style={LIFT}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 30 }}>
        <div style={{ display: "flex", gap: 14 }}>
          {Array.from({ length: total }).map((_, i) => {
            const on = i < acesos;
            const e = interpolate(frame, [2 + i * 2.2, 10 + i * 2.2], [0, 1], {
              ...OUT,
              easing: EASE,
            });
            return (
              <div
                key={i}
                style={{
                  width: 74,
                  height: 74,
                  borderRadius: "50%",
                  background: on ? COLORS.accent : "rgba(255,255,255,0.18)",
                  border: `4px solid ${on ? COLORS.accent : "rgba(255,255,255,0.35)"}`,
                  transform: `scale(${interpolate(e, [0, 1], [0.3, 1])}) translateY(${interpolate(e, [0, 1], [22, 0])}px)`,
                  opacity: e,
                }}
              />
            );
          })}
        </div>

        <div
          style={{
            width: 760,
            height: 26,
            borderRadius: 13,
            background: "rgba(255,255,255,0.18)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${bar * 80}%`,
              height: "100%",
              background: COLORS.accent,
              borderRadius: 13,
            }}
          />
        </div>

        <div style={{ ...display, fontSize: 92, color: COLORS.white, textAlign: "center" }}>
          A MAIORIA JÁ
          <br />
          MIGROU
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------ 3. VERSUS */

/** Dois painéis entrando em split — ChatGPT ganha, Google recua. */
const VersusBeat: React.FC = () => {
  const left = useEnter(2, 160, 14);
  const right = useEnter(8, 160, 14);
  const vs = useEnter(18, 220, 10);

  const panel = (
    win: boolean,
    title: string,
    sub: string,
    e: number,
    dir: number,
  ): ReactNode => (
    <div
      style={{
        width: 400,
        padding: "38px 26px",
        borderRadius: 30,
        textAlign: "center",
        background: win ? COLORS.accent : "rgba(20,20,22,0.9)",
        border: `4px solid ${win ? COLORS.accent : "rgba(255,255,255,0.22)"}`,
        transform: `translateX(${interpolate(e, [0, 1], [dir * 320, 0])}px) scale(${
          win ? interpolate(e, [0, 1], [0.9, 1.06]) : interpolate(e, [0, 1], [0.9, 0.94])
        })`,
        opacity: Math.min(1, e * 2),
        boxShadow: win ? "0 24px 60px rgba(0,0,0,0.5)" : "none",
      }}
    >
      <div
        style={{
          ...display,
          fontSize: 54,
          color: win ? COLORS.accentInk : COLORS.white,
          textShadow: "none",
        }}
      >
        {title}
      </div>
      <div
        style={{
          ...kicker,
          fontSize: 24,
          marginTop: 12,
          color: win ? COLORS.accentInk : "rgba(255,255,255,0.7)",
        }}
      >
        {sub}
      </div>
    </div>
  );

  return (
    <AbsoluteFill style={LIFT}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 34 }}>
        <div style={{ ...display, fontSize: 82, color: COLORS.white }}>
          REDE DE INTENÇÃO
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 18, position: "relative" }}>
          {panel(true, "CHATGPT", "intenção real", left, -1)}
          <div
            style={{
              ...display,
              fontSize: 52,
              color: COLORS.white,
              transform: `scale(${interpolate(vs, [0, 1], [0, 1])}) rotate(${interpolate(vs, [0, 1], [-40, 0])}deg)`,
            }}
          >
            VS
          </div>
          {panel(false, "GOOGLE", "palavra-chave", right, 1)}
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------ 4. FILTROS */

/** Chips com toggle ligando em cascata. */
const FiltrosBeat: React.FC = () => {
  const frame = useCurrentFrame();
  const items = ["TIPO DE BUSCA", "INTERESSE", "INTENÇÃO DE COMPRA"];

  return (
    <AbsoluteFill style={LIFT}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 26 }}>
        <Tag bg={COLORS.white} fg="#111">
          filtros disponíveis
        </Tag>
        {items.map((t, i) => {
          const d = 6 + i * 9;
          const e = interpolate(frame, [d, d + 12], [0, 1], { ...OUT, easing: EASE });
          const on = interpolate(frame, [d + 8, d + 18], [0, 1], { ...OUT, easing: EASE });
          return (
            <div
              key={t}
              style={{
                width: 780,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 24,
                padding: "22px 28px",
                borderRadius: 24,
                background: "rgba(18,18,20,0.9)",
                border: `3px solid rgba(255,255,255,${0.16 + on * 0.5})`,
                transform: `translateX(${interpolate(e, [0, 1], [-90, 0])}px)`,
                opacity: Math.min(1, e * 2),
              }}
            >
              <span
                style={{
                  ...kicker,
                  fontSize: 32,
                  color: COLORS.white,
                  opacity: 0.55 + on * 0.45,
                }}
              >
                {t}
              </span>
              {/* toggle */}
              <div
                style={{
                  width: 96,
                  height: 52,
                  borderRadius: 26,
                  background: on > 0.5 ? COLORS.success : "rgba(255,255,255,0.2)",
                  position: "relative",
                  flexShrink: 0,
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 6,
                    left: 6 + on * 44,
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    background: COLORS.white,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------ 5. SIMILAR */

/** Equalizer: barras de eficiência subindo uma a uma. */
const SimilarBeat: React.FC = () => {
  const frame = useCurrentFrame();
  const bars = [0.42, 0.55, 0.68, 0.8, 0.95];

  return (
    <AbsoluteFill style={LIFT}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 32 }}>
        <div style={{ ...display, fontSize: 78, color: COLORS.white, textAlign: "center" }}>
          MESMA LÓGICA.
        </div>

        <div style={{ display: "flex", alignItems: "flex-end", gap: 26, height: 420 }}>
          {bars.map((h, i) => {
            const d = 6 + i * 6;
            const g = interpolate(frame, [d, d + 16], [0, 1], { ...OUT, easing: EASE });
            const last = i === bars.length - 1;
            return (
              <div
                key={i}
                style={{
                  width: 128,
                  height: 420 * h * g,
                  borderRadius: 22,
                  background: last ? COLORS.success : "rgba(255,255,255,0.42)",
                  border: "3px solid rgba(255,255,255,0.25)",
                  boxShadow: last ? "0 0 56px rgba(48,209,88,0.7)" : "none",
                }}
              />
            );
          })}
        </div>

        <Tag delay={26} bg={COLORS.success} fg="#04240F" size={32}>
          resultado mais eficiente
        </Tag>
      </div>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------- 6. BRASIL */

/** Selo de país carimbando por cima do B-roll da cidade. */
const BrasilBeat: React.FC = () => {
  const e = useEnter(2, 240, 9);
  return (
    <AbsoluteFill style={LIFT}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 22,
          padding: "26px 40px",
          borderRadius: 26,
          background: COLORS.white,
          transform: `scale(${interpolate(e, [0, 1], [1.7, 1])}) rotate(${interpolate(e, [0, 1], [-12, -4])}deg)`,
          opacity: Math.min(1, e * 2.5),
          boxShadow: "0 26px 64px rgba(0,0,0,0.5)",
        }}
      >
        {/* nada de emoji de bandeira aqui: 🇧🇷 é um par de "regional indicator"
            e o Chrome headless do render desenha as letras "BR" cruas. Faixa
            verde-amarela desenhada na mão resolve e fica mais forte. */}
        <div
          style={{
            width: 26,
            height: 96,
            borderRadius: 6,
            background: "linear-gradient(180deg, #009C3B 0%, #FFDF00 100%)",
          }}
        />
        <span style={{ ...display, fontSize: 76, color: "#111", textShadow: "none" }}>
          CHEGOU NO BRASIL
        </span>
      </div>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------- 7. CONTAS */

/** Cadeado + contador de vagas caindo (acesso restrito). */
const ContasBeat: React.FC = () => {
  const frame = useCurrentFrame();
  const e = useEnter(2, 180, 13);
  const shake = Math.sin(frame / 2.2) * interpolate(frame, [8, 34], [5, 0], OUT);
  // barra de vagas esvaziando (um "%" contando pra baixo ficava sem sentido —
  // porcentagem de quê? A barra comunica escassez sem prometer número).
  const vagas = interpolate(frame, [8, 34], [1, 0.12], { ...OUT, easing: EASE });

  return (
    <AbsoluteFill style={LIFT}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 22,
          transform: `translateX(${shake}px) scale(${interpolate(e, [0, 1], [0.8, 1])})`,
          opacity: Math.min(1, e * 2),
        }}
      >
        <span style={{ fontSize: 110 }}>🔒</span>
        <div style={{ ...display, fontSize: 84, color: COLORS.accent, textAlign: "center" }}>
          ACESSO RESTRITO
        </div>
        <div
          style={{
            width: 700,
            height: 30,
            borderRadius: 15,
            background: "rgba(255,255,255,0.18)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${vagas * 100}%`,
              height: "100%",
              background: COLORS.danger,
              borderRadius: 15,
            }}
          />
        </div>
        <Tag delay={22} bg={COLORS.white} fg="#111" size={28}>
          liberado só pra algumas contas
        </Tag>
      </div>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------ 8. VÁ ATRÁS */

/** Checklist marcando item a item. */
const VaAtrasBeat: React.FC = () => {
  const frame = useCurrentFrame();
  const items = ["ENTRA NA PLATAFORMA", "ENTENDE O LEILÃO", "TESTA ANTES DA FILA"];

  return (
    <AbsoluteFill style={LIFT}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 24 }}>
        {items.map((t, i) => {
          const d = 4 + i * 11;
          const e = interpolate(frame, [d, d + 10], [0, 1], { ...OUT, easing: EASE });
          const check = interpolate(frame, [d + 7, d + 15], [0, 1], { ...OUT, easing: EASE });
          return (
            <div
              key={t}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 22,
                transform: `translateX(${interpolate(e, [0, 1], [-70, 0])}px)`,
                opacity: Math.min(1, e * 2),
              }}
            >
              <div
                style={{
                  width: 62,
                  height: 62,
                  borderRadius: 16,
                  flexShrink: 0,
                  background: check > 0.5 ? COLORS.success : "transparent",
                  border: `5px solid ${check > 0.5 ? COLORS.success : "rgba(255,255,255,0.5)"}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 36,
                  color: COLORS.white,
                  transform: `scale(${0.9 + check * 0.1})`,
                }}
              >
                {check > 0.5 ? "✓" : ""}
              </div>
              <span style={{ ...display, fontSize: 54, color: COLORS.white }}>{t}</span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/* ----------------------------------------------------------- 9. PROBLEMA */

/** Faixa de alerta listrada pulsando. */
const ProblemaBeat: React.FC = () => {
  const frame = useCurrentFrame();
  const e = useEnter(2, 170, 13);
  const pulse = 1 + Math.sin(frame / 4) * 0.03;

  const stripes =
    "repeating-linear-gradient(45deg, #FFD60A 0 34px, #1A1400 34px 68px)";

  return (
    <AbsoluteFill style={LIFT}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 0,
          transform: `scale(${interpolate(e, [0, 1], [0.85, 1]) * pulse}) rotate(-2deg)`,
          opacity: Math.min(1, e * 2),
        }}
      >
        <div style={{ width: 900, height: 26, background: stripes }} />
        <div
          style={{
            width: 900,
            background: "rgba(10,10,12,0.94)",
            padding: "40px 30px",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: 88, lineHeight: 1 }}>⚠️</div>
          <div style={{ ...display, fontSize: 74, color: COLORS.accent, marginTop: 14 }}>
            O ÚNICO PROBLEMA
          </div>
          <div style={{ ...kicker, fontSize: 30, color: COLORS.white, marginTop: 14 }}>
            existe um nicho de fora
          </div>
        </div>
        <div style={{ width: 900, height: 26, background: stripes }} />
      </div>
    </AbsoluteFill>
  );
};

/* -------------------------------------------------------- 10. NÃO ANUNCIA */

/** Carimbo "PROIBIDO" batendo torto. */
const NaoAnunciaBeat: React.FC = () => {
  const e = useEnter(1, 260, 8);
  const s = interpolate(e, [0, 1], [2.4, 1]);
  const rot = interpolate(e, [0, 1], [-24, -8]);

  return (
    <AbsoluteFill style={LIFT}>
      <div
        style={{
          border: `10px solid ${COLORS.danger}`,
          borderRadius: 22,
          padding: "26px 46px",
          transform: `scale(${s}) rotate(${rot}deg)`,
          opacity: Math.min(1, e * 3),
          background: "rgba(10,0,0,0.5)",
        }}
      >
        <div style={{ ...display, fontSize: 96, color: COLORS.danger, lineHeight: 1 }}>
          NÃO PODE
          <br />
          ANUNCIAR
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------ 11. QUER ANUNCIAR */

/** Campo de busca com cursor digitando. */
const QuerAnunciarBeat: React.FC = () => {
  const frame = useCurrentFrame();
  const e = useEnter(2, 180, 13);
  const TXT = "como anunciar no chatgpt ads";
  const chars = Math.round(interpolate(frame, [6, 46], [0, TXT.length], OUT));
  const caret = Math.floor(frame / 7) % 2;

  return (
    <AbsoluteFill style={LIFT}>
      <div
        style={{
          width: 880,
          transform: `translateY(${interpolate(e, [0, 1], [50, 0])}px)`,
          opacity: Math.min(1, e * 2),
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            background: "rgba(245,245,247,0.97)",
            borderRadius: 999,
            padding: "26px 34px",
            boxShadow: "0 26px 60px rgba(0,0,0,0.5)",
          }}
        >
          <span style={{ fontSize: 44 }}>🔎</span>
          <span
            style={{
              fontFamily: MONTSERRAT,
              fontWeight: 700,
              fontSize: 38,
              color: "#111",
              whiteSpace: "nowrap",
              overflow: "hidden",
            }}
          >
            {TXT.slice(0, chars)}
            <span style={{ opacity: caret }}>|</span>
          </span>
        </div>
        <div
          style={{
            ...display,
            fontSize: 70,
            color: COLORS.white,
            textAlign: "center",
            marginTop: 30,
          }}
        >
          QUER COMEÇAR?
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* --------------------------------------------------------- 12. TRANQUILO */

/** Chip curto, respirando. */
const TranquiloBeat: React.FC = () => {
  const frame = useCurrentFrame();
  const e = useEnter(1, 240, 10);
  const breathe = 1 + Math.sin(frame / 5) * 0.035;

  return (
    <AbsoluteFill style={LIFT}>
      <div
        style={{
          background: COLORS.success,
          borderRadius: 999,
          padding: "28px 56px",
          transform: `scale(${interpolate(e, [0, 1], [0.4, 1]) * breathe})`,
          opacity: Math.min(1, e * 3),
          boxShadow: "0 22px 56px rgba(0,0,0,0.45)",
        }}
      >
        <span style={{ ...display, fontSize: 84, color: "#04240F", textShadow: "none" }}>
          FICA TRANQUILO
        </span>
      </div>
    </AbsoluteFill>
  );
};

/* --------------------------------------------------------------- 13. CTA */

/** Caixa de comentário do Instagram digitando a palavra. */
const CtaBeat: React.FC = () => {
  const frame = useCurrentFrame();
  const WORD = "vazamento";
  const chars = Math.round(interpolate(frame, [10, 44], [0, WORD.length], OUT));
  const caret = Math.floor(frame / 7) % 2;
  const box = useEnter(2, 170, 14);
  const btn = useEnter(46, 240, 10);

  return (
    <AbsoluteFill
      style={{ justifyContent: "flex-start", alignItems: "center", paddingTop: 820 }}
    >
      <div
        style={{
          width: 900,
          transform: `translateY(${interpolate(box, [0, 1], [70, 0])}px)`,
          opacity: Math.min(1, box * 2),
        }}
      >
        <div style={{ ...kicker, fontSize: 30, color: COLORS.white, marginBottom: 18, textShadow: TEXT_SHADOW }}>
          comenta aqui embaixo 👇
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            background: "rgba(18,18,20,0.94)",
            border: "3px solid rgba(255,255,255,0.28)",
            borderRadius: 999,
            padding: "22px 30px",
          }}
        >
          <div
            style={{
              flex: 1,
              ...display,
              fontSize: 62,
              color: COLORS.accent,
              textShadow: "none",
              minHeight: 68,
            }}
          >
            {WORD.slice(0, chars)}
            <span style={{ opacity: caret, color: COLORS.white }}>|</span>
          </div>
          <div
            style={{
              ...kicker,
              fontSize: 28,
              background: COLORS.accent,
              color: COLORS.accentInk,
              padding: "14px 24px",
              borderRadius: 999,
              transform: `scale(${interpolate(btn, [0, 1], [0.55, 1])})`,
              opacity: Math.min(1, btn * 2),
            }}
          >
            publicar
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ MAP */

const BEATS: Record<string, React.FC> = {
  hookTitulo: HookTituloBeat,
  maioria: MaioriaBeat,
  versus: VersusBeat,
  filtros: FiltrosBeat,
  similar: SimilarBeat,
  brasil: BrasilBeat,
  contas: ContasBeat,
  vaAtras: VaAtrasBeat,
  problema: ProblemaBeat,
  naoAnuncia: NaoAnunciaBeat,
  querAnunciar: QuerAnunciarBeat,
  tranquilo: TranquiloBeat,
  cta: CtaBeat,
};

export const Overlays: React.FC = () => (
  <Sequence name="MOTION DESIGN" layout="none">
    {BEAT_TIMING.map(({ key, from, to }) => {
      const Comp = BEATS[key];
      const clip = BROLL.find((c) => c.key === key);
      if (!Comp && !clip) {
        return null;
      }
      // película: só quando o overlay entra POR CIMA do vídeo do apresentador.
      // Se o beat é B-roll full-bleed, o clipe já toma a tela — escurecer de
      // novo só sujaria a imagem.
      const scrim = Boolean(Comp) && clip?.layout !== "full";

      return (
        <Sequence
          key={key}
          from={secToFrame(from)}
          durationInFrames={secToFrame(to - from)}
          name={`beat:${key}`}
        >
          {scrim ? <BeatScrim /> : null}
          <ExitFade duration={12}>
            {clip ? <BRoll clip={clip} /> : null}
            {Comp ? (
              // motion blur estilo After Effects (playbook: 150 / 6)
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
