import {type SystemStyleObject, Text} from '@chakra-ui/react';
import {map} from 'lodash-es';
import {getFormatter, getTranslations} from 'next-intl/server';

import {ExternalLink} from '@/components/ui/ExternalLink';
import {site} from '@/content/site';
import {MusicMention} from '@/features/music/MusicMention';
import {getListening} from '@/features/music/spotify';

const interestLink = {
  display: 'inline',
  color: 'seal',
  textDecoration: 'underline',
  textUnderlineOffset: '0.25em',
  transitionProperty: 'opacity',
  transitionDuration: 'moderate',
  _hover: {opacity: 0.8},
} satisfies SystemStyleObject;

const interestKeys = ['programming', 'history', 'heraldry', 'books', 'music'] as const;

export const Interests = async () => {
  const t = await getTranslations('HomePage.interests');
  const format = await getFormatter();
  const listening = await getListening();

  const interests = map(interestKeys, (interest) => {
    const label = t(interest);

    if (interest === 'heraldry') {
      return (
        <ExternalLink key={interest} href={site.links.heraldry} {...interestLink}>
          {label}
        </ExternalLink>
      );
    }

    if (interest === 'music' && listening) {
      return (
        <MusicMention key={interest} {...interestLink}>
          {label}
        </MusicMention>
      );
    }

    return label;
  });

  return <Text lineHeight="relaxed">{format.list(interests, {type: 'conjunction'})}</Text>;
};
