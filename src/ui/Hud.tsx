/* ---------- IN-GAME HUD (Step 4 split) ----------
   Top stats bar: pause + distance on the left, nitro status in the middle,
   score + speed on the right. Pure presentational: no game logic, no refs. */
import { Compass, Flame, Pause, Play, Trophy } from 'lucide-react';

export type HudProps = {
  gameState: 'title' | 'countdown' | 'playing' | 'gameover';
  score: number;
  speed: number;
  paused: boolean;
  boostFuel: number;
  isBoosting: boolean;
  onTogglePause: () => void;
};

export function Hud({ gameState, score, speed, paused, boostFuel, isBoosting, onTogglePause }: HudProps) {
  return (
    <div className={`absolute inset-x-0 top-0 p-3 sm:p-5 pointer-events-none flex flex-col gap-3 font-body transition-all duration-300 safe-pad-l safe-pad-r ${gameState === 'playing' ? 'opacity-100' : 'opacity-0'}`}>

      {/* Top Row: Distance & Pause, Center Nitro Status, Right: Speed & Score */}
      <div className="flex justify-between items-start w-full">
        {/* Distance & Pause */}
        <div
          key={gameState === 'playing' ? 'hud-score-active' : 'hud-score-idle'}
          className={`flex items-center gap-2 sm:gap-3 pointer-events-auto ${gameState === 'playing' ? 'animate-hud-slide-left' : ''}`}
          id="hud-score-display"
        >
          <button
            onClick={onTogglePause}
            className="arcade-button w-12 h-12 sm:w-12 sm:h-12 bg-steel border-edge text-text transition-all flex items-center justify-center cursor-pointer active:scale-95"
            title={paused ? "Resume Drive (P)" : "Pause Drive (P)"}
            id="hud-pause-btn"
          >
            {paused ? <Play className="w-5 h-5 fill-current" /> : <Pause className="w-5 h-5 fill-current" />}
          </button>
          <div className={`arcade-panel px-3 py-1.5 flex flex-col justify-center ${score % 100 < 15 && score > 20 ? 'animate-hud-vibrate-subtle' : ''}`}>
            <div className="text-[0.625rem] text-muted font-semibold flex items-center gap-1">
              <Compass className="w-3 h-3 text-secondary" /> Distance
            </div>
            <div className="hud-number text-xl sm:text-2xl font-bold text-text leading-none mt-0.5">
              {score} <span className="text-xs font-bold text-muted">m</span>
            </div>
          </div>
        </div>

        {/* Center: Live Nitro Status / Overdrive indicator */}
        <div
          key={gameState === 'playing' ? 'hud-nitro-active' : 'hud-nitro-idle'}
          className={`hidden sm:flex flex-col items-center ${gameState === 'playing' ? 'animate-hud-slide-top' : ''}`}
        >
          <div className={`arcade-panel px-3 py-1.5 text-xs font-semibold transition-all flex items-center gap-2 ${
            isBoosting
              ? 'bg-primary border-primary text-asphalt'
              : boostFuel > 20
                ? 'text-secondary'
                : 'text-muted'
          }`}>
            <Flame className={`w-4 h-4 ${isBoosting ? 'text-asphalt' : 'text-primary'}`} />
            <span>{isBoosting ? 'Nitro active (+80% score)' : `Nitro fuel: ${boostFuel}% (hold Shift)`}</span>
          </div>
        </div>

        {/* Right: Speed & Score with subtle vibrating / pulsing animations */}
        <div
          key={gameState === 'playing' ? 'hud-speed-active' : 'hud-speed-idle'}
          className={`${gameState === 'playing' ? 'animate-hud-slide-right' : ''}`}
        >
          <div
            className={`arcade-panel flex flex-col items-end px-3 sm:px-4 py-2 pointer-events-auto ${Math.round(speed * 6.5) > 180 ? 'animate-hud-vibrate-subtle' : ''}`}
            id="hud-speed-display"
          >
            {/* Header Score Display */}
            <div className="flex items-center justify-between w-full gap-3 pb-1 border-b border-edge mb-1">
              <div className="text-[0.625rem] text-muted font-semibold flex items-center gap-1">
                <Trophy className="w-3 h-3 text-primary" /> Score
              </div>
              <div className="hud-number text-sm sm:text-base font-bold text-text leading-none font-display">
                {Math.round(score * 12.5).toLocaleString()}
              </div>
            </div>

            <div className="hud-number text-2xl sm:text-3xl font-bold text-speed font-display leading-none">
              {Math.round(speed * 6.5)} <span className="text-xs font-body text-muted">km/h</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hud;