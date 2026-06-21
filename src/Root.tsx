import "./index.css";
import { Composition } from "remotion";
import { MeuVideo } from "./MeuVideo";

// Each <Composition> is an entry in the sidebar!

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Video baixado hoje: 1080x1920, 30fps, 1m47s (3216 frames) */}
      <Composition
        id="MeuVideo"
        component={MeuVideo}
        durationInFrames={3216}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
