/**
 * TRILHA DE FUNDO — sintetizada por `scripts/make-music.cjs` (public/music/bed.m4a).
 *
 * Estilo da referência: pad cinematográfico de tensão + sub-grave, sem
 * batida. A curva "hook cheio → miolo mais baixo → sobe no fim" já está
 * dentro do arquivo; aqui só entra o volume geral, MEDIDO com
 * `scripts/measure-audio.py` (ver SoundFX.tsx pra leitura).
 */
import { Audio, staticFile } from "remotion";

export const MUSIC_VOLUME = 0.22;

export const Music: React.FC = () => (
  <Audio src={staticFile("music/bed.m4a")} volume={MUSIC_VOLUME} />
);
