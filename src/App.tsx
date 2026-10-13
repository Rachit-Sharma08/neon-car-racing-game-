import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import {
  Trophy,
  Target,
  Zap,
  Cpu,
  Volume2,
  VolumeX,
  Compass,
  User,
  Shield,
  ArrowLeft,
  ArrowRight,
  Info,
  Award,
  Pause,
  Play,
  Flame,
  Gauge,
  HelpCircle,
  RotateCcw,
  Sparkles,
  ChevronRight,
  X,
  Car,
  Maximize,
  Minimize,
  Home
} from 'lucide-react';
import { synth } from './game/synth';
import { VEHICLES } from './game/vehicles';
import type { Vehicle } from './game/vehicles';
import { useIsPortrait, verticalFovForAspect, getPixelRatio } from './game/viewport';
import { DebugLabel } from './ui/DebugLabel';
import { Hud } from './ui/Hud';
import { Controls } from './ui/Controls';
import { CountdownOverlay, PauseOverlay } from './ui/PauseOverlays';
import { MainMenu } from './ui/MainMenu';
import { GameOverOverlay, QuitConfirmOverlay } from './ui/GameOverOverlay';
import { GarageOverlay } from './ui/GarageOverlay';
import { HowToPlayOverlay, RotateOverlay, WebglErrorOverlay } from './ui/StaticOverlays';
import { useGameScene } from './game/scene';
import { useRunInterruption } from './hooks/useRunInterruption';

export default function App() {
  /* ---------- REACT STATE ---------- */
  const [gameState, setGameState] = useState<'title' | 'countdown' | 'playing' | 'gameover'>('title');
  const [countdownVal, setCountdownVal] = useState<'3' | '2' | '1' | 'GO!' | ''>('3');
  const [countdownSubtext, setCountdownSubtext] = useState<string>('Get ready');
  const countdownTimersRef = useRef<NodeJS.Timeout[]>([]);
  const startRaceCountdownRef = useRef<() => void>(() => {});

  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(() => {
    try {
      return parseInt(localStorage.getItem('neon_rush_highscore') || '0', 10);
    } catch {
      return 0;
    }
  });
  const [speed, setSpeed] = useState<number>(0);
  const [selectedVehicleId, setSelectedVehicleId] = useState<'titan' | 'blade' | 'glide' | 'bmw'>('titan');
  const [paused, setPaused] = useState<boolean>(false);
  const [muted, setMuted] = useState<boolean>(false);
  const [username, setUsername] = useState<string>(() => {
    try {
      return localStorage.getItem('neon_rush_username') || 'PLAYER 1';
    } catch {
      return 'PLAYER 1';
    }
  });
  const [isEditingName, setIsEditingName] = useState<boolean>(false);
  const [nameInput, setNameInput] = useState<string>(username);
  const [dodgeCount, setDodgeCount] = useState<number>(0);
  const [ping, setPing] = useState<number>(12);

  // Nitro Boost state
  const [boostFuel, setBoostFuel] = useState<number>(100);
  const [isBoosting, setIsBoosting] = useState<boolean>(false);
  // Step 2.10: pedal input state (Auto gas keeps the old auto-acceleration).
  const [gasHeld, setGasHeld] = useState<boolean>(false);
  const [brakeHeld, setBrakeHeld] = useState<boolean>(false);
  const [autoGas, setAutoGas] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('neon_rush_autogas');
      return saved === null ? true : saved === 'true';
    } catch {
      return true;
    }
  });
  const [showHelpModal, setShowHelpModal] = useState<boolean>(false);
  const [garageOpen, setGarageOpen] = useState<boolean>(false);
  // Step 2.6: one hook drives orientation for the whole app.
  const isPortrait = useIsPortrait();
  const [fullscreenOn, setFullscreenOn] = useState<boolean>(false);
  const [showQuitConfirm, setShowQuitConfirm] = useState<boolean>(false);
  // Step 2.8: set when the WebGL renderer cannot be created, so we can show a
  // plain message instead of a blank screen.
  const [webglFailed, setWebglFailed] = useState<boolean>(false);

  /* ---------- REFS ---------- */
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameLoopRef = useRef<any>(null);

  // Active vehicle state ref for the fast-paced Three.js animation loop
  const activeVehicleRef = useRef<Vehicle>(VEHICLES[0]);
  const pausedRef = useRef<boolean>(false);
  // Step 2.10: pedal refs mirror the React state so the render loop reads
  // the live value without re-creating the Three.js scene.
  const gasHeldRef = useRef<boolean>(false);
  const brakeHeldRef = useRef<boolean>(false);
  const autoGasRef = useRef<boolean>(true);
  // Step 2.5 exit and interruption handling refs
  const gameStateRef = useRef<'title' | 'countdown' | 'playing' | 'gameover'>('title');
  const runPushedRef = useRef<boolean>(false);
  const pauseRunRef = useRef<() => void>(() => {});
  const goToMainMenuRef = useRef<() => void>(() => {});

  // Clean countdown timers on unmount
  const clearCountdownTimers = () => {
    countdownTimersRef.current.forEach(t => clearTimeout(t));
    countdownTimersRef.current = [];
  };

  const persistFullscreen = (on: boolean) => {
    try { localStorage.setItem('neon_rush_fullscreen', on ? 'true' : 'false'); } catch {}
  };

  // iPhone/iPad Safari have no Fullscreen API. Hide the button there and rely on
  // the Rotate screen instead of showing a button that can never work.
  const canFullscreen = typeof document !== 'undefined' && (
    typeof document.documentElement.requestFullscreen === 'function' ||
    typeof (document.documentElement as any).webkitRequestFullscreen === 'function'
  );

  const enterFullscreen = () => {
    try {
      const root = document.documentElement;
      const request = root.requestFullscreen || (root as any).webkitRequestFullscreen;
      if (typeof request !== 'function') return;
      const result = request.call(root);
      if (result && typeof result.then === 'function') {
        result.then(() => {
          setFullscreenOn(true);
          persistFullscreen(true);
          try {
            const orientation = screen.orientation as (ScreenOrientation & { lock?: (o: string) => Promise<void> }) | undefined;
            if (orientation && typeof orientation.lock === 'function') {
              orientation.lock('landscape').catch(() => {});
            }
          } catch {}
        }).catch(() => {});
      } else {
        // Old WebKit API returns nothing; assume it worked and let the event correct us.
        setFullscreenOn(true);
        persistFullscreen(true);
      }
    } catch {}
  };

  const exitFullscreen = () => {
    try {
      if (document.fullscreenElement && typeof document.exitFullscreen === 'function') {
        document.exitFullscreen().catch(() => {});
      }
    } catch {}
    setFullscreenOn(false);
    persistFullscreen(false);
  };

  const toggleFullscreen = () => {
    if (document.fullscreenElement) {
      exitFullscreen();
    } else {
      enterFullscreen();
    }
  };

  useEffect(() => {
    return () => clearCountdownTimers();
  }, []);

  // Sync paused state to ref and adjust engine sound pitch
  useEffect(() => {
    pausedRef.current = paused;
    if (paused) {
      synth.updateEngine(0);
    } else if (gameState === 'playing') {
      synth.updateEngine(speed);
    }
  }, [paused, gameState, speed]);

  // Update high score in local storage
  const saveHighScore = (newScore: number) => {
    setHighScore(newScore);
    try {
      localStorage.setItem('neon_rush_highscore', newScore.toString());
    } catch (e) {}
  };

  // Ping update simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setPing(prev => {
        const delta = Math.random() > 0.5 ? 1 : -1;
        const next = prev + delta;
        return next < 8 ? 8 : next > 16 ? 16 : next;
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Sync mute state to Audio Synth Engine
  useEffect(() => {
    synth.setMute(muted);
  }, [muted]);

  // Step 2.10: keep the loop ref in sync and persist the Auto gas choice.
  useEffect(() => {
    autoGasRef.current = autoGas;
    try {
      localStorage.setItem('neon_rush_autogas', autoGas ? 'true' : 'false');
    } catch {}
  }, [autoGas]);

  // Step 2.6: the whole app is landscape-only. In portrait the Rotate overlay
  // covers every screen and any run in progress is paused. It never auto-resumes.
  useEffect(() => {
    if (isPortrait && (gameState === 'playing' || gameState === 'countdown') && !paused) {
      setPaused(true);
    }
  }, [isPortrait, gameState, paused]);

  // Step 2.10: pedal setters update the UI state and the loop refs together.
  // Each pedal is independent so multi-touch steer + gas + brake works.
  const setGas = (held: boolean) => {
    gasHeldRef.current = held;
    setGasHeld(held);
  };
  const setBrake = (held: boolean) => {
    brakeHeldRef.current = held;
    setBrakeHeld(held);
  };
  const handleSelectVehicle = (id: 'titan' | 'blade' | 'glide' | 'bmw') => {
    setSelectedVehicleId(id);
    const vehicle = VEHICLES.find(v => v.id === id);
    if (vehicle) {
      activeVehicleRef.current = vehicle;
      // Trigger update to existing car elements in Three.js scene
      if (gameLoopRef.current && typeof gameLoopRef.current.updateCarMaterials === 'function') {
        gameLoopRef.current.updateCarMaterials(vehicle);
      }
    }
  };

  // Submit username change
  const handleSaveUsername = () => {
    let clean = nameInput.trim().toUpperCase().substring(0, 14);
    if (!clean) clean = 'RACER_1';
    setUsername(clean);
    setIsEditingName(false);
    try {
      localStorage.setItem('neon_rush_username', clean);
    } catch {}
  };

  /* ---------- GAME ACTION TRIGGER HANDLERS ---------- */
  const beginRun = () => {
    if (runPushedRef.current) return;
    try {
      history.pushState({ game: true }, '');
      runPushedRef.current = true;
    } catch {}
  };

  const pauseRun = () => {
    // Auto-pause / Back-button pause. Never auto-resumes: the player must press Resume.
    if (gameState === 'countdown') {
      clearCountdownTimers();
    }
    setPaused(true);
  };
  pauseRunRef.current = pauseRun;

  const goToMainMenu = () => {
    clearCountdownTimers();
    runPushedRef.current = false;
    setShowQuitConfirm(false);
    setGarageOpen(false);
    setShowHelpModal(false);
    setPaused(false);
    setGameState('title');
    // Returning to the Main Menu exits fullscreen if active.
    try {
      if (document.fullscreenElement && typeof document.exitFullscreen === 'function') {
        document.exitFullscreen().catch(() => {});
      }
    } catch {}
    setFullscreenOn(false);
    persistFullscreen(false);
  };
  goToMainMenuRef.current = goToMainMenu;

  const startRaceCountdown = () => {
    beginRun();
    clearCountdownTimers();
    synth.init();
    synth.startEngine();
    setPaused(false);
    setDodgeCount(0);
    setGameState('countdown');
    setCountdownVal('3');
    setCountdownSubtext('Get ready');

    // Notify Three.js scene to align car on grid
    if (gameLoopRef.current && typeof gameLoopRef.current.prepareCountdown === 'function') {
      gameLoopRef.current.prepareCountdown();
    }

    // Step 3 (0ms)
    synth.playCountdownBeep(false);
    synth.updateEngine(35);

    // Step 2 (750ms)
    const t1 = setTimeout(() => {
      setCountdownVal('2');
      setCountdownSubtext('Set');
      synth.playCountdownBeep(false);
      synth.updateEngine(60);
    }, 750);

    // Step 1 (1500ms)
    const t2 = setTimeout(() => {
      setCountdownVal('1');
      setCountdownSubtext('Rev up');
      synth.playCountdownBeep(false);
      synth.updateEngine(90);
    }, 1500);

    // Step GO! (2250ms)
    const t3 = setTimeout(() => {
      setCountdownVal('GO!');
      setCountdownSubtext('Launch!');
      synth.playCountdownBeep(true);
      synth.playBoost();
      if (gameLoopRef.current && typeof gameLoopRef.current.launchRace === 'function') {
        gameLoopRef.current.launchRace();
      }
    }, 2250);

    // Enter full playing state (2950ms)
    const t4 = setTimeout(() => {
      setGameState('playing');
    }, 2950);

    countdownTimersRef.current = [t1, t2, t3, t4];
  };

  startRaceCountdownRef.current = startRaceCountdown;

  const startGame = () => {
    startRaceCountdown();
  };

  const restartGame = () => {
    setPaused(false);
    startRaceCountdown();
  };

  const resumeGame = () => {
    if (gameState === 'countdown') {
      startRaceCountdown();
    } else {
      setPaused(false);
    }
  };

  // Setup Three.js Grid Engine (src/game/scene.ts)
  useGameScene({
    canvasRef,
    containerRef,
    gameLoopRef,
    activeVehicleRef,
    pausedRef,
    gasHeldRef,
    brakeHeldRef,
    autoGasRef,
    startRaceCountdownRef,
    setGameState,
    saveHighScore,
    setScore,
    setSpeed,
    setBoostFuel,
    setIsBoosting,
    setDodgeCount,
    setGasHeld,
    setBrakeHeld,
    setPaused,
    setWebglFailed,
  });

  // Sync core Game State to Three Loop Ref on component state change
  useEffect(() => {
    gameStateRef.current = gameState;
    if (gameLoopRef.current && typeof gameLoopRef.current.setExternalState === 'function') {
      gameLoopRef.current.setExternalState(gameState);
    }
  }, [gameState]);

  // Exit / interruption handling (src/hooks/useRunInterruption.ts):
  //  - auto-pause when the app loses focus or the tab is hidden (never auto-resumes)
  //  - Android Back button pauses the run instead of leaving the page
  useRunInterruption({
    gameStateRef,
    pausedRef,
    pauseRunRef,
    goToMainMenuRef,
    setFullscreenOn,
    setShowQuitConfirm,
  });

  const activeVehicle = VEHICLES.find(v => v.id === selectedVehicleId) || VEHICLES[0];
  const progressToObjective = Math.min(100, Math.floor((dodgeCount / 15) * 100));

  return (
    <div
      className="fixed inset-0 h-[100dvh] w-full overflow-hidden bg-asphalt text-text font-body select-none"
      id="root-container"
      onContextMenu={(e) => e.preventDefault()}
    >

      {/* ---------- FULL-SCREEN 3D GAMEPLAY VIEW (canvas fills the whole screen) ---------- */}
      <section className="absolute inset-0" id="gameplay-viewport">
          <div
            ref={containerRef}
            className="w-full h-full relative overflow-hidden"
            id="game-frame-container"
          >
            {/* Real WebGL Canvas Render Element */}
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" id="gameCanvas" />

            {/* --- IN-GAME OVERLAY STATS / HUD (src/ui/Hud.tsx) --- */}
            <Hud
              gameState={gameState}
              score={score}
              speed={speed}
              paused={paused}
              boostFuel={boostFuel}
              isBoosting={isBoosting}
              onTogglePause={() => setPaused(!paused)}
            />

            {/* --- OVERLAY: STARTING RACE COUNTDOWN (src/ui/PauseOverlays.tsx) --- */}
            {gameState === 'countdown' && !paused && (
              <CountdownOverlay countdownVal={countdownVal} countdownSubtext={countdownSubtext} />
            )}

            {/* --- OVERLAY: PAUSED SCREEN (src/ui/PauseOverlays.tsx) --- */}
            {paused && (gameState === 'playing' || gameState === 'countdown') && (
              <PauseOverlay
                score={score}
                speed={speed}
                autoGas={autoGas}
                canFullscreen={canFullscreen}
                fullscreenOn={fullscreenOn}
                onResume={resumeGame}
                onRestart={restartGame}
                onToggleFullscreen={toggleFullscreen}
                onQuit={() => setShowQuitConfirm(true)}
                onOpenHelp={() => setShowHelpModal(true)}
                onToggleAutoGas={() => setAutoGas(v => !v)}
              />
            )}

            {/* --- OVERLAY: QUIT CONFIRM (src/ui/GameOverOverlay.tsx) --- */}
            {showQuitConfirm && (
              <QuitConfirmOverlay
                onCancel={() => setShowQuitConfirm(false)}
                onConfirm={goToMainMenu}
              />
            )}

            {/* --- OVERLAY: MAIN MENU (src/ui/MainMenu.tsx) --- */}
            {gameState === 'title' && (
              <MainMenu
                highScore={highScore}
                muted={muted}
                fullscreenOn={fullscreenOn}
                canFullscreen={canFullscreen}
                username={username}
                isEditingName={isEditingName}
                nameInput={nameInput}
                isPortrait={isPortrait}
                onToggleMute={() => setMuted(!muted)}
                onToggleFullscreen={toggleFullscreen}
                onStartEditName={() => {
                  setNameInput(username);
                  setIsEditingName(true);
                }}
                onNameInputChange={setNameInput}
                onNameInputKeyDown={(key) => {
                  if (key === 'Enter') handleSaveUsername();
                  if (key === 'Escape') setIsEditingName(false);
                }}
                onSaveUsername={handleSaveUsername}
                onCancelEditName={() => setIsEditingName(false)}
                onPlay={startGame}
                onOpenGarage={() => setGarageOpen(true)}
                onOpenHelp={() => setShowHelpModal(true)}
              />
            )}

            {gameState === 'gameover' && (
              <GameOverOverlay
                score={score}
                highScore={highScore}
                dodgeCount={dodgeCount}
                onPlayAgain={restartGame}
                onMainMenu={goToMainMenu}
              />
            )}

            {/* --- ON-SCREEN CONTROLS: steer / nitro / pedals (src/ui/Controls.tsx) --- */}
            <Controls
              gameState={gameState}
              boostFuel={boostFuel}
              isBoosting={isBoosting}
              gasHeld={gasHeld}
              brakeHeld={brakeHeld}
              onSteer={(direction) =>
                direction < 0
                  ? gameLoopRef.current?.changeLaneLeft()
                  : gameLoopRef.current?.changeLaneRight()
              }
              onBoost={(held) => gameLoopRef.current?.setBoost(held)}
              onGas={setGas}
              onBrake={setBrake}
            />

          </div>
        </section>

      {/* --- GARAGE OVERLAY (src/ui/GarageOverlay.tsx) --- */}
      {garageOpen && (
        <GarageOverlay
          activeVehicle={activeVehicle}
          selectedVehicleId={selectedVehicleId}
          onClose={() => setGarageOpen(false)}
          onSelectVehicle={handleSelectVehicle}
        />
      )}
      {/* Garage overlay moved to src/ui/GarageOverlay.tsx */}

      {/* ---------- STATIC OVERLAYS (src/ui/StaticOverlays.tsx) ---------- */}
      {showHelpModal && <HowToPlayOverlay onClose={() => setShowHelpModal(false)} />}

      {/* ---------- ROTATE TO LANDSCAPE OVERLAY (Step 2.6) ----------
          Rendered LAST so it covers every screen: menu, garage, how-to-play
          and the running game. It clears itself as soon as landscape returns. */}
      {isPortrait && <RotateOverlay portrait={isPortrait} />}

      {/* ---------- WEBGL UNAVAILABLE (Step 2.8): plain message, not a blank screen ---------- */}
      {webglFailed && <WebglErrorOverlay />}
    </div>
  );
}