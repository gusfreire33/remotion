// "Reels 35 PRE EDITADO.mp4": 2160×3840, 1258 frames, 30fps, 41.933s.
export const WIDTH = 1080;
export const HEIGHT = 1920;
export const FPS = 30;
// A fonte pré-editada faz fade pra preto de 41,45s a 41,67s. Fechamos em 41,73s (1252 f):
// termina no fim do fade, sem segurar tela preta.
export const DURATION_IN_FRAMES = 1252;
export const frameAt = (seconds: number): number => Math.round(seconds * FPS);
export const ASSET = "reels35/";
// Pedido do dono (12/09/2026): SEM desfoque de fundo nos Reels 32–35.
export const BACKGROUND_BLUR_PX = 0;
