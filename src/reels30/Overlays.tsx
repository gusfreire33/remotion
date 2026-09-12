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
import { BEAT_TIMING, ELEMENT_FRAMES, type BeatKey } from "./lib/beats";
import { frameAt } from "./lib/constants";

const WHITE = "#FFFFFF";
const RED = "#FF3B30";
const GOLD = "#FFD60A";
const GREEN = "#30D158";
const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const title: CSSProperties = {
  fontFamily: ANTON,
  letterSpacing: 1,
  lineHeight: 1,
  color: WHITE,
};
const label: CSSProperties = {
  fontFamily: MONTSERRAT,
  fontWeight: 800,
  letterSpacing: 3,
  color: WHITE,
};

const enter = (frame: number, delay = 0): number =>
  spring({
    frame: frame - delay,
    fps: 30,
    config: { stiffness: 175, damping: 17, mass: 0.65 },
  });
const motion = (amount: number, x = 0, y = 60): CSSProperties => ({
  opacity: Math.min(1, amount * 1.8),
  transform: `translate(${x * (1 - amount)}px, ${y * (1 - amount)}px) scale(${0.8 + amount * 0.2})`,
});

const Check: React.FC<{
  x: number;
  y: number;
  scale?: number;
  color?: string;
}> = ({ x, y, scale = 1, color = GREEN }) => (
  <path
    d={`M ${x - 17 * scale} ${y} l ${12 * scale} ${13 * scale} l ${26 * scale} ${-31 * scale}`}
    fill="none"
    stroke={color}
    strokeWidth={8 * scale}
    strokeLinecap="round"
    strokeLinejoin="round"
  />
);

/** "Boca a boca PARA": three conversations pass a pulse; the connector
 * physically disconnects on PARA (3.96s), stopping the pulse downstream. */
const Referral: React.FC = () => {
  const frame = useCurrentFrame();
  const entry = ELEMENT_FRAMES.referral.map((delay) => enter(frame, delay));
  const stop = interpolate(
    frame,
    [frameAt(3.96 - 3.08), frameAt(3.96 - 3.08) + 3],
    [0, 1],
    CLAMP,
  );
  const pulse = Math.min(frame, frameAt(3.96 - 3.08)) / 30;
  return (
    <AbsoluteFill>
      <div
        style={{
          ...title,
          position: "absolute",
          top: 480,
          width: "100%",
          textAlign: "center",
          fontSize: 86,
          ...motion(entry[0]),
        }}
      >
        BOCA A BOCA
      </div>
      <svg width="1080" height="1920" style={{ position: "absolute" }}>
        <path
          d="M290 758 H436 M642 758 H788"
          stroke="#FFFFFF66"
          strokeWidth="5"
          fill="none"
        />
        {[200, 540, 880].map((x, i) => (
          <g
            key={x}
            opacity={Math.min(1, entry[i] * 1.5)}
            transform={`translate(${x} ${745 + 55 * (1 - entry[i])}) scale(${0.7 + 0.3 * entry[i]})`}
          >
            <path
              d="M-70 -59 H70 Q90 -59 90 -39 V37 Q90 57 70 57 H-26 L-64 88 V57 H-70 Q-90 57 -90 37 V-39 Q-90 -59 -70 -59Z"
              fill="#101820EE"
              stroke={stop > 0.5 && i > 0 ? RED : WHITE}
              strokeWidth="4"
            />
            {[-35, 0, 35].map((dx) => (
              <circle
                key={dx}
                cx={dx}
                cy="0"
                r="8"
                fill={stop > 0.5 && i > 0 ? RED : WHITE}
              />
            ))}
          </g>
        ))}
        <circle
          cx={300 + ((pulse * 300) % 140)}
          cy="758"
          r="8"
          fill={stop > 0 ? RED : GOLD}
        />
        <path
          d={`M653 758 L${677 + stop * 12} ${758 - stop * 40}`}
          stroke={stop > 0 ? RED : GOLD}
          strokeWidth="7"
          strokeLinecap="round"
        />
        {stop > 0 && (
          <g opacity={stop}>
            <path
              d="M718 736 L746 764 M746 736 L718 764"
              stroke={RED}
              strokeWidth="7"
              strokeLinecap="round"
            />
          </g>
        )}
      </svg>
      <div
        style={{
          ...label,
          position: "absolute",
          top: 925,
          width: "100%",
          textAlign: "center",
          fontSize: 34,
          opacity: stop,
          color: RED,
        }}
      >
        O FLUXO PARA.
      </div>
    </AbsoluteFill>
  );
};

/** "Isso NÃO É NEGÓCIO": an interruption stripe cuts through the noun.
 * Strongest warning beat: two staggered elements, no full-screen replacement. */
const Warning: React.FC = () => {
  const frame = useCurrentFrame();
  const [a, b] = ELEMENT_FRAMES.warning.map((d) => enter(frame, d));
  return (
    <AbsoluteFill>
      <div
        style={{
          ...label,
          position: "absolute",
          top: 495,
          width: "100%",
          textAlign: "center",
          fontSize: 38,
          ...motion(a),
        }}
      >
        ISSO NÃO É
      </div>
      <div
        style={{
          ...title,
          position: "absolute",
          top: 590,
          width: "100%",
          textAlign: "center",
          fontSize: 170,
          ...motion(a, 0, 80),
        }}
      >
        NEGÓCIO
      </div>
      <div
        style={{
          position: "absolute",
          left: 144,
          top: 790,
          width: 792,
          height: 106,
          transform: `translateX(${(1 - b) * -1000}px) rotate(-5deg)`,
          opacity: Math.min(1, b * 2),
          borderTop: `5px solid ${RED}`,
          borderBottom: `5px solid ${RED}`,
          background: "#170B0DDD",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ ...label, color: RED, fontSize: 41, letterSpacing: 8 }}>
          DEPENDÊNCIA
        </div>
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 18 + i * 23,
              width: 10,
              height: 62,
              background: RED,
              transform: "skew(-20deg)",
            }}
          />
        ))}
      </div>
    </AbsoluteFill>
  );
};

/** "NÃO APOSTAM": a verdict lands in two spoken beats, a physical seal. */
const Verdict: React.FC = () => {
  const frame = useCurrentFrame();
  const [a, b] = ELEMENT_FRAMES.verdict.map((d) => enter(frame, d));
  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: 215,
          top: 525,
          width: 650,
          height: 350,
          border: `10px solid ${RED}`,
          borderRadius: 12,
          color: RED,
          transform: `rotate(-8deg) scale(${1.45 - 0.45 * a})`,
          opacity: Math.min(1, a * 2),
          boxShadow: "0 12px 50px #0005",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 18,
        }}
      >
        <div style={{ ...title, color: RED, fontSize: 142 }}>NÃO</div>
        <div
          style={{
            ...title,
            color: WHITE,
            fontSize: 103,
            letterSpacing: 7,
            ...motion(b, 0, 25),
          }}
        >
          APOSTAM
        </div>
      </div>
    </AbsoluteFill>
  );
};

/** "Loteria COM CNPJ": the company identifier is literally attached to a
 * perforated lottery ticket, then its stub tears away. Not a slot machine. */
const Lottery: React.FC = () => {
  const frame = useCurrentFrame();
  const [a, b, c] = ELEMENT_FRAMES.lottery.map((d) => enter(frame, d));
  const tear = interpolate(frame, [44, 52], [0, 1], CLAMP);
  const ticket: CSSProperties = {
    background: "#F0EEE6",
    color: "#15191B",
    borderRadius: 12,
    boxShadow: "0 24px 50px #0006",
  };
  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: 178,
          top: 690,
          width: 724,
          height: 560,
          transformOrigin: "top center",
          transform: `translateY(${(1 - a) * 140}px) rotate(${-7 + 3 * a}deg) scale(${0.58 + 0.14 * a})`,
          opacity: Math.min(1, a * 2),
        }}
      >
        <div
          style={{
            ...ticket,
            position: "absolute",
            left: 0,
            top: 0,
            width: 724,
            height: 360,
            padding: "40px 50px",
          }}
        >
          <div
            style={{
              ...label,
              color: "#656563",
              fontSize: 25,
              letterSpacing: 5,
            }}
          >
            SEU FATURAMENTO
          </div>
          <div
            style={{
              ...title,
              fontSize: 124,
              color: "#15191B",
              marginTop: 24,
              ...motion(b, 0, 40),
            }}
          >
            LOTERIA
          </div>
          <div style={{ display: "flex", gap: 14, marginTop: 22 }}>
            {["?", "?", "?", "?", "?"].map((v, i) => (
              <div
                key={i}
                style={{
                  border: "2px solid #181C1F",
                  borderRadius: "50%",
                  width: 64,
                  height: 64,
                  display: "grid",
                  placeItems: "center",
                  fontFamily: MONTSERRAT,
                  fontSize: 35,
                  fontWeight: 800,
                }}
              >
                {v}
              </div>
            ))}
          </div>
        </div>
        <div
          style={{
            ...ticket,
            position: "absolute",
            top: 360 + tear * 80,
            left: tear * 45,
            width: 724,
            height: 170,
            borderTop: "4px dashed #4449",
            padding: "32px 50px",
            transform: `rotate(${tear * 11}deg)`,
            transformOrigin: "right top",
          }}
        >
          <div
            style={{
              ...label,
              color: "#161C1E",
              fontSize: 46,
              letterSpacing: 5,
              ...motion(c, 35, 0),
            }}
          >
            COM CNPJ
          </div>
          <div
            style={{
              display: "flex",
              gap: 3,
              position: "absolute",
              right: 45,
              top: 34,
              height: 84,
            }}
          >
            {Array.from({ length: 24 }, (_, i) => (
              <div
                key={i}
                style={{ background: "#202528", width: 2 + ((i * 7) % 5) }}
              />
            ))}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/** "Máquina de clientes qualificados, chegando toda semana": an actual
 * rotating mechanism converts inputs into checked clients, then dispatches
 * them onto recurring weekly slots. A single deterministic production flow. */
const Machine: React.FC = () => {
  const frame = useCurrentFrame();
  const e = ELEMENT_FRAMES.machine.map((d) => enter(frame, d));
  const qualified = interpolate(frame, [35, 41], [0, 1], CLAMP);
  const weekly = interpolate(frame, [65, 71], [0, 1], CLAMP);
  return (
    <AbsoluteFill>
      <div
        style={{
          ...title,
          position: "absolute",
          top: 452,
          width: "100%",
          textAlign: "center",
          fontSize: 94,
          ...motion(e[0]),
        }}
      >
        MÁQUINA DE CLIENTES
      </div>
      <svg width="1080" height="1920" style={{ position: "absolute" }}>
        <path
          d="M105 737 H930"
          stroke="#FFFFFF55"
          strokeWidth="4"
          strokeDasharray="9 12"
        />
        {[0, 1, 2].map((i) => (
          <circle
            key={i}
            cx={110 + ((frame * 5 + i * 64) % 190)}
            cy={737}
            r={12}
            fill="#FFFFFFAA"
            opacity={e[0]}
          />
        ))}
        <g
          transform={`translate(425 ${735 + 70 * (1 - e[1])}) scale(${0.7 + 0.3 * e[1]})`}
          opacity={e[1]}
        >
          <g transform={`rotate(${frame * 3.5})`}>
            {Array.from({ length: 10 }, (_, i) => (
              <rect
                key={i}
                x="-16"
                y="-144"
                width="32"
                height="55"
                rx="6"
                fill={GOLD}
                transform={`rotate(${i * 36})`}
              />
            ))}
            <circle r="113" fill="#161F24" stroke={GOLD} strokeWidth="18" />
            <circle r="71" fill="none" stroke="#FFFFFF99" strokeWidth="3" />
            {[0, 1, 2].map((i) => (
              <path
                key={i}
                d="M0 -70 V-35"
                stroke={GOLD}
                strokeWidth="10"
                transform={`rotate(${i * 120})`}
              />
            ))}
          </g>
          <circle r="23" fill={GOLD} />
        </g>
        {[680, 875].map((x) => (
          <g
            key={x}
            opacity={Math.min(1, e[2] * 1.5)}
            transform={`translate(${x + 55 * (1 - e[2])} 735)`}
          >
            <rect
              x="-69"
              y="-82"
              width="138"
              height="164"
              rx="24"
              fill="#111D22EE"
              stroke={qualified > 0.5 ? GREEN : WHITE}
              strokeWidth="3"
            />
            <circle
              cx="0"
              cy="-25"
              r="20"
              fill="none"
              stroke={WHITE}
              strokeWidth="4"
            />
            <path
              d="M-35 38 C-35 -1 35 -1 35 38"
              fill="none"
              stroke={WHITE}
              strokeWidth="4"
            />
            <g opacity={qualified}>
              <circle
                cx="49"
                cy="63"
                r="28"
                fill="#101C15"
                stroke={GREEN}
                strokeWidth="2"
              />
              <Check x={49} y={64} scale={0.65} />
            </g>
          </g>
        ))}
      </svg>
      <div
        style={{
          ...label,
          position: "absolute",
          top: 922,
          width: "100%",
          textAlign: "center",
          fontSize: 30,
          color: GREEN,
          opacity: qualified * (1 - weekly),
          letterSpacing: 7,
        }}
      >
        QUALIFICADOS
      </div>
      <div
        style={{
          position: "absolute",
          top: 910,
          left: 145,
          width: 790,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          opacity: weekly,
          transform: `translateY(${(1 - weekly) * 25}px)`,
        }}
      >
        <div style={{ ...label, fontSize: 29, letterSpacing: 1 }}>
          TODA SEMANA
        </div>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              width: 125,
              height: 89,
              border: "2px solid #FFFFFF99",
              borderRadius: 12,
              borderTop: `12px solid ${GOLD}`,
              display: "grid",
              placeItems: "center",
              transform: `translateY(${(1 - e[i + 4]) * 25}px)`,
              opacity: Math.min(1, e[i + 4] * 1.7),
              background: "#101C20E8",
            }}
          >
            <svg width="60" height="54">
              <Check x={28} y={25} scale={0.9} />
            </svg>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

const COMPONENTS: Record<BeatKey, React.FC> = {
  referral: Referral,
  warning: Warning,
  verdict: Verdict,
  lottery: Lottery,
  machine: Machine,
};

const BeatScrim: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const fade = Math.min(
    interpolate(frame, [0, 7], [0, 1], CLAMP),
    interpolate(
      frame,
      [durationInFrames - 12, durationInFrames - 2],
      [1, 0],
      CLAMP,
    ),
  );
  return (
    <AbsoluteFill
      style={{
        opacity: fade,
        background:
          "radial-gradient(100% 80% at 50% 36%, rgba(0,0,0,.38), rgba(0,0,0,.53))",
      }}
    />
  );
};
const ExitFade: React.FC<{ children: ReactNode }> = ({ children }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const exit = interpolate(
    frame,
    [durationInFrames - 12, durationInFrames - 2],
    [1, 0],
    { ...CLAMP, easing: Easing.inOut(Easing.ease) },
  );
  return (
    <AbsoluteFill
      style={{ opacity: exit, transform: `scale(${1 + (1 - exit) * 0.04})` }}
    >
      {children}
    </AbsoluteFill>
  );
};

export const Overlays: React.FC = () => (
  <>
    {BEAT_TIMING.map((beat) => {
      const Comp = COMPONENTS[beat.key];
      return (
        <Sequence
          key={beat.key}
          name={`FW2:${beat.key}`}
          from={frameAt(beat.from)}
          durationInFrames={frameAt(beat.to) - frameAt(beat.from)}
        >
          <BeatScrim />
          <CameraMotionBlur shutterAngle={150} samples={6}>
            <ExitFade>
              <Comp />
            </ExitFade>
          </CameraMotionBlur>
        </Sequence>
      );
    })}
  </>
);
