import "./index.css";
import { Composition } from "remotion";
import { MeuVideo } from "./MeuVideo";
import { WIDTH, HEIGHT, FPS, DURATION_IN_FRAMES } from "./lib/constants";

// Each <Composition> is an entry in the sidebar!

export const RemotionRoot: React.FC = () => {
  return (
    <>
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
