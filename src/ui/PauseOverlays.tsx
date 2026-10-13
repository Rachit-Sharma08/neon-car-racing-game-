/* ---------- COUNTDOWN + PAUSE OVERLAYS (Step 4 split) ----------
   Both are pure presentational: they receive the current values and a few
   callbacks, and render the same markup as before. No game logic here. */
import { HelpCircle, Home, Maximize, Minimize, Play, RotateCcw } from 'lucide-react';

export type CountdownOverlayProps = {
  countdownVal: '3' | '2' | '1' | 'GO!' | '';
  countdownSubtext: string;
};

export function CountdownOverlay({ countdownVal, countdownSubtext }: CountdownOverlayProps) {
  return (
    <div className="absolute inset-0 bg-asphalt/85 flex flex-col items-center justify-center pointer-events-none z-30 select-none animate-fade-in" id="starting-countdown-overlay">
      {/* 3-Gantry Starting Lights */}
      <div className="arcade-panel flex items-center gap-4 px-6 py-3 mb-6">
        {/* Light 1: Red / Ready */}
        <div className={`w-7 h-7 sm:w-9 sm:h-9 rounded-full border-2 transition-all duration-200 ${
          countdownVal === '3' || countdownVal === '2' || countdownVal === '1' || countdownVal === 'GO!'
            ? 'bg-danger border-danger animate-beacon-glow'
            : 'bg-steel border-edge opacity-40'
        }`}></div>

        {/* Light 2: Amber / Set */}
        <div className={`w-7 h-7 sm:w-9 sm:h-9 rounded-full border-2 transition-all duration-200 ${
          countdownVal === '2' || countdownVal === '1' || countdownVal === 'GO!'
            ? 'bg-primary border-primary animate-beacon-glow'
            : 'bg-steel border-edge opacity-40'
        }`}></div>

        {/* Light 3: Green / Go */}
        <div className={`w-7 h-7 sm:w-9 sm:h-9 rounded-full border-2 transition-all duration-200 ${
          countdownVal === '1' || countdownVal === 'GO!'
            ? 'bg-go border-go animate-beacon-glow'
            : 'bg-steel border-edge opacity-40'
        }`}></div>
      </div>

      {/* Big Animated Countdown Digits */}
      <div key={countdownVal} className="flex flex-col items-center animate-countdown-pop">
        <div className={`hud-number text-8xl sm:text-9xl font-bold font-display ${
          countdownVal === 'GO!'
            ? 'text-go'
            : countdownVal === '1'
              ? 'text-primary'
              : countdownVal === '2'
                ? 'text-secondary'
                : 'text-text'
        }`}>
          {countdownVal}
        </div>
        <div className="mt-2 text-lg sm:text-2xl font-bold font-display text-text">
          {countdownSubtext}
        </div>
      </div>

      {/* Quick Reminder */}
      <div className="mt-8 px-5 py-2.5 rounded-ui bg-asphalt border border-edge text-muted text-xs flex items-center gap-3">
        <span>Steer: <strong className="text-text">A / D or ← / →</strong></span>
        <span className="text-edge">•</span>
        <span>Gas: <strong className="text-text">W / ↑</strong></span>
        <span className="text-edge">•</span>
        <span>Brake: <strong className="text-text">S / Space</strong></span>
        <span className="text-edge">•</span>
        <span>Nitro: <strong className="text-text">Shift</strong></span>
      </div>
    </div>
  );
}

export type PauseOverlayProps = {
  score: number;
  speed: number;
  autoGas: boolean;
  canFullscreen: boolean;
  fullscreenOn: boolean;
  onResume: () => void;
  onRestart: () => void;
  onToggleFullscreen: () => void;
  onQuit: () => void;
  onOpenHelp: () => void;
  onToggleAutoGas: () => void;
};

export function PauseOverlay({
  score,
  speed,
  autoGas,
  canFullscreen,
  fullscreenOn,
  onResume,
  onRestart,
  onToggleFullscreen,
  onQuit,
  onOpenHelp,
  onToggleAutoGas,
}: PauseOverlayProps) {
  return (
    <div className="absolute inset-0 bg-asphalt/90 flex flex-col items-center justify-center p-6 text-center z-20 pointer-events-auto safe-pad-l safe-pad-r" id="paused-screen-overlay">
      <div className="arcade-panel max-w-md w-full animate-fade-in p-6 max-h-[92vh] overflow-y-auto">
        <h2 className="text-4xl sm:text-5xl font-bold text-text font-display">
          Paused
        </h2>
        <p className="mt-1 text-muted text-sm font-semibold font-body">
          Engine idling
        </p>

        <div className="mt-5 grid grid-cols-2 gap-3 text-center">
          <div className="p-3 rounded-ui bg-asphalt border border-edge">
            <div className="text-xs text-muted font-semibold">Distance</div>
            <div className="hud-number text-xl font-bold text-text font-display">{score} m</div>
          </div>
          <div className="p-3 rounded-ui bg-asphalt border border-edge">
            <div className="text-xs text-muted font-semibold">Speed</div>
            <div className="hud-number text-xl font-bold text-speed font-display">{Math.round(speed * 6.5)} km/h</div>
          </div>
        </div>

        <button
          onClick={onToggleAutoGas}
          className="arcade-button mt-4 w-full px-4 py-2.5 bg-steel text-text font-semibold cursor-pointer text-sm font-body flex items-center justify-between"
          id="setting-autogas"
          title="ON: the car speeds up on its own. OFF: hold Gas to speed up."
        >
          <span>Auto gas</span>
          <span className={`text-xs font-bold px-2.5 py-1 rounded-ui border ${autoGas ? 'bg-go border-go text-asphalt' : 'bg-asphalt border-edge text-muted'}`}>
            {autoGas ? 'ON' : 'OFF'}
          </span>
        </button>

        <div className="mt-5 flex flex-col gap-2.5">
          <button
            onClick={onResume}
            className="arcade-button w-full py-3.5 bg-primary text-asphalt font-bold cursor-pointer text-sm font-display flex items-center justify-center gap-2"
            id="btn-resume"
          >
            <Play className="w-4 h-4 fill-current" /> Resume
          </button>
          <button
            onClick={onRestart}
            className="arcade-button w-full py-3 bg-steel text-text font-semibold cursor-pointer text-sm font-body flex items-center justify-center gap-2"
            id="btn-restart"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Restart
          </button>
          {canFullscreen && (
            <button
              onClick={onToggleFullscreen}
              className="arcade-button w-full py-2.5 bg-steel text-muted font-semibold cursor-pointer text-sm font-body flex items-center justify-center gap-1.5"
              id="btn-fullscreen-pause"
            >
              {fullscreenOn ? <Minimize className="w-3.5 h-3.5" /> : <Maximize className="w-3.5 h-3.5" />}
              {fullscreenOn ? 'Exit fullscreen' : 'Fullscreen'}
            </button>
          )}
          <button
            onClick={onQuit}
            className="arcade-button w-full py-2.5 bg-steel text-text font-semibold cursor-pointer text-sm font-body flex items-center justify-center gap-1.5"
            id="btn-quit-to-menu"
          >
            <Home className="w-3.5 h-3.5" /> Main menu
          </button>
          <button
            onClick={onOpenHelp}
            className="arcade-button w-full py-2.5 bg-steel text-muted font-semibold cursor-pointer text-sm font-body flex items-center justify-center gap-1.5"
          >
            <HelpCircle className="w-3.5 h-3.5" /> Game guide
          </button>
        </div>
      </div>
    </div>
  );
}

export default PauseOverlay;