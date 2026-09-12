// Reels 30 Pre editado.mp4: 2160×3840, 645 frames, 30fps, 21.500s.
export const WIDTH = 1080;
export const HEIGHT = 1920;
export const FPS = 30;
export const DURATION_IN_FRAMES = 645;
export const frameAt = (seconds: number): number => Math.round(seconds * FPS);
export const ASSET = "reels30/";
// Explicit request from the owner: no background defocus. Motion blur is
// confined to animated graphics and the five-frame transition accents.
export const BACKGROUND_BLUR_PX = 0;
