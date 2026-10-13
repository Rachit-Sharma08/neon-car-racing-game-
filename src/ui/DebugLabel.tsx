/* ---------- DEBUG LABEL (Step 4 split) ----------
   TEMP overlay from Step 2.6: shows viewport, orientation and (Step 2.11) the
   live pixel ratio chosen by auto quality. Hidden by setting SHOW_DEBUG = false
   in src/game/viewport.ts. */
import { useEffect, useState } from 'react';
import { SHOW_DEBUG } from '../game/viewport';

export function DebugLabel({ portrait }: { portrait: boolean }) {
  const [, forceUpdate] = useState<number>(0);

  useEffect(() => {
    const update = () => forceUpdate(v => v + 1);
    window.addEventListener('resize', update);
    window.addEventListener('orientationchange', update);
    const interval = window.setInterval(update, 400);
    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('orientationchange', update);
      window.clearInterval(interval);
    };
  }, []);

  if (!SHOW_DEBUG) return null;

  const angle = typeof screen !== 'undefined' && screen.orientation ? screen.orientation.angle : 'n/a';
  // Step 2.11: live pixel ratio set by auto quality (budget value until a run starts).
  const pr = (window as any).__neonPixelRatio;
  const prText = typeof pr === 'number' ? pr.toFixed(2) : '?';

  return (
    <div
      className="absolute bottom-1 left-1 text-[0.625rem] leading-tight text-muted font-body select-none pointer-events-none"
      id="debug-label"
    >
      v2.6 | {window.innerWidth}x{window.innerHeight} | portrait={String(portrait)} | angle={angle} | pr={prText}
    </div>
  );
}

export default DebugLabel;