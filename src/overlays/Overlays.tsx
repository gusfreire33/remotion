import type { CSSProperties, ReactNode } from "react";
import {
  AbsoluteFill,
  interpolate,
  Sequence,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { CameraMotionBlur } from "@remotion/motion-blur";
import { PopIn } from "../components/PopIn";
import { FilmBurn } from "../components/FilmBurn";
import { ANTON, MONTSERRAT } from "../lib/fonts";
import { COLORS, TEXT_SHADOW } from "../lib/theme";
import { secToFrame } from "../lib/constants";
import { BEAT_TIMING } from "../lib/beats";

/* ----------------------------- helpers ----------------------------- */

// Cena: aplica motion blur (estilo After Effects) e centraliza o conteudo,
// erguendo-o acima da area das legendas.
const Scene: React.FC<{ children: ReactNode; lift?: number }> = ({
  children,
  lift = 270,
}) => (
  <CameraMotionBlur shutterAngle={150} samples={6}>
    <AbsoluteFill
      style={{ justifyContent: "center", alignItems: "center" }}
    >
      <div
        style={{
          transform: `translateY(${-lift}px)`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 28,
          width: 1000,
        }}
      >
        {children}
      </div>
    </AbsoluteFill>
  </CameraMotionBlur>
);

const Display: React.FC<{
  children: ReactNode;
  size?: number;
  color?: string;
  style?: CSSProperties;
}> = ({ children, size = 150, color = COLORS.white, style }) => (
  <div
    style={{
      fontFamily: ANTON,
      fontSize: size,
      lineHeight: 0.96,
      color,
      textTransform: "uppercase",
      letterSpacing: 1,
      textAlign: "center",
      textShadow: TEXT_SHADOW,
      ...style,
    }}
  >
    {children}
  </div>
);

const Kicker: React.FC<{ children: ReactNode; bg?: string; color?: string }> = ({
  children,
  bg = COLORS.accent,
  color = COLORS.accentInk,
}) => (
  <div
    style={{
      fontFamily: MONTSERRAT,
      fontWeight: 800,
      fontSize: 46,
      textTransform: "uppercase",
      letterSpacing: 1,
      color,
      background: bg,
      padding: "12px 30px",
      borderRadius: 18,
      boxShadow: "0 12px 30px rgba(0,0,0,0.35)",
    }}
  >
    {children}
  </div>
);

/* ----------------------------- 1. MILAGRE ----------------------------- */

const MilagreOverlay: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const strike = spring({
    frame: frame - 22,
    fps,
    config: { damping: 16, stiffness: 120 },
  });
  return (
    <Scene>
      <PopIn delay={0}>
        <Kicker bg={COLORS.white} color={COLORS.danger}>
          🚫 Tráfego pago
        </Kicker>
      </PopIn>
      <PopIn delay={6} from={0.3}>
        <div style={{ position: "relative", paddingInline: 10 }}>
          <Display size={200} color={COLORS.danger}>
            MILAGRE
          </Display>
          <div
            style={{
              position: "absolute",
              top: "52%",
              left: 0,
              height: 18,
              width: `${interpolate(strike, [0, 1], [0, 100])}%`,
              background: COLORS.danger,
              borderRadius: 10,
              transform: "rotate(-6deg)",
              boxShadow: "0 6px 16px rgba(0,0,0,0.4)",
            }}
          />
        </div>
      </PopIn>
      <PopIn delay={16}>
        <Display size={86}>NÃO EXISTE.</Display>
      </PopIn>
    </Scene>
  );
};

/* -------------------------- 2. POTENCIALIZADOR -------------------------- */

const Token: React.FC<{ children: ReactNode; delay: number; bg?: string }> = ({
  children,
  delay,
  bg = COLORS.panel,
}) => (
  <PopIn delay={delay} from={0.2} style={{ display: "inline-block" }}>
    <div
      style={{
        fontFamily: ANTON,
        fontSize: 120,
        color: COLORS.white,
        background: bg,
        borderRadius: 24,
        padding: "10px 36px",
        minWidth: 120,
        textAlign: "center",
        border: "4px solid rgba(255,255,255,0.12)",
        boxShadow: "0 14px 34px rgba(0,0,0,0.4)",
      }}
    >
      {children}
    </div>
  </PopIn>
);

const PotencializadorOverlay: React.FC = () => (
  <Scene>
    <PopIn>
      <Kicker>⚡ Potencializador</Kicker>
    </PopIn>
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 26,
        marginTop: 10,
      }}
    >
      <Token delay={4} bg={COLORS.danger}>
        0
      </Token>
      <Token delay={14}>×</Token>
      <Token delay={22}>⚡</Token>
      <Token delay={32}>=</Token>
      <Token delay={40} bg={COLORS.danger}>
        0
      </Token>
    </div>
    <PopIn delay={52}>
      <Display size={64} color={COLORS.accent}>
        Amplifica o que já funciona
      </Display>
    </PopIn>
  </Scene>
);

/* ----------------------------- 3. CHECKLIST ----------------------------- */

const CheckRow: React.FC<{ label: string; appear: number }> = ({
  label,
  appear,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({
    frame: frame - appear,
    fps,
    config: { damping: 13, stiffness: 170, mass: 0.6 },
  });
  const x = interpolate(s, [0, 1], [-70, 0]);
  const checked = frame >= appear + 6;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 26,
        transform: `translateX(${x}px)`,
        opacity: Math.min(1, s * 1.6),
      }}
    >
      <div
        style={{
          width: 84,
          height: 84,
          borderRadius: 20,
          background: checked ? COLORS.success : "rgba(255,255,255,0.10)",
          border: `5px solid ${checked ? COLORS.success : "rgba(255,255,255,0.3)"}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 52,
          transform: `scale(${checked ? 1 : 0.9})`,
        }}
      >
        {checked ? "✅" : ""}
      </div>
      <div
        style={{
          fontFamily: MONTSERRAT,
          fontWeight: 800,
          fontSize: 64,
          color: COLORS.white,
          textShadow: TEXT_SHADOW,
        }}
      >
        {label}
      </div>
    </div>
  );
};

const ChecklistOverlay: React.FC = () => (
  <Scene lift={250}>
    <PopIn>
      <Kicker>Arrume isso antes 👇</Kicker>
    </PopIn>
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 30,
        alignItems: "flex-start",
        background: COLORS.panel,
        padding: "46px 56px",
        borderRadius: 36,
        marginTop: 16,
        border: "3px solid rgba(255,255,255,0.10)",
        boxShadow: "0 26px 60px rgba(0,0,0,0.5)",
      }}
    >
      <CheckRow label="Processo comercial" appear={69} />
      <CheckRow label="Onboarding" appear={135} />
      <CheckRow label="Organização" appear={186} />
    </div>
  </Scene>
);

/* --------------------------- 4. PROMESSAS VAZIAS --------------------------- */

const Chip: React.FC<{ emoji: string; label: string; delay: number }> = ({
  emoji,
  label,
  delay,
}) => (
  <PopIn delay={delay} from={0.2}>
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 10,
        background: COLORS.panel,
        borderRadius: 28,
        padding: "26px 20px",
        width: 230,
        border: "3px solid rgba(255,255,255,0.10)",
        boxShadow: "0 14px 34px rgba(0,0,0,0.4)",
      }}
    >
      <div style={{ fontSize: 84 }}>{emoji}</div>
      <div
        style={{
          fontFamily: MONTSERRAT,
          fontWeight: 800,
          fontSize: 34,
          color: COLORS.white,
          textTransform: "uppercase",
          textAlign: "center",
        }}
      >
        {label}
      </div>
    </div>
  </PopIn>
);

const PromessasOverlay: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const stampAt = 114;
  const stamp = spring({
    frame: frame - stampAt,
    fps,
    config: { damping: 9, mass: 0.8, stiffness: 130 },
  });
  const stamped = frame >= stampAt;
  const dim = stamped ? 0.35 : 1;
  return (
    <Scene lift={250}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 26,
          opacity: dim,
          transition: "opacity 0.2s",
        }}
      >
        <Chip emoji="📱" label="Social media" delay={6} />
        <Chip emoji="🎯" label="Tráfego pago" delay={36} />
        <Chip emoji="🌐" label="Site" delay={63} />
        <Chip emoji="📣" label="Marketing" delay={78} />
      </div>
      {stamped ? (
        <div
          style={{
            position: "absolute",
            transform: `scale(${interpolate(stamp, [0, 1], [2.4, 1])}) rotate(-12deg)`,
            opacity: Math.min(1, stamp * 2),
          }}
        >
          <Display size={150} color={COLORS.danger}>
            NÃO ADIANTA
          </Display>
        </div>
      ) : null}
    </Scene>
  );
};

/* ----------------------------- 5. MENSAGENS ----------------------------- */

const Bubble: React.FC<{ text: string; delay: number; fromX: number; y: number }> = ({
  text,
  delay,
  fromX,
  y,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({
    frame: frame - delay,
    fps,
    config: { damping: 14, stiffness: 150, mass: 0.7 },
  });
  const x = interpolate(s, [0, 1], [fromX, 0]);
  return (
    <div
      style={{
        position: "absolute",
        top: y,
        transform: `translateX(${x}px)`,
        opacity: Math.min(1, s * 1.6),
        display: "flex",
        alignItems: "center",
        gap: 16,
        background: COLORS.white,
        color: COLORS.accentInk,
        borderRadius: 30,
        borderBottomLeftRadius: 6,
        padding: "20px 30px",
        fontFamily: MONTSERRAT,
        fontWeight: 700,
        fontSize: 40,
        boxShadow: "0 14px 30px rgba(0,0,0,0.45)",
      }}
    >
      <span style={{ fontSize: 46 }}>💬</span>
      {text}
    </div>
  );
};

const MensagensOverlay: React.FC = () => (
  <Scene lift={240}>
    <div style={{ position: "relative", width: 900, height: 460 }}>
      <Bubble text="Quero rodar tráfego!" delay={6} fromX={-700} y={0} />
      <Bubble text="Bora vender mais?" delay={28} fromX={700} y={130} />
      <Bubble text="Monta meu sistema?" delay={50} fromX={-700} y={260} />
    </div>
    <PopIn delay={120} from={0.2}>
      <Kicker bg={COLORS.danger} color={COLORS.white}>
        📍 Recife — todo dia
      </Kicker>
    </PopIn>
  </Scene>
);

/* --------------------------- 6. ARRUME A CASA --------------------------- */

const ArrumarCasaOverlay: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const punch = spring({
    frame,
    fps,
    config: { damping: 9, mass: 0.9, stiffness: 130 },
  });
  const scale = interpolate(punch, [0, 1], [0.3, 1]);
  return (
    <Scene>
      <div
        style={{
          transform: `scale(${scale})`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 24,
        }}
      >
        <div style={{ fontSize: 230 }}>🏠</div>
        <div
          style={{
            background: COLORS.accent,
            borderRadius: 28,
            padding: "18px 44px",
            boxShadow: "0 20px 50px rgba(0,0,0,0.45)",
          }}
        >
          <Display size={120} color={COLORS.accentInk} style={{ textShadow: "none" }}>
            Arrume a casa
          </Display>
        </div>
        <Display size={78} color={COLORS.white}>
          primeiro ✨
        </Display>
      </div>
    </Scene>
  );
};

/* ------------------------------- 7. CTA ------------------------------- */

const Reaction: React.FC<{ emoji: string; label: string; delay: number; color: string }> = ({
  emoji,
  label,
  delay,
  color,
}) => (
  <PopIn delay={delay} from={0.1}>
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      <div
        style={{
          width: 200,
          height: 200,
          borderRadius: "50%",
          background: color,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 110,
          boxShadow: "0 18px 40px rgba(0,0,0,0.45)",
        }}
      >
        {emoji}
      </div>
      <div
        style={{
          fontFamily: MONTSERRAT,
          fontWeight: 900,
          fontSize: 40,
          color: COLORS.white,
          textTransform: "uppercase",
          textShadow: TEXT_SHADOW,
        }}
      >
        {label}
      </div>
    </div>
  </PopIn>
);

const CTAOverlay: React.FC = () => (
  <Scene>
    <div style={{ display: "flex", gap: 40, alignItems: "flex-start" }}>
      <Reaction emoji="👍" label="Curte" delay={6} color={COLORS.blue} />
      <Reaction emoji="❤️" label="Comenta" delay={26} color={COLORS.danger} />
      <Reaction emoji="🔄" label="Compartilha" delay={46} color={COLORS.success} />
    </div>
  </Scene>
);

/* ----------------------------- 8. LINK NA BIO ----------------------------- */

const LinkBioOverlay: React.FC = () => {
  const frame = useCurrentFrame();
  const bounce = Math.sin(frame / 5) * 14;
  return (
    <Scene lift={300}>
      <PopIn from={0.2}>
        <div
          style={{
            background: COLORS.accent,
            color: COLORS.accentInk,
            fontFamily: ANTON,
            fontSize: 130,
            textTransform: "uppercase",
            padding: "24px 56px",
            borderRadius: 30,
            boxShadow: "0 22px 50px rgba(0,0,0,0.45)",
          }}
        >
          Link na bio
        </div>
      </PopIn>
      <div style={{ fontSize: 130, transform: `translateY(${bounce}px)` }}>👆</div>
    </Scene>
  );
};

/* ----------------------- pelicula (scrim) por beat ----------------------- */

// Camada preta com degrade que entra/sai junto com cada animacao. Fica na
// frente do video, mas atras da animacao — pra "limpar" o fundo e dar foco.
const BeatScrim: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const fadeIn = interpolate(frame, [0, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fadeOut = interpolate(
    frame,
    [durationInFrames - 12, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const o = Math.min(fadeIn, fadeOut);
  return (
    <AbsoluteFill
      style={{
        opacity: o,
        background:
          "radial-gradient(125% 95% at 50% 40%, rgba(0,0,0,0.32) 0%, rgba(0,0,0,0.64) 100%)",
      }}
    />
  );
};

// Saida dos elementos: somem (fade + leve recuo) sincronizado com o film burn,
// pra nao sobrar nada na tela depois que a queima passa.
const ExitFade: React.FC<{ children: ReactNode; duration?: number }> = ({
  children,
  duration = 16,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const startOut = durationInFrames - duration;
  const o = interpolate(frame, [startOut, durationInFrames - 3], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const scale = interpolate(frame, [startOut, durationInFrames - 3], [1, 0.88], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill style={{ opacity: o, transform: `scale(${scale})` }}>
      {children}
    </AbsoluteFill>
  );
};

/* ------------------------- master: sequencia tudo ------------------------- */

const COMPS: Record<string, React.FC> = {
  milagre: MilagreOverlay,
  potencializador: PotencializadorOverlay,
  checklist: ChecklistOverlay,
  promessas: PromessasOverlay,
  mensagens: MensagensOverlay,
  arrumarCasa: ArrumarCasaOverlay,
  cta: CTAOverlay,
  linkBio: LinkBioOverlay,
};

export const Overlays: React.FC = () => (
  <AbsoluteFill>
    {BEAT_TIMING.map(({ key, from, to }) => {
      const Comp = COMPS[key];
      return (
        <Sequence
          key={key}
          from={secToFrame(from)}
          durationInFrames={secToFrame(to - from)}
          name={key}
        >
          <BeatScrim />
          <ExitFade>
            <Comp />
          </ExitFade>
          <FilmBurn />
        </Sequence>
      );
    })}
  </AbsoluteFill>
);
