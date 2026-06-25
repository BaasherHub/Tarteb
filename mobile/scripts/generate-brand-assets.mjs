/**
 * Generates store icons matching in-app AppBrand (primary #1358CE, white "T", 12px radius on 40px mark).
 * Run: npm run generate:assets
 */
import sharp from 'sharp';
import { writeFileSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const assetsDir = join(__dirname, '..', 'assets');

const PRIMARY = '#1358CE';
const SCAFFOLD = '#F5F7FB';
const WHITE = '#FFFFFF';
const MARK_RADIUS_RATIO = 12 / 40;

function markSvg(size) {
  const radius = Math.round(size * MARK_RADIUS_RATIO);
  const fontSize = Math.round(size * 0.55);
  const y = Math.round(size * 0.68);
  return `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" rx="${radius}" ry="${radius}" fill="${PRIMARY}"/>
  <text x="50%" y="${y}" font-family="Arial, Helvetica, sans-serif" font-size="${fontSize}" font-weight="800" fill="${WHITE}" text-anchor="middle">T</text>
</svg>`;
}

async function main() {
  mkdirSync(assetsDir, { recursive: true });

  const iconBuf = await sharp(Buffer.from(markSvg(1024))).png().toBuffer();

  await sharp(iconBuf).toFile(join(assetsDir, 'icon.png'));
  console.log('Wrote icon.png');

  await sharp(iconBuf).toFile(join(assetsDir, 'android-icon-foreground.png'));
  console.log('Wrote android-icon-foreground.png');

  const bgSvg = `<svg width="1024" height="1024" xmlns="http://www.w3.org/2000/svg">
    <rect width="1024" height="1024" fill="${PRIMARY}"/>
  </svg>`;
  await sharp(Buffer.from(bgSvg)).png().toFile(join(assetsDir, 'android-icon-background.png'));
  console.log('Wrote android-icon-background.png');

  const monoSvg = `<svg width="1024" height="1024" xmlns="http://www.w3.org/2000/svg">
    <rect x="256" y="256" width="512" height="512" rx="154" ry="154" fill="#000000"/>
    <text x="512" y="580" font-family="Arial, Helvetica, sans-serif" font-size="300" font-weight="800" fill="#000000" text-anchor="middle">T</text>
  </svg>`;
  await sharp(Buffer.from(monoSvg)).png().toFile(join(assetsDir, 'android-icon-monochrome.png'));
  console.log('Wrote android-icon-monochrome.png');

  const splashW = 1284;
  const splashH = 2778;
  const logoSize = 220;
  const logo = await sharp(iconBuf).resize(logoSize, logoSize).png().toBuffer();
  await sharp({
    create: {
      width: splashW,
      height: splashH,
      channels: 4,
      background: SCAFFOLD,
    },
  })
    .composite([
      { input: logo, top: Math.round(splashH * 0.38), left: Math.round((splashW - logoSize) / 2) },
    ])
    .png()
    .toFile(join(assetsDir, 'splash.png'));
  console.log('Wrote splash.png');

  await sharp(iconBuf).resize(48, 48).png().toFile(join(assetsDir, 'favicon.png'));
  console.log('Wrote favicon.png');

  writeFileSync(
    join(assetsDir, 'README.md'),
    `# Tarteb brand assets

Generated to match in-app **AppBrand** (\`${PRIMARY}\` mark with white **T**, rounded corners).

\`\`\`bash
npm run generate:assets
\`\`\`
`,
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
