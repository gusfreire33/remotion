import "./index.css";
import { Composition } from "remotion";
import { MeuVideo } from "./MeuVideo";
import { WIDTH, HEIGHT, FPS, DURATION_IN_FRAMES } from "./lib/constants";
import { Reels30 } from "./reels30/Reels30";
import * as Reels30Config from "./reels30/lib/constants";
import { Yt2 } from "./yt2/Yt2";
import * as Yt2Config from "./yt2/lib/constants";

// Each <Composition> is an entry in the sidebar!

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* "Vídeo 2 YT.mp4" — YouTube horizontal, Framework 2 + estilo Bilhon-OS, sem legenda/blur. 476,9s. */}
      <Composition
        id="Yt2"
        component={Yt2}
        durationInFrames={Yt2Config.DURATION_IN_FRAMES}
        fps={Yt2Config.FPS}
        width={Yt2Config.WIDTH}
        height={Yt2Config.HEIGHT}
      />
      {/* Reels 30 Pre editado.mp4 — Framework 2, SEM blur de fundo. 21,5s. */}
      <Composition
        id="Reels30Framework2"
        component={Reels30}
        durationInFrames={Reels30Config.DURATION_IN_FRAMES}
        fps={Reels30Config.FPS}
        width={Reels30Config.WIDTH}
        height={Reels30Config.HEIGHT}
      />
      {/* "VSLL Wonne V4.mp4" — VSL horizontal estilo "Bilhon-OS". 1920x1080@30fps, 270,13s. */}
      <Composition
        id="MeuVideo"
        component={MeuVideo}
        durationInFrames={DURATION_IN_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
    </>
  );
};
