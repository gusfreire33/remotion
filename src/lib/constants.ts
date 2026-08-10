// "Vídeo 18 {RE EDITADO.mp4": fonte 2160x3840 @ 30fps, 63,88s. Espaço de design
// mantido em 1080x1920 (todo o código de overlays/legendas usa essas
// coordenadas); o 4K real (2160x3840) sai no render via `--scale=2`.
export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;
// ceil(63.88s * 30fps) = 1917
export const DURATION_IN_FRAMES = 1917;

export const msToFrame = (ms: number): number => Math.round((ms / 1000) * FPS);
export const secToFrame = (s: number): number => Math.round(s * FPS);
