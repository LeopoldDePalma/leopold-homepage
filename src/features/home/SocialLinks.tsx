import {Icon, Stack} from '@chakra-ui/react';
import {IconBrandGithub, IconBrandInstagram, IconBrandTelegram} from '@tabler/icons-react';
import {map} from 'lodash-es';

import {ExternalLink} from '@/components/ui/ExternalLink';
import {site} from '@/content/site';

const PROFILES = [
  {name: 'GitHub', BrandIcon: IconBrandGithub, ...site.profiles.github},
  {name: 'Telegram', BrandIcon: IconBrandTelegram, ...site.profiles.telegram},
  {name: 'Instagram', BrandIcon: IconBrandInstagram, ...site.profiles.instagram},
];

export const SocialLinks = () => {
  return (
    <Stack as="ul" gap="2" listStyle="none">
      {map(PROFILES, ({name, url, handle, BrandIcon}) => (
        <li key={name}>
          <ExternalLink href={url} gap="0.5em" textUnderlineOffset="0.25em">
            <Icon asChild boxSize="1.1em">
              <BrandIcon aria-hidden />
            </Icon>
            <bdi dir="ltr" lang="en">
              {name} {handle}
            </bdi>
          </ExternalLink>
        </li>
      ))}
    </Stack>
  );
};
