import { useEffect } from "react";

const LERP_SPEED = 0.14;
const LERP_DONE = 0.02;

export function useScrollSyncedVideo(videoRef) {
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return undefined;

    let rafId = null;
    let scrollBound = false;

    function getTargetTime() {
      if (!video.duration || Number.isNaN(video.duration)) return null;
      const loopProgress = (window.scrollY / window.innerHeight) % 1;
      const normalizedProgress = loopProgress < 0 ? loopProgress + 1 : loopProgress;
      return normalizedProgress * video.duration;
    }

    function lerpVideoTime() {
      const target = getTargetTime();
      if (target == null) return false;

      const { duration } = video;
      let diff = target - video.currentTime;
      if (Math.abs(diff) > duration * 0.5) {
        diff += diff > 0 ? -duration : duration;
      }

      if (Math.abs(diff) < LERP_DONE) {
        video.currentTime = target;
        return false;
      }

      video.currentTime = Math.min(
        Math.max(video.currentTime + diff * LERP_SPEED, 0),
        duration - 0.001,
      );
      return true;
    }

    function onScroll() {
      if (rafId != null) return;
      rafId = window.requestAnimationFrame(function tick() {
        rafId = null;
        if (lerpVideoTime()) {
          rafId = window.requestAnimationFrame(tick);
        }
      });
    }

    function bindScroll() {
      if (scrollBound) return;
      scrollBound = true;
      const target = getTargetTime();
      if (target != null) video.currentTime = target;
      window.addEventListener("scroll", onScroll, { passive: true });
      onScroll();
    }

    video.pause();
    video.addEventListener("loadedmetadata", bindScroll);
    video.addEventListener("canplay", bindScroll);
    if (video.readyState >= 2) bindScroll();

    return () => {
      video.removeEventListener("loadedmetadata", bindScroll);
      video.removeEventListener("canplay", bindScroll);
      window.removeEventListener("scroll", onScroll);
      if (rafId != null) window.cancelAnimationFrame(rafId);
    };
  }, [videoRef]);
}
