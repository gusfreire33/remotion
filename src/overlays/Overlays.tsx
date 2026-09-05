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
   MASTER — motion design INÉDITO pra "Vídeo 29" (OS TRÊS 10 DA VENDA /
   CONFIANÇA).

   ETAPA 9 do PLAYBOOK-2: cada beat nasceu da pergunta "QUE MOVIMENTO essa
   frase está descrevendo?". O verbo vem primeiro, a forma depois:

     naoVende        · travar / não sair          -> contadores / barras
     tres10          · revelar três notas 10      -> fileira de unidades
     tresConfiancas  · marcar os três pilares     -> lista com estado
     emAberto        · vazar / deixar aberto      -> faixa / alerta  ★RESSALVA
     comunicacao     · a comunicação subir        -> medida crescente
     encontrarErros  · vasculhar / achar os erros -> campo de entrada

   ⚠️ Nada aqui vem de vídeo anterior. O CTA é o MESMO texto falado dos
   vídeos 25–27 (comenta vazamento). Lá foram notificação de DM, esteira
   de avatares e campo de Direct. Aqui o overlay é um CAMPO DE BUSCA
   vasculhando a operação — porque a frase deste vídeo é "encontre erros
   na tua operação".

   TRATAMENTO (igual ao playbook): CameraMotionBlur 150/6, película só quando
   o overlay entra sobre o rosto, ExitFade pra nada sobrar, sem film burn.
   --------------------------------------------------------------------- */

const EASE = Easing.inOut(Easing.ease);
const OUT = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

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

const useEnter = (delay = 0, stiffness = 170, damping = 14): number => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({
    frame: frame - delay,
    fps,
    config: { damping, mass: 0.6, stiffness },
  });
};

const useRamp = (a: number, b: number): number => {
  const frame = useCurrentFrame();
  return interpolate(frame, [a, b], [0, 1], { ...OUT, easing: EASE });
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

const panelStyle: CSSProperties = {
  background: COLORS.panel,
  border: "3px solid rgba(255,255,255,0.16)",
  borderRadius: 22,
  boxShadow: "0 22px 60px rgba(0,0,0,0.5)",
};

const Cruz: React.FC<{ size: number; color: string; grow: number }> = ({
  size,
  color,
  grow,
}) => (
  <div style={{ width: size, height: size, position: "relative" }}>
    {[45, -45].map((deg, i) => (
      <div
        key={i}
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: size * 0.86 * grow,
          height: Math.max(4, size * 0.16),
          borderRadius: size * 0.08,
          background: color,
          transform: `translate(-50%, -50%) rotate(${deg}deg)`,
        }}
      />
    ))}
  </div>
);

const Check: React.FC<{ size: number; color: string; grow: number }> = ({
  size,
  color,
  grow,
}) => (
  <div style={{ width: size, height: size, position: "relative" }}>
    <div
      style={{
        position: "absolute",
        left: size * 0.12,
        top: size * 0.46,
        width: size * 0.34 * grow,
        height: Math.max(5, size * 0.14),
        borderRadius: 6,
        background: color,
        transform: "rotate(42deg)",
        transformOrigin: "left center",
      }}
    />
    <div
      style={{
        position: "absolute",
        left: size * 0.32,
        top: size * 0.62,
        width: size * 0.58 * grow,
        height: Math.max(5, size * 0.14),
        borderRadius: 6,
        background: color,
        transform: "rotate(-52deg)",
        transformOrigin: "left center",
      }}
    />
  </div>
);

const Cadeado: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <div
    style={{
      width: size,
      height: size,
      position: "relative",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    }}
  >
    <div
      style={{
        width: size * 0.46,
        height: size * 0.4,
        border: `${Math.max(5, size * 0.1)}px solid ${color}`,
        borderBottom: "none",
        borderRadius: `${size * 0.23}px ${size * 0.23}px 0 0`,
        marginBottom: -2,
      }}
    />
    <div
      style={{
        width: size * 0.72,
        height: size * 0.52,
        background: color,
        borderRadius: size * 0.1,
      }}
    />
  </div>
);

/* ---------------- 1. NÃO VENDE · CONTADORES / BARRAS */

/**
 * "não está conseguindo vender seu produto"
 * VERBO: TRAVAR / NÃO SAIR.
 *
 * A barra de VENDAS tenta subir, recua pro chão e leva um cadeado.
 * O movimento É o diagnóstico do hook: a venda não sai.
 */
export const NAOVENDE_PAINEL = 0;
export const NAOVENDE_BARRA = 6;
export const NAOVENDE_TENTA = 10;
export const NAOVENDE_TRAVOU = 28;
export const NAOVENDE_LOCK = 34;

const NaoVendeBeat: React.FC = () => {
  const painel = useEnter(NAOVENDE_PAINEL, 200, 14);
  const barra = useEnter(NAOVENDE_BARRA, 210, 14);
  const tenta = useRamp(NAOVENDE_TENTA, NAOVENDE_TENTA + 16);
  const travou = useRamp(NAOVENDE_TRAVOU, NAOVENDE_TRAVOU + 8);
  const lock = useEnter(NAOVENDE_LOCK, 320, 10);
  const altura = tenta * 0.62 * (1 - travou * 0.85);

  return (
    <AbsoluteFill style={LIFT}>
      <div
        style={{
          ...kicker,
          fontSize: 22,
          letterSpacing: 5,
          color: "rgba(255,255,255,0.78)",
          marginBottom: 22,
          opacity: Math.min(1, painel * 2),
        }}
      >
        o produto
      </div>

      <div
        style={{
          ...panelStyle,
          width: 720,
          padding: "22px 28px 20px",
          opacity: Math.min(1, painel * 2),
          transform: `translateY(${interpolate(painel, [0, 1], [36, 0])}px)`,
          position: "relative",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            marginBottom: 14,
            opacity: Math.min(1, barra * 2),
          }}
        >
          <div style={{ ...kicker, fontSize: 20, color: "rgba(255,255,255,0.7)" }}>
            vendas
          </div>
          <div style={{ ...display, fontSize: 52, color: COLORS.danger }}>0</div>
        </div>

        <div
          style={{
            height: 28,
            borderRadius: 14,
            background: "rgba(255,255,255,0.08)",
            overflow: "hidden",
            opacity: Math.min(1, barra * 2),
          }}
        >
          <div
            style={{
              width: `${Math.round(altura * 100)}%`,
              height: "100%",
              background: COLORS.danger,
              borderRadius: 14,
            }}
          />
        </div>

        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: Math.min(1, lock * 2.5),
            transform: `scale(${interpolate(lock, [0, 1], [1.8, 1])})`,
          }}
        >
          <Cadeado size={86} color={COLORS.danger} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ---------------- 2. TRÊS 10 · FILEIRA DE UNIDADES */

/**
 * "o que são esses três 10?"
 * VERBO: REVELAR TRÊS NOTAS MÁXIMAS.
 *
 * Três cartões "10" ACENDEM um a um — é a pergunta virando número, não
 * uma lista de clientes (isso era o vídeo 27).
 */
export const TRES10_KICK = 0;
export const TRES10_CARDS = [4, 14, 24];
export const TRES10_LABEL = 32;

const Tres10Beat: React.FC = () => {
  const kick = useEnter(TRES10_KICK, 210, 14);
  const label = useEnter(TRES10_LABEL, 240, 12);
  const cards = TRES10_CARDS.map((d) => useEnter(d, 280, 12));

  return (
    <AbsoluteFill style={LIFT}>
      <div
        style={{
          ...kicker,
          fontSize: 22,
          letterSpacing: 5,
          color: "rgba(255,255,255,0.8)",
          marginBottom: 22,
          opacity: Math.min(1, kick * 2),
        }}
      >
        os três
      </div>

      <div style={{ display: "flex", gap: 18, justifyContent: "center" }}>
        {cards.map((e, i) => {
          const on = Math.min(1, e * 2);
          return (
            <div
              key={i}
              style={{
                width: 250,
                height: 210,
                borderRadius: 22,
                background:
                  on > 0
                    ? `rgba(255,214,10,${0.12 + on * 0.22})`
                    : "rgba(255,255,255,0.07)",
                border: `3px solid ${on > 0 ? COLORS.accent : "rgba(255,255,255,0.16)"}`,
                transform: `scale(${1 + on * 0.06}) translateY(${interpolate(e, [0, 1], [22, 0])}px)`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  ...display,
                  fontSize: 110,
                  color: on > 0 ? COLORS.accent : "rgba(255,255,255,0.45)",
                  lineHeight: 1,
                }}
              >
                10
              </div>
            </div>
          );
        })}
      </div>

      <div
        style={{
          ...kicker,
          fontSize: 24,
          letterSpacing: 5,
          color: COLORS.white,
          marginTop: 22,
          opacity: Math.min(1, label * 2),
        }}
      >
        da venda
      </div>
    </AbsoluteFill>
  );
};

/* ---------------- 3. TRÊS CONFIANÇAS · LISTA COM ESTADO */

/**
 * "confiança no produto, em você, na empresa"
 * VERBO: MARCAR OS TRÊS PILARES.
 *
 * Três linhas entram no instante da fala e ganham o check — o movimento
 * É a enumeração, não um diagrama estático.
 *
 * Delays amarrados na minutagem (beat começa em 8,70s):
 *   produto  8,71s → frame 0
 *   você    11,04s → frame 70
 *   empresa 12,88s → frame 125
 */
export const LISTA_KICK = 0;
export const LISTA_ITENS = [2, 70, 125];
export const LISTA_CHECKS = [12, 80, 137];

const LISTA_PASSOS = ["produto", "você", "empresa"];

const TresConfiancasBeat: React.FC = () => {
  const kick = useEnter(LISTA_KICK, 210, 14);
  const itens = LISTA_ITENS.map((d) => useEnter(d, 250, 13));
  const marcas = LISTA_CHECKS.map((d) => useEnter(d, 320, 11));

  return (
    <AbsoluteFill style={LIFT}>
      <div
        style={{
          ...kicker,
          fontSize: 22,
          letterSpacing: 5,
          color: "rgba(255,255,255,0.78)",
          marginBottom: 22,
          opacity: Math.min(1, kick * 2),
        }}
      >
        confiança em
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16, width: 820 }}>
        {LISTA_PASSOS.map((p, i) => {
          const e = itens[i];
          const m = marcas[i];
          return (
            <div
              key={p}
              style={{
                ...panelStyle,
                display: "flex",
                alignItems: "center",
                gap: 22,
                padding: "18px 28px",
                opacity: Math.min(1, e * 2),
                transform: `translateX(${interpolate(e, [0, 1], [80, 0])}px)`,
              }}
            >
              <div
                style={{
                  width: 58,
                  height: 58,
                  borderRadius: 14,
                  background:
                    Math.min(1, m * 2) > 0.4 ? COLORS.success : "rgba(255,255,255,0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Check size={34} color="#fff" grow={Math.min(1, m * 1.6)} />
              </div>
              <div style={{ ...display, fontSize: 56, color: COLORS.white, flex: 1 }}>
                {p}
              </div>
              <div style={{ ...kicker, fontSize: 22, color: "rgba(255,255,255,0.45)" }}>
                {String(i + 1).padStart(2, "0")}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/* ---------------- 4. EM ABERTO · FAIXA / ALERTA  ★ RESSALVA */

/**
 * "deixando em aberto algum desses três pontos lá no seu script"
 * VERBO: VAZAR / DEIXAR ABERTO.
 *
 * A faixa listrada DESCE e trava. Três pontos: dois sólidos, um FURADO.
 * É o efeito mais forte do vídeo — o diagnóstico que o público ia pular.
 */
export const ABERTO_FAIXA = 0;
export const ABERTO_TRAVA = 12;
export const ABERTO_TEXTO = 18;
export const ABERTO_PONTOS = [28, 36, 44];

const EmAbertoBeat: React.FC = () => {
  const faixa = useEnter(ABERTO_FAIXA, 140, 16);
  const trava = useEnter(ABERTO_TRAVA, 280, 10);
  const texto = useEnter(ABERTO_TEXTO, 230, 13);
  const pontos = ABERTO_PONTOS.map((d) => useEnter(d, 260, 12));
  const y = interpolate(faixa, [0, 1], [-420, 0]);
  const shake = interpolate(trava, [0, 0.4, 1], [0, -12, 0]);

  return (
    <AbsoluteFill style={LIFT}>
      <div
        style={{
          width: 1080,
          transform: `translateY(${y + shake}px)`,
          opacity: Math.min(1, faixa * 2),
        }}
      >
        <div
          style={{
            background:
              "repeating-linear-gradient(-18deg, #1A0404 0 18px, #3A0808 18px 36px)",
            borderTop: `8px solid ${COLORS.danger}`,
            borderBottom: `8px solid ${COLORS.danger}`,
            padding: "28px 40px 24px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 14,
          }}
        >
          <div
            style={{
              ...kicker,
              fontSize: 22,
              letterSpacing: 6,
              color: "rgba(255,255,255,0.8)",
              opacity: Math.min(1, texto * 2),
            }}
          >
            no script
          </div>
          <div
            style={{
              ...display,
              fontSize: 64,
              color: COLORS.white,
              opacity: Math.min(1, texto * 2),
              transform: `scale(${interpolate(trava, [0, 1], [1.25, 1])})`,
            }}
          >
            PONTO EM ABERTO
          </div>

          <div style={{ display: "flex", gap: 22, marginTop: 6 }}>
            {pontos.map((e, i) => {
              const on = Math.min(1, e * 2.4);
              const furo = i === 1;
              return (
                <div
                  key={i}
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: "50%",
                    border: `4px solid ${furo ? COLORS.danger : COLORS.white}`,
                    background: furo ? "transparent" : COLORS.white,
                    opacity: on,
                    transform: `scale(${interpolate(e, [0, 1], [0.4, 1])})`,
                    position: "relative",
                  }}
                >
                  {furo ? (
                    <div
                      style={{
                        position: "absolute",
                        inset: -10,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Cruz size={42} color={COLORS.danger} grow={on} />
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ---------------- 5. COMUNICAÇÃO · MEDIDA CRESCENTE */

/**
 * "Basta você melhorar a sua comunicação"
 * VERBO: A COMUNICAÇÃO SUBIR.
 *
 * Três barras (clareza / prova / tom) sobem uma a uma — é o "melhorar"
 * virando medida, não um card de oferta (isso era o vídeo 27).
 */
export const COM_PAINEL = 0;
export const COM_BARRAS = [8, 18, 28];
export const COM_NUMERO = 22;
export const COM_RODAPE = 34;

const COM_ALVOS = [0.58, 0.76, 0.94];
const COM_LABELS = ["clareza", "prova", "tom"];

const ComunicacaoBeat: React.FC = () => {
  const painel = useEnter(COM_PAINEL, 200, 14);
  const numero = useEnter(COM_NUMERO, 260, 12);
  const rodape = useEnter(COM_RODAPE, 230, 13);
  const barras = COM_BARRAS.map((d) => useRamp(d, d + 16));
  const entraBarra = COM_BARRAS.map((d) => useEnter(d, 240, 13));
  const frame = useCurrentFrame();
  const pct = Math.round(
    interpolate(frame, [COM_NUMERO, COM_NUMERO + 26], [22, 91], OUT),
  );

  return (
    <AbsoluteFill style={LIFT}>
      <div
        style={{
          ...panelStyle,
          width: 860,
          padding: "24px 32px 22px",
          opacity: Math.min(1, painel * 2),
          transform: `translateY(${interpolate(painel, [0, 1], [30, 0])}px)`,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            marginBottom: 18,
          }}
        >
          <div
            style={{
              ...kicker,
              fontSize: 20,
              letterSpacing: 4,
              color: "rgba(255,255,255,0.7)",
            }}
          >
            melhorar
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: 10,
              opacity: Math.min(1, numero * 2),
            }}
          >
            <div style={{ ...display, fontSize: 56, color: COLORS.success }}>{pct}%</div>
            <div
              style={{
                ...kicker,
                fontSize: 18,
                color: COLORS.white,
                opacity: Math.min(1, rodape * 2),
              }}
            >
              comunicação
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 28, alignItems: "flex-end", height: 220 }}>
          {COM_ALVOS.map((alvo, i) => {
            const h = barras[i] * alvo;
            return (
              <div
                key={COM_LABELS[i]}
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 10,
                  opacity: Math.min(1, entraBarra[i] * 2),
                }}
              >
                <div
                  style={{
                    width: "100%",
                    height: 180,
                    borderRadius: 14,
                    background: "rgba(255,255,255,0.08)",
                    overflow: "hidden",
                    display: "flex",
                    alignItems: "flex-end",
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      height: `${Math.round(h * 100)}%`,
                      background: i === 2 ? COLORS.success : COLORS.accent,
                      borderRadius: "14px 14px 0 0",
                    }}
                  />
                </div>
                <div style={{ ...kicker, fontSize: 18, color: "rgba(255,255,255,0.75)" }}>
                  {COM_LABELS[i]}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ---------------- 6. ENCONTRAR ERROS · CAMPO DE ENTRADA */

/**
 * "a gente encontre erros tipo esse na tua operação"
 * VERBO: VASCULHAR / ACHAR OS ERROS.
 *
 * Não é um Direct (vídeo 27) nem uma notificação de DM (vídeo 25). É a
 * BUSCA na operação: o campo digita, o resultado cai — 3 erros achados.
 */
export const ERROS_CARD = 0;
export const ERROS_TYPE = [6, 12, 18, 24, 30];
export const ERROS_RESULT = 34;
export const ERROS_HITS = [40, 46, 52];

const ERROS_TEXTO = ["erros", "no", "script", "de", "venda"];
const ERROS_ACHADOS = ["produto", "você", "empresa"];

const EncontrarErrosBeat: React.FC = () => {
  const frame = useCurrentFrame();
  const card = useEnter(ERROS_CARD, 200, 15);
  const result = useEnter(ERROS_RESULT, 240, 12);
  const palavras = ERROS_TYPE.map((d) => useEnter(d, 260, 12));
  const hits = ERROS_HITS.map((d) => useEnter(d, 280, 11));
  const caret = frame % 16 < 9 ? 1 : 0.15;
  const typingDone = Math.min(1, palavras[palavras.length - 1] * 2);

  return (
    <AbsoluteFill style={LIFT}>
      <div
        style={{
          ...kicker,
          fontSize: 20,
          letterSpacing: 5,
          color: "rgba(255,255,255,0.75)",
          marginBottom: 16,
          opacity: Math.min(1, card * 2),
        }}
      >
        na tua operação
      </div>

      <div
        style={{
          ...panelStyle,
          width: 880,
          padding: "22px 22px 20px",
          opacity: Math.min(1, card * 2),
          transform: `translateY(${interpolate(card, [0, 1], [40, 0])}px)`,
        }}
      >
        <div
          style={{
            background: "rgba(255,255,255,0.06)",
            borderRadius: 18,
            padding: "18px 22px",
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 10,
            minHeight: 76,
          }}
        >
          {ERROS_TEXTO.map((p, i) => {
            const e = palavras[i];
            return (
              <span
                key={p}
                style={{
                  ...display,
                  fontSize: 40,
                  color: COLORS.white,
                  opacity: Math.min(1, e * 3),
                  transform: `translateY(${interpolate(e, [0, 1], [12, 0])}px)`,
                }}
              >
                {p}
              </span>
            );
          })}
          <div
            style={{
              width: 5,
              height: 38,
              background: COLORS.white,
              opacity: caret * (1 - typingDone),
            }}
          />
        </div>

        <div
          style={{
            marginTop: 18,
            opacity: Math.min(1, result * 2),
          }}
        >
          <div
            style={{
              ...kicker,
              fontSize: 16,
              letterSpacing: 3,
              color: COLORS.danger,
              marginBottom: 12,
            }}
          >
            3 erros achados
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {ERROS_ACHADOS.map((h, i) => {
              const e = hits[i];
              return (
                <div
                  key={h}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    padding: "10px 16px",
                    borderRadius: 12,
                    background: "rgba(255,59,48,0.12)",
                    opacity: Math.min(1, e * 2.4),
                    transform: `translateX(${interpolate(e, [0, 1], [24, 0])}px)`,
                  }}
                >
                  <Cruz size={22} color={COLORS.danger} grow={Math.min(1, e * 1.6)} />
                  <div style={{ ...kicker, fontSize: 22, color: COLORS.white }}>
                    {h}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ MAP */

const BEATS: Record<string, React.FC> = {
  naoVende: NaoVendeBeat,
  tres10: Tres10Beat,
  tresConfiancas: TresConfiancasBeat,
  emAberto: EmAbertoBeat,
  comunicacao: ComunicacaoBeat,
  encontrarErros: EncontrarErrosBeat,
};

export const Overlays: React.FC = () => (
  <Sequence name="MOTION DESIGN" layout="none">
    {BEAT_TIMING.map(({ key, from, to }) => {
      const Comp = BEATS[key];
      const clip = BROLL.find((c) => c.key === key);
      if (!Comp && !clip) {
        return null;
      }
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
