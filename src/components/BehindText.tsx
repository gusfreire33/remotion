import {
  AbsoluteFill,
  Easing,
  interpolate,
  Sequence,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { BEHIND_WORDS, type BehindWord } from "../lib/behind";
import { ANTON } from "../lib/fonts";
import { COLORS } from "../lib/theme";
import { secToFrame } from "../lib/constants";

const EASE = Easing.inOut(Easing.ease);

/**
 * Uma palavra marcante em tipografia gigante. Vai numa camada ENTRE o vídeo
 * base e o recorte da pessoa — quem assiste vê o texto passar por trás dele.
 *
 * A entrada é a mesma gramática do Captions: sobe com mola + abre o tracking
 * (letter-spacing) e sai encolhendo de leve.
 */
const Word: React.FC<{ word: BehindWord; durationInFrames: number }> = ({
  word,
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({
    frame,
    fps,
    config: { damping: 16, mass: 0.7, stiffness: 150 },
  });

  // saída: some nos últimos 8 frames (o corte fica limpo)
  const exit = interpolate(
    frame,
    [durationInFrames - 8, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE },
  );

  const y = interpolate(enter, [0, 1], [70, 0]);
  const scale = interpolate(enter, [0, 1], [0.82, 1]);
  const track = interpolate(enter, [0, 1], [40, 2]);
  const size = word.size ?? 190;
  const color = word.color ?? COLORS.white;
  const outline = word.style === "outline";

  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: "flex-start",
        paddingTop: word.top ?? 380,
        opacity: Math.min(1, enter * 1.6) * exit,
      }}
    >
      <div
        style={{
          fontFamily: ANTON,
          fontSize: size,
          lineHeight: 0.92,
          textAlign: "center",
          whiteSpace: "pre-line",
          letterSpacing: track,
          transform: `translateY(${y}px) scale(${scale}) rotate(${word.rotate ?? 0}deg)`,
          color: outline ? "transparent" : color,
          WebkitTextStrokeWidth: outline ? 7 : 0,
          WebkitTextStrokeColor: color,
          // sombra ampla e suave: descola o texto do fundo sem virar contorno
          textShadow: outline ? "none" : "0 24px 70px rgba(0,0,0,0.55)",
        }}
      >
        {word.text}
      </div>
    </AbsoluteFill>
  );
};

export const BehindText: React.FC = () => (
  <Sequence name="TEXTO ATRAS DA PESSOA" layout="none">
    {BEHIND_WORDS.map((w) => {
      const dur = secToFrame(w.to - w.from);
      return (
        <Sequence
          key={`${w.text}-${w.from}`}
          from={secToFrame(w.from)}
          durationInFrames={dur}
          name={`atras:${w.text.replace("\n", " ")}`}
        >
          <Word word={w} durationInFrames={dur} />
        </Sequence>
      );
    })}
  </Sequence>
);
