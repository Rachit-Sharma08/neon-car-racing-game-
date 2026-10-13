/* ---------- ON-SCREEN CONTROLS (Step 4 split) ----------
   Left: steer arrows. Centre: nitro. Right: brake + gas pedals (Step 2.10).
   Each control owns its own pointer handlers, so steer + gas + brake work
   together on a touchscreen (multi-touch safe). */
import { ArrowLeft, ArrowRight, Flame } from 'lucide-react';

export type ControlsProps = {
  gameState: 'title' | 'countdown' | 'playing' | 'gameover';
  boostFuel: number;
  isBoosting: boolean;
  gasHeld: boolean;
  brakeHeld: boolean;
  onSteer: (direction: -1 | 1) => void;
  onBoost: (held: boolean) => void;
  onGas: (held: boolean) => void;
  onBrake: (held: boolean) => void;
};

export function Controls({ gameState, boostFuel, isBoosting, gasHeld, brakeHeld, onSteer, onBoost, onGas, onBrake }: ControlsProps) {
  if (gameState !== 'playing') return null;
  return (
    <div
      key="on-screen-steering-controls"
      className="on-screen-controls absolute inset-x-0 bottom-3 sm:bottom-6 px-3 sm:px-8 flex justify-between items-center pointer-events-none z-10 select-none animate-hud-slide-bottom safe-pad-l safe-pad-r"
      id="on-screen-steering"
    >

      {/* Bottom-left: Left/Right steering arrows (independent pointers) */}
      <div className="flex items-center gap-2 pointer-events-auto">
        <button
          className="arcade-button pointer-events-auto h-13 sm:h-16 px-4 sm:px-6 rounded-ui bg-steel border-edge flex items-center gap-2 text-text cursor-pointer active:scale-95"
          onClick={() => onSteer(-1)}
          title="Steer left (A or left arrow)"
          id="ctrl-steer-left"
        >
          <ArrowLeft className="w-6 h-6 text-secondary" />
          <div className="text-left hidden sm:flex flex-col">
            <span className="text-xs font-bold font-display">Left</span>
            <span className="text-[0.625rem] text-muted">A / Left</span>
          </div>
        </button>
        <button
          className="arcade-button pointer-events-auto h-13 sm:h-16 px-4 sm:px-6 rounded-ui bg-steel border-edge flex items-center gap-2 text-text cursor-pointer active:scale-95"
          onClick={() => onSteer(1)}
          title="Steer right (D or right arrow)"
          id="ctrl-steer-right"
        >
          <div className="text-right hidden sm:flex flex-col">
            <span className="text-xs font-bold font-display">Right</span>
            <span className="text-[0.625rem] text-muted">D / Right</span>
          </div>
          <ArrowRight className="w-6 h-6 text-secondary" />
        </button>
      </div>

      {/* Nitro Boost Button */}
      <button
        className={`arcade-button pointer-events-auto relative overflow-hidden h-14 sm:h-16 px-5 sm:px-10 rounded-ui flex items-center gap-2 sm:gap-3 cursor-pointer select-none active:scale-95 ${
          isBoosting
            ? 'bg-primary border-primary text-asphalt'
            : boostFuel > 15
              ? 'bg-steel border-edge text-text'
              : 'bg-steel border-edge text-muted'
        }`}
        onPointerDown={() => onBoost(true)}
        onPointerUp={() => onBoost(false)}
        onPointerLeave={() => onBoost(false)}
        onPointerCancel={() => onBoost(false)}
        onTouchStart={(e) => { e.preventDefault(); onBoost(true); }}
        onTouchEnd={(e) => { e.preventDefault(); onBoost(false); }}
        title="Hold for nitro speed boost (Shift)"
        id="ctrl-nitro-boost"
      >
        {/* Fuel gauge fill inside button */}
        <div
          className="absolute inset-y-0 left-0 bg-secondary/40 pointer-events-none transition-all duration-150"
          style={{ width: `${boostFuel}%` }}
        ></div>

        <Flame className={`w-6 h-6 sm:w-7 sm:h-7 relative z-10 ${isBoosting ? 'text-asphalt' : 'text-primary'}`} />
        <div className="text-left relative z-10 flex flex-col">
          <span className="text-xs sm:text-sm font-bold font-display">
            {isBoosting ? 'Boosting' : 'Nitro'}
          </span>
          <span className="text-[0.625rem] text-muted">
            Hold Shift ({boostFuel}%)
          </span>
        </div>
      </button>

      {/* Bottom-right: Brake + Gas pedals (independent pointers, multi-touch safe) */}
      <div className="flex items-center gap-2 pointer-events-auto">
        <button
          className={`arcade-button pointer-events-auto h-13 sm:h-16 px-4 sm:px-6 rounded-ui border-edge flex items-center gap-2 cursor-pointer select-none active:scale-95 ${
            brakeHeld ? 'bg-danger border-danger text-asphalt' : 'bg-steel text-text'
          }`}
          onPointerDown={(e) => { e.preventDefault(); onBrake(true); }}
          onPointerUp={() => onBrake(false)}
          onPointerLeave={() => onBrake(false)}
          onPointerCancel={() => onBrake(false)}
          onTouchStart={(e) => { e.preventDefault(); onBrake(true); }}
          onTouchEnd={(e) => { e.preventDefault(); onBrake(false); }}
          title="Brake (S or Space)"
          id="ctrl-brake-pedal"
        >
          <div className="text-left flex flex-col">
            <span className="text-xs font-bold font-display">Brake</span>
            <span className="text-[0.625rem] opacity-70">S / Space</span>
          </div>
        </button>
        <button
          className={`arcade-button pointer-events-auto h-13 sm:h-16 px-4 sm:px-6 rounded-ui border-edge flex items-center gap-2 cursor-pointer select-none active:scale-95 ${
            gasHeld ? 'bg-go border-go text-asphalt' : 'bg-steel text-text'
          }`}
          onPointerDown={(e) => { e.preventDefault(); onGas(true); }}
          onPointerUp={() => onGas(false)}
          onPointerLeave={() => onGas(false)}
          onPointerCancel={() => onGas(false)}
          onTouchStart={(e) => { e.preventDefault(); onGas(true); }}
          onTouchEnd={(e) => { e.preventDefault(); onGas(false); }}
          title="Gas (W or up arrow)"
          id="ctrl-gas-pedal"
        >
          <div className="text-left flex flex-col">
            <span className="text-xs font-bold font-display">Gas</span>
            <span className="text-[0.625rem] opacity-70">W / Up</span>
          </div>
        </button>
      </div>
    </div>
  );
}

export default Controls;