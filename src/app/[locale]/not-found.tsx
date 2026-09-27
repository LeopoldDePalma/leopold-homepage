import {Flex, Heading, HStack, Icon, Stack, Text} from '@chakra-ui/react';
import {Sword} from 'lucide-react';
import {getTranslations} from 'next-intl/server';
import type {ReactNode} from 'react';

import {ExternalLink} from '@/components/ui/ExternalLink';
import {OptimizedImage} from '@/components/ui/OptimizedImage';
import {OutlineButton} from '@/components/ui/OutlineButton';
import {site} from '@/content/site';
import {Link} from '@/i18n/navigation';

const renderCreditLink = (href: string) => {
  const CreditLink = (chunks: ReactNode) => {
    return (
      <ExternalLink
        href={href}
        // Inline, not Chakra's inline-flex: a long title has to wrap with the sentence.
        display="inline"
        color="inherit"
        textDecoration="underline"
        _hover={{color: 'fg'}}
      >
        {chunks}
      </ExternalLink>
    );
  };

  return CreditLink;
};

const NotFoundPage = async () => {
  const t = await getTranslations('NotFound');

  return (
    <Stack flex="1" align="center" gap="4" py="8" textAlign="center">
      {/* Arms of Swabia, borne by the Hohenstaufen: gold and three black lions. */}
      <OptimizedImage
        src="/images/arms-of-swabia.svg"
        alt=""
        width={220}
        height={260}
        w="7em"
        h="auto"
      />
      {/* The code and the title sit side by side, split by a rule, as on the built-in 404. */}
      <HStack gap="0">
        <Text
          pe="4"
          fontFamily="heading"
          fontSize="2xl"
          lineHeight="1"
          fontWeight="bold"
          color="accent"
        >
          404
        </Text>
        <Heading as="h1" py="2" ps="5" fontSize="2xl" fontWeight="bold" borderStartWidth="1px">
          {t('title')}
        </Heading>
      </HStack>
      <Text maxW="md" color="fg.muted">
        {t('description')}
      </Text>
      {/* Takes the space left over, so the button lands halfway between text and licence line. */}
      <Flex flex="1" align="center">
        <OutlineButton asChild>
          <Link href="/">
            <Icon asChild boxSize="1.1em" transform="scaleX(-1)" _rtl={{transform: 'none'}}>
              <Sword aria-hidden />
            </Icon>
            {t('home')}
          </Link>
        </OutlineButton>
      </Flex>
      <Text textStyle="xs" color="fg.muted/80">
        {t.rich('armsCredit', {
          arms: renderCreditLink(site.armsCredit.arms),
          author: renderCreditLink(site.armsCredit.author),
          license: renderCreditLink(site.armsCredit.license),
        })}
      </Text>
    </Stack>
  );
};

export default NotFoundPage;
