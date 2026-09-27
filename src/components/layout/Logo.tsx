import {Link, Text} from '@chakra-ui/react';
import {useTranslations} from 'next-intl';

import {OptimizedImage} from '@/components/ui/OptimizedImage';
import {Link as IntlLink} from '@/i18n/navigation';

export const Logo = () => {
  const t = useTranslations('Site');

  return (
    <Link
      asChild
      className="group"
      gap="0.5em"
      fontFamily="heading"
      fontSize="xl"
      fontWeight="bold"
      color="fg"
      _hover={{textDecoration: 'none'}}
    >
      <IntlLink href="/">
        <OptimizedImage
          src="/images/eagle.svg"
          alt=""
          width={32}
          height={32}
          boxSize="1.4em"
          transitionProperty="transform"
          transitionDuration="slow"
          _groupHover={{rotate: '-12deg', _rtl: {rotate: '12deg'}}}
          _motionReduce={{transition: 'none'}}
        />
        <Text as="span" srOnly={{base: true, sm: false}}>
          {t('name')}
        </Text>
      </IntlLink>
    </Link>
  );
};
