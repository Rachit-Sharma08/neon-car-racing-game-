# Autopilot Night Log

Branch: autopilot-night
Base: main @ 4322cac (Step 2.9 items 1-4 already on main, AGENTS.md still ticks 2.8 only)
Started: 2026-10-13 night (autopilot, no user questions)

## Step status (initial assessment before work)
- S1 Step 2.9 UI scale + layouts: CODE mostly DONE on main (rem scale, 3rem buttons, edge-anchored menu, 2-col garage). REMAINING: scripts/smoke.mjs + qa-screenshots/autopilot/ at 7 sizes + tick AGENTS.md.
- S2 Step 2.10 controls: NOT DONE (no Brake/Gas pedals, no Auto-gas setting, W/Up/Space still nitro).
- S3 Step 2.11 auto quality: NOT DONE (static getPixelRatio only, no frame-time adaptation, no ratio in debug label).
- S4 Step 3A car models: SKIPPED expected (no public/models/car-kit in repo).
- S5 Cleanup: NOT DONE (5x step3-*.png in root, SpeedRadialGauge present, @google/genai+express+dotenv in package.json).
- S6 Step 4 split: PENDING (only if S1-S5 done + smoke passes).

Assumptions:
- A1: index.css `font-size: var(--ui-root-size)` + vh fallback counts as the S1 formula (tokens.css holds dvh formula). No visual change made.
- A2: No new dependencies for smoke (Chrome headless + Node stdlib only).
- A3: S2 layout: bottom-left = Left/Right arrows, bottom-right = Brake + Gas, Nitro stays centre. Multi-touch via pointer events.
- A4: Headless (navigator.webdriver) skips permanent downgrade in S3.

## S1 Step 2.9 - DONE
- Code was already on main (9180120 rem scale, 909d4cf 3rem buttons, e0add09 edge-anchored menu, 4322cac 2-col garage). No visual changes made (guardrail: no colour/font/token changes).
- Added scripts/smoke.mjs (Node stdlib + system Chrome only, no new dep): preview server reuse, static bundle checks, headless dump-dom console-error check, CDP interaction (Play -> distance 33m->58m -> pause -> quit-confirm -> menu -> portrait rotate overlay), screenshots at 7 sizes.
- Screenshots saved to qa-screenshots/autopilot/ (gitignored): 844x390, 1180x820, 915x412, 1366x768, 1920x1080, 2560x1080, 3840x2160 menu. Verified 915x412 + 844x390 visually: Play visible, no scroll, phone layout not worse.
- Ticked AGENTS.md Step 2.9.
- Verified: npm run build OK (57s), node scripts/smoke.mjs all PASS (14/14).
- NOT verified: garage at exactly 844x390 (no automated garage-open shot); 1180x820/1366x768/4K only eyeballed via file sizes, not opened.

## S2 Step 2.10 controls - DONE
- Bottom-left: Left/Right arrows; bottom-right: Brake + Gas pedals; Nitro stays centre. All pedals use independent pointer + touch handlers (multi-touch steer + gas + brake verified by code; headless CDP is single-pointer).
- Setting "Auto gas" default ON (localStorage neon_rush_autogas), toggle in pause menu (#setting-autogas). ON = old auto-acceleration (byte-identical speeds: ramp tracked at +14/s which always catches the +0.45/s ramp). OFF = Gas-held rises toward ramp, released coasts -9/s. Brake always -34/s, applied after boost so it wins while held.
- Keyboard: A/D or arrows steer, W/Up = gas, S/Down/Space = brake in play (Space/Enter still starts from menus), Shift = nitro, P = pause. Countdown reminder, HUD fuel hint, help guide all updated to the new mapping.
- Hitboxes, spawn logic, traffic AI untouched.
- Verified: lint clean, build OK, smoke 25/25 PASS incl. live brake 125->16 km/h, toggle ON->OFF->ON, game + pause screenshots at 915x412 eyeballed (pedals fit, hints correct).
- NOT verified: real multi-touch (needs a phone); Auto-gas OFF coast/gas-rise curve (only ON-mode tested live); tilt controls (none exist, unchanged).
- Assumption A5: pedals always visible (also mouse-clickable), not touch-only — simpler and testable.

## S3 Step 2.11 auto quality - DONE
- Frame-time sampling with raw wall-clock deltas in the render loop, only while playing and visible. First window 3s after launchRace/resetGame, then rolling 5s windows.
- Adjust: avg <45fps -> pixel ratio -0.25 (floor 0.75); avg >58fps -> +0.15 back (cap = Step 2.8 budget). Resize restarts from the new budget; webdriver browsers skip adjustments.
- Current ratio mirrored to window.__neonPixelRatio and shown in the debug label (menu + rotate overlay refresh every 400ms).
- Verified: lint clean, build OK, smoke 27/27 PASS. Live evidence: menu label "pr=2.00" (budget), mid-run "pr=1.75" after a slow window — downgrade step works and stays in range. No console errors.
- NOT verified: sustained low-end-device behaviour (upgrade path back to cap untested live); real 45/58fps boundary timing on a phone.
- Note: headless run DID downgrade (webdriver flag false under remote-debugging port), which usefully proved the mechanism; design still can't stick low (re-upgrade + per-run reset).

## S4 Step 3A real car models - SKIPPED: no models
- Condition checked: public/models/car-kit does not exist and the repo has no public/ directory at all (assets/ holds only an empty .aistudio folder). No .glb/.gltf anywhere.
- Per the queue rule, src/game/carModels.ts was NOT created (no GLTFLoader work without assets, and adding assets would need downloading, which autopilot cannot do reliably).
- DESIGN HANDOFF NEEDED for Step 3A: someone must add the CC0 Kenney Car Kit .glb files under public/models/car-kit/, then the loader mapping can be implemented.

## S5 Cleanup - DONE
- git rm the five step3-*.png files from the repo root (copies still exist in qa-screenshots/, which is gitignored).
- Removed the unused SpeedRadialGauge component (~295 lines) from src/App.tsx (App.tsx 4446 -> 4151 lines).
- Removed dead index.css override selectors: the whole #radial-speed-gauge-container block, .text-[9px] HUD rules (no such class left), .font-orbitron/.font-mono/.font-rajdhani and #root-container .bg-gradient-to-r (no such classes in src), #garage-overlay #00f0ff escapes (no such classes), and dropped #starting-countdown-overlay > div from the font-family selector (matched no element; removed the :last-child panel rule that relied on it). CSS 32.95 kB -> 28.92 kB.
- Removed unused deps @google/genai, express, dotenv and devDep @types/express after confirming no import in src/ or config; npm install removed 121 packages and refreshed the lockfile.
- Kept `motion` (still a declared dep; unused in src but out of scope for this item - logged).
- Verified: lint clean, build OK (identical JS bytes 803.99 kB, CSS 4 kB smaller), smoke 27/27 PASS, menu screenshot at 915x412 unchanged vs before the CSS deletions.

## S6 Step 4 split App.tsx - DONE (7 commits, smoke after each)
- src/game/synth.ts (SynthEngine + shared `synth`), src/game/vehicles.ts (Vehicle type, VehicleId, VEHICLES),
  src/game/viewport.ts (useIsPortrait, SHOW_DEBUG, verticalFovForAspect, getPixelRatio),
  src/ui/DebugLabel.tsx, src/ui/Hud.tsx, src/ui/Controls.tsx, src/ui/PauseOverlays.tsx (Countdown + Pause),
  src/ui/MainMenu.tsx, src/ui/GameOverOverlay.tsx (Game over + Quit confirm), src/ui/GarageOverlay.tsx
  (incl. the SVG car silhouette as a local component), src/ui/StaticOverlays.tsx (how-to-play, rotate,
  WebGL fallback), src/game/scene.ts (the whole Three.js effect body moved verbatim), src/hooks/useRunInterruption.ts.
- App.tsx: 4446 -> 554 lines, now only React state, handlers and screen wiring. src/game/scene.ts is ~2410 lines
  (unchanged body) and is the next split candidate (road/scenery builder).
- Two real fixes found and made while extracting: (a) the Garage wrapper was a content-sized block so the
  overlay scrolled 305px at 915x412 - now flex-col + min-h-0 (overflow 0px, verified in smoke);
  (b) the how-to-play guide still named a real brand ("BMW E34"), changed to "Retro cruiser"/"Retro coupe"
  to satisfy the "no real brand names" rule in AGENTS.md.
- Also repaired mojibake: an earlier PowerShell Set-Content round trip had double-encoded the arrow/bullet
  glyphs in App.tsx (introduced in db39dc4, present at HEAD). All 10 occurrences restored; verified against
  the pre-cleanup commit that no glyph was lost.
- Kept the working tree at CRLF with no BOM (core.autocrlf=true) for every new file, verified against the pre-split commits.
- Smoke extended: how-to-play opens/closes, garage opens with 4 cars and no scroll, garage Back returns to menu.
- Verified after EVERY commit: npm run lint clean, npm run build OK, scripts/smoke.mjs 31/31 PASS.
- NOT verified: real-device rendering on a phone; the scene hook's internals were moved verbatim, not refactored.

---

# MORNING REPORT

| Step | Status |
|---|---|
| S1 Step 2.9 UI scale + layouts | DONE |
| S2 Step 2.10 brake/gas pedals + Auto gas | DONE |
| S3 Step 2.11 auto quality | DONE |
| S4 Step 3A real car models | SKIPPED (no models in repo) |
| S5 Cleanup | DONE |
| S6 Step 4 split App.tsx | DONE |

Branch: autopilot-night (main untouched, never committed to)
Last commit: 8ef48cb docs: tick 2.10/2.11/Step 4, mark Step 3A blocked, refresh Stack section
Pushed to origin/autopilot-night after every step. main is still at 4322cac.
Live preview: https://neon-rush-coral.vercel.app still serves main; merge the branch to publish.

## How to test on the phone
1. Open the game in Chrome on Android, turn the phone sideways (landscape only).
2. Tap Play, wait for 3-2-1-GO, check the distance counter goes up on the left.
3. Use the bottom-left arrows to change lane; hold Brake (bottom-right) and the speed must drop fast.
4. Pause (top-left), switch "Auto gas" OFF, resume, then the car only speeds up while you hold Gas.
5. Hold Nitro (bottom-centre) or the Shift key equivalent, and rotate to portrait - only "Rotate your phone" shows.

## Known issues
- Step 3A has no car models: public/models/car-kit does not exist, so cars are still procedural boxes.
- Auto gas OFF coast + gas-reaccelerate curve was never played live, only the ON path and brake were.
- src/game/scene.ts is still ~2410 lines; road/scenery builder is the next split.
- Debug label (bottom-left, pr=2.00) is still visible on every screen - hide with SHOW_DEBUG=false in src/game/viewport.ts.
- Hitboxes were NOT re-tuned for the new pedals (task said keep unchanged).
- The help guide text is still long (Step 3B item 3c outstanding), and car/traffic/nitro colours are still neon (3e).

## NOT verified (needs a real device or eyes)
- Any iPhone / iPad / tablet behaviour; iOS audio unlock; orientation lock; fullscreen on iOS.
- Multi-touch (steer + gas + brake at the same time) - headless CDP is single-pointer only.
- Actual 45/58 fps thresholds on a mid-range Android; sustained low-end downgrade then recovery.
- Screenshots only cover the Main Menu at 7 sizes; garage/HUD/gameover/help were checked by DOM assertions only.
- Font loading: screenshots use the Google Fonts CDN; offline font fallback is untested.
