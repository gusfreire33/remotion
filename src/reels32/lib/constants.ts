// "Reels 32 PRE EDITADO.mp4": 2160×3840, 1182 frames, 30fps, 39.400s.
export const WIDTH = 1080;
export const HEIGHT = 1920;
export const FPS = 30;
export const DURATION_IN_FRAMES = 1182;
export const frameAt = (seconds: number): number => Math.round(seconds * FPS);
export const ASSET = "reels32/";
// Pedido do dono (12/09/2026): SEM desfoque de fundo nos Reels 32–35.
// O recorte da pessoa só acende nas janelas das palavras-atrás.
export const BACKGROUND_BLUR_PX = 0;
