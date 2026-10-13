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
