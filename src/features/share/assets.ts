import {readFile} from 'node:fs/promises';
import {join} from 'node:path';

// Paths start at the project root, where Next runs, and stay literal so the build can trace them.

// The site's display face, as WOFF: Satori reads no WOFF2.
const readFont = async (weight: 500 | 600) => ({
  name: 'EB Garamond',
  data: await readFile(
    join(process.cwd(), `src/features/share/fonts/eb-garamond-latin-${String(weight)}.woff`),
  ),
  weight,
});

const readArms = async () => {
  const svg = await readFile(join(process.cwd(), 'public/images/arms-of-swabia.svg'));

  return `data:image/svg+xml;base64,${svg.toString('base64')}`;
};

export const getShareCardAssets = async () => {
  const [medium, semibold, arms] = await Promise.all([readFont(500), readFont(600), readArms()]);

  return {fonts: [medium, semibold], arms};
};
