/* ---------- HOW TO PLAY + ROTATE + WEBGL FALLBACK (Step 4 split) ----------
   Static overlays with no game logic. The rotate screen is rendered last by App
   so it covers every other screen in portrait. */
import { Cpu, Compass, Flame, HelpCircle, Play, RotateCcw, X } from 'lucide-react';
import { DebugLabel } from './DebugLabel';

export type HowToPlayOverlayProps = {
  onClose: () => void;
};

export function HowToPlayOverlay({ onClose }: HowToPlayOverlayProps) {
  return (
    <div className="fixed inset-0 z-50 bg-asphalt/95 flex items-center justify-center p-4">
      <div className="arcade-panel max-w-lg w-full p-6 text-text relative max-h-[90vh] overflow-y-auto animate-fade-in">
        {/* Close button */}
        <button
          onClick={onClose}
          className="arcade-button absolute top-4 right-4 w-12 h-12 flex items-center justify-center bg-steel border-edge text-muted cursor-pointer"
          title="Close guide"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 mb-2 text-text">
          <HelpCircle className="w-6 h-6 text-secondary" />
          <h2 className="text-xl font-bold font-display">How to play</h2>
        </div>
        <p className="text-xs text-muted font-body border-b border-edge pb-3">
          Neon Rush 3D is a highway traffic racer. Switch lanes and manage nitro to survive:
        </p>

        <div className="space-y-3.5 mt-4 text-xs font-body">
          {/* Concept */}
          <div className="p-3.5 rounded-ui bg-steel border border-edge">
            <div className="text-sm font-bold text-text font-display mb-1 flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-secondary" /> 1. Game concept
            </div>
            <p className="text-muted leading-relaxed">
              Drive your racer along a highway that cycles through coastal roads, countryside and city streets. <strong className="text-text">Traffic appears right from the start.</strong> Dodge cars moving at different speeds to cover the most distance without crashing.
            </p>
          </div>

          {/* Controls */}
          <div className="p-3.5 rounded-ui bg-steel border border-edge">
            <div className="text-sm font-bold text-text font-display mb-1 flex items-center gap-1.5">
              <Play className="w-4 h-4 text-primary" /> 2. Controls
            </div>
            <ul className="space-y-2 text-muted mt-2">
              <li className="flex items-center justify-between text-xs">
                <span className="text-text">Steer left / right:</span>
                <span className="text-secondary bg-asphalt px-2.5 py-1 rounded-ui border border-edge font-bold">A / D or ← / →</span>
              </li>
              <li className="flex items-center justify-between text-xs">
                <span className="text-text">Gas:</span>
                <span className="text-text bg-asphalt px-2.5 py-1 rounded-ui border border-edge font-bold">Hold W / ↑ or the Gas pedal</span>
              </li>
              <li className="flex items-center justify-between text-xs">
                <span className="text-text">Brake:</span>
                <span className="text-text bg-asphalt px-2.5 py-1 rounded-ui border border-edge font-bold">Hold S / Space or the Brake pedal</span>
              </li>
              <li className="flex items-center justify-between text-xs">
                <span className="text-text">Nitro boost:</span>
                <span className="text-primary bg-asphalt px-2.5 py-1 rounded-ui border border-edge font-bold">Hold Shift or the Nitro button</span>
              </li>
              <li className="flex items-center justify-between text-xs">
                <span className="text-text">Pause / resume:</span>
                <span className="text-text bg-asphalt px-2.5 py-1 rounded-ui border border-edge">P key</span>
              </li>
              <li className="flex items-center justify-between text-xs">
                <span className="text-text">Touch controls:</span>
                <span className="text-text bg-asphalt px-2.5 py-1 rounded-ui border border-edge">On-screen buttons</span>
              </li>
            </ul>
          </div>

          {/* Boost Mechanic */}
          <div className="p-3.5 rounded-ui bg-steel border border-edge">
            <div className="text-sm font-bold text-text font-display mb-1 flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-primary" /> 3. Nitro boost
            </div>
            <p className="text-muted leading-relaxed">
              Hold down <strong className="text-text">Shift or the Nitro button</strong> to use nitro overdrive. You earn a <strong className="text-text">+80% score multiplier</strong>. Release it and the tank refills over time.
            </p>
          </div>

          {/* Vehicles */}
          <div className="p-3.5 rounded-ui bg-steel border border-edge">
            <div className="text-sm font-bold text-text font-display mb-1 flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-secondary" /> 4. Choose your car
            </div>
            <p className="text-muted leading-relaxed">
              Pick from 4 cars in the <strong className="text-text">Garage</strong>:
            </p>
            <div className="grid grid-cols-2 gap-2 mt-2 text-[0.6875rem]">
              <div className="p-2 bg-asphalt rounded-ui border border-edge">
                <strong className="text-text">VX-Titan:</strong> <span className="text-muted">Heavy armour, high stability</span>
              </div>
              <div className="p-2 bg-asphalt rounded-ui border border-edge">
                <strong className="text-text">Neon-Blade:</strong> <span className="text-muted">Extreme top speed</span>
              </div>
              <div className="p-2 bg-asphalt rounded-ui border border-edge">
                <strong className="text-text">Cyber-Glide:</strong> <span className="text-muted">Quick lane changes</span>
              </div>
              <div className="p-2 bg-asphalt rounded-ui border border-edge">
                <strong className="text-text">Retro coupe:</strong> <span className="text-muted">Street classic, good drift</span>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="arcade-button mt-5 w-full py-3.5 bg-primary text-asphalt font-bold rounded-ui font-display text-sm cursor-pointer flex items-center justify-center gap-2"
        >
          <Play className="w-4 h-4 fill-current" /> Ready
        </button>
      </div>
    </div>
  );
}

/** Step 2.6: portrait-only full-screen rotate prompt. */
export function RotateOverlay({ portrait }: { portrait: boolean }) {
  return (
    <div
      className="absolute inset-0 z-[60] bg-asphalt flex flex-col items-center justify-center text-center p-6 safe-pad-t safe-pad-b"
      id="rotate-overlay"
    >
      <RotateCcw className="w-12 h-12 text-secondary mb-4" />
      <h2 className="text-2xl font-bold font-display text-text">Rotate your phone</h2>
      <p className="text-muted text-sm mt-2 font-body">Neon Rush plays in landscape.</p>
      <DebugLabel portrait={portrait} />
    </div>
  );
}

/** Step 2.8: plain message instead of a blank screen when WebGL is missing. */
export function WebglErrorOverlay() {
  return (
    <div
      className="absolute inset-0 z-[70] bg-asphalt flex flex-col items-center justify-center text-center p-6 safe-pad-t safe-pad-b"
      id="webgl-error-overlay"
    >
      <h2 className="text-2xl font-bold font-display text-text">Game cannot start</h2>
      <p className="text-muted text-sm mt-2 font-body max-w-sm">
        This device cannot run the game: WebGL is not available.
      </p>
    </div>
  );
}

export default HowToPlayOverlay;