'use client';

import {Link, type LinkProps} from '@chakra-ui/react';

import {useMagnet} from '@/lib/hooks/useMagnet';

export const BrandButton = (props: LinkProps) => {
  const magnet = useMagnet();

  return <Link variant="brand" {...magnet} {...props} />;
};
