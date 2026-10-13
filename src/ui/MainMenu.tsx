/* ---------- MAIN MENU (Step 4 split) ----------
   Step 2.9 layout: sound/fullscreen top-left, driver name top-right, title +
   best distance bottom-left, Play / Garage / How to play bottom-right.
   Presentational only: every action is a callback prop. */
import { Car, HelpCircle, Maximize, Minimize, Play, Trophy, Volume2, VolumeX } from 'lucide-react';
import { DebugLabel } from './DebugLabel';

export type MainMenuProps = {
  highScore: number;
  muted: boolean;
  fullscreenOn: boolean;
  canFullscreen: boolean;
  username: string;
  isEditingName: boolean;
  nameInput: string;
  isPortrait: boolean;
  onToggleMute: () => void;
  onToggleFullscreen: () => void;
  onStartEditName: () => void;
  onNameInputChange: (value: string) => void;
  onNameInputKeyDown: (key: string) => void;
  onSaveUsername: () => void;
  onCancelEditName: () => void;
  onPlay: () => void;
  onOpenGarage: () => void;
  onOpenHelp: () => void;
};

export function MainMenu({
  highScore,
  muted,
  fullscreenOn,
  canFullscreen,
  username,
  isEditingName,
  nameInput,
  isPortrait,
  onToggleMute,
  onToggleFullscreen,
  onStartEditName,
  onNameInputChange,
  onNameInputKeyDown,
  onSaveUsername,
  onCancelEditName,
  onPlay,
  onOpenGarage,
  onOpenHelp,
}: MainMenuProps) {
  return (
    <div
      className="absolute inset-0 bg-asphalt/85 flex flex-col z-10 overflow-y-auto safe-pad-t safe-pad-b safe-pad-l safe-pad-r"
      id="title-screen-overlay"
    >
      {/* Top row: sound + fullscreen on the left, player name on the right */}
      <div className="w-full flex items-start justify-between gap-2 shrink-0">
        <div className="flex items-center gap-2">
          <button
            className="arcade-button w-12 h-12 bg-steel border-edge text-muted cursor-pointer flex items-center justify-center"
            onClick={onToggleMute}
            title={muted ? "Unmute audio" : "Mute audio"}
            id="audio-toggle"
          >
            {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
          {canFullscreen && (
            <button
              className="arcade-button w-12 h-12 bg-steel border-edge text-muted cursor-pointer flex items-center justify-center"
              onClick={onToggleFullscreen}
              title={fullscreenOn ? "Exit fullscreen" : "Go fullscreen"}
              id="btn-fullscreen-menu"
            >
              {fullscreenOn ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
            </button>
          )}
        </div>
        {isEditingName ? (
          <div className="flex items-center gap-1">
            <input
              type="text"
              value={nameInput}
              onChange={(e) => onNameInputChange(e.target.value.toUpperCase())}
              className="bg-asphalt border border-edge text-xs px-2 py-1 rounded-ui text-text w-24 focus:outline-none"
              maxLength={12}
              onKeyDown={(e) => onNameInputKeyDown(e.key)}
              autoFocus
            />
            <button
              onClick={onSaveUsername}
              className="text-xs font-semibold text-asphalt bg-primary px-2 py-1 rounded-ui cursor-pointer"
            >
              Save
            </button>
          </div>
        ) : (
          <div
            className="text-xs font-semibold text-muted cursor-pointer flex items-center gap-1"
            onClick={onStartEditName}
            title="Edit driver name"
          >
            <span>{username}</span>
            <span className="text-[0.625rem] opacity-60 font-normal">(edit)</span>
          </div>
        )}
      </div>

      {/* Bottom row: title + best distance on the left, actions on the right */}
      <div className="mt-auto w-full flex items-end justify-between gap-4 sm:gap-8">

        <div className="flex flex-col items-start text-left gap-1.5 sm:gap-2 min-w-0">
          <div className="inline-block px-3 py-1 rounded-ui bg-steel border border-edge text-muted text-xs font-semibold">
            3D highway traffic racer
          </div>

          <h1 className="text-4xl sm:text-6xl font-bold text-text font-display">
            Neon Rush 3D
          </h1>

          {highScore > 0 && (
            <div className="text-primary text-sm font-semibold flex items-center gap-1.5">
              <Trophy className="w-4 h-4" /> Best distance: {highScore}m
            </div>
          )}
        </div>

        <div className="w-[45%] sm:w-[24rem] max-w-[24rem] shrink-0 flex flex-col gap-2 sm:gap-3">
          <button
            onClick={onPlay}
            className="arcade-button w-full min-h-14 px-6 py-4 bg-primary text-asphalt font-bold text-lg font-display cursor-pointer flex items-center justify-center gap-2 active:scale-95 transition-transform"
            id="btn-engage-engine"
          >
            <Play className="w-6 h-6 fill-current" /> Play
          </button>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={onOpenGarage}
              className="arcade-button min-h-12 px-4 py-3 bg-steel border-edge text-text font-semibold text-sm cursor-pointer flex items-center justify-center gap-2"
              id="btn-garage"
            >
              <Car className="w-4 h-4" /> Garage
            </button>
            <button
              onClick={onOpenHelp}
              className="arcade-button min-h-12 px-4 py-3 bg-steel border-edge text-text font-semibold text-sm cursor-pointer flex items-center justify-center gap-2"
              id="btn-how-to-play"
            >
              <HelpCircle className="w-4 h-4" /> How to play
            </button>
          </div>
        </div>
      </div>

      <DebugLabel portrait={isPortrait} />
    </div>
  );
}

export default MainMenu;