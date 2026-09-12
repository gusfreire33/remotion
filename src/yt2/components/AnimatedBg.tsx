import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Particles } from "../../components/Particles";
import { COLORS } from "../../lib/theme";

/* ------------------------------------------------------------------------
   FUNDOS ANIMADOS dos cartões — pedido do dono (11/09/2026): "às vezes fazer
   animações com backgrounds animados".

   Cinco famílias, todas determinísticas (nada de Math.random):

     sparks  · o da referência: marrom-laranja + fagulhas subindo
     grid    · malha em perspectiva correndo pro horizonte (tecnologia/sistema)
     waves   · ondas senoidais deslizando (fluxo, recorrência, tempo)
     dots    · campo de pontos pulsando em cascata (rede, pessoas, escala)
     aurora  · manchas de luz laranja/azul se movendo (a paleta das luzes do
               vídeo — LED laranja e azul atrás do apresentador)

   Cada cartão escolhe um pelo `bg` do mapa; a regra é a mesma dos overlays:
   o fundo carrega o VERBO da frase (grid = sistema, waves = fluxo…).
   --------------------------------------------------------------------- */

export type BgKind = "sparks" | "grid" | "waves" | "dots" | "aurora";

const hash = (i: number, salt: number): number => {
  const x = Math.sin(i * 127.1 + salt * 311.7) * 43758.5453;
  return x - Math.floor(x);
};

const Base: React.FC<{ warm?: boolean }> = ({ warm = true }) => (
  <AbsoluteFill
    style={{
      background: warm
        ? `radial-gradient(90% 80% at 20% 95%, ${COLORS.cardBg2} 0%, ${COLORS.cardBg1} 38%, ${COLORS.cardBg0} 100%)`
        : `radial-gradient(90% 80% at 80% 10%, #10182E 0%, #080A14 45%, #030305 100%)`,
    }}
  />
);

/* ---- grid: malha em perspectiva correndo ---- */
const Grid: React.FC = () => {
  const frame = useCurrentFrame();
  const off = (frame * 2.2) % 80;
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Base warm={false} />
      <div
        style={{
          position: "absolute",
          left: "-50%",
          right: "-50%",
          top: "42%",
          bottom: "-40%",
          transform: "perspective(600px) rotateX(62deg)",
          transformOrigin: "50% 0%",
          backgroundImage: `linear-gradient(rgba(255,122,26,0.55) 2px, transparent 2px), linear-gradient(90deg, rgba(255,122,26,0.4) 2px, transparent 2px)`,
          backgroundSize: "80px 80px",
          backgroundPosition: `0 ${off}px`,
          maskImage: "linear-gradient(to bottom, rgba(0,0,0,0) 0%, #000 35%, #000 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,0) 0%, #000 35%, #000 100%)",
        }}
      />
      {/* horizonte brilhando */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: "40%",
          height: 6,
          background: `linear-gradient(90deg, transparent, ${COLORS.orange}, transparent)`,
          boxShadow: `0 0 60px 20px rgba(255,122,26,0.35)`,
          opacity: 0.9,
        }}
      />
      <Particles count={40} speed={0.6} opacity={0.6} />
    </AbsoluteFill>
  );
};

/* ---- waves: ondas senoidais deslizando ---- */
const Waves: React.FC = () => {
  const frame = useCurrentFrame();
  const W = 1920;
  const lines = 7;
  return (
    <AbsoluteFill>
      <Base />
      <svg width={W} height={1080} style={{ position: "absolute", inset: 0 }}>
        {Array.from({ length: lines }, (_, k) => {
          const amp = 40 + k * 14;
          const baseY = 520 + k * 62;
          const speed = 0.045 + k * 0.006;
          const pts: string[] = [];
          for (let x = 0; x <= W; x += 24) {
            const y =
              baseY +
              Math.sin(x * 0.0042 + frame * speed + k * 0.8) * amp +
              Math.sin(x * 0.011 - frame * speed * 0.6) * amp * 0.3;
            pts.push(`${x},${y.toFixed(1)}`);
          }
          return (
            <polyline
              key={k}
              points={pts.join(" ")}
              fill="none"
              stroke={k % 2 === 0 ? COLORS.orange : COLORS.orangeSoft}
              strokeWidth={2.5 - k * 0.2}
              opacity={0.55 - k * 0.055}
            />
          );
        })}
      </svg>
      <Particles count={50} speed={0.7} opacity={0.7} />
    </AbsoluteFill>
  );
};

/* ---- dots: campo de pontos pulsando em cascata ---- */
const Dots: React.FC = () => {
  const frame = useCurrentFrame();
  const cols = 24;
  const rows = 13;
  const gx = 1920 / cols;
  const gy = 1080 / rows;
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Base warm={false} />
      {Array.from({ length: cols * rows }, (_, i) => {
        const c = i % cols;
        const r = Math.floor(i / cols);
        const d = Math.hypot(c - cols / 2, r - rows / 2);
        const pulse = 0.5 + 0.5 * Math.sin(frame * 0.09 - d * 0.55 + hash(i, 1) * 0.6);
        const sz = 3 + pulse * 5;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: c * gx + gx / 2 - sz / 2,
              top: r * gy + gy / 2 - sz / 2,
              width: sz,
              height: sz,
              borderRadius: "50%",
              background: pulse > 0.75 ? COLORS.orange : "rgba(255,255,255,0.7)",
              opacity: 0.25 + pulse * 0.6,
              boxShadow: pulse > 0.75 ? `0 0 ${sz * 2}px ${COLORS.orange}` : undefined,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

/* ---- aurora: manchas de luz laranja e azul (as luzes do vídeo) ---- */
const Aurora: React.FC = () => {
  const frame = useCurrentFrame();
  const blobs = [
    { c: "rgba(255,122,26,0.55)", x: 18, y: 30, r: 520, s: 0.011, ph: 0 },
    { c: "rgba(40,90,255,0.5)", x: 78, y: 62, r: 560, s: 0.009, ph: 2.1 },
    { c: "rgba(255,170,90,0.35)", x: 55, y: 85, r: 420, s: 0.014, ph: 4.0 },
    { c: "rgba(90,140,255,0.3)", x: 35, y: 70, r: 380, s: 0.012, ph: 1.2 },
  ];
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#07060A" }}>
      {blobs.map((b, i) => {
        const dx = Math.sin(frame * b.s + b.ph) * 9;
        const dy = Math.cos(frame * b.s * 0.8 + b.ph) * 7;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `calc(${b.x + dx}% - ${b.r / 2}px)`,
              top: `calc(${b.y + dy}% - ${b.r / 2}px)`,
              width: b.r,
              height: b.r,
              borderRadius: "50%",
              background: `radial-gradient(circle, ${b.c} 0%, rgba(0,0,0,0) 70%)`,
              filter: "blur(30px)",
            }}
          />
        );
      })}
      <Particles count={60} color="#FFFFFF" speed={0.5} opacity={0.5} />
    </AbsoluteFill>
  );
};

const Sparks: React.FC = () => {
  const frame = useCurrentFrame();
  const beamX = interpolate(frame, [0, 240], [-8, 8], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill>
      <Base />
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(112deg, rgba(255,150,70,0) 30%, rgba(255,170,90,0.16) 46%, rgba(255,150,70,0) 62%)",
          transform: `translateX(${beamX}%)`,
        }}
      />
      <Particles count={110} />
    </AbsoluteFill>
  );
};

export const AnimatedBg: React.FC<{ kind?: BgKind }> = ({ kind = "sparks" }) => {
  const bg =
    kind === "grid" ? <Grid /> :
    kind === "waves" ? <Waves /> :
    kind === "dots" ? <Dots /> :
    kind === "aurora" ? <Aurora /> :
    <Sparks />;
  return (
    <AbsoluteFill>
      {bg}
      {/* vinheta comum */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(110% 90% at 50% 50%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.6) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};
