export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;
export const DURATION_IN_FRAMES = 3216;

export const msToFrame = (ms: number): number => Math.round((ms / 1000) * FPS);
export const secToFrame = (s: number): number => Math.round(s * FPS);
