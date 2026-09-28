import {Button, Flex, Heading, HStack, Icon, Stack, Text} from '@chakra-ui/react';
import {Sword} from 'lucide-react';
import {getTranslations} from 'next-intl/server';

import {externalLinkTags} from '@/components/ui/ExternalLink';
import {OptimizedImage} from '@/components/ui/OptimizedImage';
import {site} from '@/content/site';
import {Link} from '@/i18n/navigation';

const NotFoundPage = async () => {
  const t = await getTranslations('NotFound');

  return (
    <Stack flex="1" align="center" gap="4" py="8" textAlign="center">
      <OptimizedImage
        src="/images/arms-of-swabia.svg"
        alt=""
        width={220}
        height={260}
        w="7em"
        h="auto"
      />
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
        <Heading as="h1" py="2" ps="5" fontSize="2xl" borderStartWidth="1px">
          {t('title')}
        </Heading>
      </HStack>
      <Text maxW="md" color="fg.muted">
        {t('description')}
      </Text>
      <Flex flex="1" align="center">
        <Button asChild variant="quiet">
          <Link href="/">
            <Icon boxSize="1.1em" transform="scaleX(-1)" _rtl={{transform: 'none'}}>
              <Sword />
            </Icon>
            {t('home')}
          </Link>
        </Button>
      </Flex>
      <Text textStyle="xs" color="fg.muted/80">
        {t.rich('armsCredit', externalLinkTags(site.armsCredit, {variant: 'credit'}))}
      </Text>
    </Stack>
  );
};

export default NotFoundPage;
