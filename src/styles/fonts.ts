import {map} from 'lodash-es';
import {Amiri, EB_Garamond, JetBrains_Mono, Noto_Kufi_Arabic} from 'next/font/google';

const jetBrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains-mono',
  subsets: ['latin'],
});

const ebGaramond = EB_Garamond({
  variable: '--font-eb-garamond',
  subsets: ['latin'],
});

const notoKufiArabic = Noto_Kufi_Arabic({
  variable: '--font-noto-kufi-arabic',
  preload: false,
});

const amiri = Amiri({
  variable: '--font-amiri',
  weight: '700',
  preload: false,
});

export const fontVariables = map(
  [jetBrainsMono, ebGaramond, notoKufiArabic, amiri],
  'variable',
).join(' ');
