// "Vídeo 2 YT.mp4" — YouTube horizontal, Framework 2 adaptado ao estilo
// "Bilhon-OS" (sem legenda, sem blur de fundo, mais B-roll horizontal).
// Fonte 3840x2160 @ 30fps, 476,87s. Proxy 1920x1080 (public/yt2_1080.mp4).
// 476,867 × 30 = 14306,0 → 14306 frames.
export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;
export const DURATION_IN_FRAMES = 14306;

export const VIDEO_SRC = "yt2_1080.mp4";
export const MATTE_SRC = "yt2_matte.webm";

export const secToFrame = (s: number): number => Math.round(s * FPS);
