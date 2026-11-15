import {Flex, Icon, Stack, Text} from '@chakra-ui/react';
import {IconBrandGithub, IconBrandLinkedin} from '@tabler/icons-react';
import {map} from 'lodash-es';
import {Mail} from 'lucide-react';
import {getTranslations} from 'next-intl/server';

import {BrandButton} from '@/components/ui/BrandButton';
import {externalLinkProps} from '@/components/ui/ExternalLink';
import {site} from '@/content/site';

const profileButtons = [
  {palette: 'linkedin', BrandIcon: IconBrandLinkedin, ...site.profiles.linkedin},
  {palette: 'github', BrandIcon: IconBrandGithub, ...site.profiles.github},
] as const;

export const Contact = async () => {
  const t = await getTranslations('HomePage.contact');

  return (
    <Stack gap="20">
      <Text lineHeight="tall">{t('text')}</Text>
      <Flex wrap="wrap" justify="center" gap="3">
        <BrandButton href={`mailto:${site.email}`} colorPalette="mail">
          <Icon color="colorPalette.fg">
            <Mail />
          </Icon>
          {t('action')}
        </BrandButton>
        {map(profileButtons, ({name, url, palette, BrandIcon}) => (
          <BrandButton key={name} href={url} {...externalLinkProps} colorPalette={palette}>
            <Icon>
              <BrandIcon />
            </Icon>
            <bdi lang="en">{name}</bdi>
          </BrandButton>
        ))}
      </Flex>
    </Stack>
  );
};
