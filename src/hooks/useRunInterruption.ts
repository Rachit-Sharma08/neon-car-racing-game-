/* ---------- LIFECYCLE / INTERRUPTION HOOK (Step 4 split) ----------
   Step 2.5 behaviour, unchanged: auto-pause when the app loses focus or the tab
   hides (never auto-resumes), Android Back button pauses the run instead of
   leaving the page, and fullscreen exit pauses an active run. */
import { useEffect } from 'react';
import type { MutableRefObject } from 'react';

export type GameState = 'title' | 'countdown' | 'playing' | 'gameover';

export type InterruptionConfig = {
  gameStateRef: MutableRefObject<GameState>;
  pausedRef: MutableRefObject<boolean>;
  pauseRunRef: MutableRefObject<() => void>;
  goToMainMenuRef: MutableRefObject<() => void>;
  setFullscreenOn: (on: boolean) => void;
  setShowQuitConfirm: (open: boolean) => void;
};

export function useRunInterruption({
  gameStateRef,
  pausedRef,
  pauseRunRef,
  goToMainMenuRef,
  setFullscreenOn,
  setShowQuitConfirm,
}: InterruptionConfig) {
  useEffect(() => {
    const inRun = () => {
      const st = gameStateRef.current;
      return st === 'playing' || st === 'countdown';
    };

    const onVisibilityChange = () => {
      if (document.hidden && inRun() && !pausedRef.current) {
        pauseRunRef.current();
      }
    };

    const onWindowBlur = () => {
      if (inRun() && !pausedRef.current) {
        pauseRunRef.current();
      }
    };

    const onFullscreenChange = () => {
      const on = !!document.fullscreenElement;
      setFullscreenOn(on);
      try {
        localStorage.setItem('neon_rush_fullscreen', on ? 'true' : 'false');
      } catch {}
      if (!on && inRun() && !pausedRef.current) {
        pauseRunRef.current();
      }
    };

    const onPopState = () => {
      const st = gameStateRef.current;
      if (st === 'playing' || st === 'countdown') {
        if (pausedRef.current) {
          setShowQuitConfirm(true);
        } else {
          try {
            history.pushState({ game: true }, '');
          } catch {}
          pauseRunRef.current();
        }
      } else if (st === 'gameover') {
        goToMainMenuRef.current();
      }
    };

    document.addEventListener('visibilitychange', onVisibilityChange);
    window.addEventListener('blur', onWindowBlur);
    document.addEventListener('fullscreenchange', onFullscreenChange);
    window.addEventListener('popstate', onPopState);
    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange);
      window.removeEventListener('blur', onWindowBlur);
      document.removeEventListener('fullscreenchange', onFullscreenChange);
      window.removeEventListener('popstate', onPopState);
    };
  }, []);
}

export default useRunInterruption;