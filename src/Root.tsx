import "./index.css";
import { Composition } from "remotion";
import { MeuVideo } from "./MeuVideo";
import { WIDTH, HEIGHT, FPS, DURATION_IN_FRAMES } from "./lib/constants";

// Each <Composition> is an entry in the sidebar!

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* "Vídeo 18 {RE EDITADO.mp4": fonte 2160x3840@30fps, 63,88s. Design
          1080x1920 @30fps; 4K real sai no render com --scale=2. */}
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
