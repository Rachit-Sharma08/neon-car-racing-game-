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
