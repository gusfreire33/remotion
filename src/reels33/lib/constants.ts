// "Reels 33 PRE DITADO.mp4": 2160×3840, 1356 frames, 30fps, 45.200s.
export const WIDTH = 1080;
export const HEIGHT = 1920;
export const FPS = 30;
export const DURATION_IN_FRAMES = 1356;
export const frameAt = (seconds: number): number => Math.round(seconds * FPS);
export const ASSET = "reels33/";
// Pedido do dono (12/09/2026): SEM desfoque de fundo nos Reels 32–35.
export const BACKGROUND_BLUR_PX = 0;
