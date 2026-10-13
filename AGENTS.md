# Neon Rush - project context (read this first, every session)
 
Mobile-first 3D endless traffic racer in the browser. Live: neon-rush-coral.vercel.app (Vercel).
Owner: Rachit (beginner-to-intermediate, hand-codes parts himself). Explain what you change in plain, short language.
 
## How to work (strict)
1. ONE step at a time. Finish it, verify it, report, then stop. Never do the next step on your own.
2. Never rewrite the whole project. Edit existing files; if a file must be replaced, say why first.
3. Before editing: list the files you will touch. After editing: list what changed and what you could NOT verify.
4. Do not add new dependencies without asking. Prefer what the project already uses.
5. Work in small commits with clear messages (e.g. `fix(menu): visible PLAY button on 360x640`).
6. Design-heavy tasks (new visual style, 3D car models, scenery art, complex layouts) are done by Codex or Antigravity. If you are opencode / the Step model: STOP on such a task and write "DESIGN HANDOFF NEEDED" plus a short brief. If you are Codex or Antigravity: you ARE the design tool, so do the task, following all other rules.
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
- The whole app is LANDSCAPE-ONLY, like the reference game - Main Menu, Garage, Game, everything.
  In portrait the ONLY thing shown is a full-screen "Rotate your phone" screen.
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
 
## Platform support
The whole app is LANDSCAPE-ONLY and must work on:
- iPhone (Safari), Android phones (Chrome), iPad and Android tablets, large touch panels (1920x1080 and
  above), and desktop (Chrome, Edge, Firefox, Safari). Latest 2 versions of each.
- Aspect ratios from 4:3 (iPad) to 21:9 (ultrawide). The canvas fills the viewport; the camera FOV adapts to
  the aspect ratio so the whole road is always visible; all UI scales from ONE scale unit based on viewport
  height, with no fixed pixel layouts.
- Respect safe-area insets on all four sides (notches in landscape).
- Input: touch (gas and brake pedals plus steering with multi-touch, so gas and steering work at the same
  time), keyboard (arrows / WASD, Space or S = brake), mouse for UI. Use pointer events. No hover-only UI.
  Touch targets >= 48px (scaled up on big panels). Disable text selection, long-press menu and double-tap zoom.
- iPhone has no Fullscreen API and no orientation lock: hide the Fullscreen button there and rely on the
  Rotate screen. Audio must be unlocked on the first user tap (iOS). Tilt controls need DeviceOrientation
  permission requested inside a tap.
- Performance: auto quality. Measure frame time during the first seconds of a run; lower pixel ratio and
  effects if below target. Pixel ratio cap 1.5 on phones, 2 on desktop, and a cap on total rendered pixels on
  4K panels. Target 60 fps on mid-range Android, accept 30 fps on low-end devices.
- If WebGL is unavailable, show a plain message instead of a blank screen.

## Progress log
- [x] Step 1: Audit codebase and fill the Stack section
- [x] Step 2: Fix start flow (visible PLAY, fixed-height screens, landscape handling)
- [x] Step 2.5: exit and interruption handling
- [x] Step 2.6: landscape-only app and rotation
- [x] Step 2.7: cross-device audit
- [x] Step 2.8: cross-device fixes (from the audit)
- [x] Step 2.9: UI scale + layouts (rem scale unit, edge-anchored menu/HUD, two-column garage, scripts/smoke.mjs + autopilot screenshots)
- [ ] Step 3A: real car models (Kenney Car Kit, CC0)
- [ ] Step 3B: design redesign of Menu/Garage/HUD to match the reference (so far: 3a+3b done - tokens + daylight
  palette; left over: 3c help text still long, 3d no camera-button slot, 3e car/traffic/nitro colours still neon)
- [ ] Step 4: split App.tsx into modules
- [ ] Step 5: core gameplay
- [ ] Step 6: maps and scenery
- [ ] Step 7: garage, upgrades, save
- [ ] Step 8: settings, revive, cleanup, performance
