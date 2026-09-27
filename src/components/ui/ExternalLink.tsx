import {Link, type LinkProps} from '@chakra-ui/react';

export const ExternalLink = (props: Omit<LinkProps, 'target' | 'rel'>) => {
  return <Link target="_blank" rel="noopener noreferrer" {...props} />;
};
