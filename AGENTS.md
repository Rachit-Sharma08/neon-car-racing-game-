# Neon Rush - project context (read this first, every session)
 
Mobile-first 3D endless traffic racer in the browser. Live: neon-rush-coral.vercel.app (Vercel).
Owner: Rachit (beginner-to-intermediate, hand-codes parts himself). Explain what you change in plain, short language.
 
## How to work (strict)
1. ONE step at a time. Finish it, verify it, report, then stop. Never do the next step on your own.
2. Never rewrite the whole project. Edit existing files; if a file must be replaced, say why first.
3. Before editing: list the files you will touch. After editing: list what changed and what you could NOT verify.
4. Do not add new dependencies without asking. Prefer what the project already uses.
5. Work in small commits with clear messages (e.g. `fix(menu): visible PLAY button on 360x640`).
6. If a task is design-heavy (new visual style, 3D car models, scenery art, complex layout), STOP and write
   "DESIGN HANDOFF NEEDED" plus a short brief. Rachit will use Codex/Antigravity for that part.
7. Update the "Progress log" at the bottom of this file after each finished step.
8. Use npm only (pnpm shim is broken on this machine). Never print or commit secrets from .env.

## Stack (filled by Step 1 audit)
- Framework/bundler: Vite 6 + React 19 + TypeScript 5.8, Tailwind CSS v4 (via @tailwindcss/vite). No router library.
- Rendering: Three.js 0.185 (WebGL) for the 3D scene; React 19 + Tailwind v4 for all UI. Everything is inside ONE file.
- Key files: src/App.tsx (~3970 lines = whole app), src/main.tsx (mount), src/index.css (keyframes + fonts).
  src/App.tsx contains: SynthEngine (Web Audio), VEHICLES (car list), SpeedRadialGauge (SVG HUD),
  App() = React state + all screens, and the whole Three.js scene inside one useEffect
  (road segments, 3 zone look sets, train, player car builder, nitro/drift particles,
  traffic pool + AI, render loop, keyboard input, ref API used by UI buttons).
- Deploy: Vercel, no vercel.json. Vite defaults: build `vite build`, output `dist`. Git repo -> GitHub -> Vercel
  (github.com/Rachit-Sharma08/neon-car-racing-game-). Build verified OK (47s, 807 kB JS / 217 kB gzip).

## Target devices and testing
- Main target: mid-range Android phone, Chrome. Game runs in LANDSCAPE.
- Always check: 360x640, 412x915, 915x412 (and 800x480). No page scroll on menu/game screens.
- Use 100dvh, viewport-fit=cover, env(safe-area-inset-*), touch-action: none on the game canvas.
- Target 60fps; pixel ratio capped at 1.5 on mobile; no realtime shadows; pool and instance objects.
 
## Screen flow
Loading -> Main Menu (big PLAY always visible without scrolling) -> Garage -> Map Select -> Game -> Pause -> Game Over / Revive.
 
## Design rules (this is NOT a cyberpunk website)
BANNED: purple/pink/magenta, gradient text, decorative gradient backgrounds, glowing shadows/neon borders,
glassmorphism cards, monospace "terminal" labels (e.g. "SYS // ..."), fake status text (ONLINE, ping),
letter-spaced ALL-CAPS microcopy everywhere, emoji/generic icon-pack decoration.
USE: arcade look - steel HUD panels, glossy flat buttons, red speed digits, daylight scenery.
- All colours/fonts/spacing live in ONE tokens file (CSS variables). Never hardcode colours elsewhere.
- Default tokens (Rachit may change): asphalt #14171c, steel #2a3038 / #3a424d, edge #5b6674, text #e8ecf1,
  muted #9aa5b1, primary action orange #ff8a00, secondary steel-blue #2f7fb8, danger #d93a2e.
- Fonts: one display (Rajdhani or Teko) + one body (Barlow). Radius 6px. Buttons min height 48px.
- Copy is short and plain: "Play", "Garage", "Best distance".
 
## Gameplay spec (from Rachit's reference recording and screenshots)
- Chase camera behind/above car. 4-lane highway, white dashed lines, yellow centre/edge lines, guardrails.
- Traffic: sedan, taxi, pickup, van, truck, armored van. Never spawn an impassable wall.
- HUD: top-left DISTANCE (m), top-right SCORE, speed km/h under score (colour changes as speed rises),
  pause button top-left, camera-switch button top-right, brake pedal bottom-left, gas pedal bottom-right.
- Run starts with a short loading screen, then a "Go!" countdown.
- Near miss shows a floating "+100" popup and adds score.
- Scenery changes during a run (different map looks); maps: coastal cliff, bridge, countryside (with train), city.
- Crash -> "Repair Now?" revive prompt with a 3-2-1 countdown and Continue; otherwise Game Over.
- Settings: control scheme (buttons vs tilt/touch), Sound slider, Music slider, Credits.
 
## Garage spec
- Top bar: Level, Energy, Coins. Car on a turntable, left/right arrows + swipe + dot pager.
- Locked cars show a lock and a price with a Buy button; owned cars show Upgrade / Paint / Wheel / Next.
- Upgrade menu: Speed, Shift, Brake, each level adds a small % and costs coins (must change real gameplay values).
- Paint: 3x3 colour grid, locked colours show price. Wheels: 3-4 styles.
- Save in localStorage (versioned schema): coins, owned cars, paint, upgrades, best distance, high score.
- Cars are original or generic names (no real brand names such as BMW). Keep Rachit's existing car stats.
 
## Assets and legal
- Use only original or CC0 assets (Kenney, Quaternius). Do NOT copy art, models, sounds or UI images from other games.
- References are for layout and feel only.
 
## Progress log
- [x] Step 1: Audit codebase and fill the Stack section
- [x] Step 2: Fix start flow (visible PLAY, fixed-height screens, landscape handling)
- [ ] Step 3: Split App.tsx into modules (no behaviour change)
- [ ] Step 4: Design tokens and restyle all screens
- [ ] Step 5: Core gameplay (4 lanes, brake pedal, near-miss, HUD)
- [ ] Step 6: Maps and scenery
- [ ] Step 7: Garage, upgrades, save system, rename BMW E34 to a generic name
- [ ] Step 8: Settings, revive flow, remove unused deps (@google/genai, express, dotenv), performance pass
