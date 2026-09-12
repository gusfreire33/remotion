// "Reels 34 PRE EDITADO.mp4": 2160×3840, 1627 frames, 30fps, 54.233s.
export const WIDTH = 1080;
export const HEIGHT = 1920;
export const FPS = 30;
export const DURATION_IN_FRAMES = 1627;
export const frameAt = (seconds: number): number => Math.round(seconds * FPS);
export const ASSET = "reels34/";
// Pedido do dono (12/09/2026): SEM desfoque de fundo nos Reels 32–35.
export const BACKGROUND_BLUR_PX = 0;
