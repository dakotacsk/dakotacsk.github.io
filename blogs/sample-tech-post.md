# Building a Scroll-Synced Video Background

One of the fun challenges of this site was getting a video background that moves in sync with your scroll position — not just autoplaying, but actually tied 1:1 to how far you've scrolled.

## The approach

The core idea is simple: pause the video, then on every scroll event, calculate what time in the video corresponds to the current scroll position. But doing this naively creates janky, stuttery movement.

## Smooth interpolation

The trick is **lerp** (linear interpolation). Instead of jumping directly to the target time, we ease toward it frame by frame using `requestAnimationFrame`. This creates that buttery-smooth feeling where the video feels physically connected to your scroll.

```javascript
function lerpVideoTime() {
  const target = getScrollTargetTime();
  let diff = target - current;
  scrollBgVideo.currentTime = current + diff * LERP_SPEED;
}
```

## Looping

To make the video loop seamlessly, I map scroll position modulo one viewport height to the full video duration. So every screen-height of scrolling plays the video once, and it wraps around endlessly.

## Lessons learned

- Always use `muted playsinline preload="metadata"` for autoplay-like behavior
- `mix-blend-mode: multiply` is a lifesaver for blending video with page backgrounds
- Test on a local server — `file://` protocol blocks video manipulation
