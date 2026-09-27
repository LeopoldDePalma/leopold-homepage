import type {ReactNode} from 'react';

import {ExternalLink} from './ExternalLink';

/** A link for licence credits in `t.rich`; inline, so a long title wraps with the sentence. */
export const renderCreditLink = (href: string, dir?: 'ltr') => {
  const CreditLink = (chunks: ReactNode) => (
    <ExternalLink
      href={href}
      dir={dir}
      display="inline"
      color="inherit"
      textDecoration="underline"
      _hover={{color: 'fg'}}
    >
      {chunks}
    </ExternalLink>
  );

  return CreditLink;
};
