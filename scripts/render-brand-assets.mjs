#!/usr/bin/env node
/**
 * Renders the committed brand SVG sources to PNG/ICO. NOT part of `npm run build`;
 * the rendered files are committed so the build has no new dependency.
 *
 * Usage (outside the repo's dependency tree):
 *   npm i --prefix /tmp/qpf-render @resvg/resvg-js@2.6.2
 *   INTER_DIR=/path/to/Inter-4.0/extras/ttf NODE_PATH=/tmp/qpf-render/node_modules \
 *     node scripts/render-brand-assets.mjs
 * ICO packing uses Python Pillow (python3 -c ...), invoked below.
 *
 * Inputs:  deploy/brand/og-image.svg, deploy/brand/qpf-mark.svg
 * Outputs: deploy/og-image.png (1200x630), deploy/favicon-32.png,
 *          deploy/apple-touch-icon.png (180x180), deploy/favicon.ico (16/32/48)
 * Fonts:   Inter 4.0 static TTFs (rsms/inter release v4.0), system fonts disabled
 *          so the render does not depend on the machine.
 */
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const { Resvg } = require('@resvg/resvg-js');
const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const interDir = process.env.INTER_DIR;
if (!interDir) throw new Error('Set INTER_DIR to the Inter 4.0 extras/ttf directory');
const fontFiles = ['Inter-SemiBold.ttf', 'Inter-Bold.ttf'].map((f) => path.join(interDir, f));

function render(srcRel, outRel, width) {
  const svg = fs.readFileSync(path.join(root, srcRel), 'utf8');
  const png = new Resvg(svg, {
    fitTo: { mode: 'width', value: width },
    font: { loadSystemFonts: false, fontFiles, defaultFontFamily: 'Inter' },
  }).render().asPng();
  fs.writeFileSync(path.join(root, outRel), png);
  console.log(`${outRel} ${png.length} bytes`);
}

render('deploy/brand/og-image.svg', 'deploy/og-image.png', 1200);
render('deploy/brand/qpf-mark.svg', 'deploy/favicon-32.png', 32);
render('deploy/brand/qpf-mark.svg', 'deploy/apple-touch-icon.png', 180);
const tmp48 = path.join(root, 'deploy', '.favicon-48.tmp.png');
const tmp16 = path.join(root, 'deploy', '.favicon-16.tmp.png');
render('deploy/brand/qpf-mark.svg', path.relative(root, tmp48), 48);
render('deploy/brand/qpf-mark.svg', path.relative(root, tmp16), 16);
execFileSync('python3', ['-c', `
from PIL import Image
imgs=[Image.open(p).convert('RGBA') for p in ('${tmp16}','${path.join(root, 'deploy/favicon-32.png')}','${tmp48}')]
imgs[2].save('${path.join(root, 'deploy/favicon.ico')}', format='ICO', sizes=[(16,16),(32,32),(48,48)], append_images=imgs[:2])
`]);
fs.unlinkSync(tmp48); fs.unlinkSync(tmp16);
console.log('deploy/favicon.ico written');
