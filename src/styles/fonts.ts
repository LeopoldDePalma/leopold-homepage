import { Amiri, EB_Garamond, JetBrains_Mono, Noto_Kufi_Arabic } from 'next/font/google';

// Latin script: body/UI and headings.
const jetBrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains-mono',
  subsets: ['latin'],
});

const ebGaramond = EB_Garamond({
  variable: '--font-eb-garamond',
  subsets: ['latin'],
});

// Arabic script: body/UI and headings. Their Latin glyphs cover Latin words inside Arabic text.
// Not preloaded — only Arabic pages and `lang="ar"` elements request them.
const notoKufiArabic = Noto_Kufi_Arabic({
  variable: '--font-noto-kufi-arabic',
  subsets: ['arabic', 'latin'],
  preload: false,
});

const amiri = Amiri({
  variable: '--font-amiri',
  subsets: ['arabic', 'latin'],
  weight: ['400', '700'],
  preload: false,
});

export const fontVariables = [jetBrainsMono, ebGaramond, notoKufiArabic, amiri]
  .map((font) => font.variable)
  .join(' ');
