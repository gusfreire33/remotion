// "VSLL Wonne V4.mp4" — VSL horizontal, estilo da referência "Bilhon-OS".
// Fonte 3840x2160 @ 30fps, 270,13s. Proxy 1920x1080 @ 30fps.
// 270,133 × 30 = 8104 frames.
export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;
export const DURATION_IN_FRAMES = 8104;

export const msToFrame = (ms: number): number => Math.round((ms / 1000) * FPS);
export const secToFrame = (s: number): number => Math.round(s * FPS);
