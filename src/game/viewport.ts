
/* ---------- VIEWPORT HELPERS (Step 4 split) ----------
   Orientation detection, the camera-FOV-by-aspect rule and the pixel-ratio
   budget. Pure helpers plus one hook: no React screens live here. */
import { useEffect, useState } from 'react';

/* ---------- ORIENTATION (Step 2.6: landscape-only app) ---------- */

// TEMP (Step 2.6): set to false to remove the debug label from every screen.
export const SHOW_DEBUG = true;

/**
 * True when the viewport is portrait.
 *
 * Android Chrome still reports the pre-rotation innerWidth/innerHeight right
 * after orientationchange, so the size is re-read twice on every event: once
 * immediately and once more after a short delay, and the latest value wins.
 */
export function useIsPortrait(): boolean {
  const [isPortrait, setIsPortrait] = useState<boolean>(() =>
    typeof window === 'undefined' ? false : window.innerHeight > window.innerWidth
  );

  useEffect(() => {
    let refreshTimer: number | undefined;

    const read = () => {
      setIsPortrait(window.innerHeight > window.innerWidth);
      if (refreshTimer) window.clearTimeout(refreshTimer);
      refreshTimer = window.setTimeout(() => {
        refreshTimer = undefined;
        setIsPortrait(window.innerHeight > window.innerWidth);
      }, 300);
    };

    const portraitQuery = window.matchMedia('(orientation: portrait)');
    const viewport = window.visualViewport;

    read();
    window.addEventListener('resize', read);
    window.addEventListener('orientationchange', read);
    portraitQuery.addEventListener('change', read);
    if (viewport) viewport.addEventListener('resize', read);

    return () => {
      if (refreshTimer) window.clearTimeout(refreshTimer);
      window.removeEventListener('resize', read);
      window.removeEventListener('orientationchange', read);
      portraitQuery.removeEventListener('change', read);
      if (viewport) viewport.removeEventListener('resize', read);
    };
  }, []);

  return isPortrait;
}

/* ---------- CAMERA FOV BY ASPECT (Step 2.8) ----------
   What decides how much road fits left/right is the HORIZONTAL fov, so we keep
   that constant and derive the vertical fov from the current aspect ratio. The
   constant is the horizontal fov implied by the old fixed 72deg vertical at 16:9,
   so 16:9 looks exactly like before and other ratios keep the same road width. */
const BASE_HORIZONTAL_FOV = 2 * Math.atan(Math.tan((72 * Math.PI / 180) / 2) * (16 / 9)) * 180 / Math.PI;
const MIN_VERTICAL_FOV = 40;
const MAX_VERTICAL_FOV = 90;

export function verticalFovForAspect(aspect: number): number {
  const halfHorizontal = (BASE_HORIZONTAL_FOV * Math.PI / 180) / 2;
  const vertical = 2 * Math.atan(Math.tan(halfHorizontal) / Math.max(0.1, aspect)) * 180 / Math.PI;
  return Math.min(MAX_VERTICAL_FOV, Math.max(MIN_VERTICAL_FOV, vertical));
}

/* ---------- PIXEL RATIO BUDGET (Step 2.8) ----------
   Caps the device pixel ratio per device type and also keeps the total number of
   rendered pixels under a budget, so 4K panels do not try to fill 8M+ pixels. */
export function getPixelRatio(width: number, height: number): number {
  const coarse =
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(pointer: coarse)').matches;

  const base = coarse ? 1.5 : 2;
  const pixelBudget = coarse ? 2500000 : 5000000;
  const area = Math.max(1, width * height);
  const byBudget = Math.sqrt(pixelBudget / area);

  return Math.max(0.75, Math.min(base, byBudget));
}
