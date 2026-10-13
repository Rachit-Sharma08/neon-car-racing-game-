/* ---------- GAME OVER + QUIT CONFIRM (Step 4 split) ----------
   Small end-of-run dialogs. Presentational only. */
import { RotateCcw } from 'lucide-react';

export type GameOverOverlayProps = {
  score: number;
  highScore: number;
  dodgeCount: number;
  onPlayAgain: () => void;
  onMainMenu: () => void;
};

export function GameOverOverlay({ score, highScore, dodgeCount, onPlayAgain, onMainMenu }: GameOverOverlayProps) {
  return (
    <div className="absolute inset-0 bg-asphalt/90 flex flex-col items-center justify-center p-6 text-center z-10" id="gameover-screen-overlay">
      <div className="arcade-panel max-w-md w-full animate-fade-in p-6">
        <h2 className="text-3xl sm:text-5xl font-bold text-danger font-display">
          Race over
        </h2>
        <p className="mt-1 text-muted text-sm font-semibold font-body">
          Vehicle collision
        </p>

        <div className="mt-5 p-5 rounded-ui bg-asphalt border border-edge relative">
          <div className="text-sm text-muted font-semibold">Distance</div>
          <div className="hud-number text-4xl font-bold text-text font-display mt-1">
            {score} M
          </div>

          {score >= highScore && score > 0 && (
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-asphalt text-xs font-bold px-3 py-1 rounded-ui border border-asphalt">
              New best
            </span>
          )}

          <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-edge text-sm font-body">
            <div className="text-left text-muted">
              Cars dodged: <strong className="hud-number text-secondary">{dodgeCount}</strong>
            </div>
            <div className="text-right text-muted">
              Best distance: <strong className="hud-number text-primary">{highScore}m</strong>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mt-6">
          <button
            onClick={onPlayAgain}
            className="arcade-button w-full sm:w-auto px-8 py-3.5 bg-primary text-asphalt font-bold cursor-pointer text-sm font-display flex items-center justify-center gap-2"
            id="btn-re-engage"
          >
            <RotateCcw className="w-4 h-4" /> Play again
          </button>
          <button
            onClick={onMainMenu}
            className="arcade-button w-full sm:w-auto px-6 py-3.5 bg-steel text-text font-semibold cursor-pointer text-sm font-body"
          >
            Main menu
          </button>
        </div>
      </div>
    </div>
  );
}

export type QuitConfirmOverlayProps = {
  onCancel: () => void;
  onConfirm: () => void;
};

export function QuitConfirmOverlay({ onCancel, onConfirm }: QuitConfirmOverlayProps) {
  return (
    <div className="absolute inset-0 bg-asphalt/90 flex items-center justify-center p-6 text-center z-50" id="quit-confirm-overlay">
      <div className="arcade-panel max-w-sm w-full animate-fade-in p-6">
        <h2 className="text-xl sm:text-2xl font-bold text-text font-display">
          Quit this run?
        </h2>
        <div className="mt-5 flex flex-col sm:flex-row gap-2.5 justify-center">
          <button
            onClick={onCancel}
            className="arcade-button w-full sm:w-auto px-6 py-3 bg-steel text-text font-semibold cursor-pointer text-sm font-body"
            id="btn-quit-cancel"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="arcade-button w-full sm:w-auto px-6 py-3 bg-primary text-asphalt font-bold cursor-pointer text-sm font-display"
            id="btn-quit-confirm"
          >
            Quit
          </button>
        </div>
      </div>
    </div>
  );
}

export default GameOverOverlay;