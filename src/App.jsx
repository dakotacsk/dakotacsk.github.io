import { useRef } from "react";
import { BentoGrid } from "./components/BentoGrid.jsx";
import { Hero } from "./components/Hero.jsx";
import { Nav } from "./components/Nav.jsx";
import { useRevealCards } from "./hooks/useRevealCards.js";
import { useScrollSyncedVideo } from "./hooks/useScrollSyncedVideo.js";
import blobVideo from "../blob-moving-bg.mp4";

function App() {
  const videoRef = useRef(null);
  useScrollSyncedVideo(videoRef);
  useRevealCards();

  return (
    <>
      <video
        ref={videoRef}
        id="scroll-bg-video"
        className="scroll-bg-video"
        muted
        playsInline
        preload="metadata"
      >
        <source src={blobVideo} type="video/mp4" />
      </video>

      <div className="container">
        <Nav />
        <Hero />
        <BentoGrid />
      </div>
    </>
  );
}

export default App;
