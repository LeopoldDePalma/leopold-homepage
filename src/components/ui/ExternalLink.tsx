import {Link, type LinkProps} from '@chakra-ui/react';

/** Opens in a new tab without handing the other site a reference back to this one. */
export const ExternalLink = (props: Omit<LinkProps, 'target' | 'rel'>) => {
  return <Link target="_blank" rel="noopener noreferrer" {...props} />;
};
