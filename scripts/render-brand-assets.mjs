#!/usr/bin/env node
/**
 * Renders committed brand sources to PNG/ICO. NOT part of `npm run build`;
 * the rendered files are committed so the build has no new dependency.
 *
 * Usage (outside the repo's dependency tree):
 *   npm i --prefix /tmp/qpf-render @resvg/resvg-js@2.6.2
 *   INTER_DIR=/path/to/Inter-4.0/extras/ttf NODE_PATH=/tmp/qpf-render/node_modules \
 *     node scripts/render-brand-assets.mjs
 * Favicons are composed with Python Pillow (python3, invoked below).
 *
 * Inputs:  deploy/brand/og-image.svg, deploy/brand/qf-logo.png (QF logo, transparent,
 *          cropped from the original artwork; shape and colors unchanged)
 * Outputs: deploy/og-image.png (1200x630), deploy/favicon-32.png,
 *          deploy/apple-touch-icon.png (180x180), deploy/favicon.ico (16/32/48)
 * Fonts:   Inter 4.0 static TTFs (rsms/inter v4.0); system fonts disabled.
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
const logoPath = path.join(root, 'deploy/brand/qf-logo.png');

const svg = fs.readFileSync(path.join(root, 'deploy/brand/og-image.svg'), 'utf8')
  .replace('href="qf-logo.png"', `href="data:image/png;base64,${fs.readFileSync(logoPath).toString('base64')}"`);
const png = new Resvg(svg, {
  fitTo: { mode: 'width', value: 1200 },
  font: { loadSystemFonts: false, fontFiles, defaultFontFamily: 'Inter' },
}).render().asPng();
fs.writeFileSync(path.join(root, 'deploy/og-image.png'), png);
console.log(`deploy/og-image.png ${png.length} bytes`);

// Favicons: logo centered on a #0a0a0c rounded square, filling most of the width
// so QF stays legible at 16/32 px.
execFileSync('python3', ['-c', `
from PIL import Image, ImageDraw
logo = Image.open(${JSON.stringify(logoPath)}).convert('RGBA')
def icon(n):
    s = n * 8
    bg = Image.new('RGBA', (s, s), (0, 0, 0, 0))
    ImageDraw.Draw(bg).rounded_rectangle([0, 0, s - 1, s - 1], radius=int(s * 0.2), fill=(10, 10, 12, 255))
    w = int(s * 0.90); h = round(w * logo.height / logo.width)
    l = logo.resize((w, h), Image.LANCZOS)
    bg.alpha_composite(l, ((s - w) // 2, (s - h) // 2))
    return bg.resize((n, n), Image.LANCZOS)
d = ${JSON.stringify(path.join(root, 'deploy'))}
icon(32).save(d + '/favicon-32.png', optimize=True)
icon(180).save(d + '/apple-touch-icon.png', optimize=True)
i48 = icon(48)
i48.save(d + '/favicon.ico', format='ICO', sizes=[(16,16),(32,32),(48,48)], append_images=[icon(16), icon(32)])
`]);
console.log('favicons written');
