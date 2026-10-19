import "./index.css";
import { Composition } from "remotion";
import { MeuVideo } from "./MeuVideo";
import { WIDTH, HEIGHT, FPS, DURATION_IN_FRAMES } from "./lib/constants";
import { Reels30 } from "./reels30/Reels30";
import * as Reels30Config from "./reels30/lib/constants";
import { Yt2 } from "./yt2/Yt2";
import { Reels32 } from "./reels32/Reels32";
import * as Reels32Config from "./reels32/lib/constants";
import { Reels33 } from "./reels33/Reels33";
import * as Reels33Config from "./reels33/lib/constants";
import { Reels34 } from "./reels34/Reels34";
import * as Reels34Config from "./reels34/lib/constants";
import { Reels35 } from "./reels35/Reels35";
import * as Reels35Config from "./reels35/lib/constants";
import * as Yt2Config from "./yt2/lib/constants";
import { WonneMaxVSL } from "./wmvsl/WonneMaxVSL";
import * as WmvslConfig from "./wmvsl/lib/sync";

// Each <Composition> is an entry in the sidebar!

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* "VSL Wonne Max" — 100% IA: copy do squad + narração ElevenLabs + motion design
          das telas do Wonne Max. Framework 2 adaptado (sem apresentador). 1920x1080@30. */}
      <Composition
        id="WonneMaxVSL"
        component={WonneMaxVSL}
        durationInFrames={WmvslConfig.DURATION_IN_FRAMES}
        fps={WmvslConfig.FPS}
        width={WmvslConfig.WIDTH}
        height={WmvslConfig.HEIGHT}
        defaultProps={{ noCaptions: false }}
      />
      {/* "Vídeo 2 YT.mp4" — YouTube horizontal, Framework 2 + estilo Bilhon-OS, sem legenda/blur. 476,9s. */}
      <Composition
        id="Yt2"
        component={Yt2}
        durationInFrames={Yt2Config.DURATION_IN_FRAMES}
        fps={Yt2Config.FPS}
        width={Yt2Config.WIDTH}
        height={Yt2Config.HEIGHT}
      />
      {/* "Reels 35 PRE EDITADO.mp4" — Framework 2, SEM blur de fundo. 41,9s. */}
      <Composition
        id="Reels35"
        component={Reels35}
        durationInFrames={Reels35Config.DURATION_IN_FRAMES}
        fps={Reels35Config.FPS}
        width={Reels35Config.WIDTH}
        height={Reels35Config.HEIGHT}
      />
      {/* "Reels 34 PRE EDITADO.mp4" — Framework 2, SEM blur de fundo. 54,2s. */}
      <Composition
        id="Reels34"
        component={Reels34}
        durationInFrames={Reels34Config.DURATION_IN_FRAMES}
        fps={Reels34Config.FPS}
        width={Reels34Config.WIDTH}
        height={Reels34Config.HEIGHT}
      />
      {/* "Reels 33 PRE DITADO.mp4" — Framework 2, SEM blur de fundo. 45,2s. */}
      <Composition
        id="Reels33"
        component={Reels33}
        durationInFrames={Reels33Config.DURATION_IN_FRAMES}
        fps={Reels33Config.FPS}
        width={Reels33Config.WIDTH}
        height={Reels33Config.HEIGHT}
      />
      {/* "Reels 32 PRE EDITADO.mp4" — Framework 2, SEM blur de fundo. 39,4s. */}
      <Composition
        id="Reels32"
        component={Reels32}
        durationInFrames={Reels32Config.DURATION_IN_FRAMES}
        fps={Reels32Config.FPS}
        width={Reels32Config.WIDTH}
        height={Reels32Config.HEIGHT}
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
