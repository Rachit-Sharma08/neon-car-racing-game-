// One-off: normalise the working tree to match the repo conventions:
//  - core.autocrlf=true, so working-tree files should be CRLF (repo stores LF)
//  - no BOM (src/App.tsx had no BOM before the cleanup commit)
import fs from 'node:fs';

const files = [
  'src/App.tsx',
  'src/game/synth.ts',
  'src/game/vehicles.ts',
  'src/game/viewport.ts',
  'src/ui/DebugLabel.tsx',
  'src/ui/Hud.tsx',
  'src/ui/Controls.tsx',
  'src/ui/PauseOverlays.tsx',
  'src/ui/MainMenu.tsx',
  'src/ui/GameOverOverlay.tsx',
  'src/ui/StaticOverlays.tsx',
  'src/game/scene.ts',
  'src/hooks/useRunInterruption.ts',
  'src/index.css',
  'src/styles/tokens.css',
  'scripts/smoke.mjs',
];

for (const f of files) {
  let buf = fs.readFileSync(f);
  const hadBom = buf[0] === 0xef && buf[1] === 0xbb && buf[2] === 0xbf;
  if (hadBom) buf = buf.slice(3);
  const text = buf.toString('utf8').replace(/\r\n/g, '\n').replace(/\n/g, '\r\n');
  fs.writeFileSync(f, text, 'utf8');
  console.log(`${f}: bom-removed=${hadBom} crlf=${(text.match(/\r\n/g) || []).length}`);
}