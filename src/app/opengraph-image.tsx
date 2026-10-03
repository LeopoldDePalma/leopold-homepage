import {ImageResponse} from 'next/og';
import {createTranslator} from 'next-intl';

import {getShareCardAssets} from '@/features/share/assets';
import {ShareCard, shareCardSize} from '@/features/share/ShareCard';
import messages from '@/messages/en.json';

// One card, in English, for every language. It sits above `[locale]`, so `proxy.ts` must not
// rewrite its address into one.
const t = createTranslator({locale: 'en', messages});
const name = t('Site.name');
const role = t('ProfileHeader.role');

export const alt = `${name}, ${role}`;
export const size = shareCardSize;

const OpenGraphImage = async () => {
  const {fonts, arms} = await getShareCardAssets();

  return new ImageResponse(<ShareCard name={name} role={role} arms={arms} />, {...size, fonts});
};

export default OpenGraphImage;
